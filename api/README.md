# API - Nexus IoT

Esta API e usada pelo frontend em Next.js e pelo fluxo do Node-RED.

## Requisitos

- Node.js 20+

## Como executar

1. Instale as dependencias:
   npm install
2. Inicie em modo desenvolvimento:
   npm run dev

A API sobe por padrao em:

- http://localhost:8080

## Endpoints principais

- GET /health
- POST /login
- GET/POST/PUT/DELETE /usuarios
- GET/POST/PUT/DELETE /devices
- GET /iot
- GET/PUT /sensor/:id
- POST /newData
- POST /newData/random

## Integracao

- Frontend consome esta API via NEXT_PUBLIC_API_URL
- Node-RED envia leituras para POST /newData

## Observacao

Este projeto deve ser usado junto com as pastas frontend/my-app e node-red.
Nenhuma dependencia do projeto antigo crud-usuarios.
