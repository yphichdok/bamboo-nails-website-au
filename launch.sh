#!/bin/bash

# Launch local server for Bamboo Nails website

PORT=3000
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Starting local server..."
echo "📁 Serving from: $DIR"
echo "🌐 Opening browser at http://localhost:$PORT"

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    # Start server in background
    python3 -m http.server $PORT --directory "$DIR" > /dev/null 2>&1 &
    SERVER_PID=$!
    
    # Wait a moment for server to start
    sleep 1
    
    # Open browser
    if command -v open &> /dev/null; then
        open "http://localhost:$PORT"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:$PORT"
    fi
    
    echo "✅ Server running on http://localhost:$PORT"
    echo "📝 Press Ctrl+C to stop the server"
    echo "🆔 Server PID: $SERVER_PID"
    
    # Wait for user interrupt
    trap "kill $SERVER_PID 2>/dev/null; exit" INT TERM
    wait $SERVER_PID
    
elif command -v python &> /dev/null; then
    # Fallback to python (Python 2)
    python -m SimpleHTTPServer $PORT > /dev/null 2>&1 &
    SERVER_PID=$!
    
    sleep 1
    
    if command -v open &> /dev/null; then
        open "http://localhost:$PORT"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:$PORT"
    fi
    
    echo "✅ Server running on http://localhost:$PORT"
    echo "📝 Press Ctrl+C to stop the server"
    echo "🆔 Server PID: $SERVER_PID"
    
    trap "kill $SERVER_PID 2>/dev/null; exit" INT TERM
    wait $SERVER_PID
    
else
    echo "❌ Error: Python not found. Please install Python 3."
    exit 1
fi

