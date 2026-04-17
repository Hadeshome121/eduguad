#!/bin/bash
echo "============================================"
echo "    EduGuard AI - Starting Application"
echo "============================================"

# Start backend
echo "[1/2] Starting Backend on port 5000..."
cd backend && npm install && node server.js &
BACKEND_PID=$!
cd ..

sleep 2

# Start frontend
echo "[2/2] Starting Frontend on port 3000..."
cd frontend && npm install && npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "============================================"
echo " Backend:  http://localhost:5000"
echo " Frontend: http://localhost:3000"
echo "============================================"
echo ""
echo "Press Ctrl+C to stop both servers."

# Open browser after 4 seconds
sleep 4
if [[ "$OSTYPE" == "darwin"* ]]; then
  open http://localhost:3000
else
  xdg-open http://localhost:3000 2>/dev/null || true
fi

# Wait and cleanup
wait $BACKEND_PID $FRONTEND_PID
