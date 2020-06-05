import React from 'react'
import logo from '../../assets/logo.svg'
import {FiLogIn} from 'react-icons/fi'
import {Link} from 'react-router-dom'
import './styles.css'

const Home = ()=>{
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="ecoleta"></img>
                </header>
                <main>
                    <h1>Seu marketplace de coleta de resíduos</h1>
                    <p>Ajudamos pessoas a encontrar pontos de coleta de forma eficiente</p>
                        <Link to='/newpoint'>
                            <span><FiLogIn></FiLogIn></span>
                            <strong>Cadastre um ponte de coleta</strong>
                        </Link> 
                </main>
            </div>
        </div>
    )
}


export default Home