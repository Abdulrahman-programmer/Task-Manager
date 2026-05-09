const swaggerJsDoc = require("swagger-jsdoc");
require("dotenv").config();
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "API documentation for Task Manager",
    },
    servers: [
      {
        url: process.env.SERVER_URL,
      },
    ],
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;