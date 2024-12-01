import { PRODUCTS_URL, PRODUCT_INFO_COMMENTS_URL, CATEGORIES_PRODUCTS } from './init.js';

document.addEventListener("DOMContentLoaded", () => {
  obtenerProductos();
  actualizarBadge()
});

const idProducto = localStorage.getItem("prodId");

// Esta función obtiene los detalles de un producto específico desde un API y los envía a productosInfo.

function obtenerProductos() {
  
  fetch(`${PRODUCTS_URL}/${idProducto}`, {
    method: "GET",
    headers: {
      "access-token": localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Error");
    })
    .then((data) => {
      productosInfo(data);
    })
    .catch((error) => {
      throw new Error(error);
    });
}

// Esta función toma los datos del producto y los muestra en la página.

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
        ${imagenes
      .map(
        (imagen, pos) =>
          `<img src="${imagen}" alt="${nombre}" class="col-3 col-sm-2 m-1 miniatura p-0" data-index="${pos}">`
      )
      .join("")}
      </div>
    </figure>
    <div class="col-12 col-lg-5 pb-2">
      <p class="accentText">${categoria}</p>
      <h1 id="productName" class="strongText">${nombre}</h1>
      <p>${descripcion}</p>
      <p class="strongText">${moneda} <span id="productPrice">${costo}</span></p>
      <p class="lightText">${vendidos} vendidos</p>
      <div class="divCantidad pt-4">
        <button class="btn-resta btnSumaResta">-</button>
        <input type="number" class="cantidadProducto" value="1" min="1">
        <button class="btn-suma btnSumaResta">+</button>
        <button id="btnComprar" class="botonNaranja">Comprar</button>
      </div>
    </div>
  </section>
      `;

  configurarMiniaturas(imagenes);
  obtenerComentarios();
  obtenerDatosProductosRelacionados(productosRelacionados);

  // Agregar listener al botón de compra
  document.getElementById("btnComprar").addEventListener("click", comprarProducto);
}

//funcion para el boton de comprar producto

function comprarProducto() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const productoComprado = {
    id: idProducto,
    nombre: document.querySelector("#productName").textContent,
    costo: parseFloat(document.querySelector("#productPrice").textContent.replace(/[^0-9.-]+/g, "")),
    imagen: document.querySelector("#imagenPrincipal").src,
    cantidad: parseInt(document.querySelector(".cantidadProducto").value)
  };

  const productoExistente = carrito.find(producto => producto.id === idProducto);

  if (productoExistente) {
    productoExistente.cantidad += productoComprado.cantidad;
  } else {
    carrito.push(productoComprado);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarModalCompra();
  actualizarBadge();
}

document.addEventListener("click", function(event) {
  if (event.target.classList.contains("btn-suma") || event.target.classList.contains("btn-resta")) {
    let cantidadInput = event.target.classList.contains("btn-suma")
      ? event.target.previousElementSibling
      : event.target.nextElementSibling;

    let cantidadActual = parseInt(cantidadInput.value);

    if (event.target.classList.contains("btn-suma")) {
      cantidadActual += 1;
    } else if (cantidadActual > 1) { 
      cantidadActual -= 1;
    }

    cantidadInput.value = cantidadActual;
  }
});

// Función para mostrar el modal
function mostrarModalCompra() {
  const modalHTML = `
    <div class="modal fade" id="modalCompra" tabindex="-1" aria-labelledby="modalCompraLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalCompraLabel">Producto Añadido al Carrito</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>El producto ha sido añadido al carrito. ¿Qué deseas hacer ahora?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Seguir Comprando</button>
            <button type="button" class="btn btn-primary" id="btnIrCarrito">Ir al Carrito</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Insertar el modal en el documento y mostrarlo
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  const modal = new bootstrap.Modal(document.getElementById("modalCompra"));
  modal.show();

  // Asignar evento al botón "Ir al Carrito"
  document.getElementById("btnIrCarrito").addEventListener("click", () => {
    window.location.href = "cart.html";
  });
}

