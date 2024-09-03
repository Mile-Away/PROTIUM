mkdir PROTIUM && cd PROTIUM
docker pull ghcr.io/mile-away/protium/backend:latest
docker pull ghcr.io/mile-away/protium/frontend:latest
docker pull ghcr.io/mile-away/protium/workflow:latest
docker pull ghcr.io/mile-away/protium/docfront:latest
curl -O https://raw.githubusercontent.com/Mile-Away/PROTIUM/main/.env.eaxmple
mv .env.example .env
docker compose up -d