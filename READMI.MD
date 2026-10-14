# NovaTech Solutions


Página web corporativa de una empresa de tecnología ficticia. La hice como práctica de HTML, CSS y JavaScript, y también para probar el flujo de trabajo con Git y GitHub (ramas `develop` y `master`, commits, merges).

No usa frameworks ni base de datos. Es una página estática que funciona abriendo el `index.html`.

Las imágenes, los nombres del equipo y los testimonios son inventados.

## Qué tiene

- Una sola página con las secciones de inicio, nosotros, servicios, portafolio, equipo, testimonios, planes, preguntas frecuentes y contacto.
- Diseño adaptable a celular, con menú hamburguesa.
- Modo claro y oscuro. La elección se guarda en `localStorage`.
- Contadores que se animan al llegar a esa parte de la página.
- Portafolio con filtros por categoría y visor de imágenes ampliadas.
- Carrusel de testimonios que avanza solo.
- Planes con precios en soles y un interruptor mensual/anual (20 % de descuento en el anual).
- Preguntas frecuentes tipo acordeón.
- Formulario de contacto con validación. No envía nada, solo simula el envío.
- Si falta alguna imagen, se muestra un placeholder con el nombre del archivo esperado.

## Estructura

```
Pagina2026/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── img/
    ├── hero.jpg
    ├── nosotros.jpg
    ├── servicios/
    ├── portafolio/
    └── equipo/
```

## Cómo probarlo

Clonar el repositorio y abrir `index.html` en el navegador:

```bash
git clone https://github.com/TU-USUARIO/Pagina2026.git
cd Pagina2026
```

No hace falta instalar nada. Si se prefiere, se puede usar Live Server o Live Preview desde el editor.

## Imágenes

Las fotos no están incluidas en el repositorio. Para agregarlas basta con guardarlas en `img/` con el nombre que espera el HTML, por ejemplo `img/hero.jpg` o `img/servicios/cloud.jpg`. Mientras no existan, el script `main.js` pone un placeholder en su lugar.

Si se usa otro nombre o formato, hay que cambiar el `src` y el `data-label` de esa imagen en `index.html`.

## Ramas

- `master`: versión estable.
- `develop`: donde se hacen y prueban los cambios antes de pasarlos a `master`.

## Pendiente

- Cotizador de servicios en soles
- Botón de WhatsApp
- Mapa en la sección de contacto
- Publicar en GitHub Pages

## Autor

Tu nombre - [@tu-usuario](https://github.com/tu-usuario)