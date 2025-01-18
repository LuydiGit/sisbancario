import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import axios from 'axios';

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };
    
    const navigateToSignUp = () =>{
        navigate('/Login')
    }

    const createClient = () =>{
        axios.post('http://localhost:5001/api/v1/cliente', values)
        .then(res => {
            setMessage(res.data.message)
            navigateToSignUp()
            return setTimeout(() => {
                setMessage('');
                
              }, 3000);
        })
        .catch(err =>{
            console.log(err)
            setMessage(err.message)
            return setTimeout(() => {
                setMessage('');
              }, 3000);
        })
    }

    return (
        <div className='container__form'>
            <form className="form">
                <h1 style={{color: 'black', textAlign: 'center'}}>Banco One</h1>
                
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

                {/* Campo de Email */}
                <div className="flex-column">
                    <label>Email</label>
                </div>
                <div className="inputForm">
                    
                    <input type="email" className="input" name="email" onChange={handleInputChange} placeholder="Entre com seu Email" />
                    
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

                {/* Botão de Login */}
                <p style={{color: 'black'}}>{message}</p>
                <button className="button-submit" onClick={createClient}>Cadastrar</button>

                {/* Alternativa de Cadastro */}
                <p className="p" onClick={navigateToSignUp}>
                    Não tem uma conta? <span className="span">Sign In</span>
                </p>
            </form>
        </div>
        
    );
}

export default CreateClient;
