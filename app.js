let productos = JSON.parse(localStorage.getItem('exotik_productos')) || {
    salchipapa_mixta: { nombre: "Salchipapa Mixta", categoria: "salchipapas", precio: 25000, cantidad: 0, imagen: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=300&q=80" },
    hamburguesa_exotik: { nombre: "Hamburguesa Exotik", categoria: "hamburguesas", precio: 22000, cantidad: 0, imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80" },
    miniburguer_sencilla: { nombre: "Minihamburguesa Clásica", categoria: "minihamburguesa", precio: 12000, cantidad: 0, imagen: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=300&q=80" },
    perro_especial: { nombre: "Perro Caliente Especial", categoria: "perras", precio: 15000, cantidad: 0, imagen: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=300&q=80" },
    gaseosa_400: { nombre: "Gaseosa 400ml", categoria: "gaseosas", precio: 5000, cantidad: 0, imagen: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80" }
};

let rolActual = '';

function seleccionarRol(rol) {
    rolActual = rol;
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appContainer').style.display = 'flex';
    document.getElementById('currentRoleLabel').innerText = rol.toUpperCase();

    const sectionCaja = document.getElementById('sectionCaja');
    const sectionCocina = document.getElementById('sectionCocina');
    const sectionGerencia = document.getElementById('sectionGerencia');

    if (rol === 'mesero') {
        sectionCaja.style.display = 'block';
        sectionCocina.style.display = 'none';
        sectionGerencia.style.display = 'none';
        renderizarMenu();
    } else if (rol === 'cocina') {
        sectionCaja.style.display = 'none';
        sectionCocina.style.display = 'block';
        sectionGerencia.style.display = 'none';
    } else if (rol === 'gerente') {
        sectionCaja.style.display = 'none';
        sectionCocina.style.display = 'block';
        sectionGerencia.style.display = 'block';
        actualizarPanelGerencia();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cerrarSesion() {
    document.getElementById('appContainer').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderizarMenu() {
    const container = document.getElementById('menuContainer');
    container.innerHTML = '';

    const categoriasOrden = ['salchipapas', 'hamburguesas', 'minihamburguesa', 'perras', 'gaseosas'];
    const nombresCategorias = {
        salchipapas: 'Salchipapas',
        hamburguesas: 'Hamburguesas',
        minihamburguesa: 'Minihamburguesa',
        perras: 'Perras',
        gaseosas: 'Gaseosas'
    };

    categoriasOrden.forEach(catKey => {
        let itemsEnCategoria = [];
        for (let key in productos) {
            if (productos[key].categoria === catKey) {
                itemsEnCategoria.push({ key: key, ...productos[key] });
            }
        }

        if (itemsEnCategoria.length > 0) {
            let titleDiv = document.createElement('h3');
            titleDiv.className = 'menu-category-title';
            titleDiv.innerText = nombresCategorias[catKey];
            container.appendChild(titleDiv);

            let listDiv = document.createElement('div');
            listDiv.className = 'products-list';

            itemsEnCategoria.forEach(prod => {
                let card = document.createElement('div');
                card.className = 'product-card';
                
                card.innerHTML = `
                    <img src="${prod.imagen}" alt="${prod.nombre}" onclick="cambiarCantidad('${prod.key}', 1)">
                    <div class="product-info" onclick="cambiarCantidad('${prod.key}', 1)">
                        <h3>${prod.nombre}</h3>
                        <div class="price-tag">$${prod.precio.toLocaleString('es-CO')}</div>
                        <div class="counter-badge">Cant: <span id="qty-${prod.key}">${prod.cantidad}</span></div>
                    </div>
                    <div class="waiter-actions" style="padding: 0 10px; display: flex; flex-direction: column; gap: 5px;">
                        <button class="btn-role" style="padding: 6px 10px; font-size: 0.8rem; margin: 0; background: #ff4d4d; color: white;" onclick="cambiarCantidad('${prod.key}', -1)" title="Restar o quitar">🗑️</button>
                    </div>
                `;
                listDiv.appendChild(card);
            });

            container.appendChild(listDiv);
        }
    });
}

function renderizarGerenteMenuList() {
    const gerenteMenuList = document.getElementById('gerenteMenuList');
    if (!gerenteMenuList) return;
    gerenteMenuList.innerHTML = '<label>Platos Actuales en el Menú:</label>';

    for (let key in productos) {
        let prod = productos[key];
        let row = document.createElement('div');
        row.className = 'gerente-item-row';
        row.innerHTML = `
            <span><b>[${prod.categoria.toUpperCase()}]</b> ${prod.nombre} ($${prod.precio.toLocaleString('es-CO')})</span>
            <button class="btn-delete-item" onclick="eliminarProductoMenu('${key}')">Eliminar</button>
        `;
        gerenteMenuList.appendChild(row);
    }
}

function agregarProductoMenu() {
    const categoria = document.getElementById('newProdCategory').value;
    const nombre = document.getElementById('newProdName').value.trim();
    const precio = parseFloat(document.getElementById('newProdPrice').value);
    const imageInput = document.getElementById('newProdImageFile');

    if (!nombre || isNaN(precio) || precio <= 0) {
        alert("Por favor ingresa un nombre y un precio válido.");
        return;
    }

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            guardarNuevoProducto(nombre, categoria, precio, e.target.result);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        guardarNuevoProducto(nombre, categoria, precio, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80");
    }
}

function guardarNuevoProducto(nombre, categoria, precio, imagenBase64) {
    const key = nombre.toLowerCase().replace(/[^a-z0-9]/g, '_');
    productos[key] = { nombre, categoria, precio, cantidad: 0, imagen: imagenBase64 };
    
    try {
        localStorage.setItem('exotik_productos', JSON.stringify(productos));
        if (rolActual === 'gerente') renderizarGerenteMenuList();
        if (rolActual === 'mesero') renderizarMenu();

        document.getElementById('newProdName').value = '';
        document.getElementById('newProdPrice').value = '';
        document.getElementById('newProdImageFile').value = '';
        alert("¡Producto agregado al menú con éxito!");
    } catch (error) {
        alert("La imagen seleccionada es demasiado pesada para el almacenamiento local. Intenta comprimirla o elegir una más ligera.");
    }
}

function eliminarProductoMenu(key) {
    if (confirm(`¿Estás seguro de eliminar este producto del menú?`)) {
        delete productos[key];
        localStorage.setItem('exotik_productos', JSON.stringify(productos));
        if (rolActual === 'gerente') renderizarGerenteMenuList();
        if (rolActual === 'mesero') renderizarMenu();
    }
}

function cambiarCantidad(item, cambio) {
    if (productos[item]) {
        productos[item].cantidad += cambio;
        if (productos[item].cantidad < 0) productos[item].cantidad = 0;
        
        const span = document.getElementById(`qty-${item}`);
        if (span) span.innerText = productos[item].cantidad;
        
        calcularTotalGeneral();
    }
}

function reiniciarPedido() {
    for (let key in productos) {
        productos[key].cantidad = 0;
        let span = document.getElementById(`qty-${key}`);
        if (span) span.innerText = "0";
    }
    calcularTotalGeneral();
}

function calcularTotalGeneral() {
    let total = 0;
    for (let key in productos) {
        total += productos[key].precio * productos[key].cantidad;
    }
    document.getElementById('spanTotalPagar').innerText = `$${total.toLocaleString('es-CO')}`;
    return total;
}

function procesarOrdenYPago() {
    const totalPagar = calcularTotalGeneral();
    const customerNotes = document.getElementById('customerNotes').value;

    if (totalPagar === 0) {
        alert("Por favor selecciona al menos un producto.");
        return;
    }

    let historialVentas = JSON.parse(localStorage.getItem('exotik_ventas_mes')) || [];
    historialVentas.push({ total: totalPagar, fecha: new Date().toISOString() });
    localStorage.setItem('exotik_ventas_mes', JSON.stringify(historialVentas));
    
    if (rolActual === 'gerente') {
        actualizarPanelGerencia();
    }

    let detalleProductosHTML = "";
    for (let key in productos) {
        if (productos[key].cantidad > 0) {
            detalleProductosHTML += `• ${productos[key].cantidad}x ${productos[key].nombre}<br>`;
        }
    }

    const kitchenQueue = document.getElementById('kitchenQueue');
    if (kitchenQueue.querySelector('p')) {
        kitchenQueue.innerHTML = "";
    }

    const orderId = Math.floor(Math.random() * 900) + 100;
    const orderDiv = document.createElement('div');
    orderDiv.className = 'kitchen-item';
    orderDiv.id = `order-${orderId}`;
    orderDiv.innerHTML = `
        <strong>Orden #${orderId}</strong><br>
        <span>📦 <b>Productos:</b><br>${detalleProductosHTML}</span>
        <span>📝 <b>Nota:</b> ${customerNotes ? customerNotes : 'Ninguna'}</span><br>
        <small style="color: gray;">🕒 Registrado a las ${new Date().toLocaleTimeString()}</small>
        <button class="btn-deliver-order" onclick="entregarPedido('${orderId}')">✅ Entregar Pedido</button>
    `;
    
    kitchenQueue.prepend(orderDiv);

    reiniciarPedido();
    document.getElementById('customerNotes').value = "";
    alert("¡Pedido enviado a cocina correctamente!");
}

function entregarPedido(orderId) {
    const orderEl = document.getElementById(`order-${orderId}`);
    if (orderEl) {
        orderEl.style.opacity = '0.5';
        orderEl.style.borderLeftColor = '#2e7d32';
        const btn = orderEl.querySelector('.btn-deliver-order');
        btn.innerText = '✔ Entregado';
        btn.disabled = true;
        btn.style.backgroundColor = '#9e9e9e';
        setTimeout(() => {
            orderEl.remove();
            const kitchenQueue = document.getElementById('kitchenQueue');
            if (kitchenQueue.children.length === 0) {
                kitchenQueue.innerHTML = '<p style="color: #777;">No hay órdenes pendientes en este momento.</p>';
            }
        }, 3000);
    }
}

function actualizarPanelGerencia() {
    let historialVentas = JSON.parse(localStorage.getItem('exotik_ventas_mes')) || [];
    
    let hoyStr = new Date().toDateString();
    let totalHoy = historialVentas
        .filter(v => new Date(v.fecha).toDateString() === hoyStr)
        .reduce((acc, v) => acc + v.total, 0);

    let totalMes = historialVentas.reduce((acc, v) => acc + v.total, 0);

    document.getElementById('dailyTotalText').innerText = `$${totalHoy.toLocaleString('es-CO')}`;
    document.getElementById('monthlyTotalText').innerText = `$${totalMes.toLocaleString('es-CO')}`;
    renderizarGerenteMenuList();
}

function eliminarHistorialVentas() {
    if (confirm("¿Estás seguro de eliminar todo el historial de ventas del mes? Esta acción no se puede deshacer.")) {
        localStorage.removeItem('exotik_ventas_mes');
        actualizarPanelGerencia();
        alert("Historial de ventas eliminado correctamente.");
    }
}