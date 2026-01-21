let cart = [];

try {
    const stored = localStorage.getItem('shoppingCart');
    if (stored) cart = JSON.parse(stored);
} catch (e) {
    console.log('localStorage failed, starting fresh');
    cart = [];
}

console.log('Cart loaded:', cart.length, 'items');

document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    if (document.getElementById('cart-items-list')) {
        renderCart();
    }
});

const saveCart = function() {
    try {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    } catch (e) {
        console.log('Unable to save cart');
    }
}

function addToCart(name, price, btn) {
    const existing = cart.find(item => item.name === name);
    
    if (btn) {
        btn.classList.add('added');
        btn.textContent = '';
        
        setTimeout(function() {
            btn.classList.remove('added');
            btn.classList.add('view-cart');
            btn.textContent = 'VIEW CART';
            btn.onclick = function() { window.location.href = 'cart.html'; };
        }, 1500);
    }
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ 
            name: name, 
            price: price, 
            quantity: 1 
        });
    }
    
    saveCart();
    updateCartCount();
    console.log('Added to cart:', name);
}

function updateCartCount() {
    const el = document.getElementById('cart-count');
    if (el) {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        el.textContent = total;
    }
}

function renderCart() {
    const cartList = document.getElementById('cart-items-list');
    const cartSummary = document.getElementById('cart-summary');
    cartList.innerHTML = '';

    if (cart.length === 0) {
        cartList.innerHTML = '<div class="empty-cart">Your cart is currently empty.</div>';
        cartSummary.style.display = 'none';
        return;
    }

    cartSummary.style.display = 'block';
    let subtotal = 0;

    const productImages = {
        'The Lost Sheep Tee': 'images/image1.png',
        'Essential Cross Tee': 'images/image2.png',
        'Praise The Lord Tee': 'images/image3.png',
        'Faith Over Fear Hoodie': 'images/image4.png',
        'Fruit of the Spirit Tee': 'images/image5.png',
        'Jesus Saves Tee': 'images/image6.png',
        'Pray Wait Trust Tee': 'images/image7.png',
        'Faith Over Fear Bow Hoodie': 'images/image8.png',
        'God Bless Vintage Tee': 'images/image9.png',
        'Faith Typography Tee': 'images/image10.png'
    };

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        const itemImage = productImages[item.name] || 'images/image2.png';

        const cartItemHTML = `
            <div class="cart-item">
                <div class="item-details">
                    <img src="${itemImage}" alt="${item.name}">
                    <div>
                        <div class="item-name">${item.name}</div>
                        <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                    </div>
                </div>
                <div class="item-price">$${item.price.toFixed(2)}</div>
                <div class="item-quantity">
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                </div>
                <div class="item-subtotal">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
        cartList.innerHTML += cartItemHTML;
    });

    const total = subtotal;
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(index, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
        cart[index].quantity = quantity;
    } else {
        removeFromCart(index);
        return;
    }
    saveCart();
    updateCartCount();
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    renderCart();
}