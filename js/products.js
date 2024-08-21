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
                <p><strong>Descripcion de producto:</strong> ${p.description}</p>
                <p><strong>Cantidad vendidos:</strong>${p.soldCount}</p>
                <p><strong>Precio del producto:</strong>${p.currency}${p.cost}</p>
            </div>
        </article>`
        contadorProductos++;
    }

    if(contadorProductos == 0){
        cadena = `<div class="alert alert-danger text-center">Productos con esta categoria no fueron encontrados</div>`
    }

    document.querySelector("#MostrarProductos").innerHTML = cadena;
}