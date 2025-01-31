import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { VscError } from "react-icons/vsc";

import axios from 'axios';

import './Login.css';

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [sucessRequest, setSucessRequest] = useState(false)

    const navigateToSignUp = () =>{ 
        navigate('/CreateClient')
    }
  
    // Função para validar o e-mail
    const validedEmail = (email) => {
        // Expressão regular para validar o formato do e-mail
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    let isValidEmail = validedEmail(email)

    const login = () =>{
        setIsLoading(true)

        const values = {
            email,
            senha
        }
        axios.post('http://localhost:5001/api/v1/login', values)
        .then(res =>{
            console.log(res)
            // Armazene o token no localStorage
            localStorage.clear();
            localStorage.setItem('userData', JSON.stringify(res.data.user));
            setMessage(`Olá ${res.data.user.nome}! Estamos preparando tudo pra você.`)
            setSucessRequest(true)
            return setTimeout(() => {
                setMessage('');
                setSucessRequest(false)
                setIsLoading(false)
                navigate("/HomeCliente");
              }, 3000);
        })
        .catch(err =>{
            console.log(err)
            setIsLoading(false)
            setMessage(err.response.data)
            return setTimeout(() => {
                setMessage('');
                setErroRequest(false)
              }, 3000);
        })
    }
    return (
        <div className='container__form'>
            <div className="form">
                {/* Campo de Email */}
                <h1 style={{color: 'black', textAlign: 'center'}}>Banco One</h1>
                <p style={{color: 'gray', textAlign: 'center'}}>Bem-vindo</p>
                    {sucessRequest && (
                    <div className="message__sucess" style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
                        <p >{message}</p>
                    </div>
                    )}
                <div className="flex-column">
                    <label>Email</label>
                </div>
                <div className="inputForm">
                    <input type="text" className="input" onChange={(e) =>{setEmail(e.target.value)}} placeholder="Entre com seu email" />
                </div>

                {/* Campo de Senha */}
                <div className="flex-column">
                    <label>Password</label>
                </div>
                <div className="inputForm">
                    <input type="password" className="input" onChange={(e) =>{setSenha(e.target.value)}} placeholder="Entre com sua senha" />
                </div>

                {isLoading ? (
                    <div className="box_loading">
                        <svg viewBox="25 25 50 50" className="svg">
                            <circle r="20" cy="50" cx="50"></circle>
                        </svg>
                    </div>
                    
                ):(
                    <>
                        {isValidEmail &&(
                            <button className="button-submit" onClick={login}>Entrar</button>
                        )}
                        {email.length > 0 && !isValidEmail &&(
                            <div className="message__erro">
                                <VscError className="icon__VscError"/>
                                <p >O e-mail informado não é válido!</p>
                            </div>
                        )}
                    </>
                    
                )}
                

                {/* Alternativa de Cadastro */}
                <p className="p" onClick={navigateToSignUp}>
                    Não tem uma conta? <span className="span">Sign Up</span>
                </p>
            </div>
        </div>
        
    );
}

export default Login;
