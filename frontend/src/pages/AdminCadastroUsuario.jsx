import Swal from "sweetalert2";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../assets/css/AdminCadastroUsuarios.css";
import LayoutAdmin from "../assets/components/LayoutAdmin";

function AdminCadastroUsuarios() {

    const [form, setForm] = useState({
        nome: "",
        documento: "",
        tipo: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        ativo: true
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.nome || !form.email || !form.senha) {
            Swal.fire({
                icon: "error",
                title: "Campos obrigatórios",
                text: "Preencha nome, email e senha."
            });
            return;
        }

        if (form.senha !== form.confirmarSenha) {
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: "As senhas não coincidem."
            });
            return;
        }

        if (form.senha.length < 6) {
            Swal.fire({
                icon: "warning",
                title: "Senha fraca",
                text: "A senha deve ter pelo menos 6 caracteres."
            });
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("http://localhost:3000/cadastrarUsuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: form.nome,
                    email: form.email,
                    senha: form.senha,
                    cpf_cnpj: form.documento,
                    tipo_usuario: form.tipo,
                    ativo: form.ativo
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro ao cadastrar usuário");
            }

            await Swal.fire({
                icon: "success",
                title: "Sucesso!",
                text: "Usuário cadastrado com sucesso!"
            });

            navigate("/AdminHome");


            setForm({
                nome: "",
                documento: "",
                tipo: "",
                email: "",
                senha: "",
                confirmarSenha: "",
                ativo: true
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: error.message
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

                    <h1>Cadastro de Usuários</h1>

                    <form className="form-admin" onSubmit={handleSubmit}>
                        
                        <div className="form-group">
                            <label>Nome:</label>
                            <input 
                                type="text"
                                name="nome"
                                placeholder="Digite seu nome"
                                value={form.nome}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>CPF/CNPJ:</label>
                            <input 
                                type="text"
                                name="documento"
                                placeholder="Digite o CPF/CNPJ"
                                value={form.documento}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Tipo de usuário:</label>
                            <select 
                                name="tipo"
                                value={form.tipo}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione</option>
                                <option value="construcao">Casa de construção</option>
                                <option value="industria">Indústria</option>
                                <option value="usuario">Usuário</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>E-mail:</label>
                            <input 
                                type="email"
                                name="email"
                                placeholder="Digite seu email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Senha:</label>
                            <input 
                                type="password"
                                name="senha"
                                placeholder="Digite sua senha"
                                value={form.senha}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirmar senha:</label>
                            <input 
                                type="password"
                                name="confirmarSenha"
                                placeholder="Confirme sua senha"
                                value={form.confirmarSenha}
                                onChange={handleChange}
                                required
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

export default AdminCadastroUsuarios;