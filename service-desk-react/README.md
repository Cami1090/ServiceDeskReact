# ServiceDesk

Sistema de gestión de solicitudes de soporte: registro, asignación, seguimiento y cierre de tickets, con acceso mediante Google y vistas según el rol de cada usuario.

- Enlace público: https://service-desk-react.vercel.app
- Repositorio: https://github.com/Cami1090/ServiceDeskReact (el proyecto está en la carpeta `service-desk-react`)

## Tecnologías

React 19, Vite, React Router 7, Supabase (Auth con Google y base de datos con RLS), React Bootstrap y CSS Modules.

## Inicio local

```bash
cd service-desk-react
npm install
npm run dev
```

La aplicación abre en `http://localhost:5173`.

## Variables públicas

Crear un archivo `.env.local` en `service-desk-react` con la plantilla de `.env.example`:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu-clave-publica
```

Solo se usan claves públicas. `.env.local` no se sube al repositorio.

En Supabase, en Authentication → URL Configuration, agregar a las redirecciones permitidas:

- `http://localhost:5173/acceso`
- `https://service-desk-react.vercel.app/acceso`

## Rutas principales

| Ruta | Acceso |
| --- | --- |
| `/` | Público |
| `/acceso` | Público |
| `/seguimiento` | Sesión |
| `/seguimiento/:id` | Sesión |
| `/registro` | Usuario y administrador |
| `/asignacion`, `/tecnico` | Técnico y administrador |
| `/admin` | Administrador |
| Otras direcciones | Página no encontrada |

Las rutas privadas esperan a que se resuelvan la sesión y el perfil antes de decidir. El control de rutas pertenece a la interfaz; los permisos sobre los datos los aplican las políticas RLS de Supabase.

## Sesión

`AuthProvider` escucha la sesión real de Supabase y la comparte con Context. La sesión tiene tres estados: comprobando, sin sesión y con sesión. El menú, el acceso y las rutas privadas leen el mismo valor.

## Avances complementarios

- CSS Module: `src/components/Marco.module.css` (menú de navegación).
- Componente visual: alerta de React Bootstrap en el detalle (`AvisoError`).
- Preferencia persistente: menú compacto guardado en `localStorage`.
- Localización: fechas con `Intl` y región `es-CO`.
- Prueba unitaria: validación del identificador de una solicitud.

## Pruebas

```bash
npm test
```

Ejecuta `src/lib/idSolicitud.test.js` con el ejecutor integrado de Node.js. Verifica la regla del identificador; no comprueba permisos de la API.

## Despliegue

El proyecto se publica en Vercel:

- Root Directory: `service-desk-react`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Variables: `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`

`vercel.json` devuelve `index.html` en las rutas internas para que funcionen la recarga y los enlaces directos.

## Repetir el recorrido

Usar cuentas de prueba y registros ficticios, sin datos reales.

1. Abrir `/seguimiento/<id>` sin sesión: redirige a `/acceso`.
2. Entrar con Google: llega a `/seguimiento`.
3. Registrar una solicitud de prueba, abrir su detalle y recargar la página.
4. Agregar un avance y comprobar el historial.
5. Cerrar sesión desde el detalle: vuelve a `/acceso`.
6. Entrar con otra cuenta y comprobar que no ve datos que no le corresponden.

## Equipo

Juan Esteban Arias Marin y Camilo Forero. Desarrollo Web, EAM 2026-II.
