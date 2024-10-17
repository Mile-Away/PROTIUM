#!/bin/sh

# Function to check PostgreSQL connection
check_pg_connection() {
    echo "Checking PostgreSQL connection on $DATABASE_HOST:$DATABASE_PORT..."
    while ! nc -z $DATABASE_HOST $DATABASE_PORT; do
        echo "Waiting for PostgreSQL to be available..."
        sleep 1
    done
    echo "PostgreSQL is available!"
}

# Environment variables for PostgreSQL connection
# DB_HOST=${DB_HOST:-db}
# DB_PORT=${DB_PORT:-5432}

# Check PostgreSQL connection
check_pg_connection

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
