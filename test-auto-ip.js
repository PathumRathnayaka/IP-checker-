import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.API_Key;

async function testAutoDetect() {
    console.log('Testing auto-detection (no IP in URL)...');
    try {
        // Try without IP in path
        const response = await fetch(`https://api.findip.net/?token=${API_KEY}`);
        if (!response.ok) {
            console.log(`Failed with status: ${response.status}`);
            return;
        }
        const data = await response.json();
        console.log('Detected IP:', data.traits ? data.traits.ip_address : data.ip);
        console.log('Country:', data.country ? data.country.names.en : 'Unknown');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testAutoDetect();
