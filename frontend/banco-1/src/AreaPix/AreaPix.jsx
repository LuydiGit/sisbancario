import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import axios from 'axios';

import { PiPixLogo } from "react-icons/pi";
import { RiImageAddLine } from "react-icons/ri";
import { LuUserRound } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { VscError } from "react-icons/vsc";

import './AreaPix.css'

function AreaPix () {

    const [showInputsChavePix, setShowInputsChavePix] = useState(false);
    const [typePixKey, setTypePixKey] = useState(false);
    const [newPixKey, setNewPixKey] = useState(false);
    const [message, setMessage] = useState('')
    const [erroRequest, setErroRequest] = useState(false)


    const showInputs = () =>{
        setShowInputsChavePix(true)
    }

    const createNewPixKey = () =>{
        const values = {
            bancoId: 1,
            clientId: 11,
            saldo: 100,
            chavePix: newPixKey,
            tipo_chave_pix: typePixKey
        }

        axios.post('http://localhost:5001/api/v1/pixKey', values)
        .then(res => {
            console.log(res)
            setMessage(res.data.message)
            return setTimeout(() => {
                setMessage('');
              }, 3000);
        })
        .catch(err =>{
            console.log(err)
            setErroRequest(true)
            setMessage(err.response.data.message)
            /*return setTimeout(() => {
                setMessage('');
              }, 3000);*/
        })
    }
    return (
        <div className='container__main'>
            <div className='section__main'>
                <div className='header__main__area__pix'>
                    <div className="box__close__and__question">
                        <IoClose className="icon__close__and__question"/>
                        <FaRegCircleQuestion className="icon__close__and__question"/>
                    </div>
                    <div style={{color:'black', paddingLeft: '15px'}}>
                        <h2>Área pix</h2>
                        <p>Lorem capitulum</p>
                    </div>
                </div>
                
                <div className='sectio__pix__area__pix'>
                    <div className='box__area__pix'>
                        <PiPixLogo className="icon__PiPixLogo"/>
                    </div>
                    <p style={{color: 'black'}}>Transferir</p>
                </div>

                <div className="section__add__chave__pix">
                    <h3 style={{color:'black', paddingLeft: '15px'}}>Chave pix</h3>
                    <p className="text__add__first__chave__pix">
                        Adicione seu CPF, Email ou celuar como sua primeira chave pix e ganhe R$ 100,00 de bônus.
                    </p>
                    {showInputsChavePix ? (
                        <>
                            <div style={{ paddingLeft: '15px', paddingRight: '10px', paddingTop: '10px'}}>
                                <div className="flex-column">
                                    <label>Tipo da chave</label>
                                </div>
                                <div className="inputForm">
                                    <input type="text" className="input" name="type_chave_pix" onChange={(e)=> setTypePixKey(e.target.value)} placeholder="CPF, Email ou Celular" />
                                </div>
                            </div>

                            <div style={{ paddingLeft: '15px', paddingRight: '10px', paddingTop: '10px'}}>
                                <div className="flex-column">
                                    <label>Chave</label>
                                </div>
                                <div className="inputForm">
                                    <input type="text" className="input" name="type_chave_pix" onChange={(e)=> setNewPixKey(e.target.value)} placeholder="Informe sua chave" />
                                </div>
                            </div>

                            {erroRequest && (
                                <div className="message__erro">
                                    <VscError className="icon__VscError"/>
                                    <p >{message}</p>
                                </div>
                            )}
                            <div className="box__btn__add__chave__pix" onClick={createNewPixKey}>
                                <button className="btn__add__chave__pix">
                                    Cradastar chave pix
                                </button>
                            </div>
                        </>
                    ):(
                        <div className="box__btn__add__chave__pix" onClick={showInputs}>
                            <button className="btn__show__add__chave__pix">
                                Cradastar minha primeira chave pix
                            </button>
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
    )
}

export default AreaPix;