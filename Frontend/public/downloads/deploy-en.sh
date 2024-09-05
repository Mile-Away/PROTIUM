#!/bin/bash

# ANSI color codes for champagne color and bold text
BOLD="\033[1m"
CHAMPAGNE="\033[38;5;230m"
RESET="\033[0m"
COMMENT="\033[38;5;244m"  # Light gray color for comments

# Parse options
KEEP_DEPLOY=false
while [[ $# -gt 0 ]]; do
    case "$1" in
        --keep-deploy)
            KEEP_DEPLOY=true
            ;;
        *)
            echo "Unknown parameter passed: \$1"
            exit 1
            ;;
    esac
    shift
done

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    printf "${BOLD}${CHAMPAGNE}>>> Docker is not installed. Please install Docker from https://www.docker.com/get-started.${RESET}\n"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null
then
    printf "${BOLD}${CHAMPAGNE}>>> Docker Compose is not installed. Please install Docker Compose from https://docs.docker.com/compose/install.${RESET}\n"
    exit 1
fi

# Create and enter the PROTIUM directory
echo "----------"
printf "${BOLD}${CHAMPAGNE}>>> Creating and entering the PROTIUM directory...${RESET}\n"
mkdir -p PROTIUM && cd PROTIUM

# Prompt user to login to ghcr.io
echo "----------"
printf "${BOLD}${CHAMPAGNE}>>> Login to ghcr.io. You will need your username and a personal access token.${RESET}\n"
printf "${COMMENT}For more information on how to create a personal access token, visit:${RESET}\n"
printf "${COMMENT}https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-github-container-registry${RESET}\n"
if ! docker login ghcr.io
then
    printf "${BOLD}${CHAMPAGNE}>>> Failed to login to ghcr.io. Please check your credentials.${RESET}\n"
    exit 1
fi

# Download docker-compose.yml file
echo "----------"
printf "${BOLD}${CHAMPAGNE}>>> Downloading docker-compose.yml file...${RESET}\n"
curl --progress-bar -O https://protium.space/downloads/docker-compose-en.yml

# Download .env.example file
echo "----------"
printf "${BOLD}${CHAMPAGNE}>>> Downloading .env file...${RESET}\n"
curl --progress-bar -O https://protium.space/downloads/example.env
mv example.env .env

# Start services
echo "----------"
printf "${BOLD}${CHAMPAGNE}>>> Starting services with docker-compose...${RESET}\n"
docker compose -f docker-compose-en.yml up -d

# Remove the deploy script if --keep-deploy is not set
if [ "$KEEP_DEPLOY" = false ]; then
    rm ../deploy-en.sh
fi
