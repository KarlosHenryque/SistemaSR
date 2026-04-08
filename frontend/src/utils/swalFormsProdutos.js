import Swal from "sweetalert2";
import "./css/editarUsuarioModal.css"; 

export async function editarProdutoModal(produto) {

    let novaImagemBase64 = null; 

    const { value: formValues } = await Swal.fire({
        title: "Editar Produto",

        html: `
            <div class="swal-form">
                <div class="imagem-preview-container">
                    ${produto.imagem ? `<img id="swal-imagem-preview" src="${produto.imagem}" style="width:100px;height:100px;object-fit:cover;margin-bottom:10px;">` : "Sem imagem"}
                </div>
                <input id="swal-nova-imagem" type="file" accept="image/*" class="swal-input-custom">
                <input id="swal-nome" class="swal-input-custom" placeholder="Nome do produto">
                <textarea id="swal-descricao" class="swal-input-custom" placeholder="Descrição"></textarea>
                <input id="swal-categoria" class="swal-input-custom" placeholder="Categoria">
                <input id="swal-marca" class="swal-input-custom" placeholder="Marca">
                <input id="swal-preco" type="number" step="0.01" class="swal-input-custom" placeholder="Preço">
                <input id="swal-codigo" class="swal-input-custom" placeholder="Código">
               
            </div>
        `,

        didOpen: () => {
            document.getElementById("swal-nome").value = produto.nome || "";
            document.getElementById("swal-descricao").value = produto.descricao || "";
            document.getElementById("swal-categoria").value = produto.categoria || "";
            document.getElementById("swal-marca").value = produto.marca || "";
            document.getElementById("swal-preco").value = produto.preco || 0;
            document.getElementById("swal-codigo").value = produto.codigo || "";

            const inputFile = document.getElementById("swal-nova-imagem");
            const preview = document.getElementById("swal-imagem-preview");

            inputFile.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                    novaImagemBase64 = reader.result; 
                    if (preview) {
                        preview.src = reader.result;
                    }
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
            return {
                nome: document.getElementById("swal-nome").value,
                descricao: document.getElementById("swal-descricao").value,
                categoria: document.getElementById("swal-categoria").value,
                marca: document.getElementById("swal-marca").value,
                preco: parseFloat(document.getElementById("swal-preco").value),
                codigo: document.getElementById("swal-codigo").value,
                imagem: novaImagemBase64
            };
        }
    });

    return formValues;
}