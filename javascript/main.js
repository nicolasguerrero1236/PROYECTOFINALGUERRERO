const CONFIG = {
    WHATSAPP_NUMBER: '543518697090',
    NEGOCIO: 'Bros Burger y Lomos'
};

class Carrito {
    constructor() {
        this.items = this.cargarDelStorage();
    }

    cargarDelStorage() {
        const datos = localStorage.getItem('carrito');
        return datos ? JSON.parse(datos) : [];
    }

    guardarEnStorage() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
        this.actualizarContador();
    }

    agregar(producto) {
        const itemExistente = this.items.find(item => item.id === producto.id);

        if (itemExistente) {
            itemExistente.cantidad += producto.cantidad || 1;
        } else {
            this.items.push({
                ...producto,
                cantidad: producto.cantidad || 1
            });
        }

        this.guardarEnStorage();
        return true;
    }

    actualizar(id, cantidad) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            if (cantidad <= 0) {
                this.eliminar(id);
            } else {
                item.cantidad = cantidad;
                this.guardarEnStorage();
            }
        }
    }

    eliminar(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.guardarEnStorage();
    }

    vaciar() {
        this.items = [];
        this.guardarEnStorage();
    }

    obtener() {
        return this.items;
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }

    actualizarContador() {
        const contadores = document.querySelectorAll('#contador-carrito');
        const total = this.getTotalItems();
        contadores.forEach(contador => {
            contador.textContent = total;
        });
    }
}

const carrito = new Carrito();

document.addEventListener('DOMContentLoaded', () => {
    carrito.actualizarContador();
});

function agregarAlCarrito(producto) {
    carrito.agregar(producto);
    mostrarAlerta('✓ Producto agregado al carrito', 'exito');
}

