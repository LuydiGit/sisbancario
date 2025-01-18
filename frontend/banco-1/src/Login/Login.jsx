import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import './Login.css';

function Login() {
    const navigate = useNavigate();

    const navigateToSignUp = () =>{ 
        navigate('/CreateClient')
    }
    
    return (
        <div className='container__form'>
            <form className="form">
                {/* Campo de Email */}
                <h1 style={{color: 'black', textAlign: 'center'}}>Banco One</h1>
                <div className="flex-column">
                    <label>Email</label>
                </div>
                <div className="inputForm">
                    <svg height="20" viewBox="0 0 32 32" width="20">
                        <g id="Layer_3" data-name="Layer 3">
                            <path d="M30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"/>
                        </g>
                    </svg>
                    <input type="text" className="input" placeholder="Enter your Email" />
                </div>

                {/* Campo de Senha */}
                <div className="flex-column">
                    <label>Password</label>
                </div>
                <div className="inputForm">
                    <svg height="20" viewBox="-64 0 512 512" width="20">
                        <path d="M336 512H48c-26.453 0-48-21.523-48-48V240c0-26.476 21.547-48 48-48h288c26.453 0 48 21.523 48 48v224c0 26.476-21.547 48-48 48zm-288-288c-8.813 0-16 7.168-16 16v224c0 8.832 7.188 16 16 16h288c8.813 0 16-7.168 16-16V240c0-8.832-7.188-16-16-16zm0 0"/>
                    </svg>
                    <input type="password" className="input" placeholder="Enter your Password" />
                    <svg viewBox="0 0 576 512" height="20">
                        <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6-48.4 46.6-78.7 98.6-93.5 134.3-3.3 7.9-3.3 16.7 0 24.6 14.8 35.7 45.1 87.7 93.5 134.3C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6C466.1 156 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1-288 0z"/>
                    </svg>
                </div>

                {/* Checkbox e Esqueci a Senha */}
                <div className="flex-row">
                    <div>
                        <input type="checkbox" />
                        <label>Remember me</label>
                    </div>
                    <span className="span">Forgot password?</span>
                </div>

                {/* Botão de Login */}
                <button className="button-submit">Sign In</button>

                {/* Alternativa de Cadastro */}
                <p className="p" onClick={navigateToSignUp}>
                    Don't have an account? <span className="span">Sign Up</span>
                </p>
                <p className="p line">Or With</p>

                {/* Botões de Login Social */}
                <div className="flex-row">
                <button className="btn google">
                    Google 
                </button>

                <button className="btn apple">
                    Apple 
                </button>
                </div>
            </form>
        </div>
        
    );
}

export default Login;
