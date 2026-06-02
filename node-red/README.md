# Projeto Ativo - Integracao IoT

Este diretorio faz parte do fluxo ativo do projeto com:

- API em ../api
- Frontend em ../frontend/my-app

O arquivo de fluxo usado para integracao e o node.json.
Ele envia dados para http://localhost:8080/newData.

Nao usar o projeto antigo crud-usuarios para este fluxo.

# 📘 Plano de Ensino - Interfaces Industriais

Carga horária: 80 horas (20 aulas semanais – 4h por aula)  
Modalidade: Presencial / Laboratório  
Professor: Gabriel Claro

---

## 🎯 Objetivo Geral da Disciplina

Capacitar o aluno a projetar e implementar um sistema supervisório Web aplicado a ambientes industriais, integrando controladores lógicos programáveis via OPC-UA, utilizando middleware, backend e front-end Web, com foco em arquitetura de sistemas, comunicação industrial, alarmística, históricos e desenvolvimento de interfaces IHM de alta performance.

---

## 🧠 Competências Desenvolvidas

Ao final da disciplina, o aluno será capaz de:

- Projetar arquiteturas de sistemas supervisórios baseados em Web
- Integrar sistemas industriais via OPC-UA e middleware
- Implementar backend para aquisição, tratamento e armazenamento de dados industriais
- Desenvolver aplicações Web para supervisão em tempo real
- Implementar alarmes, históricos e gráficos de tendência
- Projetar interfaces IHM seguindo princípios da norma ISA-101

---

## 🗂️ Organização Geral do Semestre

O semestre está dividido em 4 grandes módulos:

1. **Fundamentos Avançados de Desenvolvimento Web Aplicado (Aulas 1–4)**
2. **Arquitetura de Sistemas Supervisórios e Comunicação Industrial (Aulas 5–9)**
3. **Backend, Middleware, Alarmes e Históricos (Aulas 10–14)**
4. **Interfaces IHM e Sistemas Supervisórios (Aulas 15–20)**

---

## 📅 Cronograma Detalhado das Aulas

---

### 🔹 MÓDULO 1 – Desenvolvimento Web Aplicado a Sistemas Supervisórios (Aulas 1 a 4)

> Revisão em nível intermediário/avançado focada em aplicações industriais (não introdutório)

---

### 📍 Aula 1 – Apresentação da Disciplina e Introdução a Sistemas Supervisórios Web

**Conteúdos:**

- Apresentação da disciplina e do projeto final
- Revisão de conceitos de sistemas supervisórios (SCADA, IHM, IIoT)
- Diferenças entre sistemas supervisórios tradicionais e supervisórios Web
- Arquitetura geral do projeto do semestre

**Atividade prática:**

- Análise de arquiteturas reais de sistemas supervisórios Web
- Definição dos grupos e escolha do processo a ser simulado

---

### 📍 Aula 2 – Arquitetura de Aplicações Web para Sistemas em Tempo Real

**Conteúdos:**

- Arquitetura cliente-servidor aplicada à supervisão
- REST, WebSockets e comunicação em tempo real
- Separação de responsabilidades: front-end, backend e middleware
- Boas práticas para aplicações críticas

**Atividade prática:**

- Criação da estrutura inicial do projeto (front + back)
- Testes de comunicação em tempo real entre front-end e backend

---

### 📍 Aula 3 – Backend para Aquisição e Distribuição de Dados Industriais

**Conteúdos:**

- Padrões de API para sistemas supervisórios
- Gerenciamento de estados e dados em tempo real
- Cache, filas e tratamento de latência
- Organização de serviços para alarmes e históricos

**Atividade prática:**

- Implementação de uma API básica de dados em tempo real
- Simulação de variáveis de processo no backend

---

### 📍 Aula 4 – Front-end Avançado para Monitoramento em Tempo Real

**Conteúdos:**

- Gerenciamento de estado (Redux, Context, etc.)
- Componentização para aplicações industriais
- Renderização eficiente de dados em tempo real
- Introdução a dashboards industriais

**Atividade prática:**

- Construção de um dashboard Web simples com dados simulados

---

## 🔹 MÓDULO 2 – Arquitetura Supervisória e Comunicação Industrial (Aulas 5 a 9)

---

### 📍 Aula 5 – Arquitetura de Sistemas Supervisórios

**Conteúdos:**

- Componentes de um sistema supervisório
- Servidor de dados, clientes, viewers e bancos históricos
- Arquiteturas centralizadas vs distribuídas
- Introdução ao projeto final

**Atividade prática:**

- Desenho do diagrama de arquitetura do projeto do grupo

---

### 📍 Aula 6 – Protocolos Industriais e Comunicação Ethernet

**Conteúdos:**

- Protocolos industriais Ethernet
- Conceitos de cliente, servidor e publicador
- Introdução ao OPC-UA
- Segurança em comunicação industrial

**Atividade prática:**

- Configuração de um servidor OPC-UA simulado

---

### 📍 Aula 7 – OPC-UA na Prática

**Conteúdos:**

