//Todo lo que realice aca es a modo de ejemplo noma, igual agarren los articulos y modifiquen el
//contenido nomas

document.addEventListener("DOMContentLoaded", () => {
  CargaProductos();
  CargarCantidadesProducto();
  ResumenCompra();
  CargarProductosInteres();
});


function CargaProductos() {
  const productosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let cadena = "";

  productosCarrito.forEach(producto => {
    cadena += `
      <article class="row d-flex flex-wrap justify-content-between my-2 p-2 w-md-75">
        <img src="${producto.imagen}" class="col-3">
        <div class="col-6 col-md-5">
          <h3 class="pt-3">${producto.nombre}</h3>
          <div class="divCantidad pt-4">
            <button class="btn-resta btnSumaResta">-</button>
            <input type="number" class="cantidadProducto" value="${producto.cantidad}" min="1">
            <button class="btn-suma btnSumaResta">+</button>
          </div>
        </div>
        <p class="col-2 d-flex align-items-center m-0 p-0 PrecioProducto">${producto.moneda} ${producto.costo}</p>
      </article>
    `;
  });

  document.querySelector("#carritoProductos").innerHTML = cadena;
}


//Funcion que permite aumentar y decrecer cantidad de un producto, con los botones
function CargarCantidadesProducto() {
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-suma")) {
      let cantidadInput = event.target.previousElementSibling;
      cantidadInput.value = parseInt(cantidadInput.value) + 1;
    } else if (event.target.classList.contains("btn-resta")) {
      let cantidadInput = event.target.nextElementSibling;
      if (cantidadInput.value > 1) {
        cantidadInput.value = parseInt(cantidadInput.value) - 1;
      }
    }
  });
}



//Function del resumen de compra
function ResumenCompra() {
  let nroRandom = Math.floor(Math.random() * (9 - 1 + 1) + 1);
  let precioRandom = Math.floor(Math.random() * (10000 - 1 + 1) + 1);

  let cadena = `
                <article id="articloMonto">
                    <p id="cantMonto" class="mx-4 mt-3 mb-2">Productos (${nroRandom})</p>
                    <p id="Monto" class="mx-5 ">$${precioRandom}</p>
                </article>`;

  document.querySelector("#montoTotal").innerHTML += cadena;

  document.querySelector(
    "#montoTotal"
  ).innerHTML += `<button id="btnComprar" class="d-flex justify-content-center align-items-center mx-auto my-2">Comprar</button>`;
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
async function CargarProductosInteres() {
  let prod1 = await ObtenerProductoInt1();
  let prod2 = await ObtenerProductoInt2();

  function crearArticuloProducto(prod) {
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
  }
}


function redirecionAInfoProducto(id) {
  localStorage.setItem('prodId', id);
  window.location.href = "product-info.html";
}