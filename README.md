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
project-root/
│
├── package.json
├── tsconfig.json
├── nodemon.json            # optional, for dev auto-reload
├── .env                    # environment variables
├── .gitignore
│
├── src/
│   ├── server.ts           # starts the server
│   ├── app.ts              # express app setup
│   │
│   ├── config/             # app configuration
│   │   └── default.ts      # e.g., DB URI, JWT secret, port
│   │
│   ├── controllers/        # route handlers / business logic
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   └── post.controller.ts
│   │
│   ├── routes/             # route definitions
│   │   ├── auth.route.ts
│   │   ├── user.route.ts
│   │   └── post.route.ts
│   │
│   ├── models/             # Mongoose models
│   │   ├── user.model.ts
│   │   └── post.model.ts
│   │
│   ├── middleware/         # middlewares (auth, logging, error handling)
│   │   ├── auth.middleware.ts
│   │   ├── logger.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── utils/              # helpers and utility functions
│   │   └── logger.ts
│   │
│   └── types/              # custom TypeScript types/interfaces
│       ├── express/index.d.ts  # e.g., extend Request with user
│       └── other-types.ts
│
└── dist/                   # compiled JS output (tsc --outDir dist)
```

## Scripts
- `npm run dev` — Start server in development mode with auto-reload
- `npm run build` — Compile TypeScript to JavaScript
- `npm start` — Run compiled server