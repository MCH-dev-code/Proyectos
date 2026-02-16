#!/bin/bash

# Script para deploy automático - Se ejecuta en el servidor cuando hay cambios

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_DIR="/ruta/al/proyecto"  # ← CAMBIAR ESTO
LOG_FILE="$PROJECT_DIR/deploy.log"

log_message() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}" | tee -a "$LOG_FILE"
echo -e "${BLUE}║  Robcast - Auto Deploy Script          ║${NC}" | tee -a "$LOG_FILE"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n" | tee -a "$LOG_FILE"

# Validar directorio
if [ ! -d "$PROJECT_DIR" ]; then
    log_message "${RED}Error: Directorio del proyecto no existe: $PROJECT_DIR${NC}"
    exit 1
fi

cd "$PROJECT_DIR"
log_message "${BLUE}📁 Entrando a: $PROJECT_DIR${NC}"

# Verificar Git
if [ ! -d ".git" ]; then
    log_message "${RED}Error: No es un repositorio Git${NC}"
    exit 1
fi

# Obtener cambios
log_message "${BLUE}📥 Obteniendo cambios de Git...${NC}"
git fetch origin
current_branch=$(git branch --show-current)

# Verificar si hay cambios
if git diff --quiet origin/$current_branch; then
    log_message "${YELLOW}⏭ No hay cambios que descargar${NC}"
    exit 0
fi

log_message "${BLUE}⬇ Descargando cambios...${NC}"
git pull origin $current_branch

# Construir y levantar contenedores
log_message "${BLUE}🔨 Reconstruyendo imágenes Docker...${NC}"
docker-compose build

log_message "${BLUE}▶ Iniciando servicios...${NC}"
docker-compose up -d

# Esperar a que los servicios estén listos
sleep 5

# Verificar salud de los servicios
log_message "${BLUE}🏥 Verificando estado de servicios...${NC}"

if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    log_message "${GREEN}✓ API está funcionando${NC}"
else
    log_message "${RED}✗ API no responde${NC}"
fi

if curl -s http://localhost > /dev/null 2>&1; then
    log_message "${GREEN}✓ Frontend está funcioning${NC}"
else
    log_message "${RED}✗ Frontend no responde${NC}"
fi

# Limpiar imágenes no usadas
log_message "${BLUE}🧹 Limpiando recursos Docker no usados...${NC}"
docker system prune -f

log_message "${GREEN}✓ Deploy completado exitosamente${NC}\n"
