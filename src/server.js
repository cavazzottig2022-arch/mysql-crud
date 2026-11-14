import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.use(express.json());

const port = process.env.SERVER_PORT;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit : 10,
    queueLimit: 0
});

app.get('/users', async (req,res) => {
    try{
        const [rows] = await pool.query("SELECT * FROM users;");

        return res.status(200).json({
            message : "Sucesso ao retornar usuarios",
            data : rows
        });
    }
    catch(error){
        console.log("Error");
        return res.status(500).json({
            message : "Erro no servidor, tente novamente!"
        });
    }
});

app.post('/users', async (req, res) => {
    try{
        const {nome, email} = req.body;

            const [result] = await pool.query('INSERT INTO users (id, nome, email) VALUES (null, ?, ?)',
                        [nome, email]
            );

            return res.status(201).json({
                message : "Usuario criado com sucesso!"
            });
    }
    catch(error){
        console.log("Error");
        return res.status(500).json({
            message : "Erro no servidor, tente novamente!"
        });
    }
});

app.delete('/users/:id', async (req, res) => {
    try{
        const { id } = req.body;

        const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);

        return res.status(200).json({
            msg : "Usuario deletado com sucesso"
        });
    }
    catch{
        console.log("Error");
        return res.status(500).json({
            message : "Erro no servidor, tente novamente!"
        });
    }
  
});

app.put('/users/:id', async (req, res) => {
    try{
        const {nome, email} = req.body;
        const {id} = req.params

        const [result] = await pool.query('UPDATE users SET nome = ?, email = ? WHERE id = ?', [nome, email, id]);

        return res.status(200).json({
            msg : "Usuario atualizado com sucesso"
    });
    }
    catch{
        console.log("Error");
        return res.status(500).json({
            message : "Erro no servidor, tente novamente!"
        });
    }
});

app.listen(port, () => {
    console.log(`servidor rodando na porta ${port}`);
});