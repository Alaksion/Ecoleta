import React from 'react'

interface HeaderProps{
    title: string // é um parametro obrigatório
}

const Header: React.FC<HeaderProps> = (props)=>{
    return (
        <header>{props.title}</header>
    )
}

export default Header