import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../assets/css/admin/AdminCadastroUsuarios.css";
import LayoutAdmin from "../../assets/components/LayoutAdmin.jsx";
import { editarProdutoModal } from "../../utils/swalFormsProdutos.js";

function AdminListarProdutos() {
    const [busca, setBusca] = useState("");
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [buscou, setBuscou] = useState(false);
    const [filtroStatus, setFiltroStatus] = useState("true");

    const [categorias, setCategorias] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const [catRes, depRes] = await Promise.all([
                    fetch("http://localhost:3000/categorias"),
                    fetch("http://localhost:3000/departamentos")
                ]);

                setCategorias(await catRes.json());
                setDepartamentos(await depRes.json());
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        }

        fetchData();
    }, []);

    async function buscarProdutos(valor = "", status = filtroStatus) {
        try {
            setLoading(true);
            setBuscou(true);

            const response = await fetch(
                `http://localhost:3000/produtos?busca=${valor}&status=${status}`
            );

            const data = await response.json();
            setProdutos(data);

        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        buscarProdutos("", "true");
    }, []);

    async function editarProduto(prod) {
        const formValues = await editarProdutoModal(prod, categorias, departamentos);

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
                `http://localhost:3000/produtos/${prod.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formValues)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            await Swal.fire("Sucesso!", "Produto atualizado!", "success");

            buscarProdutos(busca, filtroStatus);

        } catch (error) {
            Swal.fire("Erro", error.message, "error");
        }
    }

    function limitarTexto(texto, limite = 5) {
        if (!texto) return "-";
        return texto.length > limite
            ? texto.substring(0, limite) + "..."
            : texto;
    }

    return (
        <LayoutAdmin>
            <div className="page-container-listar">
                <div className="list-container-listar">

                    <div className="close-button" onClick={() => navigate("/AdminHome")}>
                        <FaTimes />
                    </div>

                    <h1>Produtos Cadastrados</h1>

                    <div className="search-container-listar">
                        <select
                            className="SelectFiltro"
                            value={filtroStatus}
                            onChange={(e) => {
                                setFiltroStatus(e.target.value);
                                buscarProdutos(busca, e.target.value);
                            }}
                        >
                            <option value="true">Ativos</option>
                            <option value="false">Inativos</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Buscar produtos"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    buscarProdutos(busca, filtroStatus);
                                }
                            }}
                        />

                        <button onClick={() => buscarProdutos(busca, filtroStatus)}>
                            Buscar
                        </button>
                    </div>

                    {loading && <p>Carregando...</p>}

                    {!loading && (
                        <>
                            {!buscou ? (
                                <p>Digite algo para buscar produtos</p>
                            ) : produtos.length === 0 ? (
                                <p>Nenhum produto encontrado</p>
                            ) : (
                                <table className="table-users-listar">
                                    <thead>
                                        <tr>
                                            <th>Imagem</th>
                                            <th>Nome</th>
                                            <th>Descrição</th>
                                            <th>Categoria</th>
                                            <th>Departamento</th>
                                            <th>Marca</th>
                                            <th>Preço</th>
                                            <th>Código</th>
                                            <th>Status</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {produtos.map((prod) => (
                                            <tr key={prod.id}>
                                                <td>
                                                    {prod.imagem ? (
                                                        <img src={prod.imagem} width="50" />
                                                    ) : "Sem imagem"}
                                                </td>
                                                <td title={prod.nome}>
                                                    {limitarTexto(prod.nome, 10)}
                                                </td>

                                                <td title={prod.descricao}>
                                                    {limitarTexto(prod.descricao, 10)}
                                                </td>
                                                <td>{prod.categoria}</td>
                                                <td>{prod.departamento}</td>
                                                <td>{prod.marca}</td>
                                                <td>R$ {Number(prod.preco).toFixed(2)}</td>
                                                <td>{prod.codigo}</td>
                                                <td>{prod.status ? "Ativo" : "Inativo"}</td>

                                                <td>
                                                    <button
                                                        className="btn-editar"
                                                        onClick={() => editarProduto(prod)}
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

export default AdminListarProdutos;