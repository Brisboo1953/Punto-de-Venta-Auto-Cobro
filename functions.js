
let codigoBarras = "";  //Codigo de barras cargado

// Detecta el escaneo del código de barras
document.addEventListener('keydown', function (event) {
    const key = event.key;

    //Simula el Enter al momento de scannear
    if (key.length === 1 && key !== "Enter") {
        codigoBarras += key;
    }

    if (key === "Enter") {
        if (codigoBarras) {
            productoEscaneado();
            codigoBarras = ""; //Resetear el codigo de barras
        }
    }
});

//Base de datos como array asociativo
const productosDb = [
    { codigo: "987654321098", nombre: "Choco Flan", precio: 250.0 },
    { codigo: "543216789012", nombre: "Pavlova", precio: 500.0 },
    { codigo: "102938475601", nombre: "Pastel Red Velvet", precio: 350.0 },
    { codigo: "564738291054", nombre: "Pastel de Oreo", precio: 550.0 },
    { codigo: "675849302107", nombre: "Pastel estilo Cake Boss", precio: 1000.0 },
    { codigo: "938475610293", nombre: "Mis Suspiros Special", precio: 250.0 },
    { codigo: "102938547675", nombre: "Pastel de fresas", precio: 400.0 },
    { codigo: "748392019283", nombre: "Bollito de Fresa", precio: 50.0 },
    { codigo: "304758291067", nombre: "Pastel de Chocolate", precio: 450.0 }
];

var carrito = [];

function productoEscaneado() {

    var codigoProducto = document.getElementById("codigo").value;

    //Validación de producto existente en la "base de datos"
    var buscarProducto = productosDb.find(producto => producto.codigo === codigoProducto || producto.codigo === codigoBarras);

    if (!buscarProducto) {
        document.getElementById("codigo").value = "";
        alert("No existe ese producto");
        return;
    }

    //Validación, checa, revisa e incluye productos dentro del array de "carrito"
    var carritoProducto = carrito.find(carrProducto => carrProducto.codigo === codigoProducto || carrProducto.codigo === codigoBarras)

    if (!carritoProducto) {
        carrito.push({
            ...buscarProducto,
            cantidad: 1,
            subtotal: buscarProducto.precio
        });
    } else {
        carritoProducto.cantidad += 1;
        carritoProducto.subtotal = carritoProducto.cantidad * carritoProducto.precio;
    }

    document.getElementById("codigo").value = "";
    actualizarTabla();

}

function actualizarTabla() {

    var table = document.getElementById("cuerpo-tabla");

    table.innerHTML = "";

    let cantidad = 0;
    let total = 0;

    //Actualiza la tabla del HTML con la información correspondiente en base al producto scanneado
    carrito.forEach(product => {
        cantidad += product.cantidad;
        total += product.subtotal;

        const row =
            `
        <tr>
            <td>${product.cantidad}</td>
            <td>${product.nombre}</td>
            <td>$${product.subtotal.toFixed(2)}</td>
            <td><button id="boton-eliminar" onclick="borrarProducto('${product.codigo}')"></button></td>  
        </tr>
        `;

        table.innerHTML += row;

    });

    //Cantidad y total a pagar que se mostrará en el HTML
    document.getElementById("precioTotal").textContent = "Total: " + total.toFixed(2);
    document.getElementById("cantidadTotal").textContent = "Cantidad: " + cantidad;


}

//Filtrar los productos que no se quieren y eliminarlos + actualizar la tabla
function borrarProducto(codigo) {
    carrito = carrito.filter(prod => prod.codigo !== codigo);
    actualizarTabla();

}

//Verá si hay productos por pagar y se pagará o no en base a eso
function pagar() {
    if (!carrito.length) {
        alert("No hay que pagar nada");
        return;
    }

    alert(`Total a pagar: $` + document.getElementById("precioTotal").textContent);

    carrito = [];
    actualizarTabla();
}

