

/* =====================================
   HARUKO - PRODUCTOS Y FOTOGRAFIAS
===================================== */

// DATOS DE LOS PRODUCTOS
const productos = {
    "1": {
        nombre: "Ballon pants con pinza",
        categoria: "HARUKO / PANTALONES",
        precio: "$ 60.000",
        descripcion: "PANT CORTE BALLOON SASTRERO",

        foto: "fotos-hko/COOL.jpg",

        fotosPorColor: {
            "Negro": "fotos-hko/cool.negro.jpg",
            "Gris": "fotos-hko/cool.gris.jpg",
            "Crudo": "fotos-hko/cool.crudo.jpg"
        }
    },

    "2": {
        nombre: "Top con manguitas",
        categoria: "HARUKO / TOPS",
        precio: "$ 23.000",
        descripcion:
            "Top con manguitas hecho de popeline cuadrille, modelo fresco y divino",

        foto: "fotos-hko/top-rojo.jpg",

        fotosPorColor: {
            "Azul": "fotos-hko/top-azul.jpg",
            "Amarillo": "fotos-hko/top-amarillo.jpg",
            "Verde": "fotos-hko/top-verde.jpg",
            "Rojo": "fotos-hko/top-rojo.jpg"
            }
    },

    "3": {
        nombre: "Pollera tableada",
        categoria: "HARUKO / STREETWEAR",
        precio: "$ 50.000",
        descripcion: "Pollera versatil para usar sola o con un pantalon por debajo, varias opciones de colores y telas.",

        foto: "fotos-hko/pollera.jpg",
        fotosPorColor: {
            "Celeste": "fotos-hko/pollera-cel.jpg",
            "Crudo": "fotos-hko/pollera-crudo.jpg",
            "Negro": "fotos-hko/pollera-negra.jpg",
            "Jean": "fotos-hko/pollera-jean.jpg",
            "Rojo": "fotos-hko/pollera.jpg"
        }
    },

    "4": {
        nombre: "Crop camisa",
        categoria: "HARUKO / NEW COLLECTION",
        precio: "$ 31.000",
        descripcion: "Descubrí esta pieza de HARUKO.",

        foto: "fotos-hko/camisita.jpg",
        fotosPorColor: {
            "Denim": "fotos-hko/blusita-jean.jpg",
            "Lino": "fotos-hko/blusita-lino.jpg",
            "Satén": "fotos-hko/blusita-saten.jpg",
            "Broderie": "fotos-hko/camisita-brod.jpg",
            "Popelin": "fotos-hko/camisita.jpg"
        }
    }
};


// IDENTIFICAR EL PRODUCTO SELECCIONADO
const parametros = new URLSearchParams(window.location.search);
const idProducto = parametros.get("id") || "1";
const producto = productos[idProducto] || productos["1"];


// BUSCAR LOS ELEMENTOS DEL HTML
const imagen = document.getElementById("productoImagen");
const selectorColor = document.getElementById("color");


// MOSTRAR LA INFORMACION DEL PRODUCTO
document.title = producto.nombre + " | HARUKO";

document.getElementById("productoNombre").textContent =
    producto.nombre;

document.getElementById("productoCategoria").textContent =
    producto.categoria;

document.getElementById("productoPrecio").textContent =
    producto.precio;

document.getElementById("productoDescripcion").textContent =
    producto.descripcion;

document.getElementById("migaNombre").textContent =
    producto.nombre;


// CARGAR LOS COLORES CORRESPONDIENTES A CADA PRODUCTO
selectorColor.innerHTML = "";

const coloresDisponibles = Object.keys(producto.fotosPorColor);

const opcionInicial = document.createElement("option");
opcionInicial.value = "";

if (coloresDisponibles.length > 0) {
    opcionInicial.textContent = "Seleccioná un color";
} else {
    opcionInicial.textContent = "Colores próximamente";
}

selectorColor.appendChild(opcionInicial);

coloresDisponibles.forEach(function (nombreColor) {
    const opcion = document.createElement("option");

    opcion.value = nombreColor;
    opcion.textContent = nombreColor;

    selectorColor.appendChild(opcion);
});

