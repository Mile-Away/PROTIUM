# ANSI color codes for champagne color and bold text
BOLD="\033[1m"
CHAMPAGNE="\033[38;5;230m"
RESET="\033[0m"

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo -e "${BOLD}${CHAMPAGNE}Docker is not installed. Please install Docker from https://www.docker.com/get-started.${RESET}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null
then
    echo -e "${BOLD}${CHAMPAGNE}Docker Compose is not installed. Please install Docker Compose from https://docs.docker.com/compose/install.${RESET}"
    exit 1
fi

# Create and enter the PROTIUM directory
echo -e "${BOLD}${CHAMPAGNE}Creating and entering the PROTIUM directory...${RESET}"
mkdir -p PROTIUM && cd PROTIUM

# Prompt user to login to ghcr.io
echo -e "${BOLD}${CHAMPAGNE}Please login to ghcr.io. You will need your username and a personal access token.${RESET}"
echo -e "${BOLD}${CHAMPAGNE}For more information on how to create a personal access token, visit:${RESET}"
echo -e "${BOLD}${CHAMPAGNE}https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-github-container-registry${RESET}"
if ! docker login ghcr.io
then
    echo -e "${BOLD}${CHAMPAGNE}Failed to login to ghcr.io. Please check your credentials.${RESET}"
    exit 1
fi

# Download docker-compose.yml file
echo -e "${BOLD}${CHAMPAGNE}Downloading docker-compose.yml file...${RESET}"
curl -O https://protium.space/downloads/docker-compose.yml

# Download .env.example file
echo -e "${BOLD}${CHAMPAGNE}Downloading .env.example file...${RESET}"
curl -O https://protium.space/downloads/example.env

# Rename .env.example to .env
echo -e "${BOLD}${CHAMPAGNE}Renaming example.env to .env...${RESET}"
mv example.env .env

# Start services
echo -e "${BOLD}${CHAMPAGNE}Starting services with docker-compose...${RESET}"
sudo docker compose up -d