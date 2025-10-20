#!/bin/bash

echo "🚀 Starting Doxify..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start backend services
echo "📦 Starting backend services with Docker Compose..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "✅ Backend services started!"
echo ""
echo "📊 Service Status:"
echo "   - API Gateway:    http://localhost:4000"
echo "   - Auth Service:   http://localhost:4001"
echo "   - Projects:       http://localhost:4002"
echo "   - Pages:          http://localhost:4003"
echo "   - Parser:         http://localhost:4004"
echo "   - Theme:          http://localhost:4005"
echo "   - Export:         http://localhost:4006"
echo "   - MongoDB:        mongodb://localhost:27017"
echo ""

# Check if frontend dependencies are installed
if [ ! -d "apps/web/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd apps/web
    npm install
    cd ../..
    echo "✅ Frontend dependencies installed"
    echo ""
fi

# Start frontend
echo "🎨 Starting frontend..."
cd apps/web

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
fi

npm run dev &
FRONTEND_PID=$!

cd ../..

echo ""
echo "✅ Doxify is running!"
echo ""
echo "🌐 Open your browser:"
echo "   Frontend:  http://localhost:5173"
echo "   API:       http://localhost:4000"
echo ""
echo "📚 Next steps:"
echo "   1. Go to http://localhost:5173/register"
echo "   2. Create an account"
echo "   3. Create your first project"
echo "   4. Start writing documentation!"
echo ""
echo "⚠️  Press Ctrl+C to stop all services"
echo ""

# Wait for frontend process
wait $FRONTEND_PID
