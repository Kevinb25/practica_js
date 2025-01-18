const sectionGrid = document.querySelector('#items .grid');






function printOneItem(item, dom) {
    const article = document.createElement('article')
    article.classList.add(item.clase);
    const figure = document.createElement('figure')
    const img = document.createElement('img')
    img.src = `${item.image}`
    img.alt = `${item.name}`
    const texto = document.createElement('div');
    texto.classList.add('texto');
    const h3 = document.createElement('h3')
    h3.textContent = `${item.name}`
    const ul = document.createElement('ul')
    ul.innerHTML = `<li> ${item.description}</li>
                    <li> Precio: ${item.price}€</li>`
    texto.append(h3, ul);
    const button = document.createElement('button');
    button.classList.add("botonCompra");
    button.textContent = 'Agregar al carrito';
    const icon = document.createElement('i')
    icon.classList.add("fa-regular", "fa-cart-shopping")
    button.append(icon)
    figure.appendChild(img)
    article.append(figure, texto, button)
    dom.appendChild(article)
}

function printAllItems(lista, dom) {
    lista.forEach(item => printOneItem(item, dom))
}

printAllItems(items, sectionGrid)

