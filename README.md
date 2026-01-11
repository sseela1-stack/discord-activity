# Discord Activity

A web-based activity that runs directly within Discord using the Embedded App SDK. This project demonstrates how to build a Discord Activity with user authentication and data fetching.

## Project Structure

```
discord-activity/
├── client/          # Frontend (Vanilla JS + Vite)
├── server/          # Backend (Node.js + Express)
└── example.env      # Environment variables template
```

## Prerequisites

- **Discord Account:** Enable [Developer Mode](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) in `User Settings > Advanced`
- **Node.js:** Latest version installed
- **Git:** For version control

## GitHub Codespaces Setup

This project is configured to run on GitHub Codespaces with built-in port forwarding.

### 1. Configure Discord App

Follow these steps in the [Discord Developer Portal](https://discord.com/developers/applications):

#### Create Application
1. Click **New Application**
2. Give your app a name and click **Create**

#### Configure Installation
1. Navigate to **Installation** in the left sidebar
2. Ensure **User Install** and **Guild Install** are both checked
3. Add the required scopes:
   - `activities.read`
   - `applications.commands`

#### Add Redirect URI
1. Navigate to **OAuth2** > **General**
2. Click **Add Redirect URI**
3. Add your Codespace URL (you'll get this after starting)
   - Format: `https://<your-codespace-name>.github.dev`

#### Configure Activity
1. Navigate to **Activities** in the left sidebar
2. Click **Add Activity**
3. Fill in the required details:
   - **Name**: Your activity name
   - **Description**: What your activity does
   - **Application Type**: Embedded App
4. For URL Mappings, add your Codespace URL with path `/`:
   - `https://<your-codespace-name>.github.dev/`

#### Copy Environment Variables
In **OAuth2** > **General**:
- Copy **Client ID** → `VITE_DISCORD_CLIENT_ID`
- Copy **Client Secret** → `DISCORD_CLIENT_SECRET`

### 2. Configure Environment Variables

```bash
cp example.env .env
```

Then edit `.env`:
```env
VITE_DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
```

### 3. Run in Codespaces

The devcontainer configuration is already set up. Just open the project in Codespaces and:

```bash
# Terminal 1: Start the server
cd server && npm start

# Terminal 2: Start the client
cd client && npm run dev
```

### 4. Get Your Codespace URL

1. Codespaces will automatically forward port 5173
2. Click on the "Ports" tab in the bottom panel
3. Find port 5173 and click the globe icon to get your public URL
4. Copy the URL (e.g., `https://fancy-space-dataset-5vpxq7q7j5xhrj-5173.app.github.dev/`)
5. Use this URL in the Discord Developer Portal for:
   - **Redirect URI** (OAuth2)
   - **URL Mappings** (Activities)

### 5. Test in Discord

1. Go to **Installation** in the Developer Portal
2. Copy the **Installation URL**
3. Paste it in your browser and install the app to your server
4. Join a voice channel and launch your activity!

## Local Development

If developing locally (not on Codespaces), you'll need a tunnel service:

#### Using Cloudflare Tunnel
```bash
cloudflared tunnel --url http://localhost:5173
```

#### Using Ngrok
```bash
ngrok http 5173
```

Add the tunnel URL to **Developer Portal > Activities > URL Mappings** with path `/`.

## Features Implemented

- **Discord SDK Initialization**: Sets up connection with Discord client
- **OAuth2 Authentication**: Complete authorization code flow
- **Channel Data**: Fetches current voice channel name using SDK
- **Guild Data**: Fetches server info and icon using Discord API
- **User Data**: Displays authenticated user info with avatar

## Development Ports

- **Client**: Port 5173 (Vite dev server)
- **Server**: Port 3001 (Express) - proxied through client at `/api`

## Resources

- [Discord Embedded App SDK Docs](https://discord.com/developers/docs/activities/sdk-overview)
- [Building Your First Activity Guide](https://discord.com/developers/docs/activities/building-an-activity)
- [Discord Developer Portal](https://discord.com/developers/applications)
