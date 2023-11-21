CWD = $(shell pwd)

dev-up: up-database up-backend up-redis
dev-down: down-dev

up-database:
	docker-compose -f docker-compose.dev.yml up beautygo-db -d

up-backend:
	docker-compose -f docker-compose.dev.yml up beautygo-backend-dev -d
	
up-redis:
	docker-compose -f docker-compose.dev.yml up beautygo-redis -d

up-module:
	docker-compose -f docker-compose.dev.yml up beautygo-backend-node-module

down-dev:
	docker-compose -f docker-compose.dev.yml down
	docker rmi beautygo-backend_beautygo-backend-dev
	docker network rm beautygo-backend_beautygo-network

restart: 
	docker-compose -f docker-compose.dev.yml restart beautygo-backend-dev