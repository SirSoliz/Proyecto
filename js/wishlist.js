// ==================== Wishlist de Barbería ====================

// 1. Lista de productos (puedes editar fácilmente este array)
const productos = [
  {
    id: 1,
    nombre: "Cera para el cabello",
    descripcion: "Fijación fuerte, acabado mate.",
    imagen: "../Images/wishList/cera.png"
  },
  {
    id: 2,
    nombre: "Crema de afeitar",
    descripcion: "Hidratante y suave para la piel.",
    imagen: "../Images/wishList/crema.png"
  },
  {
    id: 3,
    nombre: "Aceite para barba",
    descripcion: "Nutre y da brillo a la barba.",
    imagen: "../Images/wishList/aceite.png"
  },
  {
    id: 4,
    nombre: "Shampoo para barba",
    descripcion: "Limpieza profunda, aroma fresco.",
    imagen: "../Images/wishList/shampoo.png"
  },
  {
    id: 5,
    nombre: "Aftershave",
    descripcion: "Calma y refresca la piel.",
    imagen: "../Images/wishList/aftershave.png"
  },
  {
    id: 6,
    nombre: "Minoxidil 5%",
    descripcion: "Estimula el crecimiento capilar y de barba.",
    imagen: "../Images/wishList/minoxidil.png"
  },
  {
    id: 7,
    nombre: "Maquina de Afeitar Electrica",
    descripcion: "Afeitado rápido y cómodo, recargable.",
    imagen: "../Images/wishList/maquina-afeitar.png"
  }
];

// 2. Simulación de autenticación (ajusta según tu sistema real)
function getUsuarioLogueado() {
  // Usamos la clave 'currentUser' para unificar la sesión
  return JSON.parse(localStorage.getItem('currentUser')) || null;
}

// 3. Proteger la página: solo usuarios logueados pueden acceder
const usuario = getUsuarioLogueado();
if (!usuario || !usuario.email) {
  // Si no está logueado, redirige al login
  window.location.href = "../login.html";
}

// 4. Renderizar productos en cuadrícula
const productsGrid = document.getElementById("productsGrid");
productos.forEach(producto => {
  // Creamos una tarjeta de Bootstrap por producto
  const col = document.createElement("div");
  col.className = "col-12 col-sm-6 col-md-4 col-lg-3 d-flex";
  col.innerHTML = `
    <div class="card flex-fill h-100 shadow-sm">
      <img src="${producto.imagen}" class="card-img-top img-fluid" alt="${producto.nombre}" style="object-fit:cover;max-height:160px;">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title text-center">${producto.nombre}</h5>
        <p class="card-text text-center">${producto.descripcion}</p>
        <div class="mb-2 text-center">
          <label for="cantidad-${producto.id}" class="form-label mb-0">Cantidad:</label>
          <input type="number" id="cantidad-${producto.id}" class="form-control form-control-sm d-inline-block w-auto ms-2" min="1" value="1" style="width:60px;" />
        </div>
        <button class="btn btn-outline-warning mt-auto w-100" data-id="${producto.id}">
          Agregar a wishlist
        </button>
      </div>
    </div>
  `;
  productsGrid.appendChild(col);
});

// 5. Lógica para wishlist
let wishlist = [];
const wishlistList = document.getElementById("wishlist");
const wishlistMessage = document.getElementById("wishlistMessage");
const sendWishlistBtn = document.getElementById("sendWishlist");

// Manejar clicks en los botones de producto
productsGrid.addEventListener("click", function(e) {
  if (e.target.tagName === "BUTTON") {
    const id = parseInt(e.target.getAttribute("data-id"));
    const producto = productos.find(p => p.id === id);
    const cantidadInput = document.getElementById(`cantidad-${id}`);
    const cantidad = cantidadInput ? parseInt(cantidadInput.value) : 1;
    // Si no está en la wishlist, lo agregamos con cantidad
    if (!wishlist.some(p => p.id === id)) {
      wishlist.push({ ...producto, cantidad });
      renderWishlist();
    }
  }
});

