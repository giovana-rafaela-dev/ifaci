# Frontend - Nexus IoT Control

Painel web em Next.js para monitorar usuarios, dispositivos e leituras IoT.

## Stack em uso

- API: ../api
- Frontend: .
- Node-RED: ../node-red

Este frontend nao depende do projeto antigo crud-usuarios.

## Requisitos

- Node.js 20+

## Configuracao

1. Crie o arquivo .env.local com base em .env.local.example
2. Garanta a URL da API:
   NEXT_PUBLIC_API_URL=http://localhost:8080

## Como executar

1. Instale dependencias:
   npm install
2. Rode em desenvolvimento:
   npm run dev
3. Acesse:
   http://localhost:3000

## Fluxo esperado com API e Node-RED

1. Inicie a API em http://localhost:8080
2. Inicie o frontend
3. Inicie o Node-RED e importe o fluxo node.json
4. Gere leituras pelo Node-RED e acompanhe no dashboard
