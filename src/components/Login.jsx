import './styles/login.css'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ callback }) {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const grant_type = "password";
  const url_api = import.meta.env.VITE_url_api;
  const client_id = import.meta.env.VITE_client_id;
  const client_secret = import.meta.env.VITE_client_secret;
  const goTo = useNavigate();
  
  const validateUser = async (event)=>{
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('grant_type', grant_type);
      formData.append('client_id', client_id);
      formData.append('client_secret', client_secret);
      formData.append('username', username);
      formData.append('password', password);
        const response = await fetch(`${url_api}/oauth/token`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formData,
        });
        
        if (response.ok) {
            const data = await response.json();
            const { access_token } = data;
            localStorage.setItem('access_token', access_token);
            goTo('/verFactura');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
};

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2 className="h2Login">¡Reto Factus!</h2>
        <form className="login-form" onSubmit={validateUser}>
          <div className="form-group">
            <label id='labellogin' htmlFor="email-address">Correo electrónico</label>        
            <input type="email" name="email" id="email" autoComplete="email" required placeholder="Correo electrónico" value={username} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label id='labellogin' htmlFor="password">Contraseña</label>
            <input type="password" name="password" id="password" autoComplete="current-password" required placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-button">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}