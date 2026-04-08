const express = require('express');
const router = express.Router();
const pool = require("../dataBase/db"); 

// Rota para cadastrar categoria
router.post('/', async (req, res) => {
  const { nome, status } = req.body;

  if (!nome) {
    return res.status(400).json({ error: 'O nome da categoria é obrigatório' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO categorias (nome, status) VALUES ($1, $2) RETURNING *',
      [nome, status !== undefined ? status : true] // padrão TRUE
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { 
      res.status(400).json({ error: 'Categoria já existe' });
    } else {
      res.status(500).json({ error: 'Erro ao cadastrar categoria' });
    }
  }
});

// Rota para listar todas as categorias
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias ORDER BY nome');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// Rota para atualizar nome e status da categoria pelo id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, status } = req.body;

  if (!nome && status === undefined) {
    return res.status(400).json({ error: 'É necessário informar nome ou status' });
  }

  try {
    const fields = [];
    const values = [];
    let index = 1;

    if (nome !== undefined) {
      fields.push(`nome = $${index++}`);
      values.push(nome);
    }
    if (status !== undefined) {
      fields.push(`status = $${index++}`);
      values.push(status);
    }

    values.push(id); 
    const query = `UPDATE categorias SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { 
      res.status(400).json({ error: 'Categoria já existe' });
    } else {
      res.status(500).json({ error: 'Erro ao atualizar categoria' });
    }
  }
});

module.exports = router;