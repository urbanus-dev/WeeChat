# WeeChat Application

WeeChat is a web-based chat application built with React, TypeScript, and Vite on the frontend, and Node.js with Express and Prisma on the backend. The application supports real-time messaging and language translation features.

## Project Structure

```
.gitignore
.hintrc
server/
    .env
    .gitignore
    controllers/
        chats.ts
        getLanguages.ts
        messages.ts
        messageTranslation.ts
        UserControllers.ts
    package.json
    pnpm-lock.yaml
    prisma/
        migrations/
        schema.prisma
    routes/
    server.ts
    tsconfig.json
weechatApp/
    .gitignore
    cypress/
    cypress.config.ts
    eslint.config.js
    index.html
    package.json
    pnpm-lock.yaml
    postcss.config.js
    public/
    README.md
    src/
    tailwind.config.js
    tsconfig.app.json
    tsconfig.json
    tsconfig.node.json
    vite.config.ts
```

## Backend

The backend is located in the `server` directory and is built with Node.js, Express, and Prisma.

### Setup

1. Install dependencies:
    ```sh
    cd server
    pnpm install
    ```

2. Set up the database:
    ```sh
    pnpm prisma migrate dev
    ```

3. Start the server:
    ```sh
    pnpm start
    ```

### Configuration

- The server configuration is managed through environment variables defined in the `.env` file.
- TypeScript configuration is in `server/tsconfig.json`.

## Frontend

The frontend is located in the `weechatApp` directory and is built with React, TypeScript, and Vite.

### Setup

1. Install dependencies:
    ```sh
    cd weechatApp
    pnpm install
    ```

2. Start the development server:
    ```sh
    pnpm dev
    ```

### Configuration

- The frontend configuration is managed through various configuration files such as `vite.config.ts`, `tsconfig.json`, and `cypress.config.ts`.
- ESLint configuration is in `eslint.config.js`.

## Testing

- Cypress is used for end-to-end testing. The configuration is in `weechatApp/cypress.config.ts`.

### Running Tests

1. Start the backend server.
2. Start the frontend development server.
3. Run Cypress tests:
    ```sh
    pnpm cypress open
    ```

## Features

- Real-time messaging using Socket.io.
- Language translation using Google Cloud Translate API.
- User authentication and management.