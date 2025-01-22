import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from 'axios';

import { PiPixLogo } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa6";
import { GoGift } from "react-icons/go";
import { FaArrowRight } from "react-icons/fa6";

import './Home.css'

function Home () {

    const navigate = useNavigate();

    const [saldo, setSaldo] = useState(false)
    const [chavePix, setChavePix] = useState(false)
    const [objectTransacao, setObjectTransacao] = useState([])

    const userData = localStorage.getItem('userData');
    //trasnformando os dados para JSON
    const userInformation = JSON.parse(userData);
    //Fromatando cada letra inicial do nome do usuário para caixa-alta
    const clientId = userInformation.id;
    const clientName = userInformation.nome;

    const navigateToAreaPix = () =>{ 
        navigate('/AreaPix')
    }

    //Função para formatar o saldo da conta em reais
    function formatarSaldoEmReais(saldo) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(saldo);
    }

     //Função para obter o saldo atual da conta
     const consultarTransacoes = (contaId) =>{
        axios.get(`http://localhost:5002/api/v1/transacoes/${contaId}`)
        .then(res => {
            console.log(res)
            setObjectTransacao(res.data.result)
        })
        .catch(err =>{
            console.log(err)
            return setTimeout(() => {
                setMessage('');
              }, 3000);
        })
    }
console.log(objectTransacao)
    //Função para obter o saldo atual da conta
    const consultarSaldo = () =>{
        axios.get(`http://localhost:5002/api/v1/saldo/${clientId}`)
        .then(res => {
            console.log(res)
            setSaldo(res.data.result[0].saldo);
            setChavePix(res.data.result[0].chave_pix)
            consultarTransacoes(res.data.result[0].id)
        })
        .catch(err =>{
            console.log(err)
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
            <div className="menu__nav">
                <div className='header__main' style={{paddingBottom: '35px'}}>
                    <h2 style={{color: '#fff'}}>Banco Two</h2>
                </div>
            </div>
            <div className='section__main'>
                <div className='header__main'>
                    <div className='box__img'>
                        <FaRegUser className="icon__LuUserRound"/>
                    </div>
                    <h2 className='name__user'>Olá, {clientName}</h2>
                </div>
                <div className='section__conta'>
                    <h3>Conta</h3>
                    <p>{formatarSaldoEmReais(saldo)}</p>
                </div>
                <div className='sectio__pix' onClick={navigateToAreaPix}>
                    <div className='box__area__pix'>
                        <PiPixLogo className="icon__PiPixLogo"/>
                    </div>
                    <p style={{color: 'black'}}>Área Pix</p>
                </div>
                {!chavePix ? (
                    <div className="card__promo" onClick={navigateToAreaPix}>
                        <GoGift className="icon__GoGift" />
                        <p className="text__gift">
                            Adicione seu CPF, Email ou celuar como sua primeira chave pix e ganhe R$ 100,00 de bônus.
                        </p>
                        <div className="box__icon__FaArrowRight">
                            <FaArrowRight className="icon__FaArrowRight"/>
                        </div>
                    </div>
                ):(
                    <div className="section__transacao">
                    <h3 style={{color: 'black', marginTop: '25px', marginLeft: '10px'}}>Transações</h3>
                        {objectTransacao.length > 0 ?(
                            objectTransacao.map((transacao, index ) =>(
                                <div  key={index} className="card__transferencia">
                                    <div  style={{width: '100%'}}>
                                        <div className="header__transacao">
                                            <p>Transferência pix {transacao.tipo}</p>
                                            <p>{formatarSaldoEmReais(transacao.valor)}</p>
                                        </div>
                                        <div className="header__transacao">
                                            <p>Chave pix </p>
                                            <p>{transacao.chave_pix}</p>
                                        </div>
                                        <div className="header__transacao">
                                            <p>Instituição </p>
                                            <p>{transacao.banco_oposto}</p>
                                        </div>
                                        <div className="header__transacao">
                                            <p>status </p>
                                            <p>{transacao.status}</p>
                                        </div>
                                        <div className="header__transacao">
                                            <p>Data/hora </p>
                                            <p>{transacao.data_hora}</p>
                                        </div>
                                        <div className="header__transacao">
                                            <p>ID da transação </p>
                                            <p>{transacao.transacao_id}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ):(
                        <>
                            <p  style={{color: 'gray', marginTop: '25px', marginLeft: '10px'}}>Nenhuma transação realizada.</p>
                        </>
                        )}
                    </div>
                )}
            </div>
            
        </div>
    )
}

export default Home;