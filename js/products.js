function GetProductos(){
    let idProducto = localStorage.getItem("catID");

    fetch(`${PRODUCTS_URL}${idProducto}${EXT_TYPE}`, {
        method: "GET"
    }).then(function(response){
        if(response.ok){
            return response.json()
        }
        throw new Error("Error al acceder a la URL");
    }).then(function(data){
        MostrarProductos(data.products)
        console.log(data)
    })
}

GetProductos();

function MostrarProductos(productos){
    let cadena = "";
    let contadorProductos = 0;

    for(let p of productos){
        cadena += `
        <article class="ArticuloProductos">
                <img src="${p.image}" class="m-5">
            <div class="divProductos">
                <h2 class="text-center">${p.name}</h2>
                <p class=p4><strong></strong>${p.soldCount} VENDIDOS</p>
                <p><strong>Descripcion:</strong> ${p.description}</p>
                <p class=p5><strong></strong>${p.currency}${p.cost}</p>
            </div>
        </article>`
        contadorProductos++;
    }

    if(contadorProductos == 0){
        cadena = `<div class="alert alert-danger text-center">Productos con esta categoria no fueron encontrados</div>`
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

// Función para abrir el modal con todos los detalles del producto
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

function MostrarProductos(productos) {
    const cadena = productos.map(p => `
        <article class="ArticuloProductos" onclick="openModal('${p.image}', '${p.name}', '${p.description}', ${p.soldCount}, '${p.currency}${p.cost}')">
            <img src="${p.image}" class="m-5" alt="${p.name}" 
            <div class="divProductos">
                <h2 class="text-center">${p.name}</h2>
                <p class="p4">${p.soldCount} VENDIDOS</p>
                <p><strong>Descripción:</strong> ${p.description}</p>
                <p class="p5">${p.currency}${p.cost}</p>
            </div>
        </article>
    `).join('');

    document.querySelector("#MostrarProductos").innerHTML = cadena;

    closeBtn.onclick = closeModal;

    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };
}