# Client Information App

A Node.js application that captures client information including IP address, device details, and geolocation using findmyip.net API.

## Features

- 📝 Capture name and age
- 🌍 IP address detection
- 📱 Device and browser detection
- 🗺️ Geolocation (country, city, currency, timezone)
- 🎨 Modern, responsive UI
- 📋 Copy IP address to clipboard
- 🔄 Real-time updates
- ⚡ Animated transitions
- 🎯 Error handling

## Installation

1. Clone or download the project

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open browser and visit: http://localhost:3000

## Project Structure

```
client-info-app/
├── server.js          # Express backend server
├── package.json       # Dependencies and scripts
├── public/            # Frontend files
│   ├── index.html     # Main HTML page
│   ├── style.css      # Styles and animations
│   └── script.js      # Client-side JavaScript
├── .gitignore         # Git ignore rules
└── README.md          # Documentation
```

## API Usage

This app uses findmyip.net API for geolocation services.

**API Endpoint:** `https://api.findip.net/{IP_ADDRESS}/?token=120005909550c24770b02f07`

### API Response Example

```json
{
  "city": "San Francisco",
  "continent": "North America",
  "country": "United States",
  "country_code": "US",
  "currency": "USD",
  "timezone": "America/Los_Angeles",
  "ip": "208.67.222.222"
}
```

## Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **API:** findmyip.net API
- **Icons:** Font Awesome
- **Animations:** Animate.css

## Features in Detail

### Backend Features

- Express.js server serving static files
- IP address detection from request headers
- User-agent parsing for device/browser/OS detection
- API integration with findmyip.net
- Error handling and validation
- CORS enabled

### Frontend Features

- Clean, modern UI with gradient design
- Form validation
- Loading animations
- Real-time API status indicator
- Copy to clipboard functionality
- Share information feature
- Responsive design for mobile/tablet/desktop
- Error message display
- Success notifications

### Device Detection

Automatically detects:
- Device type (Desktop, Mobile, Tablet)
- Browser (Chrome, Firefox, Safari, Edge, Opera)
- Operating System (Windows, macOS, Linux, Android, iOS)

### Location Information

Displays:
- Country with flag emoji
- City
- Continent
- Currency
- Timezone

## How It Works

1. User enters their name and age in the form
2. Form data is submitted to `/api/client-info` endpoint
3. Backend captures client IP from request headers
4. Server parses user-agent for device information
5. Server calls findmyip.net API with the IP address
6. Location data is retrieved and combined with other info
7. Complete client information is returned to frontend
8. Results are displayed in organized cards with animations

## API Endpoints

### POST `/api/client-info`

Retrieves complete client information including IP, location, and device details.

**Request Body:**
```json
{
  "name": "John Doe",
  "age": 25
}
```

**Response:**
```json
{
  "success": true,
  "message": "Client information retrieved successfully",
  "data": {
    "personal": {
      "name": "John Doe",
      "age": 25
    },
    "network": {
      "ipAddress": "192.168.1.1",
      "publicIp": "208.67.222.222"
    },
    "location": {
      "country": "United States",
      "city": "San Francisco",
      "continent": "North America",
      "countryCode": "US",
      "currency": "USD",
      "timezone": "America/Los_Angeles"
    },
    "device": {
      "type": "Desktop",
      "browser": "Chrome",
      "operatingSystem": "Windows",
      "userAgent": "..."
    },
    "timestamp": "2024-01-01T00:00:00.000Z",
    "api": {
      "service": "findmyip.net",
      "status": "success"
    }
  }
}
```

## Configuration

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Development

For development with auto-reload, you can install nodemon:

```bash
npm install --save-dev nodemon
```

Then add to package.json scripts:

```json
"dev:server": "nodemon server.js"
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Security Features

- Input validation
- Error handling
- No sensitive data exposure
- CORS enabled
- Secure API integration

## Troubleshooting

### Server won't start
- Make sure port 3000 is not already in use
- Check that all dependencies are installed: `npm install`

### API not working
- Verify internet connection
- Check API key is correct
- Review server console for error messages

### Location data shows "Unknown"
- API may have rate limits
- IP address may be local/private
- Check API status in footer

## Credits

- Powered by [findmyip.net API](https://findmyip.net)
- Icons by [Font Awesome](https://fontawesome.com)
- Animations by [Animate.css](https://animate.style)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Notes

- Location data is approximate based on IP address
- Private/local IP addresses may not return accurate location data
- API has usage limits based on the free tier
