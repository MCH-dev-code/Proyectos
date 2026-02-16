#!/bin/bash

# Script para manejar Git - Subir cambios a repositorio

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Robcast - Git Push Script             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

# Validar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}Error: No estás en la carpeta raíz del proyecto${NC}"
    exit 1
fi

# Pedir mensaje de commit
read -p "Mensaje de commit: " commit_message

if [ -z "$commit_message" ]; then
    echo -e "${RED}Error: El mensaje de commit no puede estar vacío${NC}"
    exit 1
fi

# Agregar todos los cambios
echo -e "${BLUE}📝 Agregando cambios...${NC}"
git add -A

# Verificar si hay cambios
if git diff --cached --quiet; then
    echo -e "${BLUE}No hay cambios para hacer commit${NC}"
    exit 0
fi

# Commit
echo -e "${BLUE}💾 Haciendo commit...${NC}"
git commit -m "$commit_message"

# Mostrar cambios
echo -e "${BLUE}📊 Cambios en este commit:${NC}"
git log --oneline -1

# Preguntar si subir a remoto
# read -p "¿Subir a remoto? (s/n): " push_confirm
read -p "¿Subir a remoto? (s/n): " push_confirm

if [ "$push_confirm" = "s" ] || [ "$push_confirm" = "S" ]; then
    
    # Obtener la rama actual
    current_branch=$(git branch --show-current)
    
    echo -e "${BLUE}🚀 Subiendo a origin/$current_branch...${NC}"
    git push origin $current_branch
    
    echo -e "${GREEN}✓ Cambios subidos correctamente${NC}"
    echo -e "\n${BLUE}Próximo paso:${NC}"
    echo "En el servidor, ejecuta: cd /ruta/proyecto && git pull && docker-compose up -d --build"
else
    echo -e "${BLUE}Push cancelado${NC}"
fi
