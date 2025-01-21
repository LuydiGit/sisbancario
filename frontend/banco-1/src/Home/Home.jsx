import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios';

import { PiPixLogo } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa6";
import { LuUserRound } from "react-icons/lu";

import './Home.css'

function Home () {

    const navigate = useNavigate();
    const [saldo, setSaldo] = useState(false)

    const clientId = 11;

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

    //unção para obter o saldo atual da conta
    const consultarSaldo = () =>{
        axios.get(`http://localhost:5001/api/v1/saldo/${clientId}`)
        .then(res => {
            console.log(res)
            setSaldo(res.data.result[0].saldo);
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
    console.log(saldo)
    return (
        <div className='container__main'>
            <div className='section__main'>
                <div className='header__main'>
                    <div className='box__img'>
                        <FaRegUser className="icon__LuUserRound"/>
                    </div>
                    <h2 className='name__user'>Olá, João</h2>
                </div>
                <div className='section__conta'>
                    <p>Conta</p>
                    <p>{formatarSaldoEmReais(saldo)}</p>
                </div>
                <div className='sectio__pix' onClick={navigateToAreaPix}>
                    <div className='box__area__pix'>
                        <PiPixLogo className="icon__PiPixLogo"/>
                    </div>
                    <p style={{color: 'black'}}>Área Pix</p>
                </div>
            </div>
        </div>
    )
}

export default Home;