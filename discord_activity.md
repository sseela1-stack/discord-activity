Here is a comprehensive `README.md` based on the [Building Your First Activity](https://discord.com/developers/docs/activities/building-an-activity) guide.

---

# Building Your First Discord Activity

This guide outlines the steps to build a Discord Activity—a web-based game or app that runs directly within Discord using the Embedded App SDK. By following this guide, you will set up a client/server architecture, handle user authentication, and fetch data from Discord APIs.

## 📋 Prerequisites

Before you begin, ensure you have the following:

* **Discord Account:** Enable [Developer Mode](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) in `User Settings > Advanced`.
* **Node.js:** Latest version installed.
* **Git:** To clone the starter repository.
* **Knowledge:** Basic JavaScript, async/await patterns, and frontend development (React/Vue/Vanilla JS).

## 🚀 Step 1: Project Setup

1. **Clone the starter repository:**
```bash
git clone git@github.com:discord/getting-started-activity.git
cd getting-started-activity

```


* `client/`: Frontend (Vanilla JS + Vite).
* `server/`: Backend (Node.js + Express).


2. **Install Frontend Dependencies:**
```bash
cd client
npm install
npm run dev

```


Visit `http://localhost:5173/` to verify the frontend is running.

## 🛠️ Step 2: Create & Configure Discord App

1. Go to the [Discord Developer Portal](https://www.google.com/search?q=https://discord.com/developers/applications) and click **New Application**.
2. **Installation Contexts:**
* Navigate to **Installation**.
* Ensure **User Install** and **Guild Install** are both checked.


3. **Redirect URI:**
* Navigate to **OAuth2**.
* Add `https://127.0.0.1` as a placeholder Redirect URI.


4. **Environment Variables:**
* Copy the example env file: `cp example.env .env`
* **Client ID:** Copy from **OAuth2** page -> `VITE_CLIENT_ID`.
* **Client Secret:** Copy from **OAuth2** page -> `DISCORD_CLIENT_SECRET`.



## 📦 Step 3: Install Embedded App SDK

The SDK handles communication between your app and the Discord client.

1. Navigate to the client folder: `cd client`
2. Install the SDK:
```bash
npm install @discord/embedded-app-sdk

```


3. Initialize the SDK in `client/main.js`:
```javascript
import { DiscordSDK } from "@discord/embedded-app-sdk";

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

async function setupDiscordSdk() {
  await discordSdk.ready();
  console.log("Discord SDK is ready");
}

setupDiscordSdk();

```



## 🌐 Step 4: Run & Tunnel

To test inside Discord, your localhost needs a public URL.

1. **Start the Client:** `npm run dev` (in `client/` folder).
2. **Tunnel:** Use Cloudflare or Ngrok to expose port `5173`.
```bash
# Example using cloudflared
cloudflared tunnel --url http://localhost:5173

```


3. **Map URL:**
* Copy the generated tunnel URL (e.g., `https://funky-bunny.trycloudflare.com`).
* Go to **Developer Portal > [Your App] > Activities**.
* Paste the URL into **URL Mappings** with the prefix `/`.



You can now launch your activity in a Discord Voice Channel via the App Launcher!

## 🔐 Step 5: Authentication (Backend)

Activities require a backend to exchange authorization codes for access tokens.

1. **Setup Server:**
```bash
cd server
npm install
npm run dev

```


*The server runs on port 3001 and handles the `/api/token` POST request.*
2. **Update Client Auth (`client/main.js`):**
Modify `setupDiscordSdk` to handle the OAuth2 flow:
```javascript
async function setupDiscordSdk() {
  await discordSdk.ready();

  // 1. Authorize with Discord Client
  const { code } = await discordSdk.commands.authorize({
    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
    response_type: "code",
    state: "",
    prompt: "none",
    scope: ["identify", "guilds", "applications.commands"],
  });

  // 2. Exchange code for access_token via your backend
  const response = await fetch("/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const { access_token } = await response.json();

  // 3. Authenticate with Discord Client
  const auth = await discordSdk.commands.authenticate({ access_token });

  if (!auth) throw new Error("Authentication failed");
}

```



## 📡 Step 6 & 7: Fetching Data

Once authenticated, you can access Discord data.

### Fetch Channel Name (SDK)

Use the SDK to get context about the current channel.

```javascript
const channel = await discordSdk.commands.getChannel({
  channel_id: discordSdk.channelId
});
console.log(`Channel: ${channel.name}`);

```

### Fetch Guild Avatar (API)

Use the access token to fetch data from the Discord HTTP API.

```javascript
const guilds = await fetch(`https://discord.com/api/v10/users/@me/guilds`, {
  headers: { Authorization: `Bearer ${auth.access_token}` }
}).then(res => res.json());

const currentGuild = guilds.find(g => g.id === discordSdk.guildId);
// Use currentGuild.icon to construct the image URL

```

## 📚 Resources

* [Discord Embedded App SDK Docs](https://www.google.com/search?q=https://discord.com/developers/docs/activities/sdk-overview)
* [Official Activity Quickstart Repo](https://github.com/discord/getting-started-activity)
* [Discord Developer Portal](https://www.google.com/search?q=https://discord.com/developers/applications)