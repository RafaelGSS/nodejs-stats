#!/bin/bash
SIZE=$(du $(which node) | awk '{print $1/1000}')
node -e 'setTimeout(() => {}, 30000)' &
PID=$!
# wait nodejs initialization
sleep 3

NODE_VERSION=$(node -v)
THREAD_COUNT=$(cat /proc/$PID/status | grep Threads | awk '{ print $2 }')
kill  $PID
STARTUP_SEMICOLON=$(hyperfine --warmup 5 'node semicolon.js')


echo "NODE VERSION: $NODE_VERSION"
echo "SIZE: $SIZE MB - THREADS: $THREAD_COUNT"
echo "STARTUP: $STARTUP_SEMICOLON"
