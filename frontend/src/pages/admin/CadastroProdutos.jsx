import Swal from "sweetalert2";
import { useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../assets/css/admin/AdminCadastroUsuarios.css";
import LayoutAdmin from "../../assets/components/LayoutAdmin";

function AdminCadastrarProdutos() {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    categoria_id: "",
    departamento_id: "",
    marca_id: "",
    preco: "",
    codigo: "",
    imagem: null,
  });

  const [categorias, setCategorias] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const [catRes, depRes, marcaRes] = await Promise.all([
        fetch("http://localhost:3000/categorias/ativos"),
        fetch("http://localhost:3000/departamentos/ativos"),
        fetch("http://localhost:3000/marcas/ativos"),
      ]);

      setCategorias(await catRes.json());
      setDepartamentos(await depRes.json());
      setMarcas(await marcaRes.json());
    }

    fetchData().catch((err) =>
      console.error("Erro ao buscar dados:", err)
    );
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "departamento_id") {
      if (!value) {
        setCategoriasFiltradas([]);
        setForm((prev) => ({
          ...prev,
          categoria_id: "",
        }));
        return;
      }

      const filtradas = categorias.filter(
        (cat) => String(cat.departamento_id) === String(value)
      );

      setCategoriasFiltradas(filtradas);

      setForm((prev) => ({
        ...prev,
        categoria_id: "",
      }));
    }
  }

  function handleFileChange(e) {
    setForm((prev) => ({
      ...prev,
      imagem: e.target.files[0],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const precoNumber = parseFloat(form.preco);

    if (
      !form.nome ||
      !form.codigo ||
      !form.categoria_id ||
      !form.departamento_id ||
      !form.marca_id ||
      isNaN(precoNumber)
    ) {
      Swal.fire({
        icon: "error",
        title: "Campos obrigatórios",
        text: "Preencha todos os campos corretamente.",
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("nome", form.nome);
      formData.append("descricao", form.descricao);
      formData.append("categoria_id", form.categoria_id);
      formData.append("departamento_id", form.departamento_id);
      formData.append("marca_id", form.marca_id);
      formData.append("preco", precoNumber);
      formData.append("codigo", form.codigo);

      if (form.imagem) {
        formData.append("imagem", form.imagem);
      }

      const response = await fetch(
        "http://localhost:3000/cadastrarProdutos",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Erro ao cadastrar produto");
      }

      await Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Produto cadastrado com sucesso!",
        confirmButtonColor: "#052364",
      });

      setForm({
        nome: "",
        descricao: "",
        categoria_id: "",
        departamento_id: "",
        marca_id: "",
        preco: "",
        codigo: "",
        imagem: null,
      });

      setCategoriasFiltradas([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      navigate("/AdminHome");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <LayoutAdmin>
      <div className="page-container">
        <div className="form-container">
          <div className="close-button" onClick={() => navigate("/AdminHome")}>
            <FaTimes />
          </div>

          <h1>Cadastro de Produtos</h1>

          <form className="form-admin" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome:</label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Descrição:</label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Departamento:</label>
              <select
                name="departamento_id"
                value={form.departamento_id}
                onChange={handleChange}
              >
                <option value="">Selecione um departamento</option>
                {departamentos.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Categoria:</label>
              <select
                name="categoria_id"
                value={form.categoria_id}
                onChange={handleChange}
                disabled={!form.departamento_id}
              >
                <option value="">Selecione uma categoria</option>

                {categoriasFiltradas.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Marca:</label>
              <select
                name="marca_id"
                value={form.marca_id}
                onChange={handleChange}
              >
                <option value="">Selecione uma marca</option>
                {marcas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Preço:</label>
              <input
                type="number"
                step="0.01"
                name="preco"
                value={form.preco}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Código:</label>
              <input
                type="text"
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Imagem:</label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
        </div>
      </div>
    </LayoutAdmin>
  );
}

export default AdminCadastrarProdutos;