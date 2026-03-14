import { useState } from 'react'
import './assets/css/Login.css'

function Login() {

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [lembreMe, setLembreMe] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()

    setLoading(true)

    console.log("E-mail", email)
    console.log("Senha", senha)

    alert("Login enviado")

    setLoading(false)
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