# WebSocket Implementation for EthPillar

## Overview

We've implemented a dedicated WebSocket server for EthPillar instead of integrating it directly with the Next.js application. This approach enables reliable real-time updates even when deploying the Next.js application on serverless platforms like Vercel.

## Project Structure

1. **Next.js Application**

   - Main frontend application
   - API routes for SSH connections and commands
   - Dashboard UI components with real-time updates
   - Custom hooks for WebSocket integration

2. **WebSocket Server**
   - Dedicated Node.js server using Socket.IO
   - Handles real-time communication between the frontend and SSH servers
   - Manages SSH connections and streaming data
   - Provides authentication via SSH session tokens

## Components

### Next.js Application

- `src/hooks/useWebSocket.ts`: Client-side hook for connecting to the WebSocket server with authentication and reconnection logic
- `src/hooks/useNodeStatus.ts`: Hook for subscribing to and displaying node status updates
- `src/hooks/useClientLogs.ts`: Hook for streaming and displaying service logs
- `src/components/dashboard/`: Directory containing dashboard components that use WebSocket data
- `.env`: Contains `NEXT_PUBLIC_WS_URL` to connect to the WebSocket server

### WebSocket Server

- `ethpillar-ws-server/`: Directory containing the WebSocket server code
- `ethpillar-ws-server/src/server.ts`: Main server file with Socket.IO setup
- `ethpillar-ws-server/src/connectionManager.ts`: Manages SSH connections and Redis sessions
- `ethpillar-ws-server/src/sshHelpers.ts`: Helper functions for SSH operations

## Dashboard Components Using WebSockets

- `Header.tsx`: Displays connection status with real-time updates
- `ConnectionCard.tsx`: Shows detailed connection information
- `NodeStatusCard.tsx`: Displays service status with live updates
- `LogViewerCard.tsx`: Streams and displays service logs in real-time
- `ErrorAlert.tsx`: Shows WebSocket connection errors with reconnect option

## WebSocket Hook Implementation

The `useWebSocket` hook provides:

- Connection management with automatic reconnection
- Authentication with the WebSocket server
- Event subscription system
- Error handling and recovery

The custom hooks `useNodeStatus` and `useClientLogs` build on top of `useWebSocket` to provide specific functionality for their use cases.

## Flow of Operation

1. User authenticates through the Next.js app, which sets an `ssh_session` cookie
2. The Next.js app connects to the WebSocket server sending the cookie
3. WebSocket server verifies the session token with Redis
4. Dashboard components display real-time data:
   - Service status updates via the `useNodeStatus` hook
   - Service log streaming via the `useClientLogs` hook
5. User can interact with services and view logs in real-time

## Data Flow Patterns

1. **Status Updates Flow**:

   - Client subscribes to status updates via `useNodeStatus` hook
   - Server polls services at regular intervals
   - Updates are sent to the client through WebSocket
   - `NodeStatusCard` component displays the current status

2. **Log Streaming Flow**:
   - User selects a service in the `LogViewerCard`
   - Client subscribes to logs for that service via `useClientLogs` hook
   - Server streams logs in real-time through WebSocket
   - Log entries are parsed and displayed in the UI

## Testing the Implementation

### Start the WebSocket Server

```bash
cd ethpillar-ws-server
bun install
bun dev
```

### Start the Next.js Application

```bash
cd .. # Go back to the main project directory
bun dev
```

### Test WebSocket Connection

1. Login to the EthPillar application
2. Navigate to the dashboard
3. Check for the connection status indicator in the header
4. Select a service in the log viewer to see real-time logs
5. Monitor the node status card for live updates

## Debugging

If you encounter issues:

1. **Check Dashboard Connection Status**

   - The header shows the current connection state
   - The `ErrorAlert` component displays detailed connection errors

2. **Check WebSocket Server Logs**

   - Connection attempts
   - Authentication errors
   - SSH connection issues

3. **Check Redis Connection**

   - Ensure Redis is accessible from both the Next.js app and WebSocket server
   - Verify session tokens are correctly stored

4. **Check Browser Console**
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

## Security Considerations

1. **Authentication**: WebSocket connections require a valid SSH session token
2. **CORS Protection**: The WebSocket server only accepts connections from the specified frontend URL
3. **Timeout Management**: Connections and SSH sessions have appropriate timeout settings
4. **Error Handling**: Robust error handling prevents information leakage
5. **Session Token Storage**: Session tokens are stored securely in cookies and localStorage
