const express = require("express");
const { Pool } = require("pg");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432
});

async function initDB() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            text TEXT NOT NULL
        )
    `);
}

app.get("/api/todos", async (req, res) => {
    const result = await pool.query("SELECT * FROM todos ORDER BY id DESC");
    res.json(result.rows);
});

app.post("/api/todos", async (req, res) => {
    const { text } = req.body;

    const result = await pool.query(
        "INSERT INTO todos(text) VALUES($1) RETURNING *",
        [text]
    );

    res.json(result.rows[0]);
});

app.delete("/api/todos/:id", async (req, res) => {

    await pool.query(
        "DELETE FROM todos WHERE id=$1",
        [req.params.id]
    );

    res.sendStatus(204);
});

initDB().then(() => {

    app.listen(3000, () => {
        console.log("server running on port 3000");
    });

});