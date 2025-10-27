#!/usr/bin/env bash
set -euo pipefail

# Doxify backend deploy script for a fresh Debian/Ubuntu GCP VM
# - Installs Docker Engine and Docker Compose plugin
# - Prepares .env if missing (placeholders only — set real values later)
# - Starts backend stack with docker compose (without frontend)
# - Sets up a systemd unit for auto-start on reboot
#
# Usage (run as root or with sudo):
#   curl -fsSL https://raw.githubusercontent.com/Mihir-Rabari/doxify/main/scripts/deploy-gcp.sh -o deploy-gcp.sh
#   sudo bash deploy-gcp.sh
#
# Optional env vars:
#   DOXIFY_DIR=/opt/doxify              # Repo directory (defaults to current directory)
#   COMPOSE_FILE=docker-compose.production.yml
#   API_PORT=4000 FRONTEND_PORT=3000    # Exposed ports (compose defaults respected)
#   ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"  # CORS allowlist
#   JWT_SECRET=change-me                # JWT secret for gateway/services
#   CSRF_ENABLED=true                   # CSRF protection toggle at gateway

DOXIFY_DIR=${DOXIFY_DIR:-"$(pwd)"}
COMPOSE_FILE=${COMPOSE_FILE:-"docker-compose.production.yml"}
API_PORT=${API_PORT:-4000}
FRONTEND_PORT=${FRONTEND_PORT:-3000}
ALLOWED_ORIGINS=${ALLOWED_ORIGINS:-"http://localhost:5173,http://localhost:3000"}
JWT_SECRET=${JWT_SECRET:-"change-this-secret-in-production"}
CSRF_ENABLED=${CSRF_ENABLED:-"true"}

# Services to start for backend only (omit frontend)
BACKEND_SERVICES=( 
  mongodb 
  api-gateway 
  auth-service 
  projects-service 
  pages-service 
  parser-service 
  theme-service 
  export-service 
  viewer-service 
  mcp-service 
)

log() { echo -e "\033[1;32m[deploy]\033[0m $*"; }
warn() { echo -e "\033[1;33m[warn]\033[0m $*"; }
err()  { echo -e "\033[1;31m[err ]\033[0m $*"; }

require_root() {
  if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
    err "Please run as root (sudo)."; exit 1
  fi
}

install_docker() {
  if command -v docker >/dev/null 2>&1; then
    log "Docker already installed."
    return
  fi
  log "Installing Docker Engine + Compose plugin..."
  # Debian/Ubuntu official instructions
  apt-get update -y
  apt-get install -y ca-certificates curl gnupg lsb-release
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/$(. /etc/os-release && echo "$ID")/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$(. /etc/os-release && echo "$ID") \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
  log "Docker installed. Version: $(docker --version)"
}

ensure_repo() {
  if [[ ! -f "$DOXIFY_DIR/$COMPOSE_FILE" ]]; then
    err "Compose file '$COMPOSE_FILE' not found in $DOXIFY_DIR. Clone the repo and set DOXIFY_DIR appropriately."; exit 1
  fi
}

prepare_env() {
  cd "$DOXIFY_DIR"
  if [[ ! -f .env ]]; then
    log "Creating .env from example (you should edit it later with real values)."
    if [[ -f .env.example ]]; then
      cp .env.example .env
    else
      touch .env
    fi
  fi
  # Idempotently set/overwrite key backend vars in .env
  sed -i "" -e "s/^API_GATEWAY_PORT=.*/API_GATEWAY_PORT=$API_PORT/" -e "s/^FRONTEND_PORT=.*/FRONTEND_PORT=$FRONTEND_PORT/" .env || true
  grep -q '^API_GATEWAY_PORT=' .env || echo "API_GATEWAY_PORT=$API_PORT" >> .env
  grep -q '^FRONTEND_PORT=' .env || echo "FRONTEND_PORT=$FRONTEND_PORT" >> .env
  grep -q '^JWT_SECRET=' .env || echo "JWT_SECRET=$JWT_SECRET" >> .env
  grep -q '^ALLOWED_ORIGINS=' .env || echo "ALLOWED_ORIGINS=$ALLOWED_ORIGINS" >> .env
  grep -q '^CSRF_ENABLED=' .env || echo "CSRF_ENABLED=$CSRF_ENABLED" >> .env
}

compose_up_backend() {
  cd "$DOXIFY_DIR"
  log "Building and starting backend services..."
  docker compose -f "$COMPOSE_FILE" up -d --build "${BACKEND_SERVICES[@]}"
  log "Backend is starting. Health checks:"
  echo "  curl http://localhost:$API_PORT/health"
  echo "  curl http://localhost:$API_PORT/api/rate-limits"
}

create_systemd_unit() {
  local svc=/etc/systemd/system/doxify-backend.service
  log "Creating systemd unit at $svc"
  cat > "$svc" <<EOF
[Unit]
Description=Doxify Backend (docker compose)
After=network-online.target docker.service
Wants=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$DOXIFY_DIR
ExecStart=/usr/bin/docker compose -f $COMPOSE_FILE up -d ${BACKEND_SERVICES[*]}
ExecStop=/usr/bin/docker compose -f $COMPOSE_FILE down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF
  systemctl daemon-reload
  systemctl enable doxify-backend.service
  systemctl restart doxify-backend.service
  log "Systemd unit enabled and started (doxify-backend)."
}

main() {
  require_root
  ensure_repo
  install_docker
  prepare_env
  compose_up_backend
  create_systemd_unit
  log "Done. Configure DNS/firewall to allow: API $API_PORT."
}

main "$@"
