import Swal from "sweetalert2";
import { useState, useEffect } from "react"; 
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../assets/css/admin/AdminListarUsuarios.css";
import { editarUsuarioModal } from "../../utils/swalFormsUsuario.js";
import LayoutAdmin from "../../assets/components/LayoutAdmin.jsx";

function AdminListarUsuarios() {
    const [busca, setBusca] = useState("");
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [buscou, setBuscou] = useState(false);
    const [filtroStatus, setFiltroStatus] = useState("true"); 
    const navigate = useNavigate();

    useEffect(() => {
        buscarUsuarios("", filtroStatus);
    }, []);

    async function buscarUsuarios(valor = "", status = filtroStatus) {
        try {
            setLoading(true);
            setBuscou(true);

            const response = await fetch(
                `http://localhost:3000/usuarios?busca=${valor}&status=${status}`
            );

            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        } finally {
            setLoading(false);
        }
    }

    async function editarUsuario(user) {
        const formValues = await editarUsuarioModal(user);
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
                `http://localhost:3000/usuarios/${user.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formValues)
                }
            );

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            await Swal.fire("Sucesso!", "Usuário atualizado!", "success");
            buscarUsuarios(busca, filtroStatus); 
        } catch (error) {
            Swal.fire("Erro", error.message, "error");
        }
    }

    return (
        <LayoutAdmin>
            <div className="page-container-listar">
                <div className="list-container-listar">

                    <div className="close-button" onClick={() => navigate("/AdminHome")}>
                        <FaTimes />
                    </div>

                    <h1>Usuários Cadastrados</h1>

                    <div className="search-container-listar">
                        <select
                            className="SelectFiltro"
                            value={filtroStatus}
                            onChange={(e) => {
                                setFiltroStatus(e.target.value);
                                buscarUsuarios(busca, e.target.value);
                            }}
                        >
                            <option value="true">Ativos</option>
                            <option value="false">Inativos</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Buscar por nome ou CPF/CNPJ (use % para todos)"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") buscarUsuarios(busca, filtroStatus);
                            }}
                        />

                        <button onClick={() => buscarUsuarios(busca, filtroStatus)}>
                            Buscar
                        </button>
                    </div>

                    {loading && <p>Carregando...</p>}

                    {!loading && (
                        <>
                            {!buscou ? (
                                <p className="no-data-listar">
                                    Digite um nome ou CPF/CNPJ para buscar
                                </p>
                            ) : usuarios.length === 0 ? (
                                <p className="no-data-listar">
                                    Nenhum usuário encontrado
                                </p>
                            ) : (
                                <table className="table-users-listar">
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Email</th>
                                            <th>CPF/CNPJ</th>
                                            <th>Tipo</th>
                                            <th>Status</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.nome}</td>
                                                <td>{user.email}</td>
                                                <td>{user.cpf_cnpj}</td>
                                                <td>{user.tipo_usuario}</td>
                                                <td>{user.status ? "Ativo" : "Inativo"}</td>
                                                <td>
                                                    <button
                                                        className="btn-editar"
                                                        onClick={() => editarUsuario(user)}
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

export default AdminListarUsuarios;