#!/bin/bash

# Script de verificación - Chequea que todo está funcionando

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║  Robcast - Health Check Script         ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}\n"

# 1. Verificar Docker
echo -e "${BLUE}[1/8] Verificando Docker...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker instalado${NC}"
    docker --version
else
    echo -e "${RED}✗ Docker NO está instalado${NC}"
    exit 1
fi

# 2. Verificar Docker Compose
echo -e "\n${BLUE}[2/8] Verificando Docker Compose...${NC}"
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓ Docker Compose instalado${NC}"
    docker-compose --version
else
    echo -e "${RED}✗ Docker Compose NO está instalado${NC}"
    exit 1
fi

# 3. Verificar Git
echo -e "\n${BLUE}[3/8] Verificando Git...${NC}"
if command -v git &> /dev/null; then
    echo -e "${GREEN}✓ Git instalado${NC}"
    git --version
else
    echo -e "${RED}✗ Git NO está instalado${NC}"
    exit 1
fi

# 4. Verificar estructura de archivos
echo -e "\n${BLUE}[4/8] Verificando estructura del proyecto...${NC}"
files=(
    "docker-compose.yml"
    "docker-compose.dev.yml"
    ".gitignore"
    "Robcast/Dockerfile"
    "Robcast/Dockerfile.dev"
    "Robcast-API/Dockerfile"
    "Robcast-API/.env.example"
)

all_files_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ Falta: $file${NC}"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    echo -e "${YELLOW}Faltan algunos archivos${NC}"
fi

# 5. Verificar contenedores
echo -e "\n${BLUE}[5/8] Verificando contenedores Docker...${NC}"
containers=$(docker-compose ps -q 2>/dev/null | wc -l)

if [ $containers -gt 0 ]; then
    echo -e "${GREEN}✓ $containers contenedores ejecutándose${NC}"
    docker-compose ps
else
    echo -e "${YELLOW}⚠ No hay contenedores ejecutándose${NC}"
    echo "  Ejecuta: docker-compose up -d"
fi

# 6. Verificar API
echo -e "\n${BLUE}[6/8] Verificando API...${NC}"
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ API responde en http://localhost:3001${NC}"
else
    echo -e "${YELLOW}⚠ API no responde (asegúrate de tenerla en marcha)${NC}"
fi

# 7. Verificar Frontend
echo -e "\n${BLUE}[7/8] Verificando Frontend...${NC}"
frontend_urls=("http://localhost:5173" "http://localhost" "http://localhost:5174")
for url in "${frontend_urls[@]}"; do
    if curl -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend accesible en $url${NC}"
        break
    fi
done

# 8. Verificar Git
echo -e "\n${BLUE}[8/8] Verificando Git...${NC}"
if [ -d ".git" ]; then
    echo -e "${GREEN}✓ Repositorio Git inicializado${NC}"
    git remote -v
else
    echo -e "${YELLOW}⚠ No es un repositorio Git${NC}"
    echo "  Ejecuta: git init && git remote add origin <URL>"
fi

echo -e "\n${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Verificación completada${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}\n"
