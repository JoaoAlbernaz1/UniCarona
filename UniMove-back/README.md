# UniMove Backend

API REST V1 em NestJS, Prisma 7 e PostgreSQL. Requer Node.js 24 LTS.

## Desenvolvimento

1. Copie `.env.example` para `.env` e substitua os segredos.
2. Instale Docker Desktop (se ainda não existir) e execute `docker compose up -d postgres`.
3. Execute `npm install`, `npm run prisma:generate`, `npm run prisma:migrate` e `npm run prisma:seed`.
4. Inicie com `npm run start:dev`.

Swagger: `http://localhost:3000/docs`. Health: `http://localhost:3000/health`.

O backend usa UTC e as rotas recorrentes registram seu timezone. `.env` nunca deve ser versionado.

## Notificações da V1

As notificações são persistidas exclusivamente no PostgreSQL e consultadas pelo Flutter através da API REST. A V1 não usa SMTP, Firebase, push notifications ou WebSocket. E-mail e push estão planejados para a V2.

Chat/Messages será implementado posteriormente. A infraestrutura de notificações internas já suporta o tipo `MESSAGE_RECEIVED`.
