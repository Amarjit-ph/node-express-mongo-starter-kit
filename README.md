# Node Express Mongo Starter Kit

Kickstart your Node.js API with Express, MongoDB, and TypeScript. Includes ready-to-use folder structure, linting, and type-safe configurations for rapid development.

## Features
- Express.js server setup
- MongoDB integration
- TypeScript configuration
- Pre-configured folder structure
- Linting with ESLint
- Nodemon for auto-reloading
- Environment-based config management

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- npm
- MongoDB instance (local or cloud)

### Installation
```bash
npm install
```

### Configuration
Edit `config/default.json` to set your MongoDB URI and other environment variables.

### Running the Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Starting Production Server
```bash
npm start
```

## Folder Structure
```
├── config/
│   └── default.json
├── src/
│   └── server.ts
├── dist/
├── package.json
├── tsconfig.json
├── nodemon.json
```

## Scripts
- `npm run dev` — Start server in development mode with auto-reload
- `npm run build` — Compile TypeScript to JavaScript
- `npm start` — Run compiled server