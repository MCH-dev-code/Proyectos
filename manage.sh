#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Menú principal
show_menu() {
    echo -e "\n${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║ Robcast E-commerce - Docker CLI Tool  ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"
    
    echo -e "${YELLOW}1. Levantar todos los servicios${NC}"
    echo -e "${YELLOW}2. Detener todos los servicios${NC}"
    echo -e "${YELLOW}3. Ver logs${NC}"
    echo -e "${YELLOW}4. Reiniciar servicios${NC}"
    echo -e "${YELLOW}5. Reconstruir imágenes${NC}"
    echo -e "${YELLOW}6. Acceder a MySQL${NC}"
    echo -e "${YELLOW}7. Hacer backup de BD${NC}"
    echo -e "${YELLOW}8. Restaurar backup de BD${NC}"
    echo -e "${YELLOW}9. Ver estado de contenedores${NC}"
    echo -e "${YELLOW}10. Limpiar todo (⚠️ CUIDADO)${NC}"
    echo -e "${YELLOW}0. Salir${NC}\n"
    read -p "Selecciona una opción: " option
}

# Funciones
start_services() {
    echo -e "${BLUE}▶ Iniciando servicios...${NC}"
    docker-compose up -d
    echo -e "${GREEN}✓ Servicios iniciados${NC}"
    sleep 3
    status_services
}

stop_services() {
    echo -e "${BLUE}⏹ Deteniendo servicios...${NC}"
    docker-compose down
    echo -e "${GREEN}✓ Servicios detenidos${NC}"
}

show_logs() {
    echo -e "${BLUE}📋 Eligiendo servicio...${NC}"
    echo "1. Todos"
    echo "2. Frontend"
    echo "3. API"
    echo "4. MySQL"
    echo "5. Últimas 50 líneas"
    read -p "Opción: " log_option
    
    case $log_option in
        1) docker-compose logs -f ;;
        2) docker-compose logs -f frontend ;;
        3) docker-compose logs -f api ;;
        4) docker-compose logs -f mysql ;;
        5) docker-compose logs --tail=50 ;;
        *) echo -e "${RED}Opción inválida${NC}" ;;
    esac
}

restart_services() {
    echo -e "${BLUE}🔄 Reiniciando servicios...${NC}"
    docker-compose restart
    echo -e "${GREEN}✓ Servicios reiniciados${NC}"
    sleep 3
    status_services
}

rebuild_images() {
    echo -e "${BLUE}🔨 Reconstruyendo imágenes...${NC}"
    docker-compose build
    echo -e "${BLUE}▶ Iniciando servicios...${NC}"
    docker-compose up -d
    echo -e "${GREEN}✓ Imágenes reconstruidas e iniciadas${NC}"
    sleep 3
    status_services
}

access_mysql() {
    echo -e "${BLUE}Accediendo a MySQL...${NC}"
    docker exec -it robcast-mysql mysql -u robcast_user -p robcast_db
}

backup_database() {
    BACKUP_FILE="robcast_backup_$(date +%Y%m%d_%H%M%S).sql"
    echo -e "${BLUE}💾 Creando backup: $BACKUP_FILE${NC}"
    docker exec robcast-mysql mysqldump -u robcast_user -p robcast_db > $BACKUP_FILE
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Backup creado: $BACKUP_FILE${NC}"
        ls -lh $BACKUP_FILE
    else
        echo -e "${RED}Error al crear backup${NC}"
    fi
}

restore_database() {
    read -p "Nombre del archivo de backup: " backup_file
    
    if [ ! -f "$backup_file" ]; then
        echo -e "${RED}✗ Archivo no encontrado: $backup_file${NC}"
        return
    fi
    
    echo -e "${YELLOW}⚠️ ADVERTENCIA: Esto sobrescribirá la BD actual${NC}"
    read -p "¿Continuar? (s/n): " confirm
    
    if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
        echo -e "${BLUE}Cancelado${NC}"
        return
    fi
    
    echo -e "${BLUE}📥 Restaurando backup... ${NC}"
    docker exec -i robcast-mysql mysql -u robcast_user -p robcast_db < $backup_file
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Backup restaurado exitosamente${NC}"
    else
        echo -e "${RED}Error al restaurar backup${NC}"
    fi
}

status_services() {
    echo -e "\n${BLUE}📊 Estado de servicios:${NC}\n"
    docker-compose ps
    
    echo -e "\n${BLUE}Verificaciones:${NC}"
    
    # Health check API
    if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ API: http://localhost:3001${NC}"
    else
        echo -e "${RED}✗ API no responde${NC}"
    fi
    
    # Health check Frontend
    if curl -s http://localhost > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend: http://localhost${NC}"
    else
        echo -e "${RED}✗ Frontend no responde${NC}"
    fi
    
    # Health check MySQL
    if docker exec robcast-mysql mysqladmin ping -u robcast_user -p robcast_password_123 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ MySQL: localhost:3306${NC}"
    else
        echo -e "${RED}✗ MySQL no responde${NC}"
    fi
    
    echo ""
}

cleanup_all() {
    echo -e "${RED}⚠️  ¡ADVERTENCIA! Esto eliminará:${NC}"
    echo "- Todos los contenedores"
    echo "- Todas las imágenes"
    echo "- TODOS LOS DATOS (volúmenes)"
    echo ""
    read -p "¿Está seguro? Escriba 'sí' para continuar: " confirm
    
    if [ "$confirm" = "sí" ]; then
        echo -e "${BLUE}Limpiando...${NC}"
        docker-compose down -v
        docker system prune -af
        echo -e "${GREEN}✓ Limpieza completada${NC}"
    else
        echo -e "${BLUE}Cancelado${NC}"
    fi
}

# Main loop
while true; do
    show_menu
    
    case $option in
        1) start_services ;;
        2) stop_services ;;
        3) show_logs ;;
        4) restart_services ;;
        5) rebuild_images ;;
        6) access_mysql ;;
        7) backup_database ;;
        8) restore_database ;;
        9) status_services ;;
        10) cleanup_all ;;
        0) 
            echo -e "${BLUE}Hasta luego! 👋${NC}"
            exit 0 
            ;;
        *) echo -e "${RED}Opción inválida${NC}" ;;
    esac
done
