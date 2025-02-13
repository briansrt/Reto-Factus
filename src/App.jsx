import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'; 
import { useState } from 'react';
import Login from './components/login';
import Dashboard from './components/Dashboard';
import CrearFactura from './components/CrearFactura';
import VerFactura from './components/VerFactura';
import DetallesFactura from './components/DetallesFactura';


function App() {
  const [user, setUser] = useState(null);
  return (  
    <BrowserRouter>
      {/* <Navigation/> */}
      <Routes>
        <Route index element={<Login callback={setUser}/>}></Route>
        <Route path="/Dashboard" element={<Dashboard/>}></Route>
        <Route path="/crearFactura" element={<CrearFactura/>}></Route>
        <Route path="/verFactura" element={<VerFactura/>}></Route>
        <Route path="/detalles/:number" element={<DetallesFactura/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
