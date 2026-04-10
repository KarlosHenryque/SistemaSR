import LayoutUser from "../../assets/components/LayoutUser";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "../../assets/css/usuario/ProdutosDetalhes.css";

function ProdutoDetalhe() {
  const { id } = useParams();
  const location = useLocation();

  const quantidadeInicial = location.state?.quantidadeInicial || 1;

  const [produto, setProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(quantidadeInicial);

  useEffect(() => {
    async function fetchProduto() {
      const res = await fetch(`http://localhost:3000/produtos/${id}`);
      const data = await res.json();
      setProduto(data);
    }

    fetchProduto();
  }, [id]);

  function adicionarAoCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    carrinho.push({
      ...produto,
      quantidade,
    });

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    alert("Produto adicionado ao carrinho!");
  }

  if (!produto) return <p>Carregando...</p>;

  return (
    <LayoutUser>
        <div className="produto-page">
          <div className="produto-card">

          <div className="produto-imagem">
            <img src={produto.imagem} alt={produto.nome} />
          </div>

          <div className="produto-info">
            <h1>{produto.nome}</h1>

            <p>{produto.descricao}</p>

            <h2>R$ {Number(produto.preco).toFixed(2)}</h2>

            <div className="produto-quantidade">
              <button onClick={() => setQuantidade(q => Math.max(1, q - 1))}>-</button>
              <span>{quantidade}</span>
              <button onClick={() => setQuantidade(q => q + 1)}>+</button>
            </div>

            <button className="btn-carrinho" onClick={adicionarAoCarrinho}>
              Adicionar ao carrinho
            </button>

          </div>
        </div>
      </div>
    </LayoutUser>
  );
}

export default ProdutoDetalhe;