# Gita Life Coach AI — Gemini Edition

This package keeps the existing HTML frontend and adds a small Node.js server so Gemini answers the actual message instead of returning prewritten demo text.

## Security first

The API key shared in chat should be considered exposed. Revoke it in Google AI Studio and create a new key. Never paste the key into `index.html` or share your `.env` file.

## Run on a computer

1. Install Node.js 18 or newer.
2. Extract this ZIP.
3. Copy `.env.example` to a file named `.env`.
4. Open `.env` and replace `PASTE_YOUR_NEW_GEMINI_API_KEY_HERE` with your new Gemini API key.
5. In this folder, run:

   ```bash
   npm install
   npm start
   ```

6. Open http://localhost:3000 in your browser.

## Android note

The ZIP can be downloaded and edited on Android, but HTML alone cannot safely hide an API key. To run this app on the internet from a phone, deploy the Node server to a hosting service that supports environment variables (for example, a suitable free-tier Node host). Add `GEMINI_API_KEY` in that host's environment-variable settings, then open the deployed URL. Do not put the key in frontend code.

## How it works

- `index.html`: the frontend
- `server.js`: securely calls Gemini from the server
- `.env.example`: template for private configuration
- `GEMINI_MODEL`: defaults to `gemini-2.5-flash`; change it if your account supports a different model

The server sends the user's message to Gemini and returns the generated answer. Usage limits and billing depend on your Google AI Studio account and current model terms.
