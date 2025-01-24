/* se capturan los elementos */
const sectionGrid = document.querySelector('#items .grid');
const buttonAbrir = document.querySelector('.btnCarrito');
const cerrarCarrito = document.querySelector('.botonCerrar');
const carrito = document.querySelector('.carrito');

/* se crea contenedor para comparar con data.js */
let carritoDeCompra = [];


/* se agrega el evento a los botones de mostrar y cerrar */
buttonAbrir.addEventListener('click', mostrar);
cerrarCarrito.addEventListener('click', cerrar);

function mostrar() {
    carrito.classList.add('mostrarCarrito');
}

function cerrar() {
    carritoContainer.innerHTML = ''; /* limpiar el carrito al cerrarlo */
    carrito.classList.remove('mostrarCarrito');

}


/* se agrega al boton agregar valga la redundancia al carrito el evento */
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('botonAgregar')) {  /* clase definida en el css */
        const itemId = e.target.getAttribute('data-id');
        const item = items.find(producto => producto.id === itemId); /* se busca la coincidencia en el id */
        if (item && item.stock > 0) {
            /* con esto evitamos agregar productos que no contengan un id existente en este caso por fallas en el dato (no hay fallos) */
            agregarAlCarrito(item);
        }
    }
    /* hacemos que el boton + y el boton menos dentro del carrito sume o reste al precionarlos */
    if (e.target.classList.contains('btnMas')) {
        const itemId = e.target.getAttribute('data-id');
        incrementarCantidad(itemId);
    }

    if (e.target.classList.contains('btnMenos')) {
        const itemId = e.target.getAttribute('data-id');
        decrementarCantidad(itemId);
    }
});

/* funcion agregarAlCarrito */
function agregarAlCarrito(item) {
    const itemEnCarrito = carritoDeCompra.find(producto => producto.id === item.id);
    if (itemEnCarrito) {
        if (itemEnCarrito.cantidad < item.stock) { /* permite agregar varias veces al carrito el mismo objeto desde el boton del producto */
            itemEnCarrito.cantidad++;
        }
    } else {
        carritoDeCompra.push({ ...item, cantidad: 1 }); /* se usan los puntos suspensivos para agregar todo el contenido del objeto */
    }
    /* mas adelante se crea esta function */
    actualizarCarrito();
}
/* esta funcion permite que se agregue la cantidad de un mismo tipo de articulos en referencia al stock que posea */
function incrementarCantidad(id) {
    const item = carritoDeCompra.find(producto => producto.id === id);
    if (item && item.cantidad < item.stock) {
        item.cantidad++;
        actualizarCarrito();
    }
}
/* como la funcion anterior esta influye en la cantidad de stock del carrito en este caso disminuye */
function decrementarCantidad(id) {
    const itemIndex = carritoDeCompra.findIndex(producto => producto.id === id);
    if (carritoDeCompra[itemIndex].cantidad > 1) {
        carritoDeCompra[itemIndex].cantidad--;
    } else {
        carritoDeCompra.splice(itemIndex, 1); /* hace que desaparezca el producto al restar todas las unidades */
    }
    actualizarCarrito();
}
/* se agrega el evento click al boton de compra dentro del carrito */
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('botonCompra')) {
        if (carritoDeCompra.length > 0) { /* mensaje al clickear el boton con algo dentro del carrito mostrando el monto a pagar en totalidad */
            alert(`El monto a pagar es: ${carritoDeCompra.reduce((total, item) => total + item.price * item.cantidad, 0).toFixed(2)}€`);
        } else { alert('Debe agregar primero algun articulo') } /* si se clickea sin ningun contenido en el carrito arroja este mensaje */
    }
});

