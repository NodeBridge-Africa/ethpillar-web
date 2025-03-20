# EthPillar - Ethereum Staking Simplified

EthPillar is a modern web application that transforms Ethereum node management from complex terminal commands to intuitive clickable options. It helps users set up and manage their Ethereum nodes with confidence.

## Features

- **User-friendly Interface**: Simple dashboard for node management
- **Real-time Monitoring**: Track node status and performance
- **Client Selection**: Easy setup wizard for execution and consensus clients
- **Security-focused**: Built with security best practices
- **Ethereum 2.0 Support**: Compatible with the latest Ethereum protocols

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Runtime**: Bun
- **Styling**: Tailwind CSS and Shadcn/UI
- **Animations**: Framer Motion
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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── src/
│   ├── app/           # App Router pages
│   ├── components/    # UI components organized by page
│   │   └── landing/   # Components for the landing page
│   ├── styles/        # Global styles
│   └── lib/           # Utility functions and shared logic
```

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
- [Framer Motion](https://www.framer.com/motion/)
- [Ethereum Staking](https://ethereum.org/en/staking/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
