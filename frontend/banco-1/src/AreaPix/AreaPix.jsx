import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import axios from 'axios';

import { PiPixLogo } from "react-icons/pi";
import { PiMoneyWavy } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { VscError } from "react-icons/vsc";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";

import './AreaPix.css'

function AreaPix () {

    const navigate = useNavigate();
    
    const userData = localStorage.getItem('userData');
    //trasnformando os dados para JSON
    const userInformation = JSON.parse(userData);
    //Fromatando cada letra inicial do nome do usuário para caixa-alta
    const clientId = userInformation.id;

    const [showInputsChavePix, setShowInputsChavePix] = useState(false);
    const [typePixKey, setTypePixKey] = useState(false);
    const [pixKey, setPixKey] = useState(false);
    const [pixKeySelected, setPixKeySelected] = useState(false);
    const [objectPix, setObjectPix] = useState([]);
    const [newTypePixKey, setNewTypePixKey] = useState(false);
    const [newPixKey, setNewPixKey] = useState(false);
    const [message, setMessage] = useState('')
    const [erroRequest, setErroRequest] = useState(false)
    const [sucessRequest, setSucessRequest] = useState(false)
    const [showBtnDeletePixKey, setShowBtnDeletePixKey] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [chaveCopiada, setChaveCopiada] = useState(false);
    const [invalidPixKey, setInvalidPixKey] = useState(false);

    const navigateToTransferenciaPix = () =>{
        navigate('/TransferenciaPix')
    }

    const navigateToHome = () =>{
        navigate('/HomeCliente')
    }

    const showInputs = () =>{
        setShowInputsChavePix(true)
    }

    // Função para copiar a chave pix
    const handleCopyLink = () =>{
        navigator.clipboard.writeText(pixKey);
        setChaveCopiada(true);
        setMessage('Chave pix copiada com sucesso.')
        setTimeout(() => setChaveCopiada(false), 2000);
    }

    const getPixKey = () =>{
        axios.get(`http://localhost:5001/api/v1/pixKey/${clientId}`)
        .then(res => {
            console.log(res)
            setObjectPix(res.data.result)
            setTypePixKey(res.data.result[0].tipo_chave)
            setPixKey(res.data.result[0].chave)
        })
        .catch(err =>{
            console.log(err)
            setMessage(err.response.data.message)
            return setTimeout(() => {
                setMessage('');
              }, 3000);
        })
    }

    useEffect(() =>{
        getPixKey()
    }, [])

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

    const verifyPixKey = (e) =>{
        setNewPixKey(e.target.value)
        
        setErroRequest(false)
    }

    const createNewPixKey = () =>{
        if(newTypePixKey === 'CPF'){
            let isValidCPF = validedCPF(newPixKey)
            if(!isValidCPF){
                setInvalidPixKey(true)
                return setTimeout(() => {
                    setInvalidPixKey(false)
                  }, 3000);
            }
        }else if(newTypePixKey === 'E-mail'){
            let isValidEmail = validedEmail(newPixKey)
            if(!isValidEmail){
                setInvalidPixKey(true)
                return setTimeout(() => {
                    setInvalidPixKey(false)
                  }, 3000);
            }
        }else if(newTypePixKey === 'Celular'){
            let isValidPhone = validedCelular(newPixKey)
            if(!isValidPhone){
                setInvalidPixKey(true)
                return setTimeout(() => {
                    setInvalidPixKey(false)
                  }, 3000);
            }
        }
        setIsLoading(true)
        const values = {
            bancoId: 1,
            clientId: clientId,
            chavePix: newPixKey,
            tipo_chave_pix: newTypePixKey
        }

        axios.post('http://localhost:5001/api/v1/pixKey', values)
        .then(res => {
            console.log(res)
            setSucessRequest(true)
            setMessage(res.data.message)
            return setTimeout(() => {
                getPixKey()
                setMessage('');
                setIsLoading(false)
                setShowInputsChavePix(false)
                setSucessRequest(false)
              }, 3000);
        })
        .catch(err =>{
            setIsLoading(false)
            console.log(err)
            setErroRequest(true)
            setMessage(err.response.data.message)
            return setTimeout(() => {
                setMessage('');
              }, 3000);
        })
    }
    const handleShowBtnDeletePixKey = (keySelected) =>{
        setShowBtnDeletePixKey(true)
        setPixKeySelected(keySelected)
    }

    const deletePixKey = () =>{
        setIsLoading(true)
        let isTheLastPixKey = false;
        isTheLastPixKey = objectPix.length
        axios.delete(`http://localhost:5001/api/v1/pixKey?chavePix=${pixKeySelected}`)
        .then(res => {
            console.log(res)
            setMessage(res.data.message)
            return setTimeout(() => {
                setIsLoading(false)
                if(isTheLastPixKey === 1){
                    return window.location.reload()
                }
                setMessage('');
                setShowBtnDeletePixKey(false)
                setTypePixKey(false)
                setPixKey(false)
                setPixKeySelected(false)
                getPixKey()
                setSucessRequest(false)
              }, 3000);
        })
        .catch(err =>{
            setIsLoading(false)
            console.log(err)
            setMessage(err.response.data.message)
            return setTimeout(() => {
                setMessage('');
              }, 3000);
        })
    }

    return (
        <div className='container__main'>
            <div className="menu__nav">
                <div className='header__main' style={{paddingBottom: '35px'}}>
                    <h2 style={{color: '#fff'}}>Banco One</h2>
                </div>
            </div>
            <div className='section__main'>
                <div className='header__main__area__pix'>
                    <div className="box__close__and__question">
                        <IoClose className="icon__close__and__question" onClick={navigateToHome}/>
                        <FaRegCircleQuestion className="icon__close__and__question"/>
                    </div>
                    <div style={{color:'black', paddingLeft: '15px'}}>
                        <h2>Área pix</h2>
                        <p>Envie e receba pagamentos a qualquer hora e dia da semana, sem pagar nada por</p>
                    </div>
                </div>
                
                <div className='sectio__pix__area__pix' >
                    <div className="conteiner__option" onClick={navigateToTransferenciaPix}>
                        <div className='box__area__pix'>
                            <PiPixLogo className="icon__PiPixLogo"/>
                        </div>
                        <p style={{color: 'black'}}>Transferir</p>
                    </div>
                    <div className="conteiner__option" onClick={handleCopyLink}>
                        <div className='box__area__pix' >
                            <PiMoneyWavy className="icon__PiPixLogo"/>
                        </div>
                        <p style={{color: 'black'}}>Receber</p>
                    </div>
                    
                </div>

                {chaveCopiada && (
                    <div className="message__sucess" style={{marginTop: '10px'}}>
                        <FaRegCheckCircle className="icon__FaRegCheckCircle"/>
                        <p >{message}</p>
                    </div>
                )}
                <div className="section__add__chave__pix">
                    <h3 style={{color:'black', paddingLeft: '15px'}}>Chave pix</h3>
                    {typePixKey && pixKey ?(
                        objectPix.map((pix, index) =>(
                            <div key={index} className="section__pix__cadastrado">
                                
                                    <div >
                                        <p style={{color: 'black', fontSize: '16px', fontWeight: '600'}}>{pix.tipo_chave}</p>
                                        <p style={{color: 'black', fontSize: '14px'}}>{pix.chave}</p>
                                    </div>
                            
                                
                                <div className="box__icon__MdDeleteOutline" onClick={() => {handleShowBtnDeletePixKey(pix.chave)}}>
                                    <MdDeleteOutline className="icon__MdDeleteOutline"/>
                                </div>
                                
                            </div>
                        ))
                    ):(
                        <>
                            <p className="text__add__first__chave__pix">
                                Adicione seu CPF, Email ou celuar como sua primeira chave pix e ganhe R$ 100,00 de bônus.
                            </p>
                        </>
                    )}
                    
                    {showInputsChavePix && !showBtnDeletePixKey &&(
                        <>
                            <div style={{ paddingLeft: '15px', paddingRight: '10px', paddingTop: '10px'}}>
                            <div className="flex-column">
                                <label>Tipo da chave</label>
                            </div>
                            <div className="inputForm">
                            <select
                                className="input"
                                name="type_chave_pix"
                                value={newTypePixKey}
                                onChange={(e) => setNewTypePixKey(e.target.value)}
                            >
                                <option value="">Selecione o tipo da chave</option>
                                {/* Verificando se a chave já está cadastrada e não exibindo ela */}
                                {!objectPix.some(type => type.tipo_chave === 'CPF') && (
                                    <option value="CPF">CPF</option>
                                )}
                                {!objectPix.some(type => type.tipo_chave === 'E-mail') && (
                                    <option value="E-mail">E-mail</option>
                                )}
                                {!objectPix.some(type => type.tipo_chave === 'Celular') && (
                                    <option value="Celular">Celular</option>
                                )}
                            </select>
                            </div>
                            </div>

                            <div style={{ paddingLeft: '15px', paddingRight: '10px', paddingTop: '10px'}}>
                                <div className="flex-column">
                                    <label>Chave</label>
                                </div>
                                <div className="inputForm">
                                    <input type="text" className="input" name="type_chave_pix" onChange={verifyPixKey} placeholder="Informe sua chave" />
                                </div>
                            </div>

                            {erroRequest &&(
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

                            <div className="container__loading__and__btn">
                                {isLoading ? (
                                    <svg viewBox="25 25 50 50" className="svg">
                                        <circle r="20" cy="50" cx="50"></circle>
                                    </svg>
                                ):(
                                    <div className="box__btn__add__chave__pix" onClick={createNewPixKey}>
                                        {!invalidPixKey?(
                                            <button className={` ${newTypePixKey && newPixKey ? 'btn__show__add__chave__pix':'btn__add__chave__pix'}`}>
                                                Cadastrar chave pix
                                            </button>
                                        ):(
                                            <>
                                                <div className="message__erro">
                                                    <VscError className="icon__VscError"/>
                                                    <p> O {newTypePixKey} informado não é válido.</p>
                                                </div>  
                                            </>
                                            
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    {showBtnDeletePixKey && (
                        <div className="container__btn__delete__chave__pix">
                            {isLoading ? (
                                <svg viewBox="25 25 50 50" className="svg">
                                    <circle r="20" cy="50" cx="50"></circle>
                                </svg>
                            ):(
                                <div className="container__btn__delete__chave__pix">
                                    <button className="btn__ cancel" onClick={() =>{setShowBtnDeletePixKey(false)}}>Cancelar</button>
                                    <button className="btn__ confirm" onClick={deletePixKey}>Confirmar</button>
                                </div>
                            )}
                        </div>
                    )}
                    {!showInputsChavePix && !showBtnDeletePixKey && objectPix.length < 3 &&(
                        <div className="box__btn__add__chave__pix" onClick={showInputs}>
                            <button className="btn__show__add__chave__pix">
                                Cadastrar chave pix
                            </button>
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
    )
}

export default AreaPix;