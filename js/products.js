const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const modalSoldCount = document.getElementById("modalSoldCount");
const modalPrice = document.getElementById("modalPrice");
const closeBtn = document.getElementsByClassName("close");

document.addEventListener("DOMContentLoaded", function () {
    ajustarPreferenciaPorTamañoVentana();
    window.addEventListener("resize", ajustarPreferenciaPorTamañoVentana);
    GetProductos();
    actualizarBadge();

    // Asignación de eventos para los botones de orden y filtrado de productos

    document.querySelector("#sortCompactLine").addEventListener("click", function() {
        mostrarProductosEnLinea();
        GetProductos();
    });

    document.querySelector("#sortCompactIcon").addEventListener("click", function() {
        mostrarProductosCuadrado();
        GetProductos();
    });
    
    document.querySelector("#sortPriceDescIcon").addEventListener("click", function() {
        ordenarProductosPorPrecio('desc');
    });

    document.querySelector("#sortPriceAscIcon").addEventListener("click", function() {
        ordenarProductosPorPrecio('asc');
    });

    document.querySelector("#sortRelevanceDescIcon").addEventListener("click", function() {
        ordenarProductosPorRelevancia('desc');
    });

    document.querySelector("#filter-price").addEventListener("click", filtrarProductosPorPrecio);

    document.querySelector("#delete-filter").addEventListener("click", filtrarProductosPorPrecio);
});

function ajustarPreferenciaPorTamañoVentana() {
    let anchoVentana = window.innerWidth;

    if (anchoVentana < 991) {
        mostrarProductosCuadrado();
    }
    GetProductos();
}

function mostrarProductosEnLinea() {
    sessionStorage.setItem("preferenciaProductos", "lineal");
}

function mostrarProductosCuadrado() {
    sessionStorage.setItem("preferenciaProductos", "cuadrado");
}

// Función que obtiene productos desde una API y los muestra en el formato preferido

function GetProductos() {
    let idProducto = localStorage.getItem("catID");

    fetch(`${PRODUCTS_URL}${idProducto}${EXT_TYPE}`, {
        method: "GET"
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error("Error al acceder a la URL");
    }).then(function (data) {
        mostrarProductosEnFormato(data.products);
        buscarProducto(data.products)
    }).catch(function (error) {
        console.error(error);
    });
}

// Función para ordenar los productos por precio

function ordenarProductosPorPrecio(order) {
    const contenedorProductos = document.querySelector('#productosSection');
    const productos = Array.from(contenedorProductos.children);

    productos.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute('data-price'));
        const priceB = parseFloat(b.getAttribute('data-price'));
        return order === 'asc' ? priceA - priceB : priceB - priceA;
    });

    contenedorProductos.innerHTML = ''; 
    productos.forEach(producto => contenedorProductos.appendChild(producto));
}

// Función para ordenar productos por relevancia (basada en cantidad vendida)

function ordenarProductosPorRelevancia(order) {
    const contenedorProductos = document.querySelector('#productosSection');
    const productos = Array.from(contenedorProductos.children);

    productos.sort((a, b) => {
        const soldA = parseInt(a.getAttribute('data-sold'), 10);
        const soldB = parseInt(b.getAttribute('data-sold'), 10);
        return order === 'desc' ? soldB - soldA : soldA - soldB;
    });

    contenedorProductos.innerHTML = ''; 
    productos.forEach(producto => contenedorProductos.appendChild(producto));
}

// Función que filtra productos según un rango de precios

function filtrarProductosPorPrecio(event) {
    const minPriceInput = document.getElementById('minPriceInput').value;
    const maxPriceInput = document.getElementById('maxPriceInput').value;
    
    const minPrice = parseFloat(minPriceInput);
    const maxPrice = parseFloat(maxPriceInput);
    
    const contenedorProductos = document.querySelector('#productosSection');
    const productos = Array.from(contenedorProductos.children);

    if (event.target.id === 'delete-filter') {
        GetProductos(); 
        return;
    }

    if (minPriceInput === '' && maxPriceInput === '') {
        GetProductos();
        return;
    }

    const productosFiltrados = productos.filter(producto => {
        const precio = parseFloat(producto.getAttribute('data-price'));
        return (isNaN(minPrice) || precio >= minPrice) && 
               (isNaN(maxPrice) || precio <= maxPrice);
    });

    contenedorProductos.innerHTML = ''; 
    productosFiltrados.forEach(producto => contenedorProductos.appendChild(producto));
}

