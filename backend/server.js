require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const app = express();
const port = process.env.PORT;;
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/tasksRoutes");


app.use(cors({origin: process.env.CLIENT_URL}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/tasks", require("./routes/tasksRoutes"));


connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});