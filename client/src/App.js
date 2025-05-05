import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from 'react-hot-toast';
import './style.css';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargo, setCargo] = useState(""); // Nuevo estado para cargo
  const [editando, setEditando] = useState(null);
  const [currentData, setCurrentData] = useState({
    nombre: '',
    email: '',
    password: '',
    cargo: '' // Incluido en currentData
  });

  // GET Usuarios
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = () => {
    axios.get("http://localhost:5000/usuarios")
      .then((res) => {
        setUsuarios(res.data);
      })
      .catch(() => {
        toast.error("Error al cargar usuarios");
      });
  };

  // Validación de campos (actualizada con cargo)
  const validarCampos = () => {
    const datos = editando ? currentData : { nombre, email, password, cargo };
    
    if (!datos.nombre?.trim() || !datos.email?.trim() || 
        !datos.password?.trim() || !datos.cargo?.trim()) { // Validación de cargo
      toast.error("Todos los campos son obligatorios", {
        position: "top-center",
        style: {
          background: '#ff6b6b',
          color: '#fff',
          padding: '16px'
        }
      });
      return false;
    }
    return true;
  };

  // POST Crear usuario (actualizado con cargo)
  const crearUsuario = () => {
    if (!validarCampos()) return;

    const toastId = toast.loading("Creando usuario...");
    
    axios.post("http://localhost:5000/usuarios", { nombre, email, password, cargo })
      .then(() => {
        toast.success("Usuario creado exitosamente!", { id: toastId });
        fetchUsuarios();
        setNombre("");
        setEmail("");
        setPassword("");
        setCargo(""); // Resetear campo cargo
      })
      .catch(() => {
        toast.error("Error al crear usuario", { id: toastId });
      });
  };

  // DELETE Eliminar usuario (sin cambios)
  const eliminarUsuario = (id) => {
    toast.promise(
      axios.delete(`http://localhost:5000/usuarios/${id}`),
      {
        loading: 'Eliminando usuario...',
        success: () => {
          fetchUsuarios();
          return 'Usuario eliminado';
        },
        error: 'Error al eliminar usuario'
      },
      {
        position: "bottom-right"
      }
    );
  };

  // PUT Actualizar usuario (ya usa currentData que incluye cargo)
  const actualizarUsuario = () => {
    if (!validarCampos()) return;

    const toastId = toast.loading("Actualizando usuario...");
    
    axios.put(`http://localhost:5000/usuarios/${editando}`, currentData)
      .then(() => {
        toast.success("Usuario actualizado!", { id: toastId });
        setEditando(null);
        fetchUsuarios();
      })
      .catch(() => {
        toast.error("Error al actualizar usuario", { id: toastId });
      });
  };

  // Entrar en modo edición (actualizada con cargo)
  const iniciarEdicion = (usuario) => {
    setEditando(usuario.id);
    setCurrentData({
      nombre: usuario.nombre,
      email: usuario.email,
      password: usuario.password,
      cargo: usuario.cargo // Incluido aquí
    });
  };

  // Cancelar edición (sin cambios)
  const cancelarEdicion = () => {
    setEditando(null);
    toast("Edición cancelada", {
      icon: '⚠️',
      position: "top-center"
    });
  };

  return (
    <div className="container">
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'hot-toast',
          success: {
            className: 'hot-toast-success',
            duration: 4000
          },
          error: {
            className: 'hot-toast-error',
            duration: 5000
          }
        }}
      />
      
      <h1><i className="fas fa-users-cog"></i>Usuarios</h1>
      
      {/* Formulario para Crear/Editar */}
      <div className="form-container">
        <div className="input-group">
          {/* Campo Nombre con icono */}
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input 
              placeholder="Nombre" 
              value={editando ? currentData.nombre : nombre}
              onChange={(e) => 
                editando 
                  ? setCurrentData({...currentData, nombre: e.target.value}) 
                  : setNombre(e.target.value)
              } 
            />
          </div>
          
          
          <div className="input-field">
            <i className="fas fa-envelope"></i>
            <input 
              placeholder="Email" 
              value={editando ? currentData.email : email}
              onChange={(e) => 
                editando 
                  ? setCurrentData({...currentData, email: e.target.value}) 
                  : setEmail(e.target.value)
              } 
            />
          </div>
          {/* Campo Cargo con icono */}
          <div className="input-field">
            <i className="fas fa-briefcase"></i>
            <input
              placeholder="Cargo"
              value={editando ? currentData.cargo : cargo}
              onChange={(e) =>
                editando
                  ? setCurrentData({...currentData, cargo: e.target.value})
                  : setCargo(e.target.value)
              }
            />
          </div>
          
          {/* Campo Password con icono */}
          <div className="input-field">
            <i className="fas fa-lock"></i>
            <input 
              placeholder="Password" 
              type="password" 
              value={editando ? currentData.password : password}
              onChange={(e) => 
                editando 
                  ? setCurrentData({...currentData, password: e.target.value}) 
                  : setPassword(e.target.value)
              } 
            />
          </div>
          
          
        </div>
  
        {editando ? (
          <div className="button-group">
            <button className="btn-success" onClick={actualizarUsuario}>
              <i className="fas fa-save"></i> Guardar Cambios
            </button>
            <button className="btn-secondary" onClick={cancelarEdicion}>
              <i className="fas fa-times"></i> Cancelar
            </button>
          </div>
        ) : (
          <button className="btn-primary" onClick={crearUsuario}>
            <i className="fas fa-user-plus"></i> Crear Usuario
          </button>
        )}
      </div>
  
      {/* Lista de Usuarios con iconos */}
      <ul className="user-list">
        {usuarios.map((usuario) => (
          <li 
            key={usuario.id} 
            className={editando === usuario.id ? "user-item editing" : "user-item"}
          >
            <div className="user-info">
              <i className="fas fa-user-circle"></i>
              <div>
                <h3>{usuario.nombre}</h3>
                <p>{usuario.email} - {usuario.cargo}</p>
              </div>
            </div>
            <div className="user-actions">
              <button 
                className="btn-success" 
                onClick={() => iniciarEdicion(usuario)}
              >
                <i className="fas fa-edit"></i> Editar
              </button>
              <button 
                className="btn-danger" 
                onClick={() => eliminarUsuario(usuario.id)}
              >
                <i className="fas fa-trash-alt"></i> Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

}

export default App;