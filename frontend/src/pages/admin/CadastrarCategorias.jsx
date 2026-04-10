import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LayoutAdmin from "../../assets/components/LayoutAdmin";
import "../../assets/css/admin/AdminCadastroUsuarios.css";

/* ================= MODAL EDITAR ================= */
async function editarCategoriaModal(categoria, departamentos) {
  const options = departamentos
    .map(
      (d) => `
      <option value="${d.id}" ${
        d.id === categoria.departamento_id ? "selected" : ""
      }>
        ${d.nome}
      </option>
    `
    )
    .join("");

  const { value: formValues } = await Swal.fire({
    icon: "info",
    title: "Editar Categoria",
    html: `
      <div class="swal-form">

        <input id="swal-nome" class="swal-input-custom" placeholder="Nome da categoria">

        <select id="swal-departamento" class="swal-input-custom" style="margin-top:10px;">
          <option value="">Selecione um departamento</option>
          ${options}
        </select>

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
      const departamento_id =
        document.getElementById("swal-departamento").value;

      if (!nome) {
        Swal.showValidationMessage("O nome é obrigatório");
        return false;
      }

      if (!departamento_id) {
        Swal.showValidationMessage("Selecione um departamento");
        return false;
      }

      return { nome, status, departamento_id };
    },
  });

  return formValues;
}

/* ================= MODAL NOVO ================= */
async function novaCategoriaModal(departamentos) {
  const options = departamentos
    .map((d) => `<option value="${d.id}">${d.nome}</option>`)
    .join("");

  const { value: formValues } = await Swal.fire({
    icon: "info",
    title: "Nova Categoria",
    html: `
      <div class="swal-form">
        <input id="swal-nome" class="swal-input-custom" placeholder="Nome da categoria">

        <select id="swal-departamento" class="swal-input-custom" style="margin-top:10px;">
          <option value="">Selecione um departamento</option>
          ${options}
        </select>
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
      const departamento_id =
        document.getElementById("swal-departamento").value;

      if (!nome) {
        Swal.showValidationMessage("O nome é obrigatório");
        return false;
      }

      if (!departamento_id) {
        Swal.showValidationMessage("Selecione um departamento");
        return false;
      }

      return {
        nome,
        status: true,
        departamento_id,
      };
    },
  });

  return formValues;
}

/* ================= COMPONENTE ================= */
function AdminListarCategorias() {
  const [busca, setBusca] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buscou, setBuscou] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("true");

  const navigate = useNavigate();

  /* ===== BUSCAR CATEGORIAS ===== */
  async function buscarCategorias(valor = "", status = filtroStatus) {
    try {
      setLoading(true);
      setBuscou(true);

      const response = await fetch(
        `http://localhost:3000/categorias?busca=${valor}&status=${status}`
      );

      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    } finally {
      setLoading(false);
    }
  }

  /* ===== BUSCAR DEPARTAMENTOS ===== */
  async function buscarDepartamentos() {
    try {
      const response = await fetch("http://localhost:3000/departamentos");
      const data = await response.json();
      setDepartamentos(data);
    } catch (error) {
      console.error("Erro ao buscar departamentos:", error);
    }
  }

  /* ===== EDITAR ===== */
  async function editarCategoria(cat) {
    const formValues = await editarCategoriaModal(cat, departamentos);
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
        `http://localhost:3000/categorias/${cat.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      await Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Categoria atualizada!",
        confirmButtonColor: "#052364",
      });

      buscarCategorias(busca, filtroStatus);
    } catch (error) {
      Swal.fire("Erro", error.message, "error");
    }
  }

  async function criarCategoria() {
    const formValues = await novaCategoriaModal(departamentos);
    if (!formValues) return;

    try {
      const response = await fetch("http://localhost:3000/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      await Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Categoria cadastrada!",
        confirmButtonColor: "#052364",
      });
      

      buscarCategorias(busca, filtroStatus);
    } catch (error) {
      Swal.fire("Erro", error.message, "error");
    }
  }

  useEffect(() => {
    buscarCategorias("", "true");
    buscarDepartamentos();
  }, []);

  return (
    <LayoutAdmin>
      <div className="page-container-listar">
        <div className="list-container-listar">

          <div className="close-button" onClick={() => navigate("/AdminHome")}>
            <FaTimes />
          </div>

          <h1>Categorias Cadastradas</h1>

          <div className="search-container-listar" style={{ display: "flex", gap: "10px" }}>

            <select
              className="SelectFiltro"
              value={filtroStatus}
              onChange={(e) => {
                setFiltroStatus(e.target.value);
                buscarCategorias(busca, e.target.value);
              }}
            >
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
            </select>

            <input
              type="text"
              placeholder="Buscar categoria"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />

            <button onClick={() => buscarCategorias(busca, filtroStatus)}>
              Buscar
            </button>

            <button onClick={criarCategoria}>
              Nova Categoria
            </button>
          </div>

          {loading && <p>Carregando...</p>}

          {!loading && categorias.length > 0 && (
            <table className="table-users-listar">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Status</th>
                  <th>Departamento</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {categorias.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.nome}</td>
                    <td>{cat.status ? "Ativo" : "Inativo"}</td>
                    <td>{cat.departamento_nome}</td>
                    <td>
                      <button className="btn-editar" onClick={() => editarCategoria(cat)}>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </LayoutAdmin>
  );
}

export default AdminListarCategorias;