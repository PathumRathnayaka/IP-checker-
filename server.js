import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const FINDMYIP_API_KEY = process.env.API_Key || '120005909550c24770b02f07';
const FINDMYIP_API_URL = 'https://api.findip.net';

function detectDevice(userAgent) {
  const ua = userAgent.toLowerCase();

  let device = 'Desktop';
  if (/mobile|android|iphone|ipad|ipod/.test(ua)) {
    device = /tablet|ipad/.test(ua) ? 'Tablet' : 'Mobile';
  }

  let browser = 'Unknown';
  if (/chrome/.test(ua)) browser = 'Chrome';
  else if (/firefox/.test(ua)) browser = 'Firefox';
  else if (/safari/.test(ua)) browser = 'Safari';
  else if (/edge/.test(ua)) browser = 'Edge';
  else if (/opera|opr/.test(ua)) browser = 'Opera';

  let os = 'Unknown';
  if (/windows/.test(ua)) os = 'Windows';
  else if (/mac os/.test(ua)) os = 'macOS';
  else if (/linux/.test(ua)) os = 'Linux';
  else if (/android/.test(ua)) os = 'Android';
  else if (/ios|iphone|ipad/.test(ua)) os = 'iOS';

  return { device, browser, os };
}

async function getPublicIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Public IP discovery failed:', error);
    return '208.67.222.222'; // Final fallback
  }
}

async function getLocationFromIP(ip) {
  try {
    let targetIp = ip;
    if (!targetIp || targetIp === '127.0.0.1' || targetIp === '::1') {
      targetIp = await getPublicIP();
    }

    const response = await fetch(`${FINDMYIP_API_URL}/${targetIp}/?token=${FINDMYIP_API_KEY}`);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return {
      city: data.city ? data.city.names.en : 'Unknown',
      continent: data.continent ? data.continent.names.en : 'Unknown',
      country: data.country ? data.country.names.en : 'Unknown',
      country_code: data.country ? data.country.iso_code : 'Unknown',
      currency: data.currency || (data.country && data.country.iso_code === 'US' ? 'USD' : 'Unknown'),
      timezone: data.location ? data.location.time_zone : 'Unknown',
      ip: data.traits ? data.traits.ip_address : (data.ip || targetIp),
      success: true
    };
  } catch (error) {
    console.error('FindMyIP API Error:', error);
    return {
      ip: ip,
      country: 'Unknown',
      city: 'Unknown',
      continent: 'Unknown',
      countryCode: 'Unknown',
      currency: 'Unknown',
      timezone: 'Unknown',
      success: false,
      error: error.message
    };
  }
}

app.post('/api/client-info', async (req, res) => {
  try {
    const { name, age } = req.body;

    if (!name || !age) {
      return res.status(400).json({
        success: false,
        message: 'Name and age are required'
      });
    }

    let clientIp = req.headers['x-forwarded-for'] ||
      req.headers['x-real-ip'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip ||
      '';

    // Handle IPv6 loopback and other formats
    if (clientIp === '::1') {
      clientIp = '127.0.0.1';
    }

    // Clean up IP (remove IPv4-mapped IPv6 prefix)
    clientIp = clientIp.replace(/^::ffff:/, '');

    // If it's still a local IP, use a public one for testing/lookup if needed
    // or just leave it as is if that's what's expected for local dev.
    // For now, let's just make sure it's not an empty string.
    if (!clientIp) {
      clientIp = '127.0.0.1';
    }

    const userAgent = req.headers['user-agent'] || '';
    const deviceInfo = detectDevice(userAgent);

    const locationInfo = await getLocationFromIP(clientIp);

    const clientData = {
      personal: {
        name: name.trim(),
        age: parseInt(age)
      },
      network: {
        ipAddress: clientIp,
        publicIp: locationInfo.ip
      },
      location: {
        country: locationInfo.country,
        city: locationInfo.city,
        continent: locationInfo.continent,
        country_code: locationInfo.country_code,
        currency: locationInfo.currency,
        timezone: locationInfo.timezone,
        ip: locationInfo.ip
      },
      device: {
        type: deviceInfo.device,
        browser: deviceInfo.browser,
        operatingSystem: deviceInfo.os,
        userAgent: userAgent
      },
      timestamp: new Date().toISOString(),
      api: {
        service: 'findmyip.net',
        status: locationInfo.success ? 'success' : 'failed'
      }
    };

    res.json({
      success: true,
      message: 'Client information retrieved successfully',
      data: clientData
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Using findmyip.net API for geolocation');
});
