function GetProductos() {
    let idProducto = localStorage.getItem("prodId"); 
    let url = `${PRODUCT_INFO_URL}${idProducto}${EXT_TYPE}`;

    fetch(url, {
        method: "GET"
    })
    .then(function(response) {
        if (response.ok) {
            return response.json(); 
        }
        throw new Error("Error al acceder a la URL: " + response.status);
    })
    .then(function(data) {
        productosInfo(data);
    })
    .catch(function(error) {
        throw new Error("Ocurrio un error:", error)
    });
}

GetProductos();

function productosInfo(productos) {
    let contenedor = document.querySelector("#divProductosInfo");

    let imagenes = productos.images;
    let nombre = productos.name;
    let descripcion = productos.description;
    let costo = productos.cost;
    let moneda = productos.currency;
    let categoria = productos.category;
    let vendidos = productos.soldCount;
    let productosRelacionados = productos.relatedProducts;

    contenedor.innerHTML = `
    <section id="sectionInfoProducto" class="row d-flex align-items-center justify-content-between m-4">
        <figure class="col-12 flex-wrap col-lg-7 d-flex justify-content-center flex-lg-wrap">
            <img id="imagenPrincipal" src="${imagenes[0]}" alt="${nombre}" class="col-12 col-lg-6 img-fluid m-2">
            <div class="col-12 d-flex flex-wrap justify-content-center">
                ${imagenes.map((imagen, pos) => `<img src="${imagen}" alt="${nombre}" class="col-3 col-sm-2 m-1 miniatura p-0" data-index="${pos}">`).join('')}
            </div>
        </figure>
        <div class="col-12 col-lg-5 pb-2">
            <p>${categoria}</p>
            <h2>${nombre}</h2>
            <p>${descripcion}</p>
            <p>${moneda} ${costo}</p>
            <p>${vendidos} vendidos</p>
            <button class="btnInfoProducto">Boton 1</button>
            <button class="btnInfoProducto">Boton 2</button>
        </div>
        <h3 class='px-5 py-2'>Productos relacionados</h3>
    </section>
    `;

    setTimeout(() => { //Hay que esperar a que el dom este cargado porqeu sino no funciona el click del boton ya que no encuentra las iamgenes
        let miniaturas = document.querySelectorAll('.miniatura');

        miniaturas.forEach(img => {
            img.addEventListener('click', function() {
                let pos = this.getAttribute('data-index');
                document.querySelector('#imagenPrincipal').src = imagenes[pos];
            });
        });
    }, 100); 

    obtenerDatosProductosRelacionados(productosRelacionados);
}

function obtenerDatosProductosRelacionados(arrayProductosRelacionados) {
    let idProducto = localStorage.getItem("catID");

    fetch(`${PRODUCTS_URL}${idProducto}${EXT_TYPE}`, {
        method: "GET"
    }).then(function(response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error("Error al acceder a la URL");
    }).then(function(data) {
        mostrarInfoProductosRel(data.products, arrayProductosRelacionados);
    }).catch(function(error) {
        console.error(error);
    });
}

function mostrarInfoProductosRel(productos, arrayProductosRelacionados) {
    let cadena = '';

    arrayProductosRelacionados.forEach(element => {
        let productoRelacionado = productos.find(p => p.id === element.id);
        if (productoRelacionado) {
            cadena += `
            <article class="row align-items-center articuloProductosLineal col-12 my-3 mx-1" onclick="mostrarProductoRelacionado(${productoRelacionado.id})">
                <figure class="col-12 col-md-2 m-auto">
                    <img src="${productoRelacionado.image}" class="img-fluid imgProductosLineal p-2">
                </figure>
                <div class="col-12 col-md-2">
                    <h5 class="mb-1">${productoRelacionado.name}</h5>
                    <p class="m-0"><strong>${productoRelacionado.soldCount} VENDIDOS</strong></p>
                </div>
                <div class="col-12 col-md-6 m-0">
                    <p class="">${productoRelacionado.description}</p>
                </div>
                <div class="col-12 col-md-2 text-end">
                    <h5 class="text-muted">${productoRelacionado.currency}${productoRelacionado.cost}</h5>
                </div>
            </article>
            `;
        }
    });

    let section = document.querySelector("#sectionInfoProducto");
    section.innerHTML += cadena;
}

function mostrarProductoRelacionado(id){
    localStorage.setItem("prodId", id);
    window.location.href = window.location.href;
}
