# EthPillar WebSocket Server

This is a dedicated WebSocket server for EthPillar that handles real-time communication between the frontend and the server via Socket.IO.

## Why a Separate WebSocket Server?

The WebSocket server is separated from the Next.js application to enable deployment on Vercel's serverless environment. Vercel's serverless functions are not designed to maintain persistent connections like WebSockets, so we've moved this functionality to a dedicated server.

## Features

- Real-time service logs streaming
- Service status polling
- Secure authentication using SSH session tokens from Redis
- Graceful error handling and connection cleanup

## Setup

1. Install dependencies:

   ```
   npm install
   # or
   bun install
   ```

2. Configure environment variables by copying `.env.example` to `.env` and setting:

   - `REDIS_URL`: URL for your Redis instance
   - `WS_PORT`: Port for the WebSocket server (default: 3001)
   - `FRONTEND_URL`: URL of your Next.js frontend for CORS

3. Build the server:

   ```
   npm run build
   # or
   bun run build
   ```

4. Start the server:
   ```
   npm run start
   # or
   bun run start
   ```

For development, you can use:

```
npm run dev
# or
bun run dev
```

## Deployment

Deploy this WebSocket server to a platform that supports long-running Node.js processes, such as:

- Fly.io
- Render
- Railway
- DigitalOcean App Platform
- Heroku

Make sure to:

1. Set the environment variables
2. Update the `NEXT_PUBLIC_WS_URL` in your Next.js application to point to the deployed WebSocket server
3. Configure CORS by setting the `FRONTEND_URL` to match your Next.js application's URL

## Architecture

The WebSocket server:

1. Receives connection requests from the frontend
2. Authenticates users using the SSH session stored in Redis
3. Establishes and manages SSH connections to the target servers
4. Streams real-time logs and status updates back to the frontend

The main components are:

- `server.ts`: Main server setup and Socket.IO event handlers
- `connectionManager.ts`: Manages SSH connections and session storage
- `sshHelpers.ts`: Utilities for interacting with SSH connections
