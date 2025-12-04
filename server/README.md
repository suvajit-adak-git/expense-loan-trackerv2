# Backend Proxy Server

This is a simple Express server that acts as a proxy for Anthropic API calls, keeping your API key secure on the backend.

## Setup

1. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Configure API Key**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your Anthropic API key:
     ```
     ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
     PORT=3001
     ```

3. **Start the Server**:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## Usage

The server runs on `http://localhost:3001` by default.

### Endpoints

- **GET** `/health` - Health check endpoint
- **POST** `/api/extract-loan` - Extract loan data from text
  - Request body: `{ "text": "your document text here" }`
  - Response: `{ "success": true, "data": { ...loan details } }`

## Running Both Servers

You need to run both the frontend and backend:

**Terminal 1** (Frontend):
```bash
npm run dev
```

**Terminal 2** (Backend):
```bash
cd server
npm start
```

The frontend will automatically call the backend proxy when you upload documents.
