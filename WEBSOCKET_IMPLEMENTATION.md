# WebSocket Implementation for EthPillar

## Overview

We've restructured the WebSocket implementation to use a separate, dedicated WebSocket server instead of integrating it directly with the Next.js application. This approach is more suitable for deploying the Next.js application on serverless platforms like Vercel.

## Project Structure

1. **Next.js Application**

   - Main frontend application
   - API routes for SSH connections and commands
   - Uses WebSocket client to connect to the WebSocket server

2. **WebSocket Server**
   - Dedicated Node.js server using Socket.IO
   - Handles real-time communication between the frontend and SSH servers
   - Manages SSH connections and streaming data

## Components

### Next.js Application

- `src/hooks/useWebSocket.ts`: Client-side hook for connecting to the WebSocket server
- `.env`: Contains `NEXT_PUBLIC_WS_URL` to connect to the WebSocket server

### WebSocket Server

- `ethpillar-ws-server/`: Directory containing the WebSocket server code
- `ethpillar-ws-server/src/server.ts`: Main server file with Socket.IO setup
- `ethpillar-ws-server/src/connectionManager.ts`: Manages SSH connections and Redis sessions
- `ethpillar-ws-server/src/sshHelpers.ts`: Helper functions for SSH operations

## Flow of Operation

1. User authenticates through the Next.js app, which sets an `ssh_session` cookie
2. The Next.js app connects to the WebSocket server sending the cookie
3. WebSocket server verifies the session token with Redis
4. User subscribes to logs or status updates through the WebSocket connection
5. WebSocket server streams data from SSH connections back to the frontend

## Testing the Implementation

### Start the WebSocket Server

```bash
cd ethpillar-ws-server
npm install # or bun install
npm run dev # or bun run dev
```

### Start the Next.js Application

```bash
cd .. # Go back to the main project directory
npm run dev # or bun run dev
```

### Test WebSocket Connection

1. Login to the EthPillar application
2. Navigate to a page that uses WebSocket (like logs or status)
3. Check the browser console for WebSocket connection messages
4. Check the WebSocket server terminal for connection and authentication logs

## Debugging

If you encounter issues:

1. **Check WebSocket Server Logs**

   - Connection attempts
   - Authentication errors
   - SSH connection issues

2. **Check Redis Connection**

   - Ensure Redis is accessible from both the Next.js app and WebSocket server
   - Verify session tokens are correctly stored

3. **Check Browser Console**
   - WebSocket connection errors
   - Authentication issues

## Deployment

1. Deploy the Next.js app to Vercel or your preferred platform
2. Deploy the WebSocket server to a platform that supports long-running Node.js processes:
   - Fly.io
   - Render
   - Railway
   - DigitalOcean App Platform
3. Update the `NEXT_PUBLIC_WS_URL` in your Next.js environment to point to the deployed WebSocket server
4. Configure CORS by setting the `FRONTEND_URL` on the WebSocket server to match your deployed Next.js app URL
