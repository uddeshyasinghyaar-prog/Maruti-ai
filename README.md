# Maruti AI backend

OpenAI-compatible chat-completions adapter. Defaults are configured for a compatible endpoint, but the endpoint/model/key can be changed via environment variables.


## Run locally
1. Install Node.js 18 or newer.
2. In this folder run `npm install`.
3. Copy `.env.example` to `.env` and fill in your provider API key.
4. Run `npm start`.
5. Check `http://localhost:3000/` and POST chat requests to `/chat`.

Example request:
```json
{"messages":[{"role":"user","content":"Namaste Maruti"}]}
```
Response shape: `{"reply":"..."}`.

Deploy this folder to a Node host (Render, Railway, etc.) and set environment variables in the host dashboard. Never put provider secrets in Android code or public GitHub repositories. Free hosting/provider limits and sleep behavior can change.
