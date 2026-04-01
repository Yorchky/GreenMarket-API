  require("dotenv").config();

  const express = require("express");
  const connectDB = require("./src/config/database");
  const productosRoutes = require("./src/routes/productos");
  const authRoutes = require("./src/routes/auth");

  const swaggerUi = require("swagger-ui-express");
  const swaggerSpec = require("./src/config/swagger");

  const app = express(); // declararse ANTES de usarse
  const PORT = process.env.PORT || 4000;

  // Conectar base de datos
  connectDB();

  // Middleware
  app.use(express.json());

  // Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Rutas
  app.use("/api/auth", authRoutes);
  app.use("/api/productos", productosRoutes);

  app.listen(PORT, () => {
    console.log(`Server running at:  http://localhost:${PORT}`);
    console.log(`Swagger docs at:    http://localhost:${PORT}/api-docs`);
  });