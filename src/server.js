import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.use(express.json());

const port = 3000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'usuarios',
    port: '3306',
    waitForConnections: true,
    connectionLimit : 10,
    queueLimit: 0
});

app.get('/users', async (req,res) => {
    const [rows] = await pool.query("SELECT * FROM users;");
    return res.status(200).json({
        message : "Sucesso ao retornar usuarios",
        data : rows
    });
});

app.post('/users', async (req, res) => {
    const {nome, email} = req.body;

    const [result] = await pool.query('INSERT INTO users (id, nome, email) VALUES (null, ?, ?)',
                [nome, email]
    );

    return res.status(201).json({
        message : "Usuario criado com sucesso!"
    });
});

app.delete('/users/:id', async (req, res) => {
    const { id } = req.body;

    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    return res.status(200).json({
        msg : "Usuario deletado com sucesso"
    });
});

app.put('/users/:id', async (req, res) => {
    const {nome, email} = req.body;
    const {id} = req.params

    const [result] = await pool.query('UPDATE users SET nome = ?, email = ? WHERE id = ?', [nome, email, id]);

    return res.status(200).json({
        msg : "Usuario atualizado com sucesso"
    });
});

app.listen(port, () => {
    console.log(`servidor rodando na porta ${port}`);
});