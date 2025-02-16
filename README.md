# Discord Browser Presence

Track and display your current browser activity in Discord with rich presence integration. Show what websites you're browsing with custom icons and status messages for popular services like YouTube, GitHub, Twitter, and more.

## Features

- Real-time browser activity tracking
- Custom icons and messages for popular websites
- Instant status updates
- Support for multiple services

## Prerequisites

- Node.js 
- Discord application
- Browser
- Discord desktop client

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/discord-browser-presence
cd discord-browser-presence
```

2. Install dependencies:
```bash
npm install
```

3. Create a Discord application:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application" and give it a name
   - Save the Client ID for later use
   - Under "Rich Presence" → "Art Assets", upload your icons
   - Name your icons

4. Create a `.env` file in the root directory:
```env
PORT=3000
DISCORD_CLIENT_ID=your_client_id_here
```

5. Install the Chrome extension:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension` directory from this project

## Usage

1. Start the server:
```bash
node server.js
```

2. Make sure Discord is running
3. Start browsing! Your current activity will automatically appear in Discord

## How It Works

The system consists of two main components:

1. **Chrome Extension**: Monitors your browsing activity and sends updates to the local server
2. **Node.js Server**: Receives updates from the extension and communicates with Discord via RPC

The extension detects:
- Tab switches
- Window focus changes
- URL updates
- Page title changes

## Customization

### Adding New Services

To add support for a new website, add an entry to the `SERVICES` object in `server.js`:

```javascript
'domain.com': {
    name: 'Service Name',
    imageKey: 'service-logo',
    formatDetails: (title) => `Custom status message: ${title}`
}
```

Remember to upload the corresponding logo to your Discord application's assets.

## Troubleshooting

1. **No presence showing**:
   - Ensure Discord is running
   - Check if the server is running
   - Verify your Client ID is correct
   - Make sure Discord Game Activity is enabled

2. **Images not showing**:
   - Verify image names match exactly with Discord asset names
   - Wait a few minutes after uploading new images
   - Check browser console for any errors

3. **Delay in updates**:
   - Ensure no other Discord RPC applications are running
   - Check your system resources
   - Verify network connectivity

## Security Notes

- The extension only tracks active tab titles and URLs
- No personal data is stored
- All communication is local (localhost)
- No data is sent to external servers

## Contributing

Contributions are welcome! Please feel free to submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
