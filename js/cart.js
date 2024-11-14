const envioHeading = document.getElementById("envioHeading");
const envioSection = document.getElementById("envioSection");
const submitEnvioButton = document.getElementById("submitEnvio");
const productosHeading = document.getElementById("productosHeading");
const productosSection = document.getElementById("productosSection");

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  cargarCantidadesProducto();
  resumenCompra();
  cargarProductosInteres();
  actualizarBadge();
  alternarPestañas();
});

//Funcion para agregar productos al carrito 
const agregarProductoAlCarrito = (producto) => {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const index = carrito.findIndex(item => item.id === producto.id);

  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({
      ...producto,
      cantidad: 1
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarBadge();
  cargarProductos();
  resumenCompra();
}

// Funcion para cargar los productos en la pagina del carrito
const cargarProductos = () => {
  const productos = JSON.parse(localStorage.getItem("carrito")) || [];
  let cadena = "";

  if (productos.length === 0) {
    cadena = `
      <article class="row d-flex flex-wrap justify-content-between my-2 p-2 w-md-75">
          <div class="col-12 text-center">
              <p class="mt-3">No hay productos en el carrito.</p>
          </div>
      </article>
    `;
  } else {
    productos.forEach((producto, index) => {
      cadena += `
          <article class="row d-flex align-items-center justify-content-between p-2 w-md-75">
            <!-- Contenedor de la imagen y la información del producto -->
            <div class="d-flex col-9">
              <img src="${producto.imagen}" class="col-4 me-5">
              <div class="col-8">
                <h3 class="pt-3">${producto.nombre}</h3>
                <div class="divCantidad pt-4 d-flex align-items-center">
                  <button class="btn-resta btnSumaResta">-</button>
                  <input type="number" class="cantidadProducto" value="${producto.cantidad || 1}" min="1" data-index="${index}">
                  <button class="btn-suma btnSumaResta">+</button>
                </div>
              </div>
            </div>

            <!-- Contenedor de los precios -->
            <div class="precioSection col-3 text-center">
              <p class="PrecioProducto m-0 p-0"><span class="currency">USD</span>${producto.costo}</p>
              <p class="subtotal" id="subtotal-${index}">Subtotal: <span class="currency">USD</span>${(producto.costo * producto.cantidad).toFixed(2)}</p>
            </div>
          </article>
      `;
    });
  }

  document.querySelector("#productosSection").innerHTML += cadena;
}

//Funcion para las cantidades 
const cargarCantidadesProducto = () => {
  document.addEventListener("click", (event) => {
    const productos = JSON.parse(localStorage.getItem("carrito")) || [];

    if (event.target.classList.contains("btn-suma") || event.target.classList.contains("btn-resta")) {

      let cantidadInput = event.target.classList.contains("btn-suma")
        ? event.target.previousElementSibling
        : event.target.nextElementSibling;

      let index = cantidadInput.dataset.index;
      let cantidadActual = parseInt(cantidadInput.value);

      if (event.target.classList.contains("btn-suma")) {
        cantidadActual += 1;
      } else if (cantidadActual > 1) {
        cantidadActual -= 1;
      }
      cantidadInput.value = cantidadActual;

      productos[index].cantidad = cantidadActual;
      localStorage.setItem("carrito", JSON.stringify(productos));
      actualizarBadge();

      const subtotalElement = document.querySelector(`#subtotal-${index}`);
      const precio = productos[index].precio || productos[index].costo || 0;
      const subtotal = cantidadActual * precio;
      subtotalElement.textContent = `Subtotal: USD ${subtotal.toFixed(2)}`;

      resumenCompra();
    }
  });
}

//Funcion que permite alternar entre las pestañas "Productos" y "Envío"
const alternarPestañas = () => {
  envioHeading.addEventListener("click", () => {
    envioSection.style.display = "block";
    productosSection.style.display = "none";
    envioHeading.classList.add("active");
    productosHeading.classList.remove("active");
  });
  productosHeading.addEventListener("click", () => {
    productosSection.style.display = "block";
    envioSection.style.display = "none";
    productosHeading.classList.add("active");
    envioHeading.classList.remove("active");
  });
};

//Funcion del resumen de compra
const resumenCompra = () => {
  const productos = JSON.parse(localStorage.getItem("carrito")) || [];

  let cantidadTotal = 0;
  let precioTotal = 0;

  productos.forEach((producto) => {

    const precio = producto.costo || 0;
    const cantidad = producto.cantidad || 1;

    cantidadTotal += cantidad;
    precioTotal += cantidad * precio;
  });

  let cadena = `
    <article id="articuloMonto">
      <p id="cantMonto" class="mx-4 mt-3 mb-2">Productos (${cantidadTotal})</p>
      <p id="Monto" class="mx-5 "><span class="currency">USD </span>${precioTotal.toFixed(2)}</p>
    </article>
    <button id="btnComprar" class="d-flex justify-content-center align-items-center mx-auto my-2">Comprar</button>
  `;

  const montoTotalContainer = document.querySelector("#montoTotal");
  if (montoTotalContainer) {
    montoTotalContainer.innerHTML = "";
    montoTotalContainer.innerHTML = "<h2 class='text-center pt-2'>Resumen de compra</h2>";
    montoTotalContainer.innerHTML += cadena;
  } else {
    console.error("El contenedor #montoTotal no existe en el DOM.");
  }
}

//Funcion que obtiene los productos en los cuales el usuario ingreso por ultima vez.
async function ObtenerProductoInt1() {
  let idProducto = localStorage.getItem("proRel1");
  try {
    let resultado = await fetch(`${PRODUCT_INFO_URL}${idProducto}${EXT_TYPE}`);
    if (!resultado.ok) throw new Error("Error en la carga del producto 1");
    let producto = await resultado.json();
    return producto;
  } catch (error) {
    console.error(error);
  }
}

async function ObtenerProductoInt2() {
  let idProducto = localStorage.getItem("proRel2");
  try {
    let resultado = await fetch(`${PRODUCT_INFO_URL}${idProducto}${EXT_TYPE}`);
    if (!resultado.ok) throw new Error("Error en la carga del producto 2");
    let producto = await resultado.json();
    return producto;
  } catch (error) {
    console.error(error);
  }
}
async function cargarProductosInteres() {
  let prod1 = await ObtenerProductoInt1();
  let prod2 = await ObtenerProductoInt2();

  const crearArticuloProducto = (prod) => {
    return `
      <article class="row articuloProductosLineal col-12 col-lg-8 mx-auto px-3 articuloProductosInteres" onClick="redirecionAInfoProducto(${prod.id})">
        <figure class="col-10  mx-auto">
          <img src="${prod.images[0]}" alt="${prod.name}" class="img-fluid py-3 imgProductosLineal ">
        </figure>
        <div class="px-4 mb-2 divNameSoldCount">
          <h3 class="mb-1">${prod.name}</h3>
          <p class="cantidadVendidos m-0">${prod.soldCount} vendidos</p>
        </div>
        <div class="col-12 m-0 px-4 ">
          <p class="">${prod.description}</p>
        </div>
        <div class="col-12 text-end ">
          <p class="price text-muted"><span class="currency">${prod.currency}</span> ${prod.cost}</p>
        </div>
      </article>
    `;
  }

  let productosContainer = document.querySelector("#productosDeInteres");

  if (prod1 && !prod2) {
    productosContainer.innerHTML += crearArticuloProducto(prod1);
  } else if (!prod1 && prod2) {
    productosContainer.innerHTML += crearArticuloProducto(prod2);
  } else if (prod1 && prod2) {
    let carrusel = `
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div id="Carrusel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
            <div class="carousel-inner">
              <div class="carousel-item active">
                ${crearArticuloProducto(prod1)}
              </div>
              <div class="carousel-item">
                ${crearArticuloProducto(prod2)}
              </div>
            </div>
            <a class="carousel-control-prev aCarrusel1" href="#Carrusel" role="button" data-bs-slide="prev">
              <i class="fa-solid fa-angle-left flechitaCarrito"></i>
            </a>
            <a class="carousel-control-next aCarrusel" href="#Carrusel" role="button" data-bs-slide="next">
              <i class="fa-solid fa-angle-right flechitaCarrito"></i>
            </a>
          </div>
        </div>
      </div>
    `;
    productosContainer.innerHTML += carrusel;
  } else {
    tituloProdInteres.style.display = "none";
  }
}


const redirecionAInfoProducto = (id) => {
  localStorage.setItem('prodId', id);
  window.location.href = "product-info.html";
}