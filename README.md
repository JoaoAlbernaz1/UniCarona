# 🚗 UniCarona

> **Plataforma de caronas solidárias para a comunidade acadêmica**

<div align="center">

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Versão](https://img.shields.io/badge/Versão-1.0-blue)
![Licença](https://img.shields.io/badge/Licença-Acadêmico-green)
![Grupo](https://img.shields.io/badge/Grupo-05-purple)

**Universidade Católica de Brasília — Análise e Projeto de Software — 2026**

</div>

---

## 📄 Documentação (links atualizados)

| Documento | Link |
|-----------|------|
| **Especificação dos Casos de Uso** | [Abrir no Google Docs](https://docs.google.com/document/d/1yODVtw9hHyY5FSUCa7P8aLDSWaZnLDw6qFGL2goDdGM/edit?usp=sharing) |
| Documento de Visão | [PDF](docs/Documento_de_Visao.pdf) |

---

## 📋 Sobre o Projeto

O **UniCarona** é uma plataforma mobile de caronas solidárias exclusiva para a comunidade acadêmica da UCB. O sistema conecta estudantes motoristas com vagas ociosas a estudantes que enfrentam trajetos exaustivos entre as cidades satélites e o campus.

### 🎯 Problema
- Desgaste físico e mental de alunos com múltiplos modais de transporte
- Incompatibilidade entre horários de ônibus/metrô e aulas noturnas
- Falta de rede organizada de apoio para deslocamento

### 💡 Solução
Uma plataforma que permite cadastro seguro (CPF + reconhecimento facial), matching inteligente de rotas, rastreamento em tempo real e avaliação bidirecional entre usuários.

---

## 🏗️ Arquitetura

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | Flutter (Dart 3.x) |
| **Backend** | NestJS (Node.js 18.x + TypeScript 5.x) |
| **Banco de Dados** | PostgreSQL (Geography data type) |
| **ORM** | Prisma ou TypeORM |
| **Comunicação** | API RESTful (JSON) |
| **Segurança** | HTTPS/TLS + JWT + Facial ID |

---

## 📝 Casos de Uso

| # | Caso de Uso | Prioridade | Entrega |
|---|------------|-----------|---------|
| UC01 | Cadastrar Usuário (CPF + Facial ID) | Crítico | 1.0 (MVP) |
| UC02 | Cadastrar Rotas e Horários | Crítico | 1.0 (MVP) |
| UC03 | Solicitar Carona e Busca | Crítico | 1.0 (MVP) |
| UC04 | Matching (Cruzamento de Dados) | Crítico | 1.0 (MVP) |
| UC05 | Rastrear Viagem em Tempo Real | Importante | 1.1 |
| UC06 | Histórico de Viagens | Importante | 1.1 |
| UC07 | Avaliar Usuário (Rating) | Útil | 2.0 |
| UC08 | Cancelar Carona Agendada | Essencial | — |

---

## 🔒 Segurança
- ✅ Validação via CPF + Reconhecimento Facial
- ✅ Verificação de vínculo institucional por e-mail acadêmico
- ✅ HTTPS/TLS com tokens JWT
- ✅ Rastreamento em tempo real
- ✅ Histórico imutável (LGPD)

---

## 👥 Equipe — Grupo 05
**Universidade Católica de Brasília** — Análise e Projeto de Software — 2026

---
*"Conectando estudantes, transformando trajetos em oportunidades de ajuda mútua."*
# UniCarona
