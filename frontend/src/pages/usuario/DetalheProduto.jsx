import LayoutUser from "../../assets/components/LayoutUser";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../assets/css/usuario/detalheProduto.css";

function DetalheProduto() {
  const { id } = useParams();
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

          <button>Adicionar ao carrinho</button>
        </div>
      </div>
    </LayoutUser>
  );
}

export default DetalheProduto;