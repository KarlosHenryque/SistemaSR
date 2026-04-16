import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import LayoutUser from "../../assets/components/LayoutUser";
import "../../assets/css/usuario/carrinho.css";

function Carrinho() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecionados, setSelecionados] = useState([]);

  async function carregarCarrinho() {
    try {
      const usuario_id = localStorage.getItem("usuario_id");

      if (!usuario_id) {
        Swal.fire("Erro", "Usuário não logado", "error");
        return;
      }

      const res = await fetch(
        `http://localhost:3000/carrinho/${usuario_id}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao carregar carrinho");
      }

      setItens(data.itens || []);
    } catch (error) {
      Swal.fire("Erro", error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarCarrinho();
  }, []);

  function toggleSelecionado(id) {
    setSelecionados((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  }

  function calcularTotalSelecionado() {
    return itens
      .filter((item) => selecionados.includes(item.id))
      .reduce((total, item) => {
        return total + Number(item.preco) * item.quantidade;
      }, 0);
  }

  function aumentarQuantidade(id) {
    setItens((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      )
    );
  }

  function diminuirQuantidade(id) {
    setItens((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantidade: item.quantidade > 1 ? item.quantidade - 1 : 1,
            }
          : item
      )
    );
  }

  async function removerItem(id) {
    try {
      const res = await fetch(
        `http://localhost:3000/carrinho/remover/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Erro ao remover item");
      }

      Swal.fire("Removido!", "Item removido do carrinho", "success").then(() => {
        window.location.reload();
      });

      await carregarCarrinho();
      setSelecionados([]);
    } catch (error) {
      Swal.fire("Erro", error.message, "error");
    }
  }

  async function limparCarrinhoSelecionados() {
    try {
      for (const id of selecionados) {
        await removerItem(id);
      }

      setSelecionados([]);

      Swal.fire({
        title: "Sucesso",
        icon: "success",
        confirmButtonText: "ok",
        confirmButtonColor: "#052364",
      });
      
    } catch (error) {
      Swal.fire("Erro", error.message, "error");
    }
  }

  function gerarPedido() {
    const itensSelecionados = itens.filter((item) =>
      selecionados.includes(item.id)
    );

    let texto = "🧾 *NOVO PEDIDO* \n\n";

    itensSelecionados.forEach((item) => {
      texto += `Produto: ${item.nome}\n`;
      texto += `Preço: R$ ${Number(item.preco).toFixed(2)}\n`;
      texto += `Quantidade: ${item.quantidade}\n`;
      texto += `Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
      texto += `------------------------- \n`;
    });

    const total = calcularTotalSelecionado();
    texto += `\n💵 *TOTAL: R$ ${total.toFixed(2)}*`;

    return encodeURIComponent(texto);
  }

  function enviarWhatsApp() {
    const numero = "5545998377262";
    const mensagem = gerarPedido();

    window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");

    setTimeout(() => {
      Swal.fire({
        title: "Limpar carrinho?",
        text: "Deseja remover os itens enviados?",
        icon: "question",
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        confirmButtonColor: "#052364",
        cancelButtonColor: "#ff4d4d",
      }).then((result) => {
        if (result.isConfirmed) {
          limparCarrinhoSelecionados();
        }
      });
    }, 500);
  }

  if (loading) {
    return (
      <LayoutUser>
        <p style={{ padding: 20 }}>Carregando carrinho...</p>
      </LayoutUser>
    );
  }

  return (
    <LayoutUser>
      <div className="carrinho-container">
        <h2>Meu Carrinho</h2>

        {itens.length === 0 ? (
          <p className="carrinho-vazio">Seu carrinho está vazio 🛒</p>
        ) : (
          <div className="carrinho-layout">
            <div className="carrinho-itens">
              {itens.map((item) => (
                <div key={item.id} className="carrinho-item">
                  <input
                    type="checkbox"
                    className="item-check"
                    checked={selecionados.includes(item.id)}
                    onChange={() => toggleSelecionado(item.id)}
                  />

                  <img src={item.imagem} alt={item.nome} />

                  <div className="item-info">
                    <h3>{item.nome}</h3>
                    <p>R$ {Number(item.preco).toFixed(2)}</p>

                    <div className="qty">
                      <button onClick={() => diminuirQuantidade(item.id)}>
                        -
                      </button>

                      <span>{item.quantidade}</span>

                      <button onClick={() => aumentarQuantidade(item.id)}>
                        +
                      </button>
                    </div>
                  </div>

                  <div className="item-total">
                    <p>
                      R$ {(item.preco * item.quantidade).toFixed(2)}
                    </p>
                  </div>

                  <div
                    className="trash"
                    onClick={() => removerItem(item.id)}
                  >
                    <FaTrash />
                  </div>
                </div>
              ))}
            </div>

            <div className="carrinho-resumo">
              <h3>Resumo do pedido</h3>

              <div className="resumo-linha">
                <span>Selecionados:</span>
                <strong>{selecionados.length}</strong>
              </div>

              <div className="resumo-linha">
                <span>Total:</span>
                <strong>
                  R$ {calcularTotalSelecionado().toFixed(2)}
                </strong>
              </div>

              <button
                className="btn-finalizar"
                disabled={selecionados.length === 0}
                onClick={() => {
                  if (selecionados.length === 0) {
                    Swal.fire("Atenção", "Selecione itens", "warning");
                    return;
                  }

                  Swal.fire({
                    title: "Confirmar pedido?",
                    text: `Você selecionou ${selecionados.length} item(s)`,
                    icon: "question",
                    showCancelButton: true,
                    reverseButtons: true,
                    confirmButtonText: "Enviar para WhatsApp",
                    cancelButtonText: "Cancelar",
                    confirmButtonColor: "#052364",
                    cancelButtonColor: "#ff4d4d",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      enviarWhatsApp();
                    }
                  });
                }}
              >
                Finalizar compra
              </button>
            </div>
          </div>
        )}
      </div>
    </LayoutUser>
  );
}

export default Carrinho;