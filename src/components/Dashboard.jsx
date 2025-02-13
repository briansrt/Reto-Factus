import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./styles/dashboard.css";

const App = () => {
  return (
    <div className="container">
      {/* Panel lateral */}
      <aside className="sidebar">
        <nav>
          <ul>
            <li><Link to="/Dashboard">Home</Link></li>
            <li><Link to="/verFactura">Facturas</Link></li>
            <li><Link to="/crearFactura">Crear Factura</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
        <main className="content">
            <div>
                <h1 className="title">Dashboard del Sistema de Facturación del reto Factus</h1>
                <div className="cards">
                    <Card title="Facturas" description="Gestiona todas tus facturas desde aquí." url="/verFactura"/>
                    <Card title="Clientes" description="Gestiona la información de tus clientes." />
                    <Card title="Reportes" description="Genera reportes detallados de tus facturas." url="/crearFactura"/>
                </div>
            </div>
        </main>
    </div>
  );
};

const Card = ({ title, description, url }) => (
  <div className="card">
    <h2>{title}</h2>
    <p>{description}</p>
    <Link to={url} className="button">
      Ver más
    </Link>
  </div>
);

export default App;
