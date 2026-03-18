import Swal from "sweetalert2";
import "./css/editarUsuarioModal.css";

export async function editarUsuarioModal(user) {

    const { value: formValues } = await Swal.fire({
        title: "Editar Usuário",
        icon: "info",
        html: `
            <div class="swal-form">
                <input id="swal-nome" class="swal-input-custom" placeholder="Nome">
                <input id="swal-email" class="swal-input-custom" placeholder="Email">
                <input id="swal-documento" class="swal-input-custom" placeholder="CPF/CNPJ">
                
                <select id="swal-tipo" class="swal-input-custom">
                    <option value="">Selecione o tipo</option>
                    <option value="usuario">Usuário</option>
                    <option value="construcao">Casa de construção</option>
                    <option value="industria">Indústria</option>
                </select>

                    <input id="swal-senha" type="password" class="swal-input-custom" placeholder="Senha">
            </div>
        `,

        didOpen: () => {
            document.getElementById("swal-nome").value = user.nome;
            document.getElementById("swal-email").value = user.email;
            document.getElementById("swal-documento").value = user.cpf_cnpj;
            document.getElementById("swal-tipo").value = user.tipo_usuario;
            document.getElementById("swal-senha").value = user.senha;
        },

        showCancelButton: true,
        showCloseButton: true,
        reverseButtons: true,
        confirmButtonText: "Salvar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#052364",
        cancelButtonColor: "#ff4d4d",

        preConfirm: () => {
            return {
                nome: document.getElementById("swal-nome").value,
                email: document.getElementById("swal-email").value,
                cpf_cnpj: document.getElementById("swal-documento").value,
                tipo_usuario: document.getElementById("swal-tipo").value,
                senha: document.getElementById("swal-senha").value,
            };
        }
    });

    return formValues; 
}