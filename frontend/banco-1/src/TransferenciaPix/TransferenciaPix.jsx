import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import axios from 'axios';

import { PiPixLogo } from "react-icons/pi";
import { IoQrCode } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { VscError } from "react-icons/vsc";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";

import './TransferenciaPix.css'

function TransferenciaPix () {

    const [pixKey, setPixKey] = useState(false);
    const [message, setMessage] = useState('')
    const [showInputPixKey, setShowInputPixKey] = useState(false)
    const [valor, setValor] = useState('');
    const [saldo, setSaldo] = useState(false)
    const [clientFound, setClientFound] = useState(false)
    const [bankName, setBankName] = useState('')
    const [clientName, setClientName] = useState('')
    const [clientCPF, setClientCPF] = useState('')
    const [erroRequest, setErroRequest] = useState(false)

    const clientId = 11;

    //Função para buscar o cliente destinatário
    const searchClient = () =>{
        axios.get(`http://localhost:5001/api/v1/searchClientByPixKey/${pixKey}`)
        .then(res => {
            console.log(res)
            setBankName(res.data.result.banco_Name)
            setClientName(res.data.result.result.nome)
            setClientCPF(res.data.result.result.cpf)
            setClientFound(true)
        })
        .catch(err =>{
            console.log(err)
            setMessage(err.response.data.message)
            setErroRequest(true)
            return setTimeout(() => {
                setErroRequest(false)
                setMessage('');
              }, 3000);
        })
    }
    //Função para formatar o saldo da conta em reais
    function formatarSaldoEmReais(saldo) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(saldo);
    }
    //Função para formatar o saldo digitado pelo usuário em reais
    function formatarValorParaReais(valor) {
        // Remove caracteres que não são dígitos
        const valorNumerico = valor.replace(/\D/g, '');
    
        // Converte para número e divide por 100 para ajustar os centavos
        const valorFloat = parseFloat(valorNumerico) / 100;
    
        // Formata o número como moeda brasileira
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valorFloat || 0);
    }
    //Função para obter o valor digitado pelo usuário
    const handleChange = (e) => {
        const valorDigitado = e.target.value;
        const valorFormatado = formatarValorParaReais(valorDigitado);
        setValor(valorFormatado); // Atualiza o estado com o valor formatado
    };
    //unção para obter o saldo atual da conta
    const consultarSaldo = () =>{
        axios.get(`http://localhost:5001/api/v1/saldo/${clientId}`)
        .then(res => {
            console.log(res)
            setSaldo(res.data.result[0].saldo);
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
    useEffect(() =>{
        consultarSaldo()
    }, [])

    const transferirPix = () =>{
        const values = {
            clientId,
            valorTransacao: valor,
            chavePix: pixKey
        }
        axios.put(`http://localhost:5001/api/v1/transferenciaPix`, values)
        .then(res => {
            console.log(res)
            
        })
        .catch(err =>{
            console.log(err)
            setMessage(err.response.data.message)
            setErroRequest(true)
            return setTimeout(() => {
                setErroRequest(false)
                setMessage('');
              }, 3000);
        })
    }
    
    return (
        <div className='container__main'>
            <div className='section__main'>
                <div className='header__main__area__pix' style={{height: '125px', border: 'none'}}>
                    <div className="box__close__and__question">
                        <IoClose className="icon__close__and__question"/>
                        {!clientFound &&(
                            <IoQrCode className="icon__close__and__question"/>
                        )}
                    </div>
                    {clientFound ? (
                        <>
                            <div style={{color:'black', paddingLeft: '15px'}}>
                                <h2>Confirme os detalhes da transação</h2>
                                <h1>{valor}</h1>
                                <p style={{marginBottom: '15px'}}>Para <b>{clientName}</b></p>
                                <p>CPF <b>{clientCPF}</b></p>
                                <p>Instituição <b>{bankName}</b></p>

                                <div className="box__btn__add__chave__pix">
                                    <button className="btn__show__add__chave__pix" onClick={transferirPix}>
                                        Confirmar
                                    </button>
                                </div>
                            </div>
                        </>
                    ):(
                        <>
                            {!showInputPixKey &&(
                            <div style={{color:'black', paddingLeft: '15px'}}>
                                <h2>Qual é o valor da <br/>transferência?</h2>
                                <p>Saldo disponível de {formatarSaldoEmReais(saldo)}</p>
                            </div>
                            )}
                            {showInputPixKey &&(
                                <div style={{color:'black', paddingLeft: '15px'}}>
                                    <h2>Qual a chave pix <br/>da conta destinatária?</h2>
                                </div>
                            )}

                            <div className='sectio__pix__area__pix' style={{width:'100%', border: 'none'}}>
                                {!showInputPixKey &&(
                                    <>
                                        <div className="inputForm" style={{width:'90%'}}>
                                            <input type="text" className="input" name="saldo" value={valor} onChange={handleChange} placeholder="R$ 0,00" />
                                        </div>
                                        <div className="box__btn__add__chave__pix">
                                            <button className="btn__show__add__chave__pix" onClick={() => setShowInputPixKey(true)}>
                                                Continuar
                                            </button>
                                        </div>
                                    </>
                                    
                                )}
                                {showInputPixKey &&(
                                    <>
                                        <div className="inputForm" style={{width:'90%'}}>
                                            <input type="text" className="input" name="chavePix" onChange={(e) => setPixKey(e.target.value)} placeholder="CPF, Email ou Celular" />
                                        </div>
                                        {erroRequest ? (
                                            <div className="message__erro" style={{width:'90%', marginTop: '10px'}}>
                                                <VscError className="icon__VscError"/>
                                                <p >{message}</p>
                                            </div>
                                        ):(
                                        <div className="box__btn__add__chave__pix">
                                            <button className="btn__show__add__chave__pix" onClick={searchClient}>
                                                Continuar
                                            </button>
                                        </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TransferenciaPix;