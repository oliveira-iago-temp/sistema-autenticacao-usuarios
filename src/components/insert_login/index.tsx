import React, { useState } from "react"
import './input.css'

export default function ImputCard() {

    const [login, setLogin] = useState("")
    const [senha, setSenha] = useState("")

    return (
        <div className={"container"}>
            <input className={"campo"}
                type="text"
                placeholder="email de login"
                onChange={(nome => { setLogin(nome.target.value) })}
            />

            <input className={"campo"}
                type="text"
                placeholder="senha de login"
                onChange={(nome => { setSenha(nome.target.value) })}
            />
        </div>
    )
}