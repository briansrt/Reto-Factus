import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./styles/header.css";

const Header = () => {
    const location = useLocation();

    return (
        <header>
            <div className="logo">Factus x BSRT</div>
            <nav>
                <ul>
                    <li>
                        <Link to="/verFactura" className={location.pathname === "/verFactura" ? "active" : ""}>Ver Factura</Link>
                    </li>
                    <li>
                        <Link to="/crearFactura" className={location.pathname === "/crearFactura" ? "active" : ""}>Crear Factura</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
