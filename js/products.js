document.addEventListener("DOMContentLoaded", function() {
    if (!sessionStorage.getItem("preferenciaProductos")) {
        sessionStorage.setItem("preferenciaProductos", "cuadrado");
    }
    GetProductos();
    
    document.querySelector("#btnLinealProductos").addEventListener("click", function() {
        mostrarProductosEnLinea();
        GetProductos();
    });

    document.querySelector("#btnCuadradoProductos").addEventListener("click", function() {
        mostrarProductosCuadrado();
        GetProductos();
    });
});

function mostrarProductosEnLinea() {
    sessionStorage.setItem("preferenciaProductos", "lineal");
}

function mostrarProductosCuadrado() {
    sessionStorage.setItem("preferenciaProductos", "cuadrado");
}

function GetProductos() {
    let idProducto = localStorage.getItem("catID");

    fetch(`${PRODUCTS_URL}${idProducto}${EXT_TYPE}`, {
        method: "GET"
    }).then(function(response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error("Error al acceder a la URL");
    }).then(function(data) {
        MostrarProductosEnFormato(data.products);
    }).catch(function(error) {
        console.error(error);
    });
}

function MostrarProductosEnFormato(productos) {
    let cadena = "";
    let contadorProductos = 0;
    let preferencia = sessionStorage.getItem("preferenciaProductos");

    for (let p of productos) {
        if (preferencia === "lineal") {
            document.querySelector("#MostrarProductos").classList.add("d-flex");
            document.querySelector("#MostrarProductos").classList.add("flex-wrap");
            cadena += `
                <section class="container my-4 col-12 d-inline sectionProductosLineal" onclick="openModal('${p.image}', '${p.name}', '${p.description}', ${p.soldCount}, '${p.currency}${p.cost}')">
                    <article class="row align-items-center articuloProductosLineal">
                        <figure class="col-2 text-center">
                            <img src="${p.image}" class="img-fluid imgProductosLineal">
                        </figure>
                        <div class="col-2">
                            <h5 class="mb-1">${p.name}</h5>
                            <p class="m-0"><strong>${p.soldCount} VENDIDOS</strong></p>
                        </div>
                        <div class="col-6 m-0">
                            <p class="">${p.description}</p>
                        </div>
                        <div class="col-2 text-end">
                            <h5 class="text-muted">${p.currency}${p.cost}</h5>
                        </div>
                    </article>
                </section>`;
        } else {
            document.querySelector("#MostrarProductos").classList.remove("d-flex");
            document.querySelector("#MostrarProductos").classList.remove("flex-wrap");
            cadena += `
            <article class="ArticuloProductos">
                <img src="${p.image}" class="m-5" onclick="openModal('${p.image}', '${p.name}', '${p.description}', ${p.soldCount}, '${p.currency}${p.cost}')">
                <div class="divProductos">
                    <h2 class="text-center">${p.name}</h2>
                    <p class="p4"><strong>VENDIDOS:</strong> ${p.soldCount}</p>
                    <p><strong>Descripción:</strong> ${p.description}</p>
                    <p class="p5"><strong></strong>${p.currency}${p.cost}</p>
                </div>
            </article>`;
        }
        contadorProductos++;
    }

    if (contadorProductos == 0) {
        cadena = `<div class="alert alert-danger text-center">No fueron encontrados productos con esa categoria</div>`;
    }

    document.querySelector("#MostrarProductos").innerHTML = cadena;
}

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const modalSoldCount = document.getElementById("modalSoldCount");
const modalPrice = document.getElementById("modalPrice");
const closeBtn = document.getElementsByClassName("close")[0];

function openModal(imgSrc, name, description, soldCount, price) {
    modal.style.display = "block";
    modalImg.src = imgSrc;
    modalName.innerHTML = name;
    modalDescription.innerHTML = description;
    modalSoldCount.innerHTML = `${soldCount} VENDIDOS`;
    modalPrice.innerHTML = ` ${price}`;
}

function closeModal() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

closeBtn.onclick = closeModal;