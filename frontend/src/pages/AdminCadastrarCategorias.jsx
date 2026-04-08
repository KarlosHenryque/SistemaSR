import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LayoutAdmin from "../assets/components/LayoutAdmin";
import "../assets/css/AdminCadastroUsuarios.css";

async function editarCategoriaModal(categoria) {
  const { value: formValues } = await Swal.fire({
    icon: "info",
    title: "Editar Categoria",
    html: `
      <div class="swal-form">
        <input id="swal-nome" class="swal-input-custom" placeholder="Nome da categoria">

        <div class="status-container" style="margin-top:10px;">
          <label>Status da categoria</label>
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

      document.getElementById("swal-nome").value = categoria.nome || "";
      checkbox.checked = categoria.status; 

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
        Swal.showValidationMessage("O nome da categoria é obrigatório");
        return false;
      }

      return { nome, status };
    }
  });

  return formValues;
}

async function novaCategoriaModal() {
  const { value: formValues } = await Swal.fire({
    icon: "info",
    title: "Nova Categoria",
    html: `<div class="swal-form">
             <input id="swal-nome" class="swal-input-custom" placeholder="Nome da categoria">
           </div>`,
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
        Swal.showValidationMessage("O nome da categoria é obrigatório");
        return false;
      }
      return { nome, status: true }; 
    }
  });

  return formValues;
}

function AdminListarCategorias() {
  const [busca, setBusca] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buscou, setBuscou] = useState(false);
  const navigate = useNavigate();

  async function buscarCategorias(valor = "") {
    try {
      setLoading(true);
      setBuscou(true);

      const response = await fetch(`http://localhost:3000/categorias?busca=${valor}`);
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    } finally {
      setLoading(false);
    }
  }

  async function editarCategoria(cat) {
    const formValues = await editarCategoriaModal(cat);
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
      const response = await fetch(`http://localhost:3000/categorias/${cat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      await Swal.fire("Sucesso!", "Categoria atualizada!", "success");
      setCategorias((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, ...formValues } : c))
      );
    } catch (error) {
      Swal.fire("Erro", error.message, "error");
    }
  }

  async function criarCategoria() {
    const formValues = await novaCategoriaModal();
    if (!formValues) return;

    try {
      const response = await fetch(`http://localhost:3000/categorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      await Swal.fire("Sucesso!", "Categoria cadastrada!", "success");
      buscarCategorias(busca || "%");
    } catch (error) {
      Swal.fire("Erro", error.message, "error");
    }
  }

  useEffect(() => {
    buscarCategorias("%");
  }, []);

  return (
    <LayoutAdmin>
      <div className="page-container-listar">
        <div className="list-container-listar">

          <div className="close-button" onClick={() => navigate("/AdminHome")}>
            <FaTimes />
          </div>

          <h1>Categorias Cadastradas</h1>

          <div className="search-container-listar" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Buscar por nome (use % para todos)"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") buscarCategorias(busca); }}
            />
            <button onClick={() => buscarCategorias(busca)}>Buscar</button>
            <button style={{ backgroundColor: "#052364", color: "#fff" }} onClick={criarCategoria}>
              Nova Categoria
            </button>
          </div>

          {loading && <p>Carregando...</p>}

          {!loading && (
            <>
              {!buscou ? (
                <p className="no-data-listar">Digite algo para buscar categorias</p>
              ) : categorias.length === 0 ? (
                <p className="no-data-listar">Nenhuma categoria encontrada</p>
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
                    {categorias.map((cat) => (
                      <tr key={cat.id}>
                        <td>{cat.nome}</td>
                        <td>{cat.status ? "Ativo" : "Inativo"}</td>
                        <td style={{ display: "flex", justifyContent: "center" }}>
                          <button className="btn-editar" onClick={() => editarCategoria(cat)}>
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

export default AdminListarCategorias;