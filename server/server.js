import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config({ path: "../.env" });

const app = express();
const port = 3001;

// Allow express to parse JSON bodies
app.use(express.json());

app.post("/api/token", async (req, res) => {
  try {
    console.log('Received token exchange request');

    if (!req.body.code) {
      return res.status(400).json({ error: 'No code provided in request body' });
    }

    console.log('Code received (first 20 chars):', req.body.code.substring(0, 20) + '...');

    // Exchange the code for an access_token
    const response = await fetch(`https://discord.com/api/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.VITE_DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: req.body.code,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Discord API error:', data);
      return res.status(response.status).json(data);
    }

    // Retrieve the access_token from the response
    const { access_token } = data;

    console.log('Token exchange successful!');

    // Return the access_token to our client as { access_token: "..."}
    res.send({access_token});
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
