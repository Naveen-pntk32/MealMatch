#!/bin/bash


set -e

echo "🚀 Starting Frontend..."
cd frontend

if [ -d "node_modules" ]; then
    echo "✅ node_modules exist."
    npm run dev &
else
    echo "⚠️ node_modules not found. Installing dependencies..."
    npm install
    npm run dev &
fi

FRONTEND_PID=$!
cd ..

echo " Starting Backend..."
cd Backend

if [ -d "node_modules" ]; then
    echo " node_modules exist."
    npm run dev &
else
    echo "node_modules not found. Installing dependencies..."
    npm install
    npm run dev &
fi

BACKEND_PID=$!
cd ..

echo "Both apps are running."
echo "Frontend PID: $FRONTEND_PID | Backend PID: $BACKEND_PID"

wait $FRONTEND_PID $BACKEND_PID
