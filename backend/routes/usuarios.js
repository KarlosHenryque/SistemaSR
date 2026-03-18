const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../dataBase/db");

// Listar clientes
router.get("/", async (req, res) => {
    const { busca } = req.query;

    try {
        let query = `
            SELECT id, nome, email, cpf_cnpj, tipo_usuario, senha, status
            FROM usuarios
            WHERE 1=1
        `;

        let values = [];
        let index = 1;

        if (busca && busca !== "%") {
            query += `
                AND (nome ILIKE $${index}
                OR cpf_cnpj ILIKE $${index})
            `;
            values.push(`%${busca}%`);
            index++;
        }

        query += " ORDER BY nome";

        const result = await pool.query(query, values);
        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
});

// Editar
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nome, email, cpf_cnpj, tipo_usuario, senha, status } = req.body;    
    
    try {
        let query = `
            UPDATE usuarios
            SET nome = $1,
                email = $2,
                cpf_cnpj = $3,
                tipo_usuario = $4,
                status = $5
        `;

        let values = [nome, email, cpf_cnpj, tipo_usuario, status];
        let index = 6;

        if (senha && senha.trim() !== "") {
            const saltRounds = 10;
            const senhaHash = await bcrypt.hash(senha, saltRounds);

            query += `, senha = $${index}`;
            values.push(senhaHash);
            index++;
        }

        query += ` WHERE id = $${index} RETURNING *`;
        values.push(id);

        const result = await pool.query(query, values);

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Erro ao atualizar:", error);
        res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
});

module.exports = router;