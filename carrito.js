
/* =====================================
   HARUKO - BOLSA DE COMPRA
===================================== */

const CLAVE_BOLSA = "harukoCarrito";

// Para probar esta funcionalidad coloque su numero de telefono.
// Código de país + número, sin +, 0, espacios ni guiones.
const WHATSAPP_HARUKO = "0000000000000";

const fotosProductos = {
    "1": {
        principal: "fotos-hko/COOL.jpg",
        colores: {
            "Negro": "fotos-hko/cool.negro.jpg",
            "Gris": "fotos-hko/cool.gris.jpg",
            "Crudo": "fotos-hko/cool.crudo.jpg"
        }
    },

    "2": {
        principal: "fotos-hko/blusita.jpg",
        colores: {
            "Azul": "fotos-hko/top-azul.jpg",
            "Amarillo": "fotos-hko/top-amarillo.jpg",
            "Verde": "fotos-hko/top-verde.jpg"
        }
    },

    "3": {
        principal: "fotos-hko/pollera.jpg",
        colores: {
            "Celeste": "fotos-hko/pollera-cel.jpg",
            "Crudo": "fotos-hko/pollera-crudo.jpg",
            "Negro": "fotos-hko/pollera-negra.jpg",
            "Jean": "fotos-hko/pollera-jean.jpg",
            "Rojo": "fotos-hko/pollera.jpg"
        }
    },

    "4": {
        principal: "camisita.jpg",
        colores: {
            "Denim": "fotos-hko/blusita-jean.jpg",
            "Lino": "fotos-hko/blusita-lino.jpg",
            "Satén": "fotos-hko/blusita-saten.jpg",
            "Broderie": "fotos-hko/camisita-brod.jpg",
            "Popelin": "fotos-hko/camisita.jpg"
        }
    }
};


// LEER LA BOLSA GUARDADA
function leerBolsa() {
    try {
        const datos = JSON.parse(
            localStorage.getItem(CLAVE_BOLSA) || "[]"
        );

        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        console.error("No se pudo leer la bolsa:", error);
        return [];
    }
}


// GUARDAR CAMBIOS
function guardarBolsa(bolsa) {
    try {
        localStorage.setItem(CLAVE_BOLSA, JSON.stringify(bolsa));
        return true;
    } catch (error) {
        console.error("No se pudo guardar la bolsa:", error);
        return false;
    }
}


// CONVERTIR EL PRECIO A NÚMERO
function obtenerPrecio(precio) {
    if (typeof precio === "number") {
        return Number.isFinite(precio) ? precio : 0;
    }

    const numero = Number(
        String(precio || "").replace(/[^\d]/g, "")
    );

    return Number.isFinite(numero) ? numero : 0;
}


// FORMATEAR PRECIOS EN PESOS ARGENTINOS
function formatoPrecio(precio) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    }).format(precio);
}


// BUSCAR LA FOTOGRAFÍA DEL PRODUCTO
function obtenerFoto(prenda) {
    // Las nuevas prendas pueden guardar su propia foto.
    if (prenda.foto) {
        return prenda.foto;
    }

    const datos = fotosProductos[String(prenda.id)];

    if (!datos) {
        return "";
    }

    return datos.colores?.[prenda.color] || datos.principal;
}


// EVITAR QUE LOS DATOS ROMPAN EL HTML
function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, function (caracter) {
        const reemplazos = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return reemplazos[caracter];
    });
}


// ACTUALIZAR TODA LA PÁGINA
function mostrarBolsa() {
    const bolsa = leerBolsa();

    const vacio = document.getElementById("carritoVacio");
    const contenido = document.getElementById("carritoContenido");
    const lista = document.getElementById("listaCarrito");

    vacio.classList.toggle("d-none", bolsa.length > 0);
    contenido.classList.toggle("d-none", bolsa.length === 0);

    if (bolsa.length === 0) {
        lista.innerHTML = "";
        document.getElementById("cantidadProductos").textContent = "0";
        document.getElementById("subtotalCarrito").textContent =
            formatoPrecio(0);
        return;
    }

    let subtotal = 0;
    let unidades = 0;

    lista.innerHTML = bolsa.map(function (prenda, indice) {
        const cantidad = Math.max(
            1,
            Math.min(10, Math.floor(Number(prenda.cantidad) || 1))
        );

        const precio = obtenerPrecio(prenda.precio);
        const totalPrenda = precio * cantidad;

        subtotal += totalPrenda;
        unidades += cantidad;

        const foto = escaparHTML(obtenerFoto(prenda));

        const fotoAlternativa = escaparHTML(
            fotosProductos[String(prenda.id)]?.principal || ""
        );

        return `
            <article class="item-carrito">
                <div class="item-carrito-foto">
                    ${
                        foto
                            ? `<img
                                src="${foto}"
                                data-fallback="${fotoAlternativa}"
                                alt="${escaparHTML(prenda.nombre)}"
                                class="imagen-carrito">`
                            : `<div class="foto-no-disponible">
                                HARUKO
                              </div>`
                    }
                </div>

                <div class="item-carrito-info">
                    <p class="item-categoria">HARUKO / COLECCIÓN</p>

                    <h3>${escaparHTML(prenda.nombre)}</h3>

                    <p>Color: ${escaparHTML(prenda.color)}</p>
                    <p>Talle: ${escaparHTML(prenda.talle)}</p>

                    <p class="precio-unitario">
                        ${formatoPrecio(precio)} por unidad
                    </p>

                    <div class="controles-cantidad">
                        <button
                            type="button"
                            data-accion="restar"
                            data-indice="${indice}"
                            aria-label="Restar una unidad">−</button>

                        <span>${cantidad}</span>

                        <button
                            type="button"
                            data-accion="sumar"
                            data-indice="${indice}"
                            aria-label="Sumar una unidad"
                            ${cantidad >= 10 ? "disabled" : ""}>+</button>
                    </div>

                    <button
                        type="button"
                        class="enlace-eliminar"
                        data-accion="eliminar"
                        data-indice="${indice}">
                        Eliminar
                    </button>
                </div>

                <div class="item-carrito-total">
                    ${formatoPrecio(totalPrenda)}
                </div>
            </article>
        `;
    }).join("");

    document.getElementById("cantidadProductos").textContent = unidades;
    document.getElementById("subtotalCarrito").textContent =
        formatoPrecio(subtotal);

    activarAlternativasDeImagen();
}


// SI UNA FOTO NO EXISTE, PROBAR LA FOTO PRINCIPAL
function activarAlternativasDeImagen() {
    document.querySelectorAll(".imagen-carrito").forEach(function (imagen) {
        imagen.onerror = function () {
            imagen.onerror = null;

            const alternativa = imagen.dataset.fallback;

            if (alternativa && imagen.src !== new URL(alternativa, document.baseURI).href) {
                imagen.src = alternativa;
            } else {
                imagen.alt = "Fotografía no disponible";
                imagen.classList.add("imagen-fallida");
            }
        };
    });
}


// CAMBIAR CANTIDAD O ELIMINAR PRENDAS
document.getElementById("listaCarrito").addEventListener(
    "click",
    function (evento) {
        const boton = evento.target.closest("button[data-accion]");

        if (!boton) return;

        const indice = Number(boton.dataset.indice);
        const accion = boton.dataset.accion;
        const bolsa = leerBolsa();

        if (!Number.isInteger(indice) || !bolsa[indice]) return;

        const prenda = bolsa[indice];
        const cantidadActual = Number(prenda.cantidad) || 1;

        if (accion === "sumar" && cantidadActual < 10) {
            prenda.cantidad = cantidadActual + 1;
        } else if (accion === "restar" && cantidadActual > 1) {
            prenda.cantidad = cantidadActual - 1;
        } else if (accion === "eliminar") {
            bolsa.splice(indice, 1);
        }

        if (!guardarBolsa(bolsa)) {
            mostrarMensajeCarrito("No se pudo guardar el cambio.");
            return;
        }

        // PAGAR CON MERCADO PAGO
document.getElementById("pagarMercadoPago").addEventListener(
    "click",
    async function () {

        const bolsa = leerBolsa();

        if (bolsa.length === 0) {
            mostrarMensajeCarrito("Tu bolsa está vacía.");
            return;
        }

        const boton = this;

        boton.disabled = true;
        boton.textContent = "CONECTANDO CON MERCADO PAGO...";

        try {
            const respuesta = await fetch(
                "http://localhost:3000/api/crear-pago",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        productos: bolsa
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok || !datos.link) {
                throw new Error(datos.error || "No se pudo crear el pago.");
            }

            window.location.href = datos.link;

        } catch (error) {
            console.error("Error al pagar:", error);

            mostrarMensajeCarrito(
                "No pudimos conectar con Mercado Pago. Intentá nuevamente."
            );

            boton.disabled = false;
            boton.textContent = "PAGAR CON MERCADO PAGO";
        }
    }
);
        mostrarBolsa();
    }
);


// VACIAR LA BOLSA
document.getElementById("vaciarCarrito").addEventListener("click", function () {
    if (!window.confirm("¿Querés eliminar todas las prendas de tu bolsa?")) {
        return;
    }

    if (guardarBolsa([])) {
        mostrarBolsa();
    }
});


// MOSTRAR MENSAJES
function mostrarMensajeCarrito(texto) {
    document.getElementById("mensajeCarrito").textContent = texto;
}


// PREPARAR PEDIDO POR WHATSAPP
document.getElementById("finalizarWhatsApp").addEventListener(
    "click",
    function () {
        const bolsa = leerBolsa();

        if (bolsa.length === 0) {
            mostrarMensajeCarrito("Tu bolsa está vacía.");
            return;
        }

        if (WHATSAPP_HARUKO.includes("X")) {
            mostrarMensajeCarrito(
                "Configurá el número de WhatsApp de HARUKO en carrito.js."
            );
            return;
        }

        let total = 0;

        const lineas = bolsa.map(function (prenda) {
            const cantidad = Number(prenda.cantidad) || 1;
            const precio = obtenerPrecio(prenda.precio);
            total += precio * cantidad;

            return (
                "- " + prenda.nombre + "\n" +
                "  Color: " + prenda.color + "\n" +
                "  Talle: " + prenda.talle + "\n" +
                "  Cantidad: " + cantidad + "\n" +
                "  Subtotal: " + formatoPrecio(precio * cantidad)
            );
        });

        const texto =
            "Hola, HARUKO. Quiero realizar este pedido:\n\n" +
            lineas.join("\n\n") +
            "\n\nSubtotal: " + formatoPrecio(total) +
            "\n¿Me confirman disponibilidad, envío y medios de pago?";

        const url = "https://wa.me/" + WHATSAPP_HARUKO +
            "?text=" + encodeURIComponent(texto);

        window.open(url, "_blank", "noopener,noreferrer");
    }
);


// MOSTRAR LA BOLSA AL CARGAR LA PÁGINA
mostrarBolsa();
