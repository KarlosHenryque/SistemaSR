import LayoutUser from "../../assets/components/LayoutUser";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/usuario/Produtos.css";

function Produtos() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantidades, setQuantidades] = useState({});

  useEffect(() => {
    async function fetchProdutos() {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:3000/produtos?departamento_id=${id}`
        );

        const data = await res.json();
        setProdutos(data);

        const inicial = {};
        data.forEach((p) => {
          inicial[p.id] = 1;
        });
        setQuantidades(inicial);

      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProdutos();
  }, [id]);

  function aumentar(id) {
    setQuantidades((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  }

  function diminuir(id) {
    setQuantidades((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  }

  return (
    <LayoutUser>
      <div className="UserContainer">
        <h2>Produtos do Departamento</h2>

        {loading ? (
          <p>Carregando...</p>
        ) : produtos.length === 0 ? (
          <p>Nenhum produto encontrado.</p>
        ) : (
          <div className="UserGrid">
            {produtos.map((p) => (
              <div key={p.id} className="UserCard">

                <img src={p.imagem} alt={p.nome} className="UserImagem" />

                <h4 className="UserNome">{p.nome}</h4>

                <p className="UserPreco">
                  Por <strong>R$ {Number(p.preco).toFixed(2)}</strong>
                </p>

                <div className="UserQuantidade">
                  <button onClick={() => diminuir(p.id)}>-</button>
                  <span>{quantidades[p.id]}</span>
                  <button onClick={() => aumentar(p.id)}>+</button>
                </div>

                <button
                  className="UserBtn"
                  onClick={() =>
                    navigate(`/produto/${p.id}`, {
                      state: {
                        quantidadeInicial: quantidades[p.id],
                      },
                    })
                  }
                >
                  ADICIONAR
                </button>

              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutUser>
  );
}

export default Produtos;