/* Permite pintar en el carrito los productos */
function actualizarCarrito() {
    carritoContainer.innerHTML = '';
    let total = 0;
    carritoDeCompra.forEach(item => {
        total += item.price * item.cantidad;
        const article = document.createElement('article');
        const botonParaCompra = document.createElement('button')
        botonParaCompra.classList.add('botonCompra')
        article.classList.add('articleCarrito');
        article.innerHTML = `
            <div class="imagenCarrito"><img src="${item.image}" alt="${item.name}"></div>
            <div class="nombreArticulo">${item.name} - ${item.price}€</div>
            <div class="contenedorBtn">
                <button class="btnMenos" data-id="${item.id}">-</button>
                <span>${item.cantidad}</span>
                <button class="btnMas" data-id="${item.id}" ${item.cantidad >= item.stock ? 'disabled' : ''}>+</button>
            </div>`;
        carritoContainer.appendChild(article);
    });
    /* intente en esta funcion agregar los botones de cerrar y comprar y me causo muchos problemas por eso se ubican en la parte de arriba del carrito */

    const totalElement = document.createElement('div');
    totalElement.classList.add('totalCarrito');
    totalElement.textContent = `Total: ${total}€`;
    carritoContainer.appendChild(totalElement);
}
const carritoContainer = document.createElement('div');
carritoContainer.classList.add('carritoContainer');
carrito.appendChild(carritoContainer);


/* funcion para pintar un producto en el DOM */
function printOneItem(item, dom) {
    if (item.stock > 0) {
        const article = document.createElement('article');
        article.classList.add(item.clase);
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = `${item.image}`;
        img.alt = `${item.name}`;
        const texto = document.createElement('div');
        texto.classList.add('texto');
        const h3 = document.createElement('h3');
        h3.textContent = `${item.name}`;
        const ul = document.createElement('ul');
        ul.innerHTML = `<li> ${item.description}</li><li> Precio: ${item.price}€</li>`;
        texto.append(h3, ul);
        const button = document.createElement('button');
        button.classList.add('botonAgregar');
        button.textContent = 'Agregar al carrito';
        button.setAttribute('data-id', item.id);
        const icon = document.createElement('i');
        icon.classList.add('fa-regular', 'fa-cart-shopping');
        button.append(icon);
        figure.appendChild(img);
        article.append(figure, texto, button);
        dom.appendChild(article);
    }
}
/* funcion para pintar todos los elementos en el DOM */
function printAllItems(lista, dom) {
    dom.innerHTML = '';
    lista.forEach(item => printOneItem(item, dom));
}
document.addEventListener("DOMContentLoaded", () => {
    printAllItems(items, sectionGrid);
});

function buscarItem(query, type = "name") {
    const regex = /^[a-zA-Z0-9áéíóúñÑüÜ\s]*$/; // Validar caracteres permitidos
    if (!regex.test(query)) {
        return "La búsqueda contiene caracteres no permitidos. Intenta nuevamente.";
    }

    const busqueda = query.toLowerCase().trim(); // Limpiar la entrada
    if (busqueda.length === 0) return "Por favor, escribe algo para buscar.";

    const resultado = items.filter(item => {
        const campo = (item[type] || "").toLowerCase();
        if (busqueda.length === 1) {

            return campo.startsWith(busqueda);
        } else {

            return campo.includes(busqueda);
        }
    });

    return resultado.length > 0 ? resultado : "No se han encontrado resultados.";
}


document.getElementById("busqueda").addEventListener("submit", event => {
    event.preventDefault(); // Evitar recarga de página

    const input = document.getElementById("searchInput");
    const query = input.value.trim();
    const resultado = buscarItem(query, "name");

    if (typeof resultado === "string") {
        sectionGrid.innerHTML = `<p>${resultado}</p>`;
    } else {
        printAllItems(resultado, sectionGrid);
    }


    input.value = "";
    input.focus();
});

document.getElementById("buscarItem").addEventListener("click", event => {
    if (event.key === "Enter") {
        document.getElementById("busqueda").click();
    }
});

printAllItems(items, sectionGrid);