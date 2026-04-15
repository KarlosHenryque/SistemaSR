import LayoutUser from "../../assets/components/LayoutUser";
import "../../assets/css/usuario/categoriaProdutos.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function CategoriaProdutos() {
  const { id } = useParams();
  const [produtos, setProdutos] = useState([]);
  const [qtd, setQtd] = useState({});

    useEffect(() => {
    async function load() {
        Swal.fire({
            title: "Carregando...",
            text: "Buscando produtos da categoria",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
            background: "#fff",
            backdrop: "rgba(0,0,0,0.4)",
        });

        try {
        const res = await fetch(
            `http://localhost:3000/produtos/categoria/${id}`
        );
        const data = await res.json();

        setTimeout(() => {
            setProdutos(data);

            Swal.close();
        }, 2000);
        } catch (err) {
        console.error(err);

        Swal.fire({
            icon: "error",
            title: "Erro ao carregar produtos",
        });
        }
    }

    load();
    }, [id]);

  function aumentar(produtoId) {
    setQtd((prev) => ({
      ...prev,
      [produtoId]: (prev[produtoId] || 1) + 1,
    }));
  }

  function diminuir(produtoId) {
    setQtd((prev) => ({
      ...prev,
      [produtoId]: prev[produtoId] > 1 ? prev[produtoId] - 1 : 1,
    }));
  }

  return (
    <LayoutUser>
      <div className="cat-container">
        <h2 className="cat-title">Produtos</h2>

        <div className="cat-grid">
          {produtos.map((p) => (
            <div key={p.id} className="cat-card">
              <img
                className="cat-image"
                src={p.imagem}
                alt={p.nome}
              />

              <h3 className="cat-name">{p.nome}</h3>

              <p className="cat-price">
                Por R$ {Number(p.preco).toFixed(2)}
              </p>

              <div className="cat-qty">
                <button onClick={() => diminuir(p.id)}>-</button>
                <span>{qtd[p.id] || 1}</span>
                <button onClick={() => aumentar(p.id)}>+</button>
              </div>

              <button className="cat-btn">ADICIONAR</button>
            </div>
          ))}
        </div>
      </div>
    </LayoutUser>
  );
}

export default CategoriaProdutos;