function mostrarAlerta(mensaje, tipo = 'info') {
    const alerta = document.createElement('div');
    alerta.className = `alerta alerta-${tipo}`;
    alerta.textContent = mensaje;
    
    const container = document.querySelector('main') || document.body;
    container.insertBefore(alerta, container.firstChild);

    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function generarMensajeWhatsApp(cliente) {
    let mensaje = `Hola, soy *${cliente.nombre}*\n\n`;
    mensaje += `📱 Teléfono: ${cliente.telefono}\n`;
    if (cliente.email) mensaje += `📧 Email: ${cliente.email}\n`;
    if (cliente.direccion) mensaje += `🏠 Dirección: ${cliente.direccion}\n`;
    mensaje += `🚚 Modalidad: ${cliente.delivery ? 'Delivery (+$500)' : 'Retiro en local'}\n`;
    if (cliente.notas) mensaje += `📝 Notas: ${cliente.notas}\n`;
    mensaje += `\n*PEDIDO:*\n`;
    mensaje += `${'='.repeat(40)}\n`;

    carrito.obtener().forEach((item, index) => {
        mensaje += `${index + 1}. ${item.nombre} x${item.cantidad}\n`;
        mensaje += `   Precio: $${(item.precio * item.cantidad).toFixed(2)}\n`;
    });

    mensaje += `${'='.repeat(40)}\n`;
    const subtotal = carrito.getTotal();
    const delivery = cliente.delivery ? 500 : 0;
    const total = subtotal + delivery;
    
    if (delivery > 0) {
        mensaje += `Subtotal: $${subtotal.toFixed(2)}\n`;
        mensaje += `Delivery: $${delivery.toFixed(2)}\n`;
        mensaje += `${'='.repeat(40)}\n`;
    }
    mensaje += `*TOTAL: $${total.toFixed(2)}*\n`;
    mensaje += `\n¡Gracias por tu pedido en ${CONFIG.NEGOCIO}!`;

    return encodeURIComponent(mensaje);
}

function enviarPorWhatsApp(cliente) {
    const mensaje = generarMensajeWhatsApp(cliente);
    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${mensaje}`;
    window.open(url, '_blank');
}

const hamburguesas = [
    {
        id: 'ham1',
        nombre: 'Hamburguesa Clásica Simple',
        descripcion: 'PAN DE PAPA,  MAYONESA CASERA MEDALLON DE CARNE DE 120GS,  QUESO CHEDDAR  Y PAPAS FRITAS',
        precio: 9000,
        emoji: '🍔'
    },
    {
        id: 'ham2',
        nombre: 'Hamburguesa Clasica Doble',
        descripcion: 'PAN DE PAPA, MAYONESA CASERA, DOS MEDALLONES DE CARNE DE 120GS, QUESO CHEDDAR Y PAPAS FRITAS',
        precio: 11500,
        emoji: '🍔'
    },
    {
        id: 'ham3',
        nombre: 'Hamburguesa Clasica Triple',
        descripcion: 'PAN DE PAPA, MAYONESA CASERA, TRES MEDALLONES DE CARNE DE 120GS, QUESO CHEDDAR Y PAPAS FRITAS',
        precio: 14000,
        emoji: '🍔'
    },
    {
        id: 'ham4',
        nombre: 'Hamburguesa Completa Simple',
        descripcion: 'PAN DE PAPA, MAYONESA CASERA, MEDALLON DE CARNE DE 120GS, LECHUGA, TOMATE, HUEVO, QUESO DAMBO, JAMON, CEBOLLA MORADA, PEPINILLO Y PAPAS FRITAS',
        precio: 13000,
        emoji: '🍔'
    },
    {
        id: 'ham5',
        nombre: 'Hamburguesa Completa Doble',
        descripcion: 'PAN DE PAPA, MAYONESA CASERA, DOS MEDALLONES DE CARNE DE 120GS, LECHUGA, TOMATE, HUEVO, QUESO DAMBO, JAMON, CEBOLLA MORADA, PEPINILLO Y PAPAS FRITAS',
        precio: 15500,
        emoji: '🍔',
        imagen: '../files/hamburguesa_completa_doble.png'
    },
    {
        id: 'ham6',
        nombre: 'Hamburguesa Completa Triple',
        descripcion: 'PAN DE PAPA, MAYONESA CASERA, TRES MEDALLONES DE CARNE DE 120GS, LECHUGA, TOMATE, HUEVO, QUESO DAMBO, JAMON, CEBOLLA MORADA, PEPINILLO Y PAPAS FRITAS',
        precio: 18000,
        emoji: '🍔',
        imagen: '../files/hamburguesa_completa_triple.png'
    },
    {
        id: 'ham7',
        nombre: 'Hamburguesa Cheese Simple',
        descripcion: 'PAN DE PAPA, SALSA TASTY, UN MEDALLON DE CARNE DE 120GS, CEBOLLA CARAMELIZADA, CHEDDAR , HUEVO Y PAPAS FRITAS',
        precio: 13000,
        emoji: '🍔',
        imagen: '../files/hamburguesa_cheese_simple.png'
    },
    {
        id: 'ham8',
        nombre: 'Hamburguesa Cheese Doble',
        descripcion: 'PAN DE PAPA, SALSA TASTY, DOS MEDALLONES DE CARNE DE 120GS, CEBOLLA CARAMELIZADA, CHEDDAR , HUEVO Y PAPAS FRITAS',
        precio: 15500,
        emoji: '🍔',
        imagen: '../files/hamburguesa_cheese_doble.png'
    },
    {
        id: 'ham9',
        nombre: 'Hamburguesa Cheese Triple',
        descripcion: 'PAN DE PAPA, SALSA TASTY, TRES MEDALLONES DE CARNE DE 120GS, CEBOLLA CARAMELIZADA, CHEDDAR , HUEVO Y PAPAS FRITAS',
        precio: 18000,
        emoji: '🍔',
        imagen: '../files/hamburguesa_cheese_triple.png'
    },
    {
        id: 'ham10',
        nombre: 'Hamburguesa Americana simple',
        descripcion: 'PAN DE PAPA, MAYONESA  CASERA, MEDALLON DE CARNE DE 120GS, CEBOLLA CARAMELIZADA, HUEVO, BACON , QUESO CHEDDAR, SALSA BBQ Y PAPAS FRITAS',
        precio: 14000,
        emoji: '🍔',
        imagen: '../files/hamburguesa_americana_simple.png'
    },
    {
        id: 'ham11',
        nombre: 'Hamburguesa Americana Doble',
        descripcion: 'PAN DE PAPA, MAYONESA  CASERA, DOS MEDALLONES DE CARNE DE 120GS, CEBOLLA CARAMELIZADA, HUEVO, BACON , QUESO CHEDDAR, SALSA BBQ Y PAPAS FRITAS',
        precio: 16500,
        emoji: '🍔',
        imagen: '../files/hamburguesa_americana_doble.png'
    },
    {
        id: 'ham12',
        nombre: 'Hamburguesa Americana Triple',
        descripcion: 'PAN DE PAPA, MAYONESA  CASERA, TRES MEDALLONES DE CARNE DE 120GS, CEBOLLA CARAMELIZADA, HUEVO, BACON , QUESO CHEDDAR, SALSA BBQ Y PAPAS FRITAS',
        precio: 19000,
        emoji: '🍔',
        imagen: '../files/hamburguesa_americana_triple.png'
    },
    {
        id: 'ham13',
        nombre: 'Hamburguesa Provo Simple',
        descripcion: 'PAN DE PAPA, MAYONESA CASERA, MEDALLON DE CARNE 120GS,  QUESO PROVOLETA, CEBOLLA CARAMELIZADA, CHIMICHURRI, HUEVO Y PAPAS FRITAS',
        precio: 13500,
        emoji: '🍔',
        imagen: '../files/hamburguesa_provo_simple.png'
    },
    {
        id: 'ham14',
        nombre: 'Hamburguesa Provo Doble',
        descripcion: 'PPAN DE PAPA, MAYONESA CASERA, DOS MEDALLONES DE CARNE 120GS,  QUESO PROVOLETA, CEBOLLA CARAMELIZADA, CHIMICHURRI, HUEVO Y PAPAS FRITAS',
        precio: 16000,
        emoji: '🍔',
        imagen: '../files/hamburguesa_provo_doble.png'
    },
    {
        id: 'ham15',
        nombre: 'Hamburguesa Provo Triple',
        descripcion: 'PAN DE PAPA, MAYONESA CASERA, TRES MEDALLON DE CARNE 120GS,  QUESO PROVOLETA, CEBOLLA CARAMELIZADA, CHIMICHURRI, HUEVO Y PAPAS FRITAS',
        precio: 18500,
        emoji: '🍔',
        imagen: '../files/hamburguesa_provo_triple.png'
    },
    {
        id: 'ham16',
        nombre: 'Hamburguesa Mex Simple',
        descripcion: 'PAN DE PAPA, MAYONESA CASERA, MEDALLON DE CARNE 120GS,  CEBOLLA SALTEADA, PIMIENTOS SALTEADOS ( ROJO, VERDE Y AMARILLO)  SALSA PICANTE, QUESO DAMBO Y PAPAS FRITAS',
        precio: 12000,
        emoji: '🍔',
        imagen: '../files/hamburguesa_mex_simple.png'
    },
    {
        id: 'ham17',
        nombre: 'Hamburguesa Mex Doble',
        descripcion: 'PAN DE PAPA, MAYONESA CASERA, DOS MEDALLONES DE CARNE 120GS,  CEBOLLA SALTEADA, PIMIENTOS SALTEADOS ( ROJO, VERDE Y AMARILLO)  SALSA PICANTE, QUESO DAMBO Y PAPAS FRITAS',
        precio: 14500,
        emoji: '🍔',
        imagen: '../files/hamburguesa_mex_doble.png'
    },
    {
        id: 'ham18',
        nombre: 'Hamburguesa Mex Triple',
        descripcion: 'PAN DE PAPA, MAYONESA CASERA, TRES MEDALLONES DE CARNE 120GS,  CEBOLLA SALTEADA, PIMIENTOS SALTEADOS ( ROJO, VERDE Y AMARILLO)  SALSA PICANTE, QUESO DAMBO Y PAPAS FRITAS',
        precio: 17000,
        emoji: '🍔',
        imagen: '../files/hamburguesa_mex_triple.png'
    },
    {
        id: 'ham19',
        nombre: 'Hamburguesa Blue Simple',
        descripcion: 'PAN DE PAPA, MEDALLON DE 120GS, MAYONESA CASERA, QUESO DAMBO, QUESO ROQUEFORT, LECHUGA, TOMATE, CEBOLLA MORADA, HUEVO, JAMON Y PAPAS FRITAS',
        precio: 14000,
        emoji: '🍔',
        imagen: '../files/hamburguesa_blue_simple.png'
    },
    {
        id: 'ham20',
        nombre: 'Hamburguesa Blue Doble',
        descripcion: 'PAN DE PAPA, DOS MEDALLONES DE 120GS, MAYONESA CASERA, QUESO DAMBO, QUESO ROQUEFORT, LECHUGA, TOMATE, CEBOLLA MORADA, HUEVO, JAMON Y PAPAS FRITAS',
        precio: 16500,
        emoji: '🍔',
        imagen: '../files/hamburguesa_blue_doble.png'
    },
    {
        id: 'ham21',
        nombre: 'Hamburguesa Blue Triple',
        descripcion: 'PAN DE PAPA, TRES MEDALLONES DE 120GS, MAYONESA CASERA, QUESO DAMBO, QUESO ROQUEFORT, LECHUGA, TOMATE, CEBOLLA MORADA, HUEVO, JAMON Y PAPAS FRITAS',
        precio: 19000,
        emoji: '🍔',
        imagen: '../files/hamburguesa_blue_triple.png'
    },
    {
        id: 'ham22',
        nombre: 'Burger Gula Bros',
        descripcion: 'PAN DE PAPA, MAYONESA BROS, CUATRO MEDALLONES DE CARNE DE 120 GS, CUATRO CHEDDAR, CEBOLLA SALTEADA, PIMIENTOS SALTEADOS ( ROJO, VERDE Y AMARILLO), DOBLE HUEVO, DOBLE JAMON Y PAPAS FRITAS',
        precio: 19000,
        emoji: '🍔',
        imagen: '../files/hamburguesa_gulabros.png'
    },
];

const lomos = [
    {
        id: 'lomo1',
        nombre: 'Lomo Completo',
        descripcion: 'PAN DE LOMO DE 20CM, MAYONESA CASERA, BIFE DE LOMO DE 120GS, LECHUGA, TOMATE, JAMON, QUESO, HUEVO Y PAPAS FRITAS',
        precio: 17000,
        emoji: '🥪'
    },
    {
        id: 'lomo2',
        nombre: 'Lomo Americano',
        descripcion: 'PAN DE LOMO DE 20CM, BIFE DE LOMO DE 120GS,  MAYONESA CASERA, CEBOLLA CARAMELIZADA, QUESO CHEDDAR, BACON, SALSA BBQ, HUEVO Y PAPAS FRITAS',
        precio: 19000,
        emoji: '🥪'
    },
    {
        id: 'lomo3',
        nombre: 'Lomo Azul',
        descripcion: 'PAN DE LOMO DE 20CM, BIFE DE LOMO DE 120GS, MAYONESA CASERA, LECHUGA, TOMATE, QUESO TYBO, QUESO AZUL, HUEVO, JAMON Y PAPAS FRITAS',
        precio: 19000,
        emoji: '🥪'
    },
    {
        id: 'lomo4',
        nombre: 'Lomo Mex',
        descripcion: 'PAN DE LOMO DE 20CM, MAYONESA CASERA, BIFE DE LOMO DE 120GS, PIMIENTOS SALTEADOS ( ROJO, VERDE, AMARILLO), SALSA PICANTE, CEBOLLA SALTEADA Y PAPAS FRITAS',
        precio: 19000,
        emoji: '🥪'
    },
    {
        id: 'lomo5',
        nombre: 'Lomo Vegetariano',
        descripcion: 'PAN DE LOMO DE 20CM, BERENJENA SALTEADA, CEBOLLA SALTEADA, PIMIENTOS SALTEADOS (ROJO, AMARILLO Y VERDE), LECHUGA, TOMATE, HUEVO, QUESO TYBO Y PAPAS FRITAS',
        precio: 14000,
        emoji: '🥪'
    },
    {
        id: 'bife-extra',
        nombre: 'Bife Extra',
        descripcion: 'Bife de lomo adicional de 120gs',
        precio: 4000,
        emoji: '🥩'
    },
];

const sandwiches = [
    {
        id: 'sand1',
        nombre: 'Hamburlomo',
        descripcion: 'PAN DE LOMO, MEDALLON DE 240GS, MAYONESA, CASERA, LECHUGA, TOMATE, JAMON, QUESO DAMBO, HUEVO, ACOMPAÑADO DE PAPAS FRITAS',
        precio: 12500,
        emoji: '🥖',
        imagen: '../files/hamburlomo.png'
    },
    {
        id: 'sand2',
        nombre: 'Sandwich de Milanesa',
        descripcion: 'PAN DE LOMO, MILANESA DE CARNE, MAYONESA CASERA, LECHUGA, TOMATE, JAMON, QUESO DAMBO, HUEVO Y PAPAS FRITAS',
        precio: 13000,
        emoji: '🥖'
    },
    {
        id: 'sand3',
        nombre: 'Tostado',
        descripcion: 'PAN DE LOMO, QUESO DAMBO, JAMON Y PAPAS FRITAS',
        precio: 8000,
        emoji: '🥖',
        imagen: '../files/tostado.png'
    },
];

const pizzas = [
    {
        id: 'pizza1',
        nombre: 'Pizza Mozzarella',
        descripcion: 'MASA CASERA, SALSA , MUZZARELLA, OREGANO Y ACEITUNAS',
        precio: 11000,
        emoji: '🍕',
        imagen: '../files/pizza_mozzarella.png'
    },
    {
        id: 'pizza2',
        nombre: '1/2 Pizza Mozzarella',
        descripcion: 'MASA CASERA, SALSA , MUZZARELLA, OREGANO Y ACEITUNAS',
        precio: 7000,
        emoji: '🍕',
        imagen: '../files/pizza_mozzarella.png'
    },
    {
        id: 'pizza3',
        nombre: 'Pizza mozzarella con huevo',
        descripcion: 'MASA CASERA, SALSA, MUZZARELLA, HUEVO RAYADO, OREGANO Y ACEITUNAS',
        precio: 13000,
        emoji: '🍕',
        imagen: '../files/pizza_mozzarella_con_huevo.png'
    },
    {
        id: 'pizza4',
        nombre: '1/2 Pizza mozzarella con huevo',
        descripcion: 'MASA CASERA, SALSA, MUZZARELLA, HUEVO RAYADO, OREGANO Y ACEITUNAS',
        precio: 8000,
        emoji: '🍕',
        imagen: '../files/pizza_mozzarella_con_huevo.png'
    },
    {
        id: 'pizza5',
        nombre: 'Pizza Especial',
        descripcion: 'MASA CASERA, SALSA, MUZZARELLA, JAMON, MORRON, OREGANO Y ACEITUNAS',
        precio: 13000,
        emoji: '🍕',
        imagen: '../files/pizza_especial.png'
    },
    {
        id: 'pizza6',
        nombre: '1/2 Pizza Especial',
        descripcion: 'MASA CASERA, SALSA, MUZZARELLA, JAMON, MORRON, OREGANO Y ACEITUNAS',
        precio: 8000,
        emoji: '🍕',
        imagen: '../files/pizza_especial.png'
    },
    {
        id: 'pizza7',
        nombre: 'Pizza Especial con Huevo',
        descripcion: 'MASA PARA PIZZA, SALSA, JAMON, MUZZARELLA, HUEVO RAYADO , ACEITUNAS Y OREGANO',
        precio: 14500,
        emoji: '🍕',
        imagen: '../files/pizza_especial_con_huevo.png'
    },
    {
        id: 'pizza8',
        nombre: '1/2 Pizza Especial con Huevo',
        descripcion: 'MASA PARA PIZZA, SALSA, JAMON, MUZZARELLA, HUEVO RAYADO , ACEITUNAS Y OREGANO',
        precio: 9000,
        emoji: '🍕',
        imagen: '../files/pizza_especial_con_huevo.png'
    },
    {
        id: 'pizza9',
        nombre: 'Pizza Fugazzeta',
        descripcion: 'MASA CASERA, MUZZARELLA, CEBOLLA Y ACEITUNAS',
        precio: 13000,
        emoji: '🍕',
        imagen: '../files/pizza_fugazzeta.png'
    },
    {
        id: 'pizza10',
        nombre: '1/2 Pizza Fugazzeta',
        descripcion: 'MASA CASERA, MUZZARELLA, CEBOLLA Y ACEITUNAS',
        precio: 8000,
        emoji: '🍕',
        imagen: '../files/pizza_fugazzeta.png'
    },
    {
        id: 'pizza11',
        nombre: 'Pizza Napolitana',
        descripcion: 'MASA CASERA, SALSA, MUZZARELLA, TOMATE, ACEITUNAS',
        precio: 13000,
        emoji: '🍕',
        imagen: '../files/pizza_napolitana.png'
    },
    {
        id: 'pizza12',
        nombre: '1/2 Pizza Napolitana',
        descripcion: 'MASA CASERA, SALSA, MUZZARELLA, TOMATE, ACEITUNAS',
        precio: 8000,
        emoji: '🍕',
        imagen: '../files/pizza_napolitana.png'
    }
];

const papas = [
    {
        id: 'papa1',
        nombre: 'Papas Clásicas',
        descripcion: 'Papas fritas crujientes con sal',
        precio: 9000,
        emoji: '🍟',
        imagen: '../files/papas_clasicas.png'
    },
    {
        id: 'papa2',
        nombre: 'Papas con Huevo',
        descripcion: 'Papas fritas con huevo revuelto',
        precio: 11000,
        emoji: '🍟',
        imagen: '../files/papas_con_huevo.png'
    },
    {
        id: 'papa3',
        nombre: 'Papas con Cheddar y Bacon',
        descripcion: 'Papas fritas con queso cheddar y trozos de bacon',
        precio: 12500,
        emoji: '🍟',
        imagen: '../files/papas_con_cheddar.png'
    }
];

const empanadas = [
    {
        id: 'emp1',
        nombre: 'Docena de Empanadas Árabe',
        descripcion: 'Docena de empanadas árabes',
        precio: 20000,
        emoji: '🥟',
        imagen: '../files/empanada_arabe.png'
    },
    {
        id: 'emp2',
        nombre: 'Docena de Empanadas Criolla Salada',
        descripcion: 'Docena de empanadas criollas saladas',
        precio: 20000,
        emoji: '🥟',
        imagen: '../files/empanada_criolla_salada.png'
    },
    {
        id: 'emp3',
        nombre: 'Docena de Empanadas Jamón y Queso',
        descripcion: 'Docena de empanadas de jamón y queso',
        precio: 20000,
        emoji: '🥟',
        imagen: '../files/empanada_jamon_queso.png'
    },
    {
        id: 'emp4',
        nombre: 'Empanada Árabe (Unidad)',
        descripcion: 'Empanada árabe',
        precio: 2000,
        emoji: '🥟',
        imagen: '../files/empanada_arabe.png'
    },
    {
        id: 'emp5',
        nombre: 'Empanada Criolla Salada (Unidad)',
        descripcion: 'Empanada criolla salada',
        precio: 2000,
        emoji: '🥟',
        imagen: '../files/empanada_criolla_salada.png'
    },
    {
        id: 'emp6',
        nombre: 'Empanada Jamón y Queso (Unidad)',
        descripcion: 'Empanada de jamón y queso',
        precio: 2000,
        emoji: '🥟',
        imagen: '../files/empanada_jamon_queso.png'
    }
];

const vegetarianos = [
    {
        id: 'veg1',
        nombre: 'Hamburguesa Vegetariana Simple',
        descripcion: 'PAN DE PAPA, MAYONESA CASERA, MEDALLON VEGETARIANO, LECHUGA, TOMATE, HUEVO, PEPINILLO, QUESO TYBO Y PAPAS FRITAS',
        precio: 11500,
        emoji: '🥗',
        imagen: '../files/hamburguesa_vegetariana_simple.png'
    },
    {
        id: 'veg2',
        nombre: 'Hamburguesa Vegetariana Doble',
        descripcion: 'PAN DE PAPA, MAYONESA CASERA, DOS MEDALLONES VEGETARIANO, LECHUGA, TOMATE, HUEVO, PEPINILLO, QUESO TYBO Y PAPAS FRITAS',
        precio: 14000,
        emoji: '🥗',
        imagen: '../files/hamburguesa_vegetariana_doble.png'
    },
    {
        id: 'veg3',
        nombre: 'Hamburguesa Vegetariana Triple',
        descripcion: 'PAN DE PAPA, MAYONESA CASERA, TRES MEDALLONES VEGETARIANO, LECHUGA, TOMATE, HUEVO, PEPINILLO, QUESO TYBO Y PAPAS FRITAS',
        precio: 16500,
        emoji: '🥗',
        imagen: '../files/hamburguesa_vegetariana_triple.png'
    },
    {
        id: 'veg4',
        nombre: 'Lomo Vegetariano',
        descripcion: 'PAN DE LOMO DE 20CM, BERENJENA SALTEADA, CEBOLLA SALTEADA, PIMIENTOS SALTEADOS (ROJO, AMARILLO Y VERDE), LECHUGA, TOMATE, HUEVO, QUESO TYBO Y PAPAS FRITAS',
        precio: 14000,
        emoji: '🥗',
        imagen: '../files/lomo_vegetariano.png'
    }
];

const aderezos = [
    {
        id: 'aderezo1',
        nombre: 'Mayonesa Casera',
        descripcion: 'Mayonesa fresca y cremosa preparada en casa',
        precio: 1000,
        emoji: '🍯',
    },
    {
        id: 'aderezo2',
        nombre: 'Mayonesa con Ajo',
        descripcion: 'Mayonesa casera con ajo fresco',
        precio: 1000,
        emoji: '🍯',
    },
    {
        id: 'aderezo3',
        nombre: 'Cheddar',
        descripcion: 'Salsa de queso cheddar cremoso',
        precio: 2000,
        emoji: '🍯',
    },
    {
        id: 'aderezo4',
        nombre: 'Barbacoa',
        descripcion: 'Salsa BBQ ahumada y dulce',
        precio: 1000,
        emoji: '🍯',
    },
    {
        id: 'aderezo5',
        nombre: 'Ketchup',
        descripcion: 'Ketchup de tomate natural',
        precio: 1000,
        emoji: '🍯',
    },
    {
        id: 'aderezo6',
        nombre: 'Mostaza',
        descripcion: 'Mostaza clásica picante',
        precio: 1000,
        emoji: '🍯',
    },
    {
        id: 'aderezo7',
        nombre: 'Salsa Picante',
        descripcion: 'Salsa picante con chiles y especias',
        precio: 1000,
        emoji: '🍯',

    },
    {
        id: 'aderezo8',
        nombre: 'Chimichurri',
        descripcion: 'Chimichurri argentino con hierbas frescas',
        precio: 1000,
        emoji: '🍯',
    }
];

const bebidas = [
    {
        id: 'beb1',
        nombre: 'Coca Cola 500ml',
        descripcion: 'Refresco clásico y refrescante',
        precio: 3000,
        emoji: '🥤',
        imagen: '../files/coca_medio.png'
    },
    {
        id: 'beb2',
        nombre: 'Fanta 500ml',
        descripcion: 'Refresco sabor naranja',
        precio: 3000,
        emoji: '🥤',
        imagen: '../files/fanta_medio.png'
    },
    {
        id: 'beb3',
        nombre: 'Sprite 500ml',
        descripcion: 'Refresco sabor lima-limón',
        precio: 3000,
        emoji: '🥤',
        imagen: '../files/sprite_medio.png'
    },
    {
        id: 'beb4',
        nombre: 'Coca Cola Zero 500ml',
        descripcion: 'Coca Cola sin azúcar',
        precio: 3000,
        emoji: '🥤',
        imagen: '../files/coca_zero_medio.png'
    },
    {
        id: 'beb5',
        nombre: 'Schweppes 500ml',
        descripcion: 'Agua tónica premium',
        precio: 3000,
        emoji: '🥤',
        imagen: '../files/schweppes_medio.png'
    },
    {
        id: 'beb6',
        nombre: 'Agua Bonaqua 500ml',
        descripcion: 'Agua mineral natural',
        precio: 2500,
        emoji: '🥤',
        imagen: '../files/agua_medio.png'
    },
    {
        id: 'beb7',
        nombre: 'Aquarius Manzana 500ml',
        descripcion: 'Bebida isotónica sabor manzana',
        precio: 3000,
        emoji: '🥤',
        imagen: '../files/aquarius_manzana_medio.png'
    },
    {
        id: 'beb8',
        nombre: 'Aquarius Pera 500ml',
        descripcion: 'Bebida isotónica sabor pera',
        precio: 3000,
        emoji: '🥤',
        imagen: '../files/aquarius_pera_medio.png'
    },
    {
        id: 'beb9',
        nombre: 'Aquarius Pomelo 500ml',
        descripcion: 'Bebida isotónica sabor pomelo',
        precio: 3000,
        emoji: '🥤',
        imagen: '../files/aquarius_pomelo_medio.png'
    },
    {
        id: 'beb10',
        nombre: 'Aquarius Naranja 500ml',
        descripcion: 'Bebida isotónica sabor naranja',
        precio: 3000,
        emoji: '🥤',
        imagen: '../files/aquarius_naranja_medio.png'
    },
    {
        id: 'beb11',
        nombre: 'Aquarius Limonada 500ml',
        descripcion: 'Bebida isotónica sabor limonada',
        precio: 3000,
        emoji: '🥤',
        imagen: '../files/aquarius_limonada_medio.png'
    },
    {
        id: 'beb12',
        nombre: 'Aquarius Manzana 1,5L',
        descripcion: 'Bebida isotónica sabor manzana formato familiar',
        precio: 6500,
        emoji: '🥤',
        imagen: '../files/aquarius_manzana_litro.png'
    },
    {
        id: 'beb13',
        nombre: 'Aquarius Pera 1,5L',
        descripcion: 'Bebida isotónica sabor pera formato familiar',
        precio: 6500,
        emoji: '🥤',
        imagen: '../files/aquarius_pera_litro.png'
    },
    {
        id: 'beb14',
        nombre: 'Coca Cola 1,5L',
        descripcion: 'Refresco clásico formato familiar',
        precio: 7000,
        emoji: '🥤',
        imagen: '../files/coca_litro.png'
    },
    {
        id: 'beb15',
        nombre: 'Coca Cola Zero 1,5L',
        descripcion: 'Coca Cola sin azúcar formato familiar',
        precio: 7000,
        emoji: '🥤',
        imagen: '../files/coca_zero_litro.png'
    },
    {
        id: 'beb16',
        nombre: 'Fanta 1,5L',
        descripcion: 'Refresco sabor naranja formato familiar',
        precio: 7000,
        emoji: '🥤',
        imagen: '../files/fanta_litro.png'
    },
    {
        id: 'beb17',
        nombre: 'Sprite 1,5L',
        descripcion: 'Refresco sabor lima-limón formato familiar',
        precio: 7000,
        emoji: '🥤',
        imagen: '../files/sprite_litro.png'
    },
    {
        id: 'beb18',
        nombre: 'Schweppes 1,5L',
        descripcion: 'Agua tónica premium formato familiar',
        precio: 7000,
        emoji: '🥤',
        imagen: '../files/schweppes_litro.png'
    },
    {
        id: 'beb19',
        nombre: 'Cerveza Monjita Heineken',
        descripcion: 'Cerveza Heineken en botella monjita',
        precio: 6000,
        emoji: '🍺',
        imagen: '../files/monjita_heineken.png'
    },
    {
        id: 'beb20',
        nombre: 'Cerveza Monjita Corona',
        descripcion: 'Cerveza Corona en botella monjita',
        precio: 6000,
        emoji: '🍺',
        imagen: '../files/monjita_corona.png'
    },
    {
        id: 'beb21',
        nombre: 'Cerveza Lata Miller',
        descripcion: 'Cerveza Miller en lata',
        precio: 6000,
        emoji: '🍺',
        imagen: '../files/lata_miller.png'
    },
    {
        id: 'beb22',
        nombre: 'Cerveza Lata Imperial',
        descripcion: 'Cerveza Imperial en lata',
        precio: 6000,
        emoji: '🍺',
        imagen: '../files/lata_imperial.png'
    },
    {
        id: 'beb23',
        nombre: 'Cerveza Lata Amstel',
        descripcion: 'Cerveza Amstel en lata',
        precio: 5500,
        emoji: '🍺',
        imagen: '../files/lata_amstel.png'
    },
    {
        id: 'beb24',
        nombre: 'Cerveza Lata Heineken',
        descripcion: 'Cerveza Heineken en lata',
        precio: 6500,
        emoji: '🍺',
        imagen: '../files/lata_heineken.png'
    }
];

const wraps = [
    {
        id: 'wrap1',
        nombre: 'Wrap de Pollo',
        descripcion: 'Pollo a la parrilla con lechuga, tomate y mayonesa',
        precio: 6.99,
        emoji: '🐔'
    },
    {
        id: 'wrap2',
        nombre: 'Wrap de Lomo',
        descripcion: 'Lomo tierno con cebolla morada y chimichurri',
        precio: 7.99,
        emoji: '🥩'
    },
    {
        id: 'wrap3',
        nombre: 'Wrap Vegano',
        descripcion: 'Humus, vegetales frescos y aguacate',
        precio: 5.99,
        emoji: '🥬'
    },
    {
        id: 'wrap4',
        nombre: 'Wrap de Camarón',
        descripcion: 'Camarones al ajillo con lechuga y salsa tártara',
        precio: 8.49,
        emoji: '🦐'
    },
    {
        id: 'wrap5',
        nombre: 'Wrap Mixto',
        descripcion: 'Pollo y lomo con queso, lechuga y tomate',
        precio: 7.49,
        emoji: '⭐'
    },
    {
        id: 'wrap6',
        nombre: 'Wrap Picante',
        descripcion: 'Pollo con jalapeños, queso cheddar y salsa picante',
        precio: 6.99,
        emoji: '🌶️'
    }
];

const promos = [
    {
        id: 'promo1',
        nombre: 'Combo Hamburguesa + Papas',
        descripcion: 'Hamburguesa + Papas Fritas + Bebida',
        precio: 9.99,
        emoji: '🍔'
    },
    {
        id: 'promo2',
        nombre: 'Combo Lomo Premium',
        descripcion: 'Lomo + Papas + Bebida + Postre',
        precio: 12.99,
        emoji: '🥩'
    },
    {
        id: 'promo3',
        nombre: 'Combo Amigos',
        descripcion: '2 Hamburguesas + 2 Papas + 2 Bebidas',
        precio: 17.99,
        emoji: '👨‍👩‍👧'
    },
    {
        id: 'promo4',
        nombre: 'Combo Familia',
        descripcion: '4 Hamburguesas + 3 Papas + Bebidas',
        precio: 24.99,
        emoji: '👨‍👩‍👧‍👦'
    },
    {
        id: 'promo5',
        nombre: 'Combo Wrap + Papas',
        descripcion: 'Wrap + Papas Fritas + Bebida',
        precio: 10.99,
        emoji: '🌯'
    },
    {
        id: 'promo6',
        nombre: 'Combo Vegetariano',
        descripcion: 'Hamburguesa Vegetariana + Papas + Bebida',
        precio: 8.99,
        emoji: '🥬'
    }
];

function renderizarHamburguesas() {
    const grid = document.getElementById('grid-hamburguesas');
    if (!grid) return;
    
    grid.innerHTML = hamburguesas.map(ham => `
        <div class="producto-card">
            <div class="producto-imagen">${ham.id === 'ham1' ? '<img src="../files/hamburguesa_clasica_simple.png" alt="Hamburguesa Clásica Simple" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham2' ? '<img src="../files/hamburguesa_clasica_doble.png" alt="Hamburguesa Clásica Doble" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham3' ? '<img src="../files/hamburguesa_clasica_triple.png" alt="Hamburguesa Clásica Triple" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham4' ? '<img src="../files/hamburguesa_completa_simple.png" alt="Hamburguesa Completa Simple" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham5' ? '<img src="../files/hamburguesa_completa_doble.png" alt="Hamburguesa Completa Doble" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham6' ? '<img src="../files/hamburguesa_completa_triple.png" alt="Hamburguesa Completa Triple" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham7' ? '<img src="../files/hamburguesa_cheese_simple.png" alt="Hamburguesa Cheese Simple" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham8' ? '<img src="../files/hamburguesa_cheese_doble.png" alt="Hamburguesa Cheese Doble" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham9' ? '<img src="../files/hamburguesa_cheese_triple.png" alt="Hamburguesa Cheese Triple" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham10' ? '<img src="../files/hamburguesa_americana_simple.png" alt="Hamburguesa Americana Simple" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham11' ? '<img src="../files/hamburguesa_americana_doble.png" alt="Hamburguesa Americana Doble" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham12' ? '<img src="../files/hamburguesa_americana_triple.png" alt="Hamburguesa Americana Triple" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham13' ? '<img src="../files/hamburguesa_provo_simple.png" alt="Hamburguesa Provo Simple" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham14' ? '<img src="../files/hamburguesa_provo_doble.png" alt="Hamburguesa Provo Doble" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham15' ? '<img src="../files/hamburguesa_provo_triple.png" alt="Hamburguesa Provo Triple" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham16' ? '<img src="../files/hamburguesa_mex_simple.png" alt="Hamburguesa Mex Simple" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham17' ? '<img src="../files/hamburguesa_mex_doble.png" alt="Hamburguesa Mex Doble" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham18' ? '<img src="../files/hamburguesa_mex_triple.png" alt="Hamburguesa Mex Triple" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham19' ? '<img src="../files/hamburguesa_blue_simple.png" alt="Hamburguesa Blue Simple" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham20' ? '<img src="../files/hamburguesa_blue_doble.png" alt="Hamburguesa Blue Doble" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham21' ? '<img src="../files/hamburguesa_blue_triple.png" alt="Hamburguesa Blue Triple" style="width: 100%; height: 100%; object-fit: cover;">' : ham.id === 'ham22' ? '<img src="../files/hamburguesa_gulabros.png" alt="La Gula Bros" style="width: 100%; height: 100%; object-fit: cover;">' : ham.emoji}</div>
            <div class="producto-info">
                <h3>${ham.nombre}</h3>
                <p class="producto-descripcion">${ham.descripcion}</p>
                <div class="producto-footer">
                    <span class="producto-precio">$${ham.precio.toFixed(2)}</span>
                    <button class="btn-agregar" onclick="agregarAlCarrito({
                        id: '${ham.id}',
                        nombre: '${ham.nombre}',
                        precio: ${ham.precio},
                        emoji: '${ham.emoji}'
                    })">
                        <i class="fas fa-plus"></i> Agregar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderizarLomos() {
    const grid = document.getElementById('grid-lomos');
    if (!grid) return;
    
    grid.innerHTML = lomos.map(lomo => `
        <div class="producto-card">
            <div class="producto-imagen">${lomo.id === 'lomo1' ? '<img src="../files/Lomo completo.png" alt="Lomo Completo" style="width: 100%; height: 100%; object-fit: cover;">' : lomo.id === 'lomo2' ? '<img src="../files/Lomo_americano.png" alt="Lomo Americano" style="width: 100%; height: 100%; object-fit: cover;">' : lomo.id === 'lomo3' ? '<img src="../files/lomo_azul.png" alt="Lomo Azul" style="width: 100%; height: 100%; object-fit: cover;">' : lomo.id === 'lomo4' ? '<img src="../files/lomo_mex.png" alt="Lomo Mex" style="width: 100%; height: 100%; object-fit: cover;">' : lomo.id === 'lomo5' ? '<img src="../files/lomo_vegetariano.png" alt="Lomo Vegetariano" style="width: 100%; height: 100%; object-fit: cover;">' : lomo.emoji}</div>
            <div class="producto-info">
                <h3>${lomo.nombre}</h3>
                <p class="producto-descripcion">${lomo.descripcion}</p>
                <div class="producto-footer">
                    <span class="producto-precio">$${lomo.precio.toFixed(2)}</span>
                    <button class="btn-agregar" onclick="agregarAlCarrito({
                        id: '${lomo.id}',
                        nombre: '${lomo.nombre}',
                        precio: ${lomo.precio},
                        emoji: '${lomo.emoji}'
                    })">
                        <i class="fas fa-plus"></i> Agregar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderizarSandwiches() {
    const grid = document.getElementById('grid-sandwiches');
    if (!grid) return;
    
    grid.innerHTML = sandwiches.map(item => {
        const imagen = item.imagen
            ? `<img src="${item.imagen}" alt="${item.nombre}" style="width: 100%; height: 100%; object-fit: cover;">`
            : item.emoji;

        return `
        <div class="producto-card">
            <div class="producto-imagen">${imagen}</div>
            <div class="producto-info">
                <h3>${item.nombre}</h3>
                <p class="producto-descripcion">${item.descripcion}</p>
                <div class="producto-footer">
                    <span class="producto-precio">$${item.precio.toFixed(2)}</span>
                    <button class="btn-agregar" onclick="agregarAlCarrito({
                        id: '${item.id}',
                        nombre: '${item.nombre}',
                        precio: ${item.precio},
                        emoji: '${item.emoji}'
                    })">
                        <i class="fas fa-plus"></i> Agregar
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function renderizarPizzas() {
    const grid = document.getElementById('grid-pizzas');
    if (!grid) return;
    
    grid.innerHTML = pizzas.map(item => {
        const imagen = item.imagen
            ? `<img src="${item.imagen}" alt="${item.nombre}" style="width: 100%; height: 100%; object-fit: cover;">`
            : item.emoji;

        return `
        <div class="producto-card">
            <div class="producto-imagen">${imagen}</div>
            <div class="producto-info">
                <h3>${item.nombre}</h3>
                <p class="producto-descripcion">${item.descripcion}</p>
                <div class="producto-footer">
                    <span class="producto-precio">$${item.precio.toFixed(2)}</span>
                    <button class="btn-agregar" onclick="agregarAlCarrito({
                        id: '${item.id}',
                        nombre: '${item.nombre}',
                        precio: ${item.precio},
                        emoji: '${item.emoji}'
                    })">
                        <i class="fas fa-plus"></i> Agregar
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function renderizarPapas() {
    const grid = document.getElementById('grid-papas');
    if (!grid) return;
    
    grid.innerHTML = papas.map(papa => {
        const imagen = papa.imagen
            ? `<img src="${papa.imagen}" alt="${papa.nombre}" style="width: 100%; height: 100%; object-fit: cover;">`
            : papa.emoji;

        return `
        <div class="producto-card">
            <div class="producto-imagen">${imagen}</div>
            <div class="producto-info">
                <h3>${papa.nombre}</h3>
                <p class="producto-descripcion">${papa.descripcion}</p>
                <div class="producto-footer">
                    <span class="producto-precio">$${papa.precio.toFixed(2)}</span>
                    <button class="btn-agregar" onclick="agregarAlCarrito({
                        id: '${papa.id}',
                        nombre: '${papa.nombre}',
                        precio: ${papa.precio},
                        emoji: '${papa.emoji}'
                    })">
                        <i class="fas fa-plus"></i> Agregar
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function renderizarEmpanadas() {
    const grid = document.getElementById('grid-empanadas');
    if (!grid) return;
    
    grid.innerHTML = empanadas.map(emp => {
        const imagen = emp.imagen
            ? `<img src="${emp.imagen}" alt="${emp.nombre}" style="width: 100%; height: 100%; object-fit: cover;">`
            : emp.emoji;

        return `
        <div class="producto-card">
            <div class="producto-imagen">${imagen}</div>
            <div class="producto-info">
                <h3>${emp.nombre}</h3>
                <p class="producto-descripcion">${emp.descripcion}</p>
                <div class="producto-footer">
                    <span class="producto-precio">$${emp.precio.toFixed(2)}</span>
                    <button class="btn-agregar" onclick="agregarAlCarrito({
                        id: '${emp.id}',
                        nombre: '${emp.nombre}',
                        precio: ${emp.precio},
                        emoji: '${emp.emoji}'
                    })">
                        <i class="fas fa-plus"></i> Agregar
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function renderizarVegetarianos() {
    const grid = document.getElementById('grid-vegetariano');
    if (!grid) return;
    
    grid.innerHTML = vegetarianos.map(veg => {
        const imagen = veg.imagen
            ? `<img src="${veg.imagen}" alt="${veg.nombre}" style="width: 100%; height: 100%; object-fit: cover;">`
            : veg.emoji;

        return `
        <div class="producto-card">
            <div class="producto-imagen">${imagen}</div>
            <div class="producto-info">
                <h3>${veg.nombre}</h3>
                <p class="producto-descripcion">${veg.descripcion}</p>
                <div class="producto-footer">
                    <span class="producto-precio">$${veg.precio.toFixed(2)}</span>
                    <button class="btn-agregar" onclick="agregarAlCarrito({
                        id: '${veg.id}',
                        nombre: '${veg.nombre}',
                        precio: ${veg.precio},
                        emoji: '${veg.emoji}'
                    })">
                        <i class="fas fa-plus"></i> Agregar
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function renderizarAderezos() {
    const grid = document.getElementById('grid-aderezos');
    if (!grid) return;
    
    grid.innerHTML = aderezos.map(aderezo => {
        const imagen = aderezo.imagen
            ? `<img src="${aderezo.imagen}" alt="${aderezo.nombre}" style="width: 100%; height: 100%; object-fit: cover;">`
            : aderezo.emoji;

        return `
        <div class="producto-card">
            <div class="producto-imagen">${imagen}</div>
            <div class="producto-info">
                <h3>${aderezo.nombre}</h3>
                <p class="producto-descripcion">${aderezo.descripcion}</p>
                <div class="producto-footer">
                    <span class="producto-precio">$${aderezo.precio.toFixed(2)}</span>
                    <button class="btn-agregar" onclick="agregarAlCarrito({
                        id: '${aderezo.id}',
                        nombre: '${aderezo.nombre}',
                        precio: ${aderezo.precio},
                        emoji: '${aderezo.emoji}'
                    })">
                        <i class="fas fa-plus"></i> Agregar
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function renderizarBebidas() {
    const grid = document.getElementById('grid-bebidas');
    if (!grid) return;
    
    grid.innerHTML = bebidas.map(beb => {
        const imagen = beb.imagen
            ? `<img src="${beb.imagen}" alt="${beb.nombre}" style="width: 100%; height: 100%; object-fit: cover;">`
            : beb.emoji;

        return `
        <div class="producto-card">
            <div class="producto-imagen">${imagen}</div>
            <div class="producto-info">
                <h3>${beb.nombre}</h3>
                <p class="producto-descripcion">${beb.descripcion}</p>
                <div class="producto-footer">
                    <span class="producto-precio">$${beb.precio.toFixed(2)}</span>
                    <button class="btn-agregar" onclick="agregarAlCarrito({
                        id: '${beb.id}',
                        nombre: '${beb.nombre}',
                        precio: ${beb.precio},
                        emoji: '${beb.emoji}'
                    })">
                        <i class="fas fa-plus"></i> Agregar
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function renderizarWraps() {
    const grid = document.getElementById('grid-wraps');
    if (!grid) return;
    
    grid.innerHTML = wraps.map(wrap => `
        <div class="producto-card">
            <div class="producto-imagen">${wrap.emoji}</div>
            <div class="producto-info">
                <h3>${wrap.nombre}</h3>
                <p class="producto-descripcion">${wrap.descripcion}</p>
                <div class="producto-footer">
                    <span class="producto-precio">$${wrap.precio.toFixed(2)}</span>
                    <button class="btn-agregar" onclick="agregarAlCarrito({
                        id: '${wrap.id}',
                        nombre: '${wrap.nombre}',
                        precio: ${wrap.precio},
                        emoji: '${wrap.emoji}'
                    })">
                        <i class="fas fa-plus"></i> Agregar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderizarPromos() {
    const grid = document.getElementById('grid-promos');
    if (!grid) return;
    
    grid.innerHTML = promos.map(promo => `
        <div class="producto-card">
            <div class="producto-imagen">${promo.emoji}</div>
            <div class="producto-info">
                <h3>${promo.nombre}</h3>
                <p class="producto-descripcion">${promo.descripcion}</p>
                <div class="producto-footer">
                    <span class="producto-precio">$${promo.precio.toFixed(2)}</span>
                    <button class="btn-agregar" onclick="agregarAlCarrito({
                        id: '${promo.id}',
                        nombre: '${promo.nombre}',
                        precio: ${promo.precio},
                        emoji: '${promo.emoji}'
                    })">
                        <i class="fas fa-plus"></i> Agregar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function actualizarCarrito() {
    const items = carrito.obtener();

    if (items.length === 0) {
        const carritoVacio = document.getElementById('carrito-vacio');
        const carritoContenido = document.getElementById('carrito-contenido');
        if (carritoVacio) carritoVacio.style.display = 'block';
        if (carritoContenido) carritoContenido.style.display = 'none';
        return;
    }

    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoContenido = document.getElementById('carrito-contenido');
    if (carritoVacio) carritoVacio.style.display = 'none';
    if (carritoContenido) carritoContenido.style.display = 'block';

    const tabla = document.getElementById('tabla-items');
    if (tabla) {
        tabla.innerHTML = items.map(item => `
            <tr>
                <td>${item.emoji} ${item.nombre}</td>
                <td>$${item.precio.toFixed(2)}</td>
                <td>
                    <div class="cantidad">
                        <button type="button" onclick="disminuirCantidad('${item.id}')" style="width: 30px; padding: 5px; background: #ecf0f1; border: none; cursor: pointer;">-</button>
                        <input type="number" value="${item.cantidad}" min="1" onchange="carrito.actualizar('${item.id}', parseInt(this.value)); actualizarCarrito();" style="width: 60px; text-align: center;">
                        <button type="button" onclick="aumentarCantidad('${item.id}')" style="width: 30px; padding: 5px; background: #ecf0f1; border: none; cursor: pointer;">+</button>
                    </div>
                </td>
                <td>$${(item.precio * item.cantidad).toFixed(2)}</td>
                <td>
                    <button type="button" class="btn-eliminar" onclick="carrito.eliminar('${item.id}'); actualizarCarrito();">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    const subtotal = carrito.getTotal();
    const deliveryCheck = document.getElementById('delivery');
    const delivery = deliveryCheck && deliveryCheck.checked ? 500 : 0;
    const total = subtotal + delivery;
    
    const subtotalEl = document.getElementById('subtotal');
    const envioEl = document.getElementById('envio');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (envioEl) envioEl.textContent = delivery > 0 ? `$${delivery.toFixed(2)}` : 'Retiro en local';
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function aumentarCantidad(id) {
    const item = carrito.obtener().find(i => i.id === id);
    if (item) {
        carrito.actualizar(id, item.cantidad + 1);
        actualizarCarrito();
    }
}

function disminuirCantidad(id) {
    const item = carrito.obtener().find(i => i.id === id);
    if (item && item.cantidad > 1) {
        carrito.actualizar(id, item.cantidad - 1);
        actualizarCarrito();
    }
}

function vaciarCarrito() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        carrito.vaciar();
        actualizarCarrito();
    }
}

function mostrarFormulario() {
    if (carrito.obtener().length === 0) {
        mostrarAlerta('⚠️ Tu carrito está vacío', 'error');
        return;
    }
    document.querySelector('.formulario-cliente').scrollIntoView({ behavior: 'smooth' });
}

function enviarPedido(event) {
    event.preventDefault();

    const cliente = {
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        direccion: document.getElementById('direccion').value,
        delivery: document.getElementById('delivery').checked,
        notas: document.getElementById('notas').value
    };

    if (!cliente.nombre || !cliente.telefono) {
        mostrarAlerta('⚠️ Por favor completa nombre y teléfono', 'error');
        return;
    }

    if (carrito.obtener().length === 0) {
        mostrarAlerta('⚠️ Tu carrito está vacío', 'error');
        return;
    }

    enviarPorWhatsApp(cliente);

    setTimeout(() => {
        carrito.vaciar();
        document.querySelector('form').reset();
        actualizarCarrito();
        mostrarAlerta('✓ Pedido enviado por WhatsApp. ¡Gracias por tu compra!', 'exito');
    }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    carrito.actualizarContador();
    
    renderizarHamburguesas();
    renderizarLomos();
    renderizarSandwiches();
    renderizarPizzas();
    renderizarPapas();
    renderizarEmpanadas();
    renderizarVegetarianos();
    renderizarAderezos();
    renderizarBebidas();
    renderizarWraps();
    renderizarPromos();
    
    if (document.getElementById('carrito-vacio') || document.getElementById('carrito-contenido')) {
        actualizarCarrito();
    }
});
