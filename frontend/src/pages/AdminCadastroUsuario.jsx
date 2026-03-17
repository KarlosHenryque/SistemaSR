import Swal from "sweetalert2";
import { useState } from "react";
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

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    }

    function handleSubmit(e) {
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

        Swal.fire({
            icon: "success",
            title: "Sucesso!",
            text: "Usuário cadastrado com sucesso!"
        });

        console.log("Usuário cadastrado:", form);
    }

    return (
        <LayoutAdmin>
            <div className="page-container">
                <div className="form-container">
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

                        <div className="status-container">
                            <label>Status do usuário</label>

                            <label className="switch">
                                <input 
                                    type="checkbox"
                                    checked={form.ativo}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            ativo: e.target.checked
                                        })
                                    }
                                />
                                <span className="slider"></span>
                            </label>

                            <span className="status-text">
                                {form.ativo ? "Ativo" : "Inativo"}
                            </span>
                        </div>

                        <button type="submit">Cadastrar</button>

                    </form>
                </div>
            </div>
        </LayoutAdmin>
    );
}

export default AdminCadastroUsuarios;