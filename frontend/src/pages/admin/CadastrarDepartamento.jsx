import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LayoutAdmin from "../../assets/components/LayoutAdmin";
import "../../assets/css/admin/AdminCadastroUsuarios.css";

async function editarDepartamentoModal(departamento) {
  const { value: formValues } = await Swal.fire({
    icon: "info",
    title: "Editar Departamento",
    html: `
      <div class="swal-form">

        <input id="swal-nome" class="swal-input-custom" placeholder="Nome do departamento">

        <div class="status-container" style="margin-top:10px;">
          <label>Status do departamento</label>

          <label class="switch">
              <input type="checkbox" id="swal-ativo">
              <span class="slider"></span>
          </label>

          <span id="status-text" class="status-text"></span>
        </div>

      </div>
    `,

    didOpen: () => {
      const checkbox = document.getElementById("swal-ativo");
      const statusText = document.getElementById("status-text");

      document.getElementById("swal-nome").value = departamento.nome || "";
      checkbox.checked = departamento.status;

      const atualizarTexto = () => {
        statusText.textContent = checkbox.checked ? "Ativo" : "Inativo";
      };

      atualizarTexto();
      checkbox.addEventListener("change", atualizarTexto);
    },

    showCancelButton: true,
    confirmButtonText: "Salvar",

    preConfirm: () => {
      const nome = document.getElementById("swal-nome").value.trim();
      const status = document.getElementById("swal-ativo").checked;

      if (!nome) {
        Swal.showValidationMessage("O nome do departamento é obrigatório");
        return false;
      }

      return { nome, status };
    }
  });

  return formValues;
}

async function novoDepartamentoModal() {
  const { value: formValues } = await Swal.fire({
    icon: "info",
    title: "Novo Departamento",
    html: `
      <div class="swal-form">
        <input id="swal-nome" class="swal-input-custom" placeholder="Nome do departamento">
      </div>
    `,

    showCancelButton: true,
    confirmButtonText: "Cadastrar",

    preConfirm: () => {
      const nome = document.getElementById("swal-nome").value.trim();

      if (!nome) {
        Swal.showValidationMessage("O nome do departamento é obrigatório");
        return false;
      }

      return { nome, status: true };
    }
  });

  return formValues;
}

function AdminCadastrarDepartamento() {
  const [busca, setBusca] = useState("");
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buscou, setBuscou] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("true");

  const navigate = useNavigate();

  async function buscarDepartamentos(valor = "", status = filtroStatus) {
    try {
      setLoading(true);
      setBuscou(true);

      const response = await fetch(
        `http://localhost:3000/departamentos?busca=${valor}&status=${status}`
      );

      const data = await response.json();
      setDepartamentos(data);

    } catch (error) {
      console.error("Erro ao buscar departamentos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function editarDepartamento(dep) {
    const formValues = await editarDepartamentoModal(dep);
    if (!formValues) return;

    const confirm = await Swal.fire({
      title: "Confirmar alteração?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Salvar"
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(
        `http://localhost:3000/departamentos/${dep.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues)
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      await Swal.fire("Sucesso!", "Departamento atualizado!", "success");

      buscarDepartamentos(busca, filtroStatus);

    } catch (error) {
      Swal.fire("Erro", error.message, "error");
    }
  }

  async function criarDepartamento() {
    const formValues = await novoDepartamentoModal();
    if (!formValues) return;

    try {
      const response = await fetch(
        "http://localhost:3000/departamentos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues)
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      await Swal.fire("Sucesso!", "Departamento cadastrado!", "success");

      buscarDepartamentos(busca, filtroStatus);

    } catch (error) {
      Swal.fire("Erro", error.message, "error");
    }
  }

  useEffect(() => {
    buscarDepartamentos("", "true");
  }, []);


  return (
    <LayoutAdmin>
      <div className="page-container-listar">
        <div className="list-container-listar">

          <div className="close-button" onClick={() => navigate("/AdminHome")}>
            <FaTimes />
          </div>

          <h1>Departamentos Cadastrados</h1>

          <div className="search-container-listar" style={{ display: "flex", gap: "10px" }}>

            <select
              className="SelectFiltro"
              value={filtroStatus}
              onChange={(e) => {
                setFiltroStatus(e.target.value);
                buscarDepartamentos(busca, e.target.value);
              }}
            >
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
            </select>

            <input
              type="text"
              placeholder="Buscar departamento"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  buscarDepartamentos(busca, filtroStatus);
                }
              }}
            />

            <button onClick={() => buscarDepartamentos(busca, filtroStatus)}>
              Buscar
            </button>

            <button
              style={{ backgroundColor: "#052364", color: "#fff" }}
              onClick={criarDepartamento}
            >
              Novo Departamento
            </button>
          </div>

          {loading && <p>Carregando...</p>}

          {!loading && (
            <>
              {!buscou ? (
                <p>Digite algo para buscar departamentos</p>
              ) : departamentos.length === 0 ? (
                <p>Nenhum departamento encontrado</p>
              ) : (
                <table className="table-users-listar">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Status</th>
                      <th style={{ display: "flex", justifyContent: "center" }}>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {departamentos.map((dep) => (
                      <tr key={dep.id}>
                        <td>{dep.nome}</td>
                        <td>{dep.status ? "Ativo" : "Inativo"}</td>
                        <td style={{ display: "flex", justifyContent: "center" }}>
                          <button
                            className="btn-editar"
                            onClick={() => editarDepartamento(dep)}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

        </div>
      </div>
    </LayoutAdmin>
  );
}

export default AdminCadastrarDepartamento;