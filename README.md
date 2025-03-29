# EthPillar - Ethereum Staking Simplified

EthPillar is a modern web application that transforms Ethereum node management from complex terminal commands to intuitive clickable options. It helps users set up and manage their Ethereum nodes with confidence.

## Features

- **User-friendly Interface**: Modern dashboard for node management with real-time updates
- **Real-time Monitoring**: Track node status, performance, and logs through WebSockets
- **Client Selection**: Easy setup wizard for execution and consensus clients
- **Security-focused**: Built with security best practices
- **Ethereum 2.0 Support**: Compatible with the latest Ethereum protocols
- **Component-Based Architecture**: Modular, maintainable codebase with reusable components

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Runtime**: Bun
- **Styling**: Tailwind CSS and Shadcn/UI
- **State Management**: React hooks and context
- **Real-time Updates**: WebSockets with Socket.IO
- **Component Structure**: Organized by page in the components directory

## Getting Started

First, install dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun dev
```

For the WebSocket server:

```bash
cd ethpillar-ws-server
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── src/
│   ├── app/           # App Router pages
│   ├── components/    # UI components organized by page
│   │   ├── landing/   # Components for the landing page
│   │   ├── auth/      # Authentication components
│   │   ├── dashboard/ # Dashboard page components
│   │   └── ui/        # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and shared logic
│   └── styles/        # Global styles
├── ethpillar-ws-server/  # Dedicated WebSocket server
│   ├── src/           # Server source code
│   ├── .env.example   # Example environment variables
│   └── README.md      # WebSocket server documentation
```

## Dashboard Features

The dashboard provides a comprehensive interface for managing your Ethereum node:

- **Connection Management**: View and manage your SSH connection
- **Node Status Display**: Real-time status of all Ethereum services
- **Live Log Viewer**: Stream logs from various services in real-time
- **Service Controls**: Start, stop, and restart services with a click
- **Error Handling**: Robust error handling and recovery options

## WebSocket Implementation

To ensure real-time updates even on serverless deployments, we use a dedicated WebSocket server:

- **Separate Server**: Dedicated Node.js server for real-time communication
- **Socket.IO**: Reliable WebSocket connections with fallbacks
- **Secure Authentication**: SSH session token validation
- **Real-time Logs**: Stream service logs directly to the UI
- **Status Updates**: Live service status polling

For more details on the WebSocket implementation, see [WEBSOCKET_IMPLEMENTATION.md](WEBSOCKET_IMPLEMENTATION.md).

## Build for Production

```bash
bun run build
```

## Preview Production Build

```bash
bun start
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Socket.IO](https://socket.io/docs/v4/)
- [Ethereum Staking](https://ethereum.org/en/staking/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
