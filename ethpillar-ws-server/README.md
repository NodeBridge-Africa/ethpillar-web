# EthPillar WebSocket Server

This is a dedicated WebSocket server for EthPillar that handles real-time communication between the frontend and the server via Socket.IO.

## Why a Separate WebSocket Server?

The WebSocket server is separated from the Next.js application to enable deployment on Vercel's serverless environment. Vercel's serverless functions are not designed to maintain persistent connections like WebSockets, so we've moved this functionality to a dedicated server.

## Features

- Real-time service logs streaming with parsed, formatted output
- Live service status polling with customizable intervals
- Secure authentication using SSH session tokens from Redis
- Robust error handling and connection management
- Automatic reconnection with exponential backoff
- Support for both WebSocket and polling transports

## Dashboard Integration

The WebSocket server directly powers several key components of the EthPillar dashboard:

- **Header**: Displays real-time connection status
- **Node Status Card**: Shows live service status updates
- **Log Viewer**: Streams and formats service logs in real-time
- **Error Alerts**: Provides WebSocket error information and recovery options

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

## Client-Side Integration

The WebSocket server integrates with the Next.js application through custom React hooks:

- `useWebSocket`: Core hook for WebSocket connection management
- `useNodeStatus`: Hook for service status subscriptions
- `useClientLogs`: Hook for log streaming subscriptions

## WebSocket Events

### Server to Client Events

- `authenticated`: Sent when authentication is successful
- `log_data`: Sends log data for a specific service
- `status_update`: Sends status updates for multiple services
- `error`: Sends error information
- `connect_error`: Socket.IO connection error details

### Client to Server Events

- `authenticate`: Authenticates the WebSocket connection with a session token
- `subscribe_logs`: Subscribes to logs for a specific service
- `unsubscribe_logs`: Unsubscribes from logs for a specific service
- `subscribe_status`: Subscribes to status updates with an optional polling interval
- `unsubscribe_status`: Unsubscribes from status updates

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
5. Handles disconnections and errors gracefully

The main components are:

- `server.ts`: Main server setup and Socket.IO event handlers
- `connectionManager.ts`: Manages SSH connections and session storage
- `sshHelpers.ts`: Utilities for interacting with SSH connections

## Security

The WebSocket server implements several security measures:

- Only authenticated clients can subscribe to logs or status updates
- Session tokens must be valid and present in Redis
- CORS configuration limits connections to the specified frontend URL
- SSH sessions have appropriate timeout settings
- Error handling prevents information leakage
