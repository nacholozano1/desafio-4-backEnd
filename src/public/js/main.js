// Establecer una conexión con el servidor utilizando socket.io
const socket = io();

// Obtener referencias a los formularios de agregar y eliminar productos
const addForm = document.getElementById("addProductForm");
const deleteForm = document.getElementById("deleteProductForm");

// Agregar un listener al formulario de agregar producto
addForm.addEventListener("submit", e => {
  e.preventDefault();

// Obtener los valores de los campos del formulario
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const code = document.getElementById("code").value;
  const stock = document.getElementById("stock").value;
  const category = document.getElementById("category").value;
  const thumbnails = [];
  const product = { 
    title, 
    description, 
    code, 
    price, 
    stock, 
    category, 
    thumbnails 
  };

// Emitir un mensaje al servidor para agregar el producto
  socket.emit("addProduct", product);
});

// Agregar un listener al formulario de eliminar producto
deleteForm.addEventListener("submit", e => {
  e.preventDefault();

// Obtener el valor del campo de ID de producto
  const productId = document.getElementById("prodId").value;

  // Emitir un mensaje al servidor para eliminar el producto
  socket.emit("deleteProduct", productId);
});

// Escuchar un mensaje del servidor de que se ha agregado un producto
socket.on("messageProductAdded", message => {
// Mostrar un mensaje de éxito al usuario

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

Toast.fire({
  title: `${message}`
});

console.log(message);
});

// Escuchar un mensaje del servidor de que se ha eliminado un producto
socket.on("messageProductDeleted", message => {
// Mostrar un mensaje de éxito al usuario
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

Toast.fire({
  title: `${message}`
});

  console.log(message);
});

// Escuchar un mensaje del servidor con una lista de productos
socket.on("getProducts", products => {
  const productsFromServer = document.getElementById("productsFromServer");
  productsFromServer.innerHTML = "";

  products.forEach(product => {
// Crear un elemento HTML para mostrar el producto
    const productElement = `
      <div>
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>Precio: $${product.price}</p>
        <p>Stock: ${product.stock} un.</p>
        <p>Código de producto: ${product.code}</p>
        <p>ID: ${product.id}</p>
        </div>
        `;

// Agregar el elemento del producto al contenedor productsFromServer
productsFromServer.innerHTML += productElement;
});
});

