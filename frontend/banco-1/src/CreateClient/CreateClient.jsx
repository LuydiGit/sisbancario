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

        if (validedCPF(values.cpf)) {
            console.log('CPF Válido');
          } else {
            console.log('CPF Inválido');
          }
    };
    
    const navigateToSignUp = () =>{
        navigate('/')
    }

    // Função para validar CPF
    const validedCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false; // Verifica se o CPF tem 11 números e se não é uma sequência repetida como "111.111.11111"
        }

        // Validação do primeiro dígito verificador
        let sum = 0;
        for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf[i]) * (10 - i);
        }
        let firstCheckDigit = 11 - (sum % 11);
        if (firstCheckDigit === 10 || firstCheckDigit === 11) firstCheckDigit = 0;

        // Validação do segundo dígito verificador
        sum = 0;
        for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf[i]) * (11 - i);
        }
        let secondCheckDigit = 11 - (sum % 11);
        if (secondCheckDigit === 10 || secondCheckDigit === 11) secondCheckDigit = 0;

        // Compara os dígitos calculados com os informados
        return cpf[9] == firstCheckDigit && cpf[10] == secondCheckDigit;
    }

    // Função para validar se a data de nascimento é maior que 18 anos
    const validedDate = (dataNascimento) => {
        const today = new Date();
        const birthDate = new Date(dataNascimento);
        
        // Calcula a diferença de anos
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        // Se o mês atual for antes do mês de nascimento, ou se for o mesmo mês e o dia for antes, subtrai um ano
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
        }

        return age >= 18; // Verifica se a pessoa tem 18 anos ou mais
    }

    // Função para validar o e-mail
    const validedEmail = (email) => {
        // Expressão regular para validar o formato do e-mail
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    // Função para validar o celular
    const validedCelular = (celular) => {
        // Remove espaços, parênteses, traços e outros caracteres não numéricos
        const cleanCelular = celular.replace(/[^\d]/g, '');
        
        // Valida se o número tem 11 dígitos e começa com 9
        const celularRegex = /^9\d{10}$/;
        return celularRegex.test(cleanCelular);
    }

    let isValidCPF = validedCPF(values.cpf)
    let isValidDate = validedDate(values.data_nascimento)
    let isValidEmail = validedEmail(values.email)
    let isValidPhone = validedCelular(values.celular)

    const createClient = () =>{
        setIsLoading(true)
        axios.post('http://localhost:5001/api/v1/cliente', values)
        .then(res => {
            setMessage(res.data.message)
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
                            
                            <input type="date" className="input" name="data_nascimento" onChange={handleInputChange} placeholder="Entre com sua data de nascimento" />
                        </div>
                        {isValidCPF && isValidDate &&(
                            <button className="button-submit" onClick={() => {setSkip(2)}}>Continuar</button>
                        )}
                        {values.cpf.length > 0 && !isValidCPF &&(
                            <div className="message__erro">
                                <VscError className="icon__VscError"/>
                                <p >O CPF informado não é válido!</p>
                            </div>
                        )}
                        {values.data_nascimento.length > 0 && !isValidDate &&(
                            <div className="message__erro">
                                <VscError className="icon__VscError"/>
                                <p >O data de nascimento informada não é válida! Você deve ser 18+</p>
                            </div>
                        )}
                    </>
                )}

                {skip === 2 &&(
                    <>
                        {/* Campo de Email */}
                        <div className="flex-column">
                            <label>Email</label>
                        </div>
                        <div className="inputForm">
                            
                            <input type="email" className="input" name="email" onChange={handleInputChange} placeholder="Entre com seu email, ex.: exemplo@dominio.com" />
                            
                        </div>

                        {/* Campo de Celular */}
                        <div className="flex-column">
                            <label>Celular</label>
                        </div>
                        <div className="inputForm">
                            <input type="tel" className="input" name="celular" onChange={handleInputChange} placeholder="Entre com seu celular, ex.: (xx) 9xxxx-xxxx" />
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
                            <>
                                {isValidPhone && isValidEmail &&(
                                    <button className="button-submit" onClick={createClient}>Cadastrar</button>
                                )}
                                {values.email.length > 0 && !isValidEmail &&(
                                    <div className="message__erro">
                                        <VscError className="icon__VscError"/>
                                        <p >O e-mail informado não é válido!</p>
                                    </div>
                                )}
                                {values.celular.length > 0 && !isValidPhone &&(
                                    <div className="message__erro">
                                        <VscError className="icon__VscError"/>
                                        <p >O celular informado não é válido!</p>
                                    </div>
                                )}
                            </>
                           
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
