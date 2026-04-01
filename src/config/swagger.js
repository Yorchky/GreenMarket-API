const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GreenMarket API",
      version: "1.0.0",
      description: "Inventario inteligente con roles y JWT",
    },
    servers: [
      {
        url: "https://emmetropic-gertrude-asymptotically.ngrok-free.dev ",
        description: "Servidor publico (ngrok)",
      },
      {
        url: "http://localhost:4000",
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);