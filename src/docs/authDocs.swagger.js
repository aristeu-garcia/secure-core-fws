const authDocs = {
  paths: {
    "/login": {
      post: {
        summary: "Realiza a autenticação do usuário",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user: {
                    type: "string",
                    example: "usuario@email.com",
                  },
                  password: {
                    type: "string",
                    example: "123456",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Usuário autenticado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1...",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Credenciais inválidas.",
          },
        },
      },
    },

    "/refresh": {
      post: {
        summary: "Atualiza o token de autenticação",
        tags: ["Auth"],
        responses: {
          200: {
            description: "Token atualizado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      example: "novo-token-jwt",
                    },
                  },
                },
              },
            },
          },
          403: {
            description: "Token inválido ou expirado.",
          },
        },
      },
    },
  },
};

export default authDocs;
