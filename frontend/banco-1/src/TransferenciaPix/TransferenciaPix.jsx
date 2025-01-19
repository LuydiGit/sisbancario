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


    const clientId = 11;

    const searchPixKey = () =>{
        axios.get(`http://localhost:5001/api/v1/searchPixKey/${pixKey}`)
        .then(res => {
            
        })
        .catch(err =>{
            console.log(err)
            setMessage(err.response.data.message)
            return setTimeout(() => {
                setMessage('');
              }, 3000);
        })
    }

    function formatarSaldoEmReais(saldo) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(saldo);
    }

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

    const handleChange = (e) => {
        const valorDigitado = e.target.value;
        const valorFormatado = formatarValorParaReais(valorDigitado);
        setValor(valorFormatado); // Atualiza o estado com o valor formatado
    };

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

    return (
        <div className='container__main'>
            <div className='section__main'>
                <div className='header__main__area__pix' style={{height: '125px', border: 'none'}}>
                    <div className="box__close__and__question">
                        <IoClose className="icon__close__and__question"/>
                        <IoQrCode className="icon__close__and__question"/>
                    </div>
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
                </div>
                
                <div className='sectio__pix__area__pix' style={{width:'100%', border: 'none'}}>
                    {!showInputPixKey &&(
                        <div className="inputForm" style={{width:'90%'}}>
                            <input type="text" className="input" name="saldo" value={valor} onChange={handleChange} placeholder="R$ 0,00" />
                        </div>
                    )}
                    {showInputPixKey &&(
                        <div className="inputForm" style={{width:'90%'}}>
                            <input type="text" className="input" name="chavePix" onChange={(e) => setPixKey(e.target.value)} placeholder="CPF, Email ou Celular" />
                        </div>
                    )}

                    <div className="box__btn__add__chave__pix">
                        <button className="btn__show__add__chave__pix" onClick={() => setShowInputPixKey(true)}>
                            Continuar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransferenciaPix;