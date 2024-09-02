#!/bin/sh

# Run database migrations
echo "Running database migrations..."
python manage.py migrate

# Restore data
echo "Restoring data..."
python manage.py restore

# Check environment variable to decide whether to start the development server or the production server
if [ "$ENV" = "development" ]; then
    echo "Starting development server..."
    uvicorn backend.asgi:application --host 0.0.0.0 --port 8000 --log-level debug --reload
else
    echo "Starting production server..."
    # Get the number of available CPU cores
    WORKERS=$(nproc)
    gunicorn \
        --access-logfile - \
        -k uvicorn.workers.UvicornWorker \
        --workers $WORKERS \
        --bind 0.0.0.0:8000 \
        backend.asgi:application
fi
