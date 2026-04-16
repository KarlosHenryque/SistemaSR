import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import "../../assets/css/usuario/detalheProduto.css";
import LayoutUser from "../../assets/components/LayoutUser";
import { useParams, useLocation, useNavigate  } from "react-router-dom";

function DetalheProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [produto, setProduto] = useState(null);
  const [qtd, setQtd] = useState(location.state?.quantidade || 1);

  useEffect(() => {
    async function load() {
      const res = await fetch(`http://localhost:3000/produtos/departamento/${id}`);
      const data = await res.json();
      setProduto(data);
    }

    load();
  }, [id]);

  function aumentar() {
    setQtd((prev) => prev + 1);
  }

  function diminuir() {
    setQtd((prev) => (prev > 1 ? prev - 1 : 1));
  }

  if (!produto) return <p>Carregando...</p>;

async function adicionarAoCarrinho() {
  try {
    const usuario_id = localStorage.getItem("usuario_id");

    console.log("DEBUG:", {
      usuario_id,
      produto_id: produto?.id,
      qtd,
    });

    if (!usuario_id) {
      Swal.fire("Erro", "Usuário não está logado", "error");
      return;
    }

    const response = await fetch("http://localhost:3000/carrinho/adicionar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario_id,
        produto_id: produto.id,
        quantidade: qtd,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao adicionar ao carrinho");
    }

    Swal.fire({
      title: "Produto adicionado!",
      text: "Deseja ir para o carrinho?",
      icon: "success",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Ir para carrinho",
      cancelButtonText: "Continuar comprando",
      confirmButtonColor: "#052364",
      cancelButtonColor: "#ff4d4d",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/carrinho");
      }
    });

  } catch (error) {
    Swal.fire("Erro!", error.message, "error");
    console.error(error);
  }
}

  return (
    <LayoutUser>
      <div className="produto-container">
        <div className="produto-imagens">
          <img src={produto.imagem} alt={produto.nome} />
        </div>

        <div className="produto-info">
          <h2>{produto.nome}</h2>
          <p>R$ {produto.preco}</p>
          <p>{produto.descricao}</p>

          <div className="produto-qty">
            <button onClick={diminuir}>-</button>
            <span>{qtd}</span>
            <button onClick={aumentar}>+</button>
          </div>

          <button onClick={adicionarAoCarrinho}>Adicionar ao carrinho</button>
        </div>
      </div>
    </LayoutUser>
  );
}

export default DetalheProduto;