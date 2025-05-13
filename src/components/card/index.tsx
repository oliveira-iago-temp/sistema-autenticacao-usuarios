import React from "react"
import InputCard from '../insert_login/index.tsx'
import './card.css'

const Card  = () => {

    return(
        <section className={"main"}>
            <h1 className={"titulo"}>Login com hash</h1>
            <p className={"texto"}>Utilize deste sistema para garantir a segurança de seus dados com login e senha criptografados</p>
            <InputCard />
        </section>
    )
}; 

export default Card