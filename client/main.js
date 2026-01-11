import './style.css';
import rocketLogo from '/rocket.png';
import { DiscordSDK } from '@discord/embedded-app-sdk';

// Initialize the Discord SDK
const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

// Store auth and user data globally
let auth = null;
let userData = null;

function showError(message) {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="container error">
      <h1>Error</h1>
      <p>${message}</p>
    </div>
  `;
}

function showLoading(message = 'Loading...') {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="container">
      <h1>${message}</h1>
    </div>
  `;
}

async function setupDiscordSdk() {
  showLoading('Connecting to Discord...');

  // Wait for the SDK to be ready
  await discordSdk.ready();
  console.log('Discord SDK is ready');

  // 1. Authorize with Discord Client
  const { code } = await discordSdk.commands.authorize({
    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
    response_type: 'code',
    state: '',
    prompt: 'none',
    scope: ['identify', 'guilds', 'applications.commands'],
  });

  showLoading('Exchanging token...');

  // 2. Exchange code for access_token via your backend
  const response = await fetch('/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Token exchange failed: ${JSON.stringify(errorData)}`);
  }

  const { access_token } = await response.json();

  // 3. Authenticate with Discord Client
  auth = await discordSdk.commands.authenticate({ access_token });

  if (!auth) throw new Error('Authentication failed');

  console.log('Authenticated successfully!', auth);

  // Now we can fetch data from Discord
  await fetchDiscordData();
}

async function fetchDiscordData() {
  // Fetch Channel Name using SDK
  const channel = await discordSdk.commands.getChannel({
    channel_id: discordSdk.channelId,
  });
  console.log(`Channel: ${channel.name}`);

  // Fetch Guild Avatar using Discord API
  const guilds = await fetch(`https://discord.com/api/v10/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${auth.access_token}` },
  }).then((res) => res.json());

  const currentGuild = guilds.find((g) => g.id === discordSdk.guildId);
  console.log('Current Guild:', currentGuild);

  // Fetch User Info
  const user = await fetch(`https://discord.com/api/v10/users/@me`, {
    headers: { Authorization: `Bearer ${auth.access_token}` },
  }).then((res) => res.json());
  userData = user;

  // Update UI with fetched data
  updateUI(channel, currentGuild, user);
}

function updateUI(channel, guild, user) {
  const app = document.querySelector('#app');

  // Construct guild icon URL if available
  let guildIconHtml = '';
  if (guild && guild.icon) {
    const iconUrl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
    guildIconHtml = `<img src="${iconUrl}" class="guild-icon" alt="Guild Icon" />`;
  }

  // Construct user avatar URL
  let userAvatarHtml = '';
  if (user && user.avatar) {
    const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    userAvatarHtml = `<img src="${avatarUrl}" class="user-avatar" alt="User Avatar" />`;
  }

  app.innerHTML = `
    <div class="container">
      <img src="${rocketLogo}" class="logo" alt="Discord" />
      <h1>Hello, World!</h1>
      <div class="info-card">
        <h2>Discord Activity Info</h2>
        <div class="info-item">
          <span class="label">User:</span>
          ${userAvatarHtml}
          <span class="value">${user ? user.global_name || user.username : 'Unknown'}</span>
        </div>
        <div class="info-item">
          <span class="label">Channel:</span>
          <span class="value">${channel ? channel.name : 'Unknown'}</span>
        </div>
        <div class="info-item">
          <span class="label">Guild:</span>
          ${guildIconHtml}
          <span class="value">${guild ? guild.name : 'Unknown'}</span>
        </div>
      </div>
    </div>
  `;
}

// Initialize the app
setupDiscordSdk().catch((err) => {
  console.error(err);
  showError(err.message || 'Unknown error occurred');
});
