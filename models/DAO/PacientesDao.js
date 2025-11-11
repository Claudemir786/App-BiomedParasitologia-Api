const pool = require('./db');

// CREATE - AJUSTADO para o frontend
async function insert(nome, telefone, email, nomeMae, medicamento, nome_medicamento) {
  try {
    const [result] = await pool.query(`
      INSERT INTO pacientes (
        nome, telefone, pacienteMail, nomeMae,
        medicamento, nome_medicamento
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      nome, telefone, email, nomeMae,  // ← pacienteMail → email
      medicamento, nome_medicamento
    ]);
    
    if (result.insertId && result.insertId > 0) {
      return { id: result.insertId }; // ← RETORNO COMPATÍVEL
    } else {
      return false;
    }
  } catch (erro) {
    console.error("Falha ao inserir paciente: ", erro.message);
    return false;
  }
}

// READ ALL
async function readAll() {
  try {
    const [rows] = await pool.query("SELECT * FROM pacientes");
    if (rows.length > 0) {
      return rows;
    }
    return false;
  } catch (erro) {
    console.error("Erro ao ler pacientes: ", erro.message);
    return false;
  }
}

// READ BY ID
async function buscarPorId(id) {
  try {
    if (id) {
      const [rows] = await pool.query(`SELECT * FROM pacientes WHERE id = ?`, [id]);
      if (rows.length > 0) {
        return rows[0];
      }
      return false;
    }
    return false;
  } catch (erro) {
    console.error("Erro ao buscar paciente por id: ", erro.message);
    return false;
  }
}

// UPDATE
async function update(id, nome, telefone, email, nomeMae, medicamento, nome_medicamento) {
  try {
    const [result] = await pool.query(`
      UPDATE pacientes SET
        nome = ?, telefone = ?, pacienteMail = ?, nomeMae = ?,
        medicamento = ?, nome_medicamento = ?
      WHERE id = ?
    `, [
      nome, telefone, email, nomeMae,  // ← pacienteMail → email
      medicamento, nome_medicamento, id
    ]);
    return result.affectedRows > 0;
  } catch (erro) {
    console.error("Erro ao atualizar paciente: ", erro.message);
    return false;
  }
}

// DELETE
async function deletePaciente(id) {
  try {
    if (id) {
      const [result] = await pool.query(`DELETE FROM pacientes WHERE id = ?`, [id]);
      return result.affectedRows > 0;
    }
    return false;
  } catch (erro) {
    console.error("Erro ao deletar paciente: ", erro.message);
    return false;
  }
}

// SEARCH BY NAME - ADICIONE ESTA FUNÇÃO
async function buscarPorNome(nome) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM pacientes WHERE nome LIKE ? ORDER BY nome`, 
      [`%${nome}%`]
    );
    return rows;
  } catch (erro) {
    console.error("Erro ao buscar paciente por nome: ", erro.message);
    return [];
  }
}

module.exports = {
  insert,
  readAll,
  buscarPorId,
  update,
  deletePaciente,
  buscarPorNome  // ← EXPORTE A NOVA FUNÇÃO
};