import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { PiPixLogo } from "react-icons/pi";
import { RiImageAddLine } from "react-icons/ri";
import { LuUserRound } from "react-icons/lu";

import './Home.css'

function Home () {

    const navigate = useNavigate();

    const navigateToAreaPix = () =>{ 
        navigate('/AreaPix')
    }

    return (
        <div className='container__main'>
            <div className='section__main'>
                <div className='header__main'>
                    <div className='box__img'>
                        <LuUserRound className="icon__LuUserRound"/>
                    </div>
                    <h2 className='name__user'>Olá, João</h2>
                </div>
                <div className='section__conta'>
                    <p>Conta</p>
                    <p>R$ 200,00</p>
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