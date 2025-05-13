# Módulo de Autenticação e Administração de Usuários

---

## 👥 Integrantes

- **Iago Alves** | RGM: 11242400738  
- **João Tigges** | RGM: 11231400100

---

## 📋 Descrição

Este projeto é um **componente de autenticação e administração de usuários**, projetado para ser incorporado em outros sistemas. Foca na segurança, conformidade com a **LGPD** (Lei Geral de Proteção de Dados) e adoção de **boas práticas de programação**.

---

## 🎯 Objetivo

Desenvolver um módulo seguro para:
- Registro e administração de usuários e perfis.
- Autenticação segura com hash de senhas.
- Recuperação de senha via e-mail ou SMS.
- Gerenciamento de sessões e logout seguro.
- Controle de acesso baseado em perfis de usuário.

---

## 📚 Escopo

O módulo deve oferecer:
- Cadastro e administração de usuários.
- Hashing seguro de senhas.
- Login e logout seguro.
- Redefinição de senha (email/SMS).
- Controle de acesso e permissões.
- Registro de logs de acesso.
- Conformidade com a LGPD.

---

## 🛠️ Tecnologias e Ferramentas

- **Frontend:** React
- **Backend:** Node.js
- **Banco de Dados:** SQLite
- **Segurança:** 
  - Hash de senhas: `bcrypt`, `Argon2`
  - Autenticação: `JWT`
- **Comunicação:** HTTPS

---

## 🧩 Modelagem de Dados

O banco de dados foi modelado considerando:

- **Usuário**: possui informações pessoais e vínculo a um perfil.
- **Papel**: define permissões de acesso.
- **Token**: utilizado para autenticação e redefinição de senha.
- **Log de Acesso**: registra eventos como login, logout e falhas de autenticação.

**Relacionamentos principais:**
- Um usuário tem **um** papel, mas um papel pode pertencer a **vários** usuários.
- Um usuário pode ter **vários** tokens e **vários** registros de acesso.

> 🔗 O modelo lógico está disponível no DER (Diagrama Entidade-Relacionamento) anexo.

---

## 🔄 Fluxos do Sistema

### Login
- Verificação de cadastro e senha.
- Limite de tentativas para prevenir ataques.
- Bloqueio temporário em caso de múltiplas falhas.
- Registro de logs em cada tentativa.

### Redefinição de Senha
- Solicitação via e-mail ou SMS.
- Envio de código de verificação.
- Bloqueio temporário após tentativas inválidas.
- Validação de nova senha conforme requisitos.

> 🔗 Detalhamento completo disponível no fluxograma anexo.

---

## ⚙️ Requisitos

### Funcionais
- Cadastro e autenticação de usuários.
- Hash seguro de senhas.
- Recuperação de senha.
- Controle de perfis e permissões.
- Registro de eventos de acesso.

### Não Funcionais
- Resposta em < 2 segundos.
- Desenvolvimento seguro seguindo boas práticas.
- Interface responsiva e acessível.
- Arquitetura escalável.

---

## 🔒 Segurança

- Hashing robusto de senhas.
- Proteção contra ataques de força bruta.
- Comunicação segura via HTTPS.
- Tokens JWT para autenticação e recuperação de sessão.

---

## 📝 Conclusão

Este módulo oferece uma base sólida e segura para gestão de usuários em aplicações diversas, garantindo **proteção de dados pessoais**, **facilidade de integração** e **respeito às normas legais**.
