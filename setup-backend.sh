#!/bin/bash

# Setup script for backend server

echo "🚀 Setting up backend server..."
echo ""

# Check if .env exists
if [ -f "server/.env" ]; then
    echo "✅ .env file already exists"
else
    echo "📝 Creating .env file from template..."
    cp server/.env.example server/.env
    echo "⚠️  IMPORTANT: Edit server/.env and add your Anthropic API key!"
    echo "   Open server/.env and replace 'your_api_key_here' with your actual key"
fi

echo ""
echo "📦 Installing dependencies..."
cd server && npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the backend server:"
echo "  cd server"
echo "  npm start"
echo ""
echo "Don't forget to add your API key to server/.env first!"
