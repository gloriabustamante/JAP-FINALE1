const envioHeading = document.getElementById("envioHeading");
const envioSection = document.getElementById("envioSection");
const submitEnvioButton = document.getElementById("submitEnvio");
const productosHeading = document.getElementById("productosHeading");
const productosSection = document.getElementById("productosSection");
const botonComprar = document.getElementById("btnComprar");
const selectEnvio = document.getElementById('selectEnvio');
const formaPago = document.getElementById('formaPago');
const departamento = document.getElementById('departamento');
const localidad = document.getElementById('localidad');
const calle = document.getElementById('calle');
const numero = document.getElementById('numero');
const esquina = document.getElementById('esquina');

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  cargarCantidadesProducto();
  resumenCompra();
  cargarProductosInteres();
  actualizarBadge();
  alternarPestañas();
  let selectEnvio = document.querySelector("#selectEnvio");
  if (selectEnvio) {
    selectEnvio.addEventListener("change", mostrarTotalCompra);
  }
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
      <article>
          <div class="text-center">
              <p class="mt-3">No hay productos en el carrito.</p>
          </div>
      </article>
    `;
  } else {
    productos.forEach((producto, index) => {
      cadena += `
          <article class="d-flex align-items-center justify-content-between p-2 w-md-75">
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

            <div class="precioSection col-3 text-center">
              <p class="PrecioProducto m-0 p-0"><span class="currency">USD</span>${producto.costo}</p>
              <p class="subtotal" id="subtotal-${index}">Subtotal: <span class="currency">USD</span>${(producto.costo * producto.cantidad).toFixed(2)}</p>
            </div>
          </article>
      `;
    });
  }

  document.querySelector("#productosSection").innerHTML = cadena;
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
      } else {
        cantidadActual -= 1;
        if (cantidadActual === 0) {
          productos.splice(index, 1);
          localStorage.setItem("carrito", JSON.stringify(productos));
          actualizarBadge();
          cargarProductos();
          resumenCompra();
          return;
        }
      }
      cantidadInput.value = cantidadActual;

      productos[index].cantidad = cantidadActual;
      localStorage.setItem("carrito", JSON.stringify(productos));
      actualizarBadge();

      const subtotalElement = document.querySelector(`#subtotal-${index}`);
      const precio = productos[index]?.precio || productos[index]?.costo || 0;
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

function mostrarTotalCompra() {
  let section = document.querySelector("#envioSection");
  let selectEnvio = document.querySelector("#selectEnvio");
  let valorEnvio = parseFloat(selectEnvio?.value || 1);

  let total = precioTotal * valorEnvio;

  if (selectEnvio.value) {
    let cadena = "";
    let valorEnvio = parseFloat(selectEnvio?.value || 1);
    let articulo = document.querySelector("#articuloEnvio");
    articulo.innerHTML = cadena;
    let totalEnvio = (precioTotal * valorEnvio) - precioTotal;

    cadena = `<p id="cantMonto" class="mx-4 mt-3 mb-2">Costo de envio</p>
              <p id="Monto" class="mx-5 "><span class="currency">USD </span>${totalEnvio.toFixed(2)}</p>`

    articulo.style.borderBottom = "solid black 2px"
    articulo.innerHTML += cadena
  }

  let montoTotal = document.querySelector("#totalCompra");
  montoTotal.style.borderBottom = "solid black 2px"
  montoTotal.innerHTML += `<p id="cantMonto" class="mx-4 mt-3 mb-2">Total :</p>
                          <p id="Monto" class="mx-5 "><span class="currency">USD </span>${total.toFixed(2)}</p>`
}

let precioTotal = 0;

//Funcion del resumen de compra
const resumenCompra = () => {
  const productos = JSON.parse(localStorage.getItem("carrito")) || [];

  let cantidadTotal = 0;
  precioTotal = 0;

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
    <article id="articuloEnvio" style="border: none"></article>
    <article id="totalCompra" style="border: none"></article>
    <button id="btnComprar" class="d-flex justify-content-center align-items-center mx-auto my-2">Comprar</button>
  `;

  const montoTotalContainer = document.querySelector("#montoTotal");
  if (montoTotalContainer) {
    montoTotalContainer.innerHTML = `
      <h2 class="text-center pt-2">Resumen de compra</h2>
      ${cadena}
    `;

    const btnComprar = document.querySelector("#btnComprar");
    if (btnComprar) {
      btnComprar.addEventListener("click", () => {
        if (validarEnvio() && precioTotal > 0) {
          const modalHTML = `
              <div class="modal fade" id="modalCompra" tabindex="-1" aria-labelledby="modalCompraLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="modalCompraLabel">Gracias por tu compra!</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <p>Te enviaremos un mail con los detalles de la misma.</p>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Seguir Comprando</button>
                    </div>
                  </div>
                </div>
              </div>
            `;

          // Insertar el modal en el documento y mostrarlo
          document.body.insertAdjacentHTML("beforeend", modalHTML);
          const modal = new bootstrap.Modal(document.getElementById("modalCompra"));
          modal.show();
        } else if (precioTotal <= 0) {
          modalHTML = `
              <div class="modal fade" id="modalCompra" tabindex="-1" aria-labelledby="modalCompraLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="modalCompraLabel">Whoops! Ha ocurrido un error...</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <p>Parece que no has seleccionado ningun producto. Probá seleccionando uno desde el catálogo!</p>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                  </div>
                </div>
              </div>
            `;
        }
        document.body.insertAdjacentHTML("beforeend", modalHTML);
        const modal = new bootstrap.Modal(document.getElementById("modalCompra"));
        modal.show();
      });
    }

  } else {
    console.error("El contenedor #montoTotal no existe en el DOM.");
  }
};


// Funcion para validar envio

function validarEnvio() {
  const selectEnvio = document.getElementById('selectEnvio');
  const formaPago = document.getElementById('formaPago');
  const departamento = document.getElementById('departamento');
  const localidad = document.getElementById('localidad');
  const calle = document.getElementById('calle');
  const numero = document.getElementById('numero');
  const esquina = document.getElementById('esquina');

  const campos = [
    { field: selectEnvio, message: "Selecciona un tipo de envío." },
    { field: formaPago, message: "Selecciona una forma de pago." },
    { field: departamento, message: "Selecciona un departamento." },
    { field: localidad, message: "Completa el campo de localidad.", trim: true },
    { field: calle, message: "Completa el campo de calle.", trim: true },
    { field: numero, message: "Completa el campo de número.", trim: true },
    { field: esquina, message: "Completa el campo de esquina.", trim: true },
  ];

  const errors = campos
    .filter(({ field, trim }) => {
      const value = field ? (trim ? field.value.trim() : field.value) : '';
      return !value;
    })
    .map(({ message }) => message);

  if (errors.length > 0) {

    const existingModal = document.getElementById('modalCompra');
    if (existingModal) {
      const modalInstance = bootstrap.Modal.getInstance(existingModal);
      modalInstance.hide();
      setTimeout(() => {
        existingModal.remove();
      }, 300);
    }


    const modalHTML = `
      <div class="modal fade" id="modalCompra" tabindex="-1" aria-labelledby="modalCompraLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalCompraLabel">Whoops! Parece que te olvidaste de llenar los datos de envío...</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <ul>
                ${errors.map(error => `<li>${error}</li>`).join('')}
              </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);


    const modal = new bootstrap.Modal(document.getElementById('modalCompra'));
    modal.show();

    return false;
  }

  return true;
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