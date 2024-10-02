[Вернуться к основному README](../README.md)

Способ ручной развертки:
```
git clone https://github.com/DorofD/StandPlanner
cd StandPlanner && mkdir data && cp backend/.env.example backend/.env && cp frontend/.env.example frontend/.env
*заполните файлы frontend/.env и backend/.env нужными значениями*
docker build . -f ./docker/Dockerfile.backend -t sp-backend:latest
docker build . -f ./docker/Dockerfile.frontend -t sp-frontend:latest
docker compose up -d
```
После развертки можно зайти в приложение по ip адресу сервера под пользователем admin с паролем admin