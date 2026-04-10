import Swal from "sweetalert2";
import "./css/editarUsuarioModal.css";

export async function editarProdutoModal(produto, categorias, departamentos, marcas) {
    let novaImagemBase64 = null;

    const { value: formValues } = await Swal.fire({
        title: "Editar Produto",
        html: `
            <div class="swal-form">

                <div class="imagem-preview-container">
                    ${produto.imagem
                        ? `<img id="swal-imagem-preview" src="${produto.imagem}" style="width:100px;height:100px;object-fit:cover;margin-bottom:10px;">`
                        : `<span id="swal-imagem-preview">Sem imagem</span>`
                    }
                </div>

                <input id="swal-imagem" type="file" accept="image/*" class="swal-input-custom">

                <input id="swal-nome" class="swal-input-custom" placeholder="Nome">

                <textarea id="swal-descricao" class="swal-input-custom" placeholder="Descrição"></textarea>

                <select id="swal-departamento" class="swal-input-custom">
                    <option value="">Departamento</option>
                    ${departamentos.map(d => `
                        <option value="${d.id}" ${d.nome === produto.departamento ? "selected" : ""}>
                            ${d.nome}
                        </option>
                    `).join("")}
                </select>

                <select id="swal-categoria" class="swal-input-custom">
                    <option value="">Categoria</option>
                    ${categorias
                        .filter(c => c.departamento_nome === produto.departamento || c.departamento_id == produto.departamento_id)
                        .map(c => `
                            <option value="${c.id}" ${c.nome === produto.categoria ? "selected" : ""}>
                                ${c.nome}
                            </option>
                        `).join("")}
                </select>

                <select id="swal-marca" class="swal-input-custom">
                    <option value="">Marca</option>
                    ${marcas.map(m => `
                        <option value="${m.id}" ${m.id === produto.marca_id ? "selected" : ""}>
                            ${m.nome}
                        </option>
                    `).join("")}
                </select>

                <input id="swal-preco" type="number" class="swal-input-custom" placeholder="Preço">

                <input id="swal-codigo" class="swal-input-custom" placeholder="Código">

                <div class="status-container">
                    <label>Status</label>
                    <label class="switch">
                        <input type="checkbox" id="swal-ativo">
                        <span class="slider"></span>
                    </label>
                </div>

            </div>
        `,

        didOpen: () => {
            const departamentoSelect = document.getElementById("swal-departamento");
            const categoriaSelect = document.getElementById("swal-categoria");

            document.getElementById("swal-nome").value = produto.nome || "";
            document.getElementById("swal-descricao").value = produto.descricao || "";
            document.getElementById("swal-preco").value = produto.preco || "";
            document.getElementById("swal-codigo").value = produto.codigo || "";
            document.getElementById("swal-ativo").checked = produto.status;

            departamentoSelect.addEventListener("change", (e) => {
                const depId = e.target.value;

                categoriaSelect.innerHTML =
                    `<option value="">Categoria</option>` +
                    categorias
                        .filter(c => String(c.departamento_id) === String(depId))
                        .map(c => `<option value="${c.id}">${c.nome}</option>`)
                        .join("");

                categoriaSelect.value = "";
            });

            document.getElementById("swal-imagem").addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                    novaImagemBase64 = reader.result;
                    document.getElementById("swal-imagem-preview").src = novaImagemBase64;
                };
                reader.readAsDataURL(file);
            });
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

            if (!nome) {
                Swal.showValidationMessage("Nome obrigatório");
                return false;
            }

            return {
                nome,
                descricao: document.getElementById("swal-descricao").value,
                categoria_id: document.getElementById("swal-categoria").value,
                departamento_id: document.getElementById("swal-departamento").value,
                marca_id: document.getElementById("swal-marca").value,
                preco: parseFloat(document.getElementById("swal-preco").value) || 0,
                codigo: document.getElementById("swal-codigo").value,
                imagem: novaImagemBase64,
                status: document.getElementById("swal-ativo").checked
            };
        }
    });

    return formValues;
}