// Deshabilitar el selector cuando todavía no cargamos variantes.
selectorColor.disabled = coloresDisponibles.length === 0;


// MOSTRAR Y CAMBIAR LAS FOTOGRAFIAS
imagen.alt = producto.nombre;

function mostrarFotografia(ruta) {
    imagen.onerror = function () {
        imagen.onerror = null;

        if (ruta !== producto.foto) {
            mostrarFotografia(producto.foto);
        } else {
            console.error("No se pudo cargar la foto:", ruta);
        }
    };

    imagen.src = ruta;
}

// Foto principal al abrir la ficha.
mostrarFotografia(producto.foto);

// Cambiar la foto cuando el cliente selecciona un color.
selectorColor.addEventListener("change", function () {
    const fotoElegida = producto.fotosPorColor[selectorColor.value];

    mostrarFotografia(fotoElegida || producto.foto);
});

/* =====================================
   HARUKO - AGREGAR PRODUCTOS A LA BOLSA
===================================== */

const botonAgregar = document.getElementById("agregarBolsa");
const selectorTalle = document.getElementById("talle");
const selectorCantidad = document.getElementById("cantidad");
const mensajeCompra = document.getElementById("mensajeCompra");

// Recuperar la bolsa guardada en el navegador.
function obtenerBolsa() {
    try {
        const datos = JSON.parse(
            localStorage.getItem("harukoCarrito") || "[]"
        );

        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        return [];
    }
}

// Guardar un mensaje en la ficha.
function mostrarMensaje(texto, esError = false) {
    if (!mensajeCompra) return;

    mensajeCompra.textContent = texto;
    mensajeCompra.style.color = esError ? "#B51F28" : "#174D38";
}

// Agregar la prenda seleccionada.
if (botonAgregar) {
    botonAgregar.addEventListener("click", function () {

        const talleElegido = selectorTalle?.value || "";
        const colorElegido = color.value;
        const cantidadElegida = Number(selectorCantidad?.value || 1);

        // Verificar las selecciones.
        if (!talleElegido) {
            mostrarMensaje("Seleccioná un talle.", true);
            return;
        }

        if (!colorElegido ||
            !producto.fotosPorColor?.[colorElegido]) {
            mostrarMensaje("Seleccioná un color disponible.", true);
            return;
        }

        if (!Number.isInteger(cantidadElegida) ||
            cantidadElegida < 1 ||
            cantidadElegida > 10) {
            mostrarMensaje("Elegí una cantidad entre 1 y 10.", true);
            return;
        }

        // Convertir el precio publicado a un número.
        const precioNumerico = Number(
            producto.precio.replace(/[^\d]/g, "")
        );

        if (!Number.isFinite(precioNumerico) ||
            precioNumerico <= 0) {
            mostrarMensaje(
                "Este producto todavía no tiene un precio válido.",
                true
            );
            return;
        }

        // Crear el producto elegido.
        const nuevaPrenda = {
            id: idProducto,
            nombre: producto.nombre,
            precio: precioNumerico,
            talle: talleElegido,
            color: colorElegido,
            cantidad: cantidadElegida
        };

        // Recuperar y actualizar la bolsa.
        const bolsa = obtenerBolsa();

        const existente = bolsa.find(function (prenda) {
            return prenda.id === nuevaPrenda.id &&
                prenda.talle === nuevaPrenda.talle &&
                prenda.color === nuevaPrenda.color;
        });

        if (existente) {
            if (existente.cantidad + cantidadElegida > 10) {
                mostrarMensaje(
                    "La cantidad máxima por variante es 10.",
                    true
                );
                return;
            }

            existente.cantidad += cantidadElegida;
        } else {
            bolsa.push(nuevaPrenda);
        }

        // Guardar los cambios.
        try {
            localStorage.setItem(
                "harukoCarrito",
                JSON.stringify(bolsa)
            );
        } catch (error) {
            mostrarMensaje(
                "No se pudo guardar la bolsa en este navegador.",
                true
            );
            return;
        }

        mostrarMensaje(
            "¡Prenda agregada a tu bolsa correctamente!"
        );
    });
}