// Esta función agrega un evento click a cada miniatura de imagen para cambiar la imagen principal del producto.

function configurarMiniaturas(imagenes) {
  let miniaturas = document.querySelectorAll(".miniatura");

  miniaturas.forEach((img) => {
    img.removeEventListener("click", cambiarImagen);
    img.addEventListener("click", cambiarImagen);
  });

  function cambiarImagen(event) {
    event.preventDefault();

    let pos = this.getAttribute("data-index");
    document.querySelector("#imagenPrincipal").src = imagenes[pos];
  }
}

// Esta función obtiene los comentarios del producto desde un API y los muestra.

function obtenerComentarios() {
  const idProducto = localStorage.getItem("prodId");

  fetch(`${PRODUCT_INFO_COMMENTS_URL}/${idProducto}`, {
    method: "GET",
    headers: {
      "access-token": localStorage.getItem("token"),
    },
  })
    .then((resp) => {
      if (resp.ok) {
        return resp.json();
      }
      throw new Error("Error en la solicitud");
    })
    .then((data) => {
      mostrarComentarios(data);
    })
    .catch((error) => {
      throw new Error("Ocurrio un error:", error);
    });
}

// Esta función muestra los comentarios obtenidos, incluyendo la fecha y las estrellas de calificación.

function mostrarComentarios(comentarios) {
  let sectionComentarios = ``;

  comentarios.forEach(com => {
    let dateObj = new Date(com.dateTime);
    let opcionesFecha = { day: 'numeric', month: 'long', year: 'numeric' };
    let fechaFormateada = dateObj.toLocaleDateString('es-ES', opcionesFecha);

    sectionComentarios += `
          <article class="comentario-calificaciones col-12 col-md-6 col-lg-4">
            <div class='contenedorSuperiorClasificaciones'>
              <p class="userCalificaciones fw-bold">${com.user}</p>
              <p class="fechaCalificaciones">${fechaFormateada}</p>
            </div>
              <div class="estrellas"></div>
              <p class="comentarioCalificaciones">${com.description}</p>
          </article>`;
  });

  let section = document.querySelector("#ListaComentarios");
  section.innerHTML += sectionComentarios;

  let estrellasDivs = section.querySelectorAll(".estrellas");
  comentarios.forEach((com, index) => {
    let estrellasDiv = estrellasDivs[index];

    for (let i = 0; i < com.score; i++) {
      let estrella = document.createElement("i");
      estrella.classList.add("fas", "fa-star");
      estrella.style.color = "yellow";
      estrellasDiv.appendChild(estrella);
    }
    for (let j = com.score; j < 5; j++) {
      let estrella = document.createElement("i");
      estrella.classList.add("fas", "fa-star");
      estrella.style.color = "grey";
      estrellasDiv.appendChild(estrella);
    }
  });
}

// Función que obtiene los datos de los productos relacionados utilizando un array de IDs

function obtenerDatosProductosRelacionados(arrayProductosRelacionados) {
  let idProducto = localStorage.getItem("catID");
  console.log(idProducto);
  
  fetch(`${CATEGORIES_PRODUCTS}/${idProducto}`, {
    method: "GET",
    headers: {
      "access-token": localStorage.getItem("token"),
    },
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Error al acceder a la URL");
    })
    .then(function (data) {
      mostrarInfoProductosRel(data.products, arrayProductosRelacionados);
    })
    .catch(function (error) {
      console.error(error);
    });
}

