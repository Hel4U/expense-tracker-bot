# Telegram Expense Bot

A Telegram bot that automatically parses expense messages and syncs them to Google Sheets in real-time.

## Tech Stack

### Core Dependencies

- **[Fastify](https://www.fastify.io/)** (v5.8.4) - High-performance Node.js web framework for handling webhooks
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript backend
- **[Node Telegram Bot API](https://github.com/yagop/node-telegram-bot-api)** (v0.67.0) - Wrapper for Telegram Bot API
- **[Google APIs](https://github.com/googleapis/google-api-nodejs-client)** (v171.4.0) - Google Sheets integration
- **[Pino](https://getpino.io/)** (v10.3.1) - Fast JSON logger
- **[Zod](https://zod.dev/)** (v4.3.6) - TypeScript-first schema validation

### Development Tools

- **ESLint** (v10.1.0) - Code linting
- **Prettier** (v3.8.1) - Code formatting
- **Husky** (v9.1.7) - Git hooks
- **Lint-staged** (v16.4.0) - Run linters on staged files
- **TSX** - TypeScript execution for development
- **pnpm** (v10.27.0) - Package manager

### Infrastructure

- **Docker & Docker Compose** - Containerization
- **ngrok** - Secure tunneling for webhook exposures

## Local Development Setup

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- Docker & Docker Compose (optional, for ngrok tunneling)
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- Google Service Account credentials (for Sheets integration)

### Installation

1. **Clone the repository**

   ```bash
   cd telegram-expense-bot
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   WEBHOOK_URL=https://your-domain.com/webhook
   PORT=4000
   HOST=localhost
   SPREADSHEET_ID=your_google_spreadsheet_id
   GOOGLE_SERVICE_ACCOUNT_MAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
   NGROK_AUTHTOKEN=your_ngrok_token (optional, for Docker)
   ```

4. **Set up Google Sheets Integration**
   - Create a Google Service Account in your Google Cloud project
   - Download the JSON key file
   - Extract the private key and service account email from the JSON
   - Share your Google Sheet with the service account email
   - Update the spreadsheet ID in `.env`

### Running Locally

**Development mode** (with hot-reload):

```bash
pnpm run dev
```

The bot will start on `http://localhost:4000`

**Build for production**:

```bash
pnpm run build
```

**Run production build**:

```bash
node dist/index.js
```

### Docker Setup

To expose your local bot via ngrok:

```bash
docker-compose up -d
```

This will:

- Start ngrok and tunnel `http://localhost:4000` to a public URL
- Access ngrok dashboard at `http://localhost:4040`

## Features Implemented

### 1. **Telegram Webhook Handler**

- Receives and processes incoming Telegram messages
- Validates webhook authenticity
- Handles multiple sequenced updates

### 2. **Expense Message Parsing**

- Parse messages in format: `<amount> <description>`
- Example: `100 lunch with colleagues` → Stores `$100` for "lunch with colleagues"
- Automatically captures current date
- Default description if none provided

### 3. **Google Sheets Sync**

- Automatically syncs parsed expenses to Google Sheets
- Stores: Serial number, Date, Description, Amount
- Real-time integration via Google Sheets API
- Connection pooling for efficiency

### 4. **Message Processing Pipeline**

- **Validation Step**: Validates incoming message format and content
- **Parsing Step**: Extracts amount, description, and date
- **Google Sheets Sync Step**: Pushes data to spreadsheet
- **Success Message Step**: Sends confirmation back to user
- Modular, extensible pipeline architecture

### 5. **Type-Safe Validation**

- Zod schema validation for all inputs
- Type-safe request/response handling
- Compile-time and runtime type checking

### 6. **Comprehensive Logging**

- Pino JSON logger for structured logging
- Request/response logging via Fastify
- Error tracking and debugging
- Pretty-printed logs in development

### 7. **Code Quality Tools**

- ESLint for linting
- Prettier for formatting
- Husky pre-commit hooks
- Lint-staged for staged file validation
- TypeScript strict mode

## Available Scripts

```bash
# Development
pnpm run dev              # Start dev server with hot-reload

# Building
pnpm run build            # Compile TypeScript to JavaScript

# Quality Assurance
pnpm run typecheck        # Check TypeScript types
pnpm run lint             # Run ESLint
pnpm run lint:fix         # Fix ESLint issues
pnpm run format           # Format code with Prettier
pnpm run format:check     # Check formatting
pnpm run test             # Run all checks (typecheck, lint, format)

# Docker
docker-compose up         # Start ngrok tunnel
docker-compose down       # Stop services
```

## Project Structure

```text
src/
├── index.ts                         # Application entry point
├── config/
│   ├── constant.ts                  # Sheet column names
│   └── env.ts                       # Environment variables & validation
├── modules/
│   └── webhook/
│       └── telegram/
│           ├── telegram.controller.ts   # Request handler
│           ├── telegram.services.ts     # Business logic
│           ├── telegram.routes.ts       # Route definitions
│           └── telegram.schema.ts       # Zod schemas
├── types/
│   ├── google.ts                    # Google API types
│   ├── message.ts                   # Message context types
│   └── validation.ts                # Validation types
└── util/
    ├── logger.ts                    # Pino logger config
    ├── server.ts                    # Fastify server setup
    ├── error.ts                     # Error utilities
    ├── google.ts                    # Google Sheets API wrapper
    ├── telegram.ts                  # Telegram utilities
    ├── try-catch.ts                 # Error handling wrapper
    └── messages/
        ├── base.ts                  # Base step interface
        ├── engine.ts                # Pipeline executor
        ├── parsing.ts               # Message parsing logic
        ├── step.ts                  # Pipeline steps
        └── validators.ts            # Message validators
```

## How It Works

1. **User sends a message** to the Telegram bot

   ```text
   100 coffee
   50 lunch
   ```

2. **Bot receives webhook** from Telegram at `/webhook` endpoint

3. **Message processing pipeline**:
   - ✅ Validates message format
   - ✨ Parses amount & description
   - 📊 Syncs to Google Sheets
   - ✔️ Sends confirmation message

4. **Data stored in Sheets**:
   ```
   | Serial | Date       | Description | Amount |
   |--------|------------|-------------|--------|
   | 1      | 2026-04-05 | coffee      | 100    |
   | 2      | 2026-04-05 | lunch       | 50     |
   ```

## Error Handling

- Type-safe validation using Zod
- Structured error logging via Pino
- Automatic error recovery
- User-friendly error messages via Telegram

## Contributing

Code quality is enforced through:

- Pre-commit hooks (Husky)
- Automated linting and formatting
- TypeScript strict mode
- Zod validation

Ensure all code passes checks:

```bash
pnpm run test
```

## License

ISC

---

**Built with TypeScript, Fastify, and Telegram Bot API** 🚀
