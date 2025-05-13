import React from "react";
import { Routes, Route } from "react-router-dom";
import Card from "../components/card/index.tsx";
import PaginaInicial from "../components/paginaInicial/index.tsx";

const Rotas = () => {
    return (
        <Routes>
            <Route path="/" element={<Card />} />
            <Route path="/page" element={<PaginaInicial />} />
        </Routes>
    );
};

export default Rotas;