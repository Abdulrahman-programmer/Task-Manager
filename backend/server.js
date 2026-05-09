require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/tasksRoutes");
const verifyToken = require("./middleWare/authMiddleWare");

app.use(cors({origin: process.env.CLIENT_URL}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use("/api/auth", require("./routes/authRoutes"));
app.use(verifyToken); // Protect all task routes
app.use("/api/tasks", require("./routes/tasksRoutes"));


connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});