// Renderizar la lista de productos seleccionados
function renderWishlist() {
  wishlistList.innerHTML = "";
  wishlist.forEach((p, idx) => {
    // Cada producto puede eliminarse de la lista y editar cantidad
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>${p.nombre}</span>
      <div class="input-group input-group-sm" style="width:120px;">
        <input type="number" class="form-control" min="1" value="${p.cantidad}" data-idx="${idx}" />
        <button class="btn btn-danger" data-remove="${p.id}">&times;</button>
      </div>
    `;
    wishlistList.appendChild(li);
  });
  sendWishlistBtn.disabled = wishlist.length === 0;
}

// Permitir quitar productos y editar cantidad en la wishlist
wishlistList.addEventListener("click", function(e) {
  if (e.target.tagName === "BUTTON" && e.target.hasAttribute("data-remove")) {
    const id = parseInt(e.target.getAttribute("data-remove"));
    wishlist = wishlist.filter(p => p.id !== id);
    renderWishlist();
  }
});
wishlistList.addEventListener("change", function(e) {
  if (e.target.tagName === "INPUT" && e.target.type === "number" && e.target.hasAttribute("data-idx")) {
    const idx = parseInt(e.target.getAttribute("data-idx"));
    const value = parseInt(e.target.value);
    if (value > 0) {
      wishlist[idx].cantidad = value;
    } else {
      wishlist[idx].cantidad = 1;
      e.target.value = 1;
    }
  }
});

// ==================== INTEGRACIÓN CON EMAILJS ====================
// 1. Inicializa EmailJS con tu User ID (NO el Service ID)
emailjs.init('2p9vFbazapEtsaXQ_');

// 2. Manejar el envío de la wishlist por correo
sendWishlistBtn.addEventListener("click", function() {
  // Validación: usuario debe estar logueado y tener email
  if (!usuario || !usuario.email) {
    wishlistMessage.innerHTML = '<div class="alert alert-danger">Debes iniciar sesión para enviar tu wishlist.</div>';
    return;
  }
  // Validación: debe haber productos en la wishlist
  if (wishlist.length === 0) {
    wishlistMessage.innerHTML = '<div class="alert alert-warning">Agrega productos a tu wishlist antes de enviarla.</div>';
    return;
  }
  // Construye la wishlist como texto plano para el correo
  let productosSeleccionados = 'Nombre del producto\t\t\t\tCantidad\n';
  productosSeleccionados += '-------------------\t\t\t\t--------\n';
  wishlist.forEach(p => {
    productosSeleccionados += `${p.nombre}\t\t${p.cantidad}\n`;
  });
  productosSeleccionados += `\nTotal de artículos: ${wishlist.reduce((sum, p) => sum + p.cantidad, 0)}`;
  // Prepara los parámetros EXACTOS que espera tu plantilla de EmailJS
  // 'productos' para el cuerpo, 'usuario' para el asunto (subject), 'to_email' para el destinatario
  // Usamos usuario.usuario porque así se guarda el nombre en localStorage
  const templateParams = {
    productos: productosSeleccionados,
    usuario: usuario.usuario,
    to_email: usuario.email
  };
  console.log('templateParams:', templateParams); // Depuración
  // Envía el correo usando EmailJS
  emailjs.send('service_5f5w65s', 'template_ioeaqci', templateParams)
    .then(function(response) {
      wishlistMessage.innerHTML = '<div class="alert alert-success">¡Wishlist enviada correctamente a tu correo!</div>';
      wishlist = [];
      renderWishlist();
      sendWishlistBtn.disabled = true;
    }, function(error) {
      wishlistMessage.innerHTML = '<div class="alert alert-danger">Error al enviar la wishlist. Intenta nuevamente.</div>';
      console.error('EmailJS error:', error); // Para depuración
    });
});