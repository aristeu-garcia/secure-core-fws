# Secure Core FWS

## Sobre o Projeto

O **Secure Core FWS** foi desenvolvido como parte de uma extensão curricular para obtenção de horas complementares. O projeto consiste na criação de um serviço utilizando **Node.js** para autenticação no servidor interno do **Instituto Federal de Goiás** via protocolo **LDAP**.

A aplicação funciona como uma **API REST** e implementa autenticação dupla utilizando **JWT (JSON Web Token)**, garantindo maior segurança na comunicação e no acesso aos dados.

### Tecnologias Utilizadas

Para a construção do projeto, utilizamos as seguintes tecnologias:

- **Node.js** – Ambiente de execução para JavaScript no backend
- **Express** – Framework minimalista para criação de servidores
- **ldapts** – Cliente LDAP para autenticação e comunicação segura
- **JWT (JSON Web Token)** – Implementação de autenticação dupla

## Estrutura do Projeto e Melhorias Futuras

Atualmente, o sistema está em uma fase inicial, com poucas entidades. Para manter boas práticas de **arquitetura de software**, foram criadas pastas separadas para diferentes responsabilidades da aplicação.

Com o crescimento do projeto e o aumento no número de entidades, será essencial reorganizar a estrutura do código seguindo o conceito de **Domain-Driven Design (DDD)**. Isso permitirá um código mais modular, escalável e de fácil manutenção.

### Estrutura Proposta (DDD)

A separação por domínio consiste na seguinte organização:

```
/src
 ├── users
 │    ├── controller.js
 │    ├── routes.js
 │    ├── service.js
 │    ├── repository.js
 │    ├── model.js
 │
 ├── auth
 │    ├── controller.js
 │    ├── routes.js
 │    ├── service.js
 │    ├── repository.js
 │
 ├── config
 │    ├── database.js
 │    ├── ldap.js
 │
 ├── middleware
 │    ├── authMiddleware.js
 │
 ├── app.js
 ├── server.js
```

### Benefícios dessa Estrutura

✅ Maior organização e modularidade
✅ Separação clara entre **domínios** da aplicação
✅ Facilidade na adição de novas funcionalidades
✅ Melhor manutenção e escalabilidade

## Como Executar o Projeto

1. **Clone o repositório**
   ```sh
   git clone https://github.com/seu-usuario/secure-core-fws.git
   cd secure-core-fws
   ```
2. **Instale as dependências**
   ```sh
   npm install
   ```
3. **Configure as variáveis de ambiente** (arquivo `.env`)
   ```env
   PORT=3000
   NODE_ENV=development
   LOGS_RETENTION_DAYS=7
   LOGS_MAX_SIZE_MB=5
   LOGS_DIR=logs
   ...
   ```
4. **Inicie o servidor**
   ```sh
   npm start
   ```
5. **Acesse a API**
   - Rota de autenticação: `POST /auth/login`
   - Rota de usuários: `GET /users`

## Contribuição

Sinta-se à vontade para contribuir com melhorias para o projeto. Caso tenha sugestões, abra uma **issue** ou envie um **pull request**! 🚀

---

📌 _Projeto desenvolvido para fins acadêmicos no Instituto Federal de Goiás._
