import { useState } from 'react'
import Swal from "sweetalert2"
import '../assets/css/Login.css'

function Login() {

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [lembreMe, setLembreMe] = useState(false)
  const [loading, setLoading] = useState(false)

  useState(() => {
    const emailSalvo = localStorage.getItem("email");
    const lembrar = localStorage.getItem("lembrar");

    if (lembrar == "true" && emailSalvo) {
      setEmail(emailSalvo);
      setLembreMe(true)
    }

  }, []);

  async function handleSubmit(e) {
    e.preventDefault()

    setLoading(true)

    Swal.fire({
      title: "Entrando...",
      text: "Validando credenciais",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    try {

      const resposta = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          senha
        })
      })

      const dados = await resposta.json()
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      Swal.close()

      if (!resposta.ok) {

        await Swal.fire({
          icon: "error",
          title: "Erro no login",
          text: dados.mensagem || "Erro ao realizar login"
        })

        return
      }

      localStorage.setItem("token", dados.token)

       if (lembreMe) {
        localStorage.setItem("email", email)
        localStorage.setItem("lembrar", true)
      } else {
        localStorage.removeItem("email")
        localStorage.removeItem("lembrar")
      }

      await Swal.fire({
        icon: "success",
        title: "Login realizado",
        text: "Bem-vindo ao sistema",
        timer: 2000,
        showConfirmButton: false
      })

      window.location.href = "/AdminHome"

    } catch (erro) {

      Swal.close()

      await Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível conectar ao servidor"
      })

    } finally {
      setLoading(false)
    }
  }

  return(
    <div className='container'>

      <div className='header'>
        <h1>Santana Representações</h1>
      </div>

      <div className='formulario'>
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>

          <div className="email">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="senha">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              required
              autoComplete="current-password"
              maxLength="100"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

         <div className="opcoesLogin">

          <div className="lembrar">
            <input
              type="checkbox"
              id="lembreMe"
              checked={lembreMe}
              onChange={(e) => setLembreMe(e.target.checked)}
            />
            <label htmlFor="lembreMe">Lembre-me</label>
          </div>

          <div className="esqueceuSenha">
            <a href="#">Esqueceu a senha?</a>
          </div>

        </div>

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login