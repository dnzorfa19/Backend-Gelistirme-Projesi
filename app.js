const express = require("express");
const taskRoutes = require("./routes/taskRoutes");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const app = express();

const PORT = 3000;

app.use(express.json());
app.set("json spaces", 4);
app.use(logger);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
    res.json({
        message: "UniTask API çalışıyor!"
    });
});

app.use("/api/tasks", taskRoutes);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`UniTask API http://localhost:${PORT} adresinde çalışıyor.`);
});