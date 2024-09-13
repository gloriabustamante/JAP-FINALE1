document.addEventListener("DOMContentLoaded", function () {
    function displayNavBarName() {
        let navListItem = document.querySelector('#navName');
        let navUsername = localStorage.getItem("username");
       
    if (navUsername) {
            let navLink = document.createElement('a');
            navLink.textContent = navUsername;
            navListItem.appendChild(navLink);
            navLink.setAttribute('class', 'nav-link')
            navLink.setAttribute('href', 'my-profile.html')
        }
    }

    function displayLogOut() {
        let navListItem = document.querySelector('#logout');
        let navUsername = localStorage.getItem("username");
       
    if (navUsername) {
            let navLink = document.createElement('a');
            navLink.textContent = 'Cerrar SesiÃ³n';
            navListItem.appendChild(navLink);
            navLink.setAttribute('class', 'nav-link')
            navLink.setAttribute('href', 'login.html')
        }
    }
    displayNavBarName()
    displayLogOut()

    function GetProductos() {
        let idProducto = localStorage.getItem("prodId"); 
        let url = `${PRODUCT_INFO_URL}${idProducto}${EXT_TYPE}`;
        
        console.log("URL de la solicitud:", url);
    
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
            console.log("Datos recibidos:", data);
            productosInfo(data);
        })
        .catch(function(error) {
            console.error("Error en la solicitud:", error);
        });
    }
    
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
        <section>
            <h2>${nombre}</h2>
            <p>${descripcion}</p>
            <p><strong>Precio:</strong> ${moneda} ${costo}</p>
            <p><strong>CategorÃ­a:</strong> ${categoria}</p>
            <p><strong>Vendidos:</strong> ${vendidos}</p>
            <figure>
                ${imagenes.map(imagen => `<img src="${imagen}" alt="${nombre}">`).join('')}
            </figure>
            <h3>Productos relacionados</h3>
            <ul>
                ${productosRelacionados.map(producto => `
                    <li>
                        <p><strong>${producto.name}</strong></p>
                        <img src="${producto.image}" alt="${producto.name}">
                    </li>
                `).join('')}
            </ul>
        </section>
        `;
    }
    GetProductos();
});