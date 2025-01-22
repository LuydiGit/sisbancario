import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import axios from 'axios';

import { FaRegCheckCircle } from "react-icons/fa";
import { VscError } from "react-icons/vsc";

import './CreateClient.css';

function CreateClient() {

    const navigate = useNavigate();

    const [values, setValues] = useState({ 
        name: '',
        cpf: '',
        data_nascimento: '',
        email: '',
        celular: '',
        senha: ''
    })
    const [message, setMessage] = useState('')
    const [skip, setSkip] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [sucessRequest, setSucessRequest] = useState(false)
    const [erroRequest, setErroRequest] = useState(false)


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };
    
    const navigateToSignUp = () =>{
        navigate('/')
    }

    const createClient = () =>{
        setIsLoading(true)
        axios.post('http://localhost:5002/api/v1/cliente', values)
        .then(res => {
            setMessage(res.data)
            setSucessRequest(true)
            return setTimeout(() => {
                setMessage('');
                navigateToSignUp()
              }, 3000);
        })
        .catch(err =>{
            console.log(err)
            setIsLoading(false)
            setMessage(err.response.data)
            setErroRequest(true)
            return setTimeout(() => {
                setMessage('');
                setErroRequest(false)
              }, 3000);
        })
    }

    return (
        <div className='container__form'>
            <div className="form">
                <h1 style={{color: 'black', textAlign: 'center'}}>Banco One</h1>
                <p style={{color: 'gray', textAlign: 'center'}}>Crie sua conta em segundos</p>
                {skip === 1 &&(
                    <>
                        {/* Campo de Nome */}
                        <div className="flex-column">
                            <label>Nome</label>
                        </div>
                        <div className="inputForm">
                            <input type="text" className="input" name="name" onChange={handleInputChange} placeholder="Entre com seu nome" />
                        </div>

                        {/* Campo de CPF */}
                        <div className="flex-column">
                            <label>CPF</label>
                        </div>
                        <div className="inputForm">
                            <input type="text" className="input" name="cpf" onChange={handleInputChange} placeholder="Entre com seu CPF" />
                        </div>

                        {/* Campo de Data de Nascimento */}
                        <div className="flex-column">
                            <label>Data de nascimento</label>
                        </div>
                        <div className="inputForm">
                            
                            <input type="text" className="input" name="data_nascimento" onChange={handleInputChange} placeholder="Entre com sua data de nascimento" />
                        </div>

                        <button className="button-submit" onClick={() => {setSkip(2)}}>Continuar</button>
                    </>
                )}

                {skip === 2 &&(
                    <>
                        {/* Campo de Email */}
                        <div className="flex-column">
                            <label>Email</label>
                        </div>
                        <div className="inputForm">
                            
                            <input type="email" className="input" name="email" onChange={handleInputChange} placeholder="Entre com seu email" />
                            
                        </div>

                        {/* Campo de Celular */}
                        <div className="flex-column">
                            <label>Celular</label>
                        </div>
                        <div className="inputForm">
                            
                            <input type="tel" className="input" name="celular" onChange={handleInputChange} placeholder="Entre com seu celular" />
                            
                        </div>

                        {/* Campo de Senha */}
                        <div className="flex-column">
                            <label>Senha</label>
                        </div>
                        <div className="inputForm">
                            <input type="password" className="input" name="senha" onChange={handleInputChange} placeholder="Entre com uma senha" />
                        </div>

                         {erroRequest && (
                            <div className="message__erro">
                                <VscError className="icon__VscError"/>
                                <p >{message}</p>
                            </div>
                         )}

                         {sucessRequest && (
                            <div className="message__sucess">
                                <FaRegCheckCircle className="icon__FaRegCheckCircle"/>
                                <p >{message}</p>
                            </div>
                         )}
                        {isLoading ? (
                            <div className="box_loading">
                                <svg viewBox="25 25 50 50" className="svg">
                                    <circle r="20" cy="50" cx="50"></circle>
                                </svg>
                            </div>
                            
                        ):(
                            <button className="button-submit" onClick={createClient}>Cadastrar</button>
                        )}
                    </>
                )}

                {/* Alternativa de Cadastro */}
                <p className="p" onClick={navigateToSignUp}>
                    Não tem uma conta? <span className="span">Sign In</span>
                </p>
            </div>
        </div>
        
    );
}

export default CreateClient;
