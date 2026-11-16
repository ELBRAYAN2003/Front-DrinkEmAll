import { Link, NavLink, Outlet } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'

const ROL = { admin: 'Administrador', vendedor: 'Vendedor' }

const SECCIONES = [
  { a: '/panel', fin: true, texto: 'Pedidos' },
  { a: '/panel/preparar', texto: 'Qué preparar' },
  { a: '/panel/productos', texto: 'Productos' },
  { a: '/panel/arrepentimientos', texto: 'Arrepentimientos' },
]

// Marco del panel del comercio: barra propia, sin la cabecera ni el pie de la tienda.
export default function PanelLayout() {
  const { usuario, rol } = useAuth()
  return (
    <div className="panel">
      <header className="panel-barra">
        <div className="panel-barra-inner">
          <Link to="/panel" className="panel-marca">
            DrinkEm<em>All</em> <span>Panel del local</span>
          </Link>
          <nav className="panel-nav" aria-label="Secciones del panel">
            {SECCIONES.map((s) => (
              <NavLink key={s.a} to={s.a} end={s.fin} className={({ isActive }) => (isActive ? 'is-activa' : undefined)}>
                {s.texto}
              </NavLink>
            ))}
          </nav>
          <div className="panel-usuario">
            <span>
              {usuario?.name} <small>{ROL[rol] ?? rol}</small>
            </span>
            <Link to="/">Ver la tienda</Link>
            <Link to="/salir" state={{ destino: '/ingresar' }}>
              Salir
            </Link>
          </div>
        </div>
      </header>
      <main className="panel-contenido">
        <Outlet />
      </main>
    </div>
  )
}
