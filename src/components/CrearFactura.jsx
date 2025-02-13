import React, { useState, useEffect } from "react";
import "./styles/crearFactura.css";
import Header from "./Header";

export default function CrearFactura(){
  // Estado para manejar los valores del formulario
  const [dataMunicipios, setDataMunicipios] = useState([]);
  const [dataRangos, setDataRangos] = useState([]);
  const [dataUnidades, setDataUnidades] = useState([]);
  const [dataTributos, setDataTributos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  const url_api= import.meta.env.VITE_url_api;
  const access_token = localStorage.getItem("access_token");
  const [form, setForm] = useState({
    numbering_range_id: "",
    reference_code: "",
    observation: "",
    payment_form: "",
    payment_due_date: "",
    payment_method_code: "",
    fechaInicioFacturacion: "",
    fechaFinFacturacion: "",

    customer: {
      identification: "",
      dv: "",
      company: "",
      trade_name: "",
      names: "",
      address: "",
      email: "",
      phone: "",
      legal_organization_id: "",
      tribute_id: "",
      identification_document_id: "",
      municipality_id: "",
    },

    items: [
      {
        code_reference: "",
        name: "",
        quantity: "",
        discount: "",
        discount_rate: "",
        price: "",
        tax_rate: "",
        unit_measure_id: "",
        standard_code_id: "",
        is_excluded: "",
        tribute_id: "",
        withholding_taxes: [],
      },
    ],
  });

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    const { parentKey, index } = dataset; // Extraer `index` para arrays como `items`
  
    setForm((prevForm) => {
      if (parentKey) {
        if (index !== undefined) {
          // Si el cambio está dentro de un array
          const updatedArray = [...prevForm[parentKey]]; // Clonar el array
          updatedArray[index] = {
            ...updatedArray[index], // Clonar el objeto dentro del array
            [name]: value, // Actualizar la propiedad específica
          };
          return {
            ...prevForm,
            [parentKey]: updatedArray, // Reemplazar el array actualizado
          };
        }
  
        // Si es un objeto anidado como `customer`
        return {
          ...prevForm,
          [parentKey]: {
            ...prevForm[parentKey],
            [name]: value,
          },
        };
      }
  
      // Si no es un input anidado
      return {
        ...prevForm,
        [name]: value,
      };
    });
  };  

  const addItem = () => {
    setForm((prevForm) => ({
      ...prevForm,
      items: [
        ...prevForm.items,
        {
          code_reference: "",
          name: "",
          quantity: "",
          discount: "",
          discount_rate: "",
          price: "",
          tax_rate: "",
          unit_measure_id: "",
          standard_code_id: "",
          is_excluded: "",
          tribute_id: "",
          withholding_taxes: [],
        },
      ],
    }));
  };
  
  const removeItem = (indexToRemove) => {
    setForm((prevForm) => ({
      ...prevForm,
      items: prevForm.items.filter((_, index) => index !== indexToRemove),
    }));
  };

  const paymentForms = {
    "1": "Pago de contado",
    "2": "Pago a crédito"
  };
  
  // Mapeo de opciones de método de pago
  const paymentMethods = {
    "10": "Efectivo",
    "42": "Consignación",
    "20": "Cheque",
    "47": "Transferencia",
    "71": "Bonos",
    "72": "Vales",
    "1": "Medio de pago no definido",
    "49": "Tarjeta Débito",
    "48": "Tarjeta Crédito"
  };

  const calcularResumen = () => {
    const cantidadItems = form.items.reduce((total, item) => total + Number(item.quantity || 0), 0);
    const subtotal = form.items.reduce((total, item) => total + Number(item.quantity || 0) * Number(item.price || 0), 0);
    const iva = form.items.reduce((total, item) => total + (Number(item.quantity || 0) * Number(item.price || 0)) * (Number(item.tax_rate || 0) / 100), 0);
    const total = subtotal + iva;
  
    return { cantidadItems, subtotal, iva, total };
  };
  
  const { cantidadItems, subtotal, iva, total } = calcularResumen();
  
  

  // Enviar datos al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${url_api}/v1/bills/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`,
          "Accept": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Factura generada exitosamente");
        setShowModal(false);
        console.log(data);
      } else {
        alert("Error al generar la factura");
      }
    } catch (error) {
      console.error("Error al enviar la factura:", error);
    }
  };


  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const response = await fetch(`${url_api}/v1/municipalities`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`,
            "Accept": "application/json",
        },
        });
        if (response.ok) {
          const {data} = await response.json();
          setDataMunicipios(data); // Guarda los datos en el estado
        } else {
          console.error("Error al obtener los municipios");
        }
      } catch (error) {
        console.error("Error en la solicitud de municipios:", error);
      }
    };
  
    const rangos = async (req, res) => {
        try {
          if (!access_token) {
            return res.status(401).json({ error: "No hay un token de acceso" });
          }
            const response = await fetch(`${url_api}/v1/numbering-ranges`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                    "Accept": "application/json",
                },
            });
            if (response.ok) {
              const { data } = await response.json();
                setDataRangos(data);
            } else {
                const errorResponse = await response.text();
                res.status(response.status).json({ error: errorResponse });
            }
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    };
  
    const fetchUnidades = async () => {
      try {
        if (!access_token) {
          return res.status(401).json({ error: "No hay un token de acceso" });
        }
        const response = await fetch(`${url_api}/v1/measurement-units`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`,
            "Accept": "application/json",
        },
        });
        if (response.ok) {
          const {data} = await response.json();
          setDataUnidades(data); // Guarda los datos en el estado
        } else {
          console.error("Error al obtener las unidades");
        }
      } catch (error) {
        console.error("Error en la solicitud de unidades:", error);
      }
    };
  
    const fetchTributos = async () => {
      try {
        if (!access_token) {
          return res.status(401).json({ error: "No hay un token de acceso" });
        }
        const response = await fetch(`${url_api}/v1/tributes/products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`,
            "Accept": "application/json",
        },
        });
        if (response.ok) {
          const {data} = await response.json();
          setDataTributos(data); // Guarda los datos en el estado
        } else {
          console.error("Error al obtener los tributos");
        }
      } catch (error) {
        console.error("Error en la solicitud de tributos:", error);
      }
    };
  
    //Llamadas a las funciones
    fetchMunicipios();
    rangos();
    fetchUnidades();
    fetchTributos();
  }, []);

  return (
    <>
    <Header/>
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Generar Factura Electrónica</h2>
      <div>
        {/* Información Factura */}
      <div className="section">
        <h3>Información Factura</h3>
        <div className="section-grid">
          <div className="form-group">
            <label>Rango de Numeración*</label>
            <select name="numbering_range_id" value={form.numbering_range_id} onChange={handleChange}>
                <option value="">Seleccione</option>
              {dataRangos.map((rango) => (
                <option key={rango.id} value={rango.id}>{rango.document}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Código de Referencia*</label>
            <input type="text" name="reference_code" value={form.reference_code} onChange={handleChange} required
            />
          </div>

          <div className="form-group">
            <label>Observación</label>
            <input type="text" name="observation" value={form.observation} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Forma de Pago</label>
            <select name="payment_form" value={form.payment_form} onChange={handleChange}>
              <option value="">Seleccione</option>
              <option value="1">Pago de contado</option>
              <option value="2">Pago a crédito</option>
            </select>
          </div>

          {form.payment_form === "2" && (
          <div className="form-group">
            <label>Fecha de Vencimiento</label>
            <input type="date" name="payment_due_date" value={form.payment_due_date} onChange={handleChange} />
          </div>
          )}

          <div className="form-group">
            <label>Metodo de Pago</label>
            <select name="payment_method_code" value={form.payment_method_code} onChange={handleChange}>
              <option value="">Seleccione</option>
              <option value="10">Efectivo</option>
              <option value="42">Consignacion</option>
              <option value="20">Cheque</option>
              <option value="47">Tranferencia</option>
              <option value="71">Bonos</option>
              <option value="72">Vales</option>
              <option value="1">Medio de pago no definido</option>
              <option value="49">Tarjeta Debito</option>
              <option value="48">Tarjeta Crédito</option>
            </select>
          </div>
        </div>
      </div>

      {/* Información Cliente */}
      <div className="section">
        <h3>Información Cliente</h3>
        <div className="section-grid">
          <div className="form-group">
            <label>Tipo de Documento*</label>
            <select name="identification_document_id" data-parent-key="customer" value={form.customer.identification_document_id} onChange={handleChange}>
              <option value="">Seleccione</option>
              <option value="1">Registro Civil</option>
              <option value="2">Tarjeta de identidad</option>
              <option value="3">Cedula de Ciudadania</option>
              <option value="4">Tarjeta de extranjería</option>
              <option value="5">Cédula de extranjería</option>
              <option value="6">NIT</option>
              <option value="7">Pasaporte</option>
              <option value="8">Documento de identificación extranjero</option>
              <option value="9">PEP</option>
              <option value="10">NIT otro país</option>
              <option value="11">NUIP*</option>
            </select>
          </div>

          <div className="form-group">
            <label>Identificación del Cliente*</label>
            <input type="number" name="identification" data-parent-key="customer" value={form.customer.identification} onChange={handleChange} required />
          </div>
          
          {form.customer.identification_document_id === "6" && (
          <div className="form-group">
            <label>Digíto de verificación del cliente</label>
            <input type="number" name="dv" data-parent-key="customer" value={form.customer.dv} onChange={handleChange} required />
          </div>
          )}

          <div className="form-group">
            <label>Tipo de Organizacion</label>
            <select name="legal_organization_id" data-parent-key="customer" value={form.customer.legal_organization_id} onChange={handleChange}>
              <option value="">Seleccione</option>
              <option value="1">Persona Jurídica</option>
              <option value="2">Persona Natural</option>
            </select>
          </div>

          {form.customer.legal_organization_id === "1" && (
            <div className="form-group">
              <label>Razon Social</label>
              <input type="text" name="company" data-parent-key="customer" value={form.customer.company} onChange={handleChange} required />
            </div>
          )}
          {form.customer.legal_organization_id === "1" && (
            <div className="form-group">
                <label>Nombre Comercial</label>
                <input type="text" name="trade_name" data-parent-key="customer" value={form.customer.trade_name} onChange={handleChange} required />
            </div>
          )}

          {form.customer.legal_organization_id === "2" && (
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" name="names" data-parent-key="customer" value={form.customer.names} onChange={handleChange} required />
          </div>
          )}

          <div className="form-group">
            <label>Direccion</label>
            <input type="text" name="address" data-parent-key="customer" value={form.customer.address} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Correo</label>
            <input type="text" name="email" data-parent-key="customer" value={form.customer.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Telefono</label>
            <input type="number" name="phone" data-parent-key="customer" value={form.customer.phone} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Tributo de Cliente</label>
            <select name="tribute_id" data-parent-key="customer" value={form.customer.tribute_id} onChange={handleChange}>
              <option value="">Seleccione</option>
              <option value="18">IVA</option>
              <option value="21">No Aplica</option>
            </select>
          </div>

          <div className="form-group">
            <label>Municipio</label>
            <select name="municipality_id" data-parent-key="customer" value={form.customer.municipality_id} onChange={handleChange}>
              <option value="">Seleccione</option>
            {dataMunicipios.map((municipio) => (
              <option key={municipio.id} value={municipio.id}>{municipio.name} - {municipio.department}</option>
            ))}
            </select>
          </div>

        </div>
      </div>

      {/* Información Producto */}
      <div className="section">
        <h3>Productos</h3>
        {form.items.map((item, index) => (
        <div key={index} className="section-grid">
          <div className="form-group">
            <label>Codigo del producto</label>
            <input type="number" name="code_reference" data-parent-key="items" data-index={index} value={item.code_reference} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Nombre del Producto</label>
            <input type="text" name="name" data-parent-key="items" data-index={index} value={item.name} onChange={handleChange} required/>
          </div>

          <div className="form-group">
            <label>Cantidad</label>
            <input type="number" name="quantity" data-parent-key="items" data-index={index} value={item.quantity} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Precio</label>
            <input type="number" name="price" data-parent-key="items" data-index={index} value={item.price} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>% de Descuento</label>
            <input type="number" name="discount_rate" data-parent-key="items" data-index={index} value={item.discount_rate} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label>¿Excluido del IVA?</label>
            <select name="is_excluded" data-parent-key="items" data-index={index} value={item.is_excluded} onChange={handleChange}>
              <option value="">Seleccione</option>
              <option value="1">Si</option>
              <option value="0">No</option>
            </select>
          </div>

          {item.is_excluded === "0" && (
          <div className="form-group">
            <label>IVA</label>
            <input type="number" name="tax_rate" data-parent-key="items" data-index={index} value={item.tax_rate} onChange={handleChange} />
          </div>
          )}

          <div className="form-group">
            <label>Codigo de Estándar</label>
            <select name="standard_code_id" data-parent-key="items" data-index={index} value={item.standard_code_id} onChange={handleChange}>
              <option value="">Seleccione</option>
              <option value="1">Estándar de adopción del Contribuyente</option>
              <option value="2">UNSPSC</option>
              <option value="3">Partida Arancelaria</option>
              <option value="4">GTIN</option>
            </select>
          </div>

          <div className="form-group">
            <label>Identificacion del Producto</label>
            <select name="unit_measure_id" data-parent-key="items" data-index={index} value={item.unit_measure_id} onChange={handleChange}>
              <option value="">Seleccione</option>
            {dataUnidades.map((unidad) => (
              <option key={unidad.id} value={unidad.id}>{unidad.name}</option>
            ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tributo del Producto</label>
            <select name="tribute_id" data-parent-key="items" data-index={index} value={item.tribute_id} onChange={handleChange}>
              <option value="">Seleccione</option>
            {dataTributos.map((tributo) => (
              <option key={tributo.id} value={tributo.id}>{tributo.name}</option>
            ))}
            </select>
          </div>
          
          <button type="button" className="buttonEliminar" onClick={() => removeItem(index)}>
            Eliminar Producto
          </button>
        </div>
      ))}
      <div className="button-group">
        <button type="button" className="buttonAgregar" onClick={addItem}>Agregar Producto</button>
        <button type="button" className="submit-button" onClick={toggleModal}>Generar Factura</button>
      </div>
      </div>
      </div>
      
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Resumen de Factura</h3>

            <div className="details-section">
              <h4>Resumen de Productos</h4>
              <p>Cantidad de ítems: <span>{cantidadItems}</span></p>
            </div>

            <div className="details-section">
              <h4>Totales</h4>
              <p>Subtotal: <span>${subtotal.toFixed(2)}</span></p>
              <p>IVA: <span>${iva.toFixed(2)}</span></p>
              <p>Total: <span>${total.toFixed(2)}</span></p>
            </div>

            <div className="details-section">
              <h4>Estado del Pago</h4>
              <p>Método: <span>{paymentMethods[form.payment_method_code] || "No definido"}</span></p>
              <p>Forma: <span>{paymentForms[form.payment_form] || "No definida"}</span></p>
            </div>

            <div className="details-section">
              <h4>Cliente</h4>
              <p>{form.customer?.names || "Sin cliente"}</p>
            </div>

            <div className="modal-buttons">
              <button onClick={toggleModal}>Cerrar</button>
              <button onClick={handleSubmit} className="send-button">Enviar Factura</button>
            </div>
          </div>
        </div>
      )}

      
    </form>
    </>
  );
};
