import React, { useState, useEffect } from "react";
import { Eye, FileDown } from 'lucide-react';
import { Link } from "react-router-dom";
import Header from "./Header";
import "./styles/verFactura.css";

export default function VerFactura() {
    const [dataFactura, setDataFactura] = useState([]);
    const [filters, setFilters] = useState({
        reference_code: "",
        number: "",
        identification: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const url_api = import.meta.env.VITE_url_api;
    const access_token = localStorage.getItem("access_token");

    useEffect(() => {
        fetchFactura();
    }, [filters, currentPage]);

    const fetchFactura = async () => {
        try {
            if (!access_token) {
                console.error("No hay un token de acceso");
                return;
            }

            // Construir la URL con los filtros aplicados
            const queryParams = new URLSearchParams({
                "page": currentPage,
                "limit": itemsPerPage,
            });
            
            if (filters.reference_code) queryParams.append("filter[reference_code]", filters.reference_code);
            if (filters.number) queryParams.append("filter[number]", filters.number);
            if (filters.identification) queryParams.append("filter[identification]", filters.identification);

            const response = await fetch(`${url_api}/v1/bills?${queryParams.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                    "Accept": "application/json",
                },
            });

            if (response.ok) {
                const { data } = await response.json();
                setDataFactura(data.data);
                setTotalPages(data.pagination.last_page || 1);
            } else {
                console.error("Error al obtener las facturas");
            }
        } catch (error) {
            console.error("Error en la solicitud de facturas:", error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
        setCurrentPage(1);
    };

    return (
        <>
        <Header/>
        <div className="ver-factura-container">
            <h2>Ver Factura</h2>

            {/* Sección de filtros */}
            <div className="filters">
                <input 
                    type="text" 
                    name="reference_code" 
                    placeholder="Código de Referencia" 
                    value={filters.reference_code} 
                    onChange={handleFilterChange} 
                />
                <input 
                    type="text" 
                    name="number" 
                    placeholder="Número de Factura" 
                    value={filters.number} 
                    onChange={handleFilterChange} 
                />
                <input 
                    type="text" 
                    name="identification" 
                    placeholder="Identificación" 
                    value={filters.identification} 
                    onChange={handleFilterChange} 
                />
            </div>

            <table className="factura-table">
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Codigo de Referencia</th>
                        <th>Identificacion</th>
                        <th>Campaña</th>
                        <th>Trade_Name</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Total</th>
                        <th>Creado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {dataFactura.map((factura) => (
                        <tr key={factura.id}>
                            <td>{factura.number}</td>
                            <td>{factura.reference_code}</td>
                            <td>{factura.identification}</td>
                            <td>{factura.company || 'N/A'}</td>
                            <td>{factura.trade_name || 'N/A'}</td>
                            <td>{factura.names}</td>
                            <td>{factura.email}</td>
                            <td>{factura.total}</td>
                            <td>{factura.created_at || "N/A"}</td>
                            <td>
                                <div className="container-action">
                                    <Link className="download-button" to={`/detalles/${factura.number}`}>
                                        <Eye />
                                    </Link>
                                    <button className="download-button" onClick={() => descargarFactura(factura.number)}>
                                        <FileDown />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Siguiente
                </button>
            </div>
        </div>
        </> 
    );
}