function mostrarInfoProductosRel(productos, arrayProductosRelacionados) {
  let cadena = `<h3 class="accentText px-5 py-2">Productos relacionados</h3>`;

  arrayProductosRelacionados.forEach((element) => {
    let productoRelacionado = productos.find((p) => p.id === element.id);
    if (productoRelacionado) {
      cadena += `
            <article class="row align-items-center articuloProductosLineal col-12 my-3 mx-1" onclick="mostrarProductoRelacionado(${productoRelacionado.id})">
                <figure class="col-12 col-md-2 m-auto">
                    <img src="${productoRelacionado.image}" class="img-fluid imgProductosLineal p-2">
                </figure>
                <div class="col-12 col-md-2">
                    <h5 class="mb-1">${productoRelacionado.name}</h5>
                    <p class="cantidadVendidos m-0">${productoRelacionado.soldCount} vendidos</p>
                </div>
                <div class="col-12 col-md-6 m-0">
                    <p class="">${productoRelacionado.description}</p>
                </div>
                <div class="col-12 col-md-2 text-end">
                    <p class="price text-muted"><span class="currency">${productoRelacionado.currency}</span>${productoRelacionado.cost}</p>
                </div>
            </article>
            `;
    }
  });

  let section = document.querySelector("#sectionProductosRelacionados");
  section.innerHTML += cadena;
}

// Función para mostrar el producto relacionado cuando se selecciona uno de la lista

window.mostrarProductoRelacionado = function (id) {
  localStorage.setItem("prodId", id);
  window.location.href = window.location.href;
};

//FUNCION PARA LOS COMENTARIOS NUEVOS

let ComentariosData = [];
let ratingValue = 0;

const emojis = document.querySelectorAll(".star-rating input");
emojis.forEach((emoji) => {
  emoji.addEventListener("change", () => {
    ratingValue = emoji.value;
  });
});

// Función que muestra los nuevos comentarios agregados dinámicamente en la lista de comentarios

function mostrarComentariosNuevos(comments) {
  const ListaComentarios = document.getElementById("ListaComentarios");
  ListaComentarios.innerHTML = "";

  comments.forEach((comentario) => {
    const listaItem = document.createElement("li");
    listaItem.classList.add("comentario");
    let estrellas = "";

    for (let i = 0; i < comentario.rating; i++) {
      estrellas += '<i class="fas fa-star" style="color: yellow;"></i>';
    }
    for (let j = comentario.rating; j < 5; j++) {
      estrellas += '<i class="fas fa-star" style="color: grey;"></i>';
    }
    listaItem.innerHTML = `
    <article class="comentario-calificaciones">
          <div class="contenedorSuperiorClasificaciones">
            <p class="userCalificaciones fw-bold">${comentario.user}</p>
            <p class="fechaCalificaciones">${comentario.date}</p>
          </div>
          <span>${estrellas}</span>
          <p class= "comentarioCalificaciones">${comentario.comment}</p>
      </div> 
    </article>`;

    ListaComentarios.appendChild(listaItem);
  });
}

// Evento que maneja el botón para agregar un nuevo comentario, verificando los campos y recargando la lista

document.getElementById("btnAgregarComentarios").addEventListener("click", (event) => {
  event.preventDefault();
  const commentInput = document.getElementById("ComentarioInput").value;
  const username = localStorage.getItem("username");
  const fechaActual = new Date();
  const opciones = { day: '2-digit', month: 'long', year: 'numeric' };
  const fechaFormateada = fechaActual.toLocaleDateString('es-ES', opciones);

  if (commentInput && ratingValue) {
    const nuevoComentario = {
      comment: commentInput,
      rating: parseInt(ratingValue),
      user: username,
      date: fechaFormateada,
    };

    ComentariosData.push(nuevoComentario);
    sessionStorage.setItem("comentarios", JSON.stringify(ComentariosData));
    mostrarComentariosNuevos(ComentariosData);

    document.getElementById("ComentarioInput").value = "";
    ratingValue = 0;
    emojis.forEach((emoji) => (emoji.checked = false));

    var modal = bootstrap.Modal.getInstance(
      document.getElementById("comentarioModal")
    );
    modal.hide();
    setTimeout(() => {
      location.reload();
    }, 10);
  } else {
    alert("Por favor, completa todos los campos y selecciona un puntaje.");
  }
});

// Carga los comentarios guardados en sessionStorage al cargar la página

document.addEventListener("DOMContentLoaded", () => {
  const savedComments = sessionStorage.getItem("comentarios");
  if (savedComments) {
    ComentariosData = JSON.parse(savedComments);
    mostrarComentariosNuevos(ComentariosData);
    sessionStorage.removeItem("comentarios");
  }
});
