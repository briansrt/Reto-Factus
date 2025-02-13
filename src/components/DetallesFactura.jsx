import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Eye, FileDown } from 'lucide-react';
import "./styles/detallesFactura.css";
import Header from "./Header";

export default function DetallesFactura() {
    const url_api = import.meta.env.VITE_url_api;
    const access_token = localStorage.getItem("access_token");
    const { number } = useParams();
    const [dataFactura, setDataFactura] = useState(null);

    const descargarFactura = async () => {
        try {
            if (!access_token) {
                console.error("No hay un token de acceso");
                return; // Si no hay token, no haces la solicitud
            }

            // Realizamos la solicitud para descargar el PDF
            const response = await fetch(`${url_api}/v1/bills/download-pdf/${number}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                    "Accept": "application/pdf", // Asegúrate de indicar que esperas un archivo PDF
                },
            });

            if (response.ok) {
                const { data } = await response.json();
                const base64String = data.pdf_base_64_encoded;
                const byteCharacters = atob(base64String);
                const byteArrays = [];

                // Convertimos los caracteres decodificados en un array de bytes
                for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                    const slice = byteCharacters.slice(offset, offset + 1024);
                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                    byteArrays.push(new Uint8Array(byteNumbers));
                }

                // Creamos un Blob con el array de bytes
                const blob = new Blob(byteArrays, { type: 'application/pdf' });

                // Creamos un enlace de descarga para el archivo PDF
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob); // Creamos una URL temporal para el archivo
                link.download = `${number}.pdf`; // El nombre del archivo descargado
                link.click(); // Disparamos el clic para iniciar la descarga
            } else {
                console.error("Error al descargar el PDF");
            }
        } catch (error) {
            console.error("Error en la solicitud de descarga:", error);
        }
    };

    useEffect(() => {
        // Depuración
        console.log('Access Token:', access_token);
        console.log('API URL:', url_api);
        console.log('Bill Number:', number);

        const fetchDetalles = async () => {
            try {
                if (!access_token) {
                    console.error('No access token found!');
                    return;
                }

                const response = await fetch(`${url_api}/v1/bills/show/${number}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access_token}`,
                        "Accept": "application/json",
                    },
                });

                if (response.ok) {
                    const { data } = await response.json();
                    setDataFactura(data); // Guarda los datos en el estado
                } else {
                    console.error("Error al obtener los detalles de la factura");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
            }
        };

        fetchDetalles();
    }, [access_token, number, url_api]);

    if (!dataFactura || !dataFactura.company) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <Header/>
        <div className="detallesFactura_container">
            <h2>Empresa</h2>
            <div className="empresa_container">
                <div>
                    <p><strong>Municipio:</strong> {dataFactura.company.municipality}</p>
                    <p><strong>Direccion:</strong> {dataFactura.company.direction}</p>
                    <p><strong>Telefono:</strong> {dataFactura.company.phone}</p>
                    <p><strong>Email:</strong> {dataFactura.company.email}</p>
                </div>
                <div>
                    <p><strong>Identificacion:</strong> {dataFactura.company.nit}</p>
                    <p><strong>Codigo de Registro:</strong> {dataFactura.company.registration_code}</p>
                    <p><strong>Actividad Economica:</strong> {dataFactura.company.economic_activity}</p>
                    <p><strong>dv:</strong> {dataFactura.company.dv}</p>
                </div>
                <div>
                    <img src={dataFactura.company.url_logo} width="230px" alt={dataFactura.company.graphic_representation_name} />
                    <p><strong>Nombre:</strong> {dataFactura.company.name}</p>
                </div>
            </div>
            <h2>Cliente</h2>
            <div className="empresa_container">
                <div>
                    <p><strong>Organizacion Legal:</strong> {dataFactura.customer.legal_organization?.name}</p>
                    <p><strong>Nombre:</strong> {dataFactura.customer.names}</p>
                    <p><strong>Identificacion:</strong> {dataFactura.customer.identification}</p>
                    <p><strong>Email:</strong> {dataFactura.customer.email}</p>
                </div>
                <div>
                    <p><strong>Direccion:</strong> {dataFactura.customer.address}</p>
                    <p><strong>Telefono:</strong> {dataFactura.customer.phone}</p>
                    <p><strong>Ciudad:</strong> {dataFactura.customer.municipality?.name}</p>
                </div>
            </div>
            <h2>Factura</h2>
            <div className="empresa_container">
                <div>
                    <p><strong>{dataFactura.bill.document?.name || "N/A"}</strong></p>
                    <p><strong>Numero:</strong> {dataFactura.bill.number}</p>
                    <p><strong>Codigo de Referencia:</strong> {dataFactura.bill.reference_code}</p>
                    <p><strong>Creado el:</strong> {dataFactura.bill.created_at}</p>
                    <p><strong>Validado el:</strong> {dataFactura.bill.validated}</p>
                    <p><strong>Total:</strong> {dataFactura.bill.total}</p>
                </div>
                <div>
                    <p><strong>Discount_rate:</strong> {dataFactura.bill.discount_rate}</p>
                    <p><strong>gross_value:</strong> {dataFactura.bill.gross_value}</p>
                    <p><strong>taxable_amount:</strong> {dataFactura.bill.taxable_amount}</p>
                    <p><strong>Forma de Pago:</strong> {dataFactura.bill.payment_form?.name || "N/A"}</p>
                    <p><strong>Metodo de Pago:</strong> {dataFactura.bill.payment_method?.name || "N/A"}</p>
                    <p><strong>Observacion:</strong> {dataFactura.bill.observation}</p>
                </div>
                <div>
                    <p><strong>Codigo QR</strong></p>
                    <img src={dataFactura.bill.qr_image} alt="Codigo QR" width="200px"/>
                </div>
            </div>
            <div className="button_container">
                <a href={dataFactura.bill.qr} target="_blank" rel="noreferrer">DIAN <Eye/></a>
                <button className="download-button" onClick={() => descargarFactura()}>Descargar PDF <FileDown/></button>
            </div>
        </div>
        </>
    );
}
