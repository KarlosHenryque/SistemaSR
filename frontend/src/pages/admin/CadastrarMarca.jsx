import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LayoutAdmin from "../../assets/components/LayoutAdmin";
import "../../assets/css/admin/AdminCadastroUsuarios.css";

async function editarMarcaModal(marca) {
  const { value: formValues } = await Swal.fire({
    icon: "info",
    title: "Editar Marca",
    html: `
      <div class="swal-form">

        <input id="swal-nome" class="swal-input-custom" placeholder="Nome da marca">

        <div class="status-container" style="margin-top:10px;">
          <label>Status da marca</label>

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

      document.getElementById("swal-nome").value = marca.nome || "";
      checkbox.checked = marca.status;

      const atualizarTexto = () => {
        statusText.textContent = checkbox.checked ? "Ativo" : "Inativo";
      };

      atualizarTexto();
      checkbox.addEventListener("change", atualizarTexto);
    },

    showCancelButton: true,
    showCloseButton: true,
    reverseButtons: true,
    confirmButtonText: "Salvar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#052364",
    cancelButtonColor: "#ff4d4d",

    preConfirm: () => {
      const nome = document.getElementById("swal-nome").value.trim();
      const status = document.getElementById("swal-ativo").checked;

      if (!nome) {
        Swal.showValidationMessage("O nome da marca é obrigatório");
        return false;
      }

      return { nome, status };
    }
  });

  return formValues;
}

async function novaMarcaModal() {
  const { value: formValues } = await Swal.fire({
    icon: "info",
    title: "Nova Marca",
    html: `
      <div class="swal-form">
        <input id="swal-nome" class="swal-input-custom" placeholder="Nome da marca">
      </div>
    `,

    showCancelButton: true,
    showCloseButton: true,
    reverseButtons: true,
    confirmButtonText: "Cadastrar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#052364",
    cancelButtonColor: "#ff4d4d",

    preConfirm: () => {
      const nome = document.getElementById("swal-nome").value.trim();

      if (!nome) {
        Swal.showValidationMessage("O nome da marca é obrigatório");
        return false;
      }

      return { nome, status: true };
    }
  });

  return formValues;
}

function AdminCadastrarMarca() {
  const [busca, setBusca] = useState("");
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buscou, setBuscou] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("true");

  const navigate = useNavigate();

  async function buscarMarcas(valor = "", status = filtroStatus) {
    try {
      setLoading(true);
      setBuscou(true);

      const response = await fetch(
        `http://localhost:3000/marcas?busca=${valor}&status=${status}`
      );

      const data = await response.json();
      setMarcas(data);

    } catch (error) {
      console.error("Erro ao buscar marcas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function editarMarca(marca) {
    const formValues = await editarMarcaModal(marca);
    if (!formValues) return;

    const confirm = await Swal.fire({
      title: "Confirmar alteração?",
      icon: "question",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Salvar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#052364",
      cancelButtonColor: "#ff4d4d",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(
        `http://localhost:3000/marcas/${marca.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues)
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      await Swal.fire("Sucesso!", "Marca atualizada!", "success");

      buscarMarcas(busca, filtroStatus);

    } catch (error) {
      Swal.fire("Erro", error.message, "error");
    }
  }

  async function criarMarca() {
    const formValues = await novaMarcaModal();
    if (!formValues) return;

    try {
      const response = await fetch(
        "http://localhost:3000/marcas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues)
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      await Swal.fire("Sucesso!", "Marca cadastrada!", "success");

      buscarMarcas(busca, filtroStatus);

    } catch (error) {
      Swal.fire("Erro", error.message, "error");
    }
  }

  useEffect(() => {
    buscarMarcas("", "true");
  }, []);

  return (
    <LayoutAdmin>
      <div className="page-container-listar">
        <div className="list-container-listar">

          <div className="close-button" onClick={() => navigate("/AdminHome")}>
            <FaTimes />
          </div>

          <h1>Marcas Cadastradas</h1>

          <div className="search-container-listar" style={{ display: "flex", gap: "10px" }}>

            <select
              className="SelectFiltro"
              value={filtroStatus}
              onChange={(e) => {
                setFiltroStatus(e.target.value);
                buscarMarcas(busca, e.target.value);
              }}
            >
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
            </select>

            <input
              type="text"
              placeholder="Buscar marca"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  buscarMarcas(busca, filtroStatus);
                }
              }}
            />

            <button onClick={() => buscarMarcas(busca, filtroStatus)}>
              Buscar
            </button>

            <button
              style={{ backgroundColor: "#052364", color: "#fff" }}
              onClick={criarMarca}
            >
              Nova Marca
            </button>
          </div>

          {loading && <p>Carregando...</p>}

          {!loading && (
            <>
              {!buscou ? (
                <p>Digite algo para buscar marcas</p>
              ) : marcas.length === 0 ? (
                <p>Nenhuma marca encontrada</p>
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
                    {marcas.map((marca) => (
                      <tr key={marca.id}>
                        <td>{marca.nome}</td>
                        <td>{marca.status ? "Ativo" : "Inativo"}</td>
                        <td style={{ display: "flex", justifyContent: "center" }}>
                          <button 
                            className="btn-editar"
                            onClick={() => editarMarca(marca)}
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

export default AdminCadastrarMarca;