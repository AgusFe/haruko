
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(cors());

app.use(express.json());

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

const preference = new Preference(client);

app.get('/api/estado', (req, res) => {
    res.json({
        mensaje: 'Servidor de HARUKO funcionando correctamente'
    });
});

// CREAR PAGO CON LOS PRODUCTOS REALES DE HARUKO
app.post('/api/crear-pago', async (req, res) => {
    try {
        const { productos: productosCarrito } = req.body;

        const catalogo = {
            "1": {
                nombre: "Ballon pants con pinza",
                precio: 60000
            },
            "2": {
                nombre: "Top con manguitas",
                precio: 23000
            },
            "3": {
                nombre: "Pollera tableada",
                precio: 50000
            },
            "4": {
                nombre: "Crop camisa",
                precio: 31000
            }
        };

        if (!Array.isArray(productosCarrito) || productosCarrito.length === 0) {
            return res.status(400).json({
                error: "El carrito está vacío."
            });
        }

        const items = productosCarrito.map(prenda => {
            const producto = catalogo[String(prenda.id)];
            const cantidad = Number(prenda.cantidad);

            if (!producto || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > 10) {
                throw new Error("Producto o cantidad no válidos.");
            }

            return {
                title: producto.nombre,
                quantity: cantidad,
                unit_price: producto.precio,
                currency_id: "ARS"
            };
        });

        const respuesta = await preference.create({
            body: { items }
        });

        res.json({
            id: respuesta.id,
            link: respuesta.init_point
        });

    } catch (error) {
        console.error("Error al crear el pago:", error);

        res.status(400).json({
            error: "No se pudo crear el pago."
        });
    }
});
// INICIAR SERVIDOR HARUKO
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor HARUKO activo en http://localhost:${PORT}`);
});