- Estrutura de nós, variáveis e métodos
- Leitura e escrita de variáveis
- Monitoramento de eventos
- Boas práticas de modelagem OPC-UA

**Atividade prática:**

- Leitura de dados de um servidor OPC-UA via cliente

---

### 📍 Aula 8 – Middleware Industrial com Node-RED

**Conteúdos:**

- Conceito de middleware industrial
- Arquitetura do Node-RED
- Fluxos de aquisição, tratamento e roteamento de dados
- Integração OPC-UA + APIs

**Atividade prática:**

- Criação de fluxos Node-RED para aquisição OPC-UA e envio ao backend

---

### 📍 Aula 9 – Integração Completa: OPC-UA → Node-RED → Backend

**Conteúdos:**

- Tratamento de dados industriais
- Normalização e filtragem
- Gerenciamento de falhas de comunicação
- Monitoramento da cadeia de dados

**Atividade prática:**

- Pipeline completo funcionando com dados reais ou simulados

---

## 🔹 MÓDULO 3 – Backend Supervisório: Alarmes, Históricos e Banco de Dados (Aulas 10 a 14)

---

### 📍 Aula 10 – Integração com Banco de Dados para Sistemas Supervisórios

**Conteúdos:**

- Modelagem de dados industriais
- Tabelas de variáveis, históricos e alarmes
- Estratégias de armazenamento em tempo real

**Atividade prática:**

- Criação do banco de dados do projeto

---

### 📍 Aula 11 – Implementação de Históricos de Processo

**Conteúdos:**

- Conceito de históricos (process historian)
- Estratégias de amostragem
- Consultas por intervalo de tempo

**Atividade prática:**

- Armazenamento contínuo de variáveis no banco

---

### 📍 Aula 12 – Alarmística Industrial

**Conteúdos:**

- Conceitos de alarme, evento e condição
- Tipos de alarmes e prioridades
- Reconhecimento de alarmes
- Boas práticas de alarmística

**Atividade prática:**

- Implementação de alarmes no backend e Node-RED

---

### 📍 Aula 13 – Segurança e Controle de Acesso

**Conteúdos:**

- Autenticação e autorização em sistemas supervisórios
- Perfis de operador e supervisor
- Logs e auditoria

**Atividade prática:**

- Implementação de login e níveis de usuário no projeto

---

### 📍 Aula 14 – Gráficos de Tendência e Visualização Histórica

**Conteúdos:**

- Tipos de gráficos industriais
- Performance em visualização de grandes volumes
- Filtros e escalas

**Atividade prática:**

- Implementação de tela de históricos com gráficos

---

## 🔹 MÓDULO 4 – Interfaces IHM e Sistemas Supervisórios (Aulas 15 a 20)

> Parte final focada especificamente em IHM, conforme solicitado.

---

### 📍 Aula 15 – Introdução às Interfaces Homem-Máquina (IHM Industrial)

**Conteúdos:**

- Conceitos de IHM
- Diferença entre IHM, SCADA e supervisório Web
- Papel do operador e do supervisor
- Erros comuns em IHMs

**Atividade prática:**

- Análise crítica de telas industriais reais

---

### 📍 Aula 16 – IHM de Alta Performance – Norma ISA-101

**Conteúdos:**

- Princípios da ISA-101
- Uso correto de cores
- Hierarquia de telas
- Destaque de alarmes e situações anormais

**Atividade prática:**

- Redesenho conceitual das telas do projeto

---

### 📍 Aula 17 – Telas de Operação: Modo Manual e Modo Automático

**Conteúdos:**

- Estados de processo
- Intertravamentos e permissivos
- Indicação visual de modos de operação

**Atividade prática:**

- Implementação das telas de modo manual e automático

---

### 📍 Aula 18 – Telas de Alarmes e Diagnóstico

**Conteúdos:**

- Layout de telas de alarmes
- Navegação e filtros
- Boas práticas de diagnóstico operacional

**Atividade prática:**

- Implementação da tela de alarmes no front-end

---

### 📍 Aula 19 – Telas de Históricos, Gráficos e Dashboards Supervisórios

**Conteúdos:**

- Layout de telas de tendência
- Dashboards operacionais vs gerenciais
- Performance e usabilidade

**Atividade prática:**

- Finalização das telas de históricos e dashboards

---

### 📍 Aula 20 – Apresentação Final dos Projetos

**Conteúdos:**

- Demonstração completa dos sistemas
- Avaliação técnica e funcional
- Feedback final

**Atividade prática:**

- Apresentação e entrega final do projeto

---

## 📝 Avaliação da Disciplina

- Projeto final de sistema supervisório Web: **70%**
- Entregas parciais e atividades práticas: **20%**
- Participação e envolvimento em aula: **10%**

---

## 📚 Bibliografia Básica

- ISA-101 – Human Machine Interfaces for Process Automation Systems
- Boyer, S. A. – SCADA: Supervisory Control and Data Acquisition
- OPC Foundation – OPC UA Specifications
- Documentação oficial do Node-RED

---

---