function buscarProducto(products) {
    let searchBar = document.querySelector('#buscarProducto');
    searchBar.addEventListener('input', function () {
        const query = searchBar.value.toLowerCase();
        const filteredProducts = products.filter(product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query)
        );
        mostrarProductosEnFormato(filteredProducts);
    })
}

// Función que muestra los productos en el formato seleccionado (lineal o cuadrado)

function mostrarProductosEnFormato(productos) {
    let cadena = "";
    let contadorProductos = 0;
    let preferencia = sessionStorage.getItem("preferenciaProductos");

    cadena = `<section id="productosSection" class="container-fluid my-4 d-flex flex-wrap justify-content-center">`;
    for (let p of productos) {
        const dataPriceAttr = `data-price="${p.cost}" data-sold="${p.soldCount}"`;
        if (preferencia === "lineal") {
            cadena += `
                <article class="row align-items-center articuloProductosLineal m-4" ${dataPriceAttr} onclick="openModal('${p.image}', '${p.name}', '${p.description}', '${p.soldCount}', '${p.currency}${p.cost}', '${p.id}')">
                        <figure class="col-2 m-auto">
                            <img src="${p.image}" class="img-fluid imgProductosLineal p-2">
                        </figure>
                        <div class="col-2">
                            <h5 class="mb-1">${p.name}</h5>
                            <p class="cantidadVendidos m-0">${p.soldCount} vendidos</p>
                        </div>
                        <div class="col-6 m-0">
                            <p class="descripcion">${p.description}</p>
                        </div>
                        <div class="col-2 text-end d-flex justify-content-center flex-wrap">
                            <p class="precio text-muted"><span class="currency">${p.currency}</span>${p.cost}</p>
                            <button class="botonNaranja"onClick="redirecionAInfoProducto(${p.id}); event.stopPropagation();">Ver detalles</button>
                        </div>
                </article>`;
        } else {
            cadena += `
                <article class="row d-block justify-content-center ArticuloProductos col-md-5 m-2 w-lg-50 col-lg-3 col-xl-3 m-lg-3" ${dataPriceAttr} onclick="openModal('${p.image}', '${p.name}', '${p.description}', '${p.soldCount}', '${p.currency}${p.cost}', '${p.id}')">
                    <figure class="col-11" >
                        <img src="${p.image}" class="m-3 imagenProductosCuadrado">
                    </figure>
                    <div class="divProductos col-12 d-flex flex-wrap justify-content-start align-items-start">
                        <h2 class="h2Cuadrado col-12">${p.name}</h2>
                        <p class="cantidadVendidos p4 col-12"> ${p.soldCount} vendidos</p>
                        <p class="descripcion col-12"><strong>Descripción:</strong> ${p.description}</p>
                        <p class="precio p5 col-12 text-center"><span class="currency">${p.currency}</span>${p.cost}</p>
                    </div>
                    <div class="col-12 d-flex justify-content-center mb-3">
                        <button class="col-7 botonNaranja" onClick="redirecionAInfoProducto(${p.id}); event.stopPropagation();">Ver detalles</button>
                    </div>
                </article>`;
        }
        contadorProductos++;
    }

    cadena += `</section>`;

    if (contadorProductos == 0) {
        cadena = `<div class="alert alert-danger text-center">No fueron encontrados productos con esa categoria</div>`;
    }

    document.querySelector("#MostrarProductos").innerHTML = cadena;
}

function redirecionAInfoProducto(id){
    localStorage.setItem('prodId', id);
    window.location.href = "product-info.html";

    if(!localStorage.getItem("proRel1")){
        localStorage.setItem("proRel1", id)
    }else{
        if(localStorage.getItem("proRel1") != id){
            localStorage.setItem("proRel2", localStorage.getItem("proRel1"))
            localStorage.setItem("proRel1", id)
        }
    }
}

// Funcion de apertura y cierre del modal

function openModal(imgSrc, name, description, soldCount, price) {
    modal.style.display = "block";
    modalImg.src = imgSrc;
    modalName.innerHTML = name;
    modalDescription.innerHTML = description;
    modalSoldCount.innerHTML = `${soldCount} VENDIDOS`;
    modalPrice.innerHTML = `${price}`;
}

function closeModal() {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target === modal) {
        closeModal();
    }
}

closeBtn.onclick = closeModal;
