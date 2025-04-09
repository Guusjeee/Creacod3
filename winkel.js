document.addEventListener('DOMContentLoaded', function() {
   
    loadCart();
    
  
    function addClickAnimation(element, className) {
        element.classList.add(className);
        setTimeout(() => {
            element.classList.remove(className);
        }, 500);
    }
    

    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener('click', function() {
     
        addClickAnimation(this, 'clicked');
        
        if (getCartItems().length > 0) {
          
            setTimeout(() => {
                
                const checkoutForm = document.getElementById('checkout-form');
                checkoutForm.style.display = 'block';
                
             
                setTimeout(() => {
                    checkoutForm.classList.add('visible');
                    
                    checkoutForm.scrollIntoView({ behavior: 'smooth' });
                }, 50);
            }, 300);
        } else {
            alert('Je winkelmandje is leeg.');
        }
    });

 
    const orderForm = document.getElementById('order-form');
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
     
        if (this.checkValidity()) {
            
            const submitButton = this.querySelector('.submit-button');
            addClickAnimation(submitButton, 'clicked');
     
            setTimeout(() => {
             
                const orderData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    postalCode: document.getElementById('postal-code').value,
                    city: document.getElementById('city').value,
                    notes: document.getElementById('notes').value,
                    items: getCartItems()
                };
                
                
                console.log('Bestelling geplaatst:', orderData);
                
           
                alert('Bedankt voor je bestelling!\nJe ontvangt binnenkort een bevestiging per e-mail.');
                
               
                localStorage.removeItem('winkelmandje');
                
              
                window.location.reload();
            }, 300);
        } else {
          
            const invalidFields = this.querySelectorAll(':invalid');
            if (invalidFields.length > 0) {
                invalidFields[0].focus();
            }
        }
    });

   
    const formFields = document.querySelectorAll('#order-form input, #order-form textarea');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        field.addEventListener('input', function() {
            validateField(this);
        });
    });
});


function validateField(field) {
    if (field.checkValidity()) {
        field.classList.remove('invalid');
        const errorMessage = field.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.style.display = 'none';
        }
    } else {
        field.classList.add('invalid');
        const errorMessage = field.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.style.display = 'block';
        }
    }
}


function addClickAnimation(element, className) {
    element.classList.add(className);
    setTimeout(() => {
        element.classList.remove(className);
    }, 500);
}


function loadCart() {
    const cartItems = getCartItems();
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    
   
    cartItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
      
        cartItemsContainer.style.display = 'none';
        document.querySelector('.cart-summary').style.display = 'none';
        emptyCartMessage.style.display = 'block';
      
        document.getElementById('checkout-form').style.display = 'none';
        document.getElementById('checkout-form').classList.remove('visible');
        return;
    }
    
  
    cartItemsContainer.style.display = 'flex';
    document.querySelector('.cart-summary').style.display = 'flex';
    emptyCartMessage.style.display = 'none';
    
   
    cartItems.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartItemsContainer.appendChild(cartItemElement);
    });
    
 
    updateTotalPrice();
}


function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.id = item.id;
    cartItem.dataset.size = item.size;
    
 
    const priceValue = parseFloat(item.price.replace('€', '').replace(',', '.').trim());
    
    cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-size">Maat: ${item.size}</div>
            <div class="cart-item-price">${item.price}</div>
        </div>
        <div class="cart-item-quantity">
            <button class="quantity-button decrease">-</button>
            <input type="number" value="${item.quantity}" min="1" class="quantity-input" readonly>
            <button class="quantity-button increase">+</button>
            <button class="remove-button">Verwijderen</button>
        </div>
    `;
    
 
    const decreaseButton = cartItem.querySelector('.decrease');
    const increaseButton = cartItem.querySelector('.increase');
    const removeButton = cartItem.querySelector('.remove-button');
    const quantityInput = cartItem.querySelector('.quantity-input');
    
    decreaseButton.addEventListener('click', function() {
      
        addClickAnimation(this, 'clicked');
        
        if (parseInt(quantityInput.value) > 1) {
          
            setTimeout(() => {
                quantityInput.value = parseInt(quantityInput.value) - 1;
                updateCartItemQuantity(item.id, item.size, parseInt(quantityInput.value));
            }, 150);
        }
    });
    
    increaseButton.addEventListener('click', function() {
      
        addClickAnimation(this, 'clicked');
        
  
        setTimeout(() => {
            quantityInput.value = parseInt(quantityInput.value) + 1;
            updateCartItemQuantity(item.id, item.size, parseInt(quantityInput.value));
        }, 150);
    });
    
    removeButton.addEventListener('click', function() {
     
        addClickAnimation(this, 'clicked');
        
       
        setTimeout(() => {
            removeCartItem(item.id, item.size);
        }, 300);
    });
    
    return cartItem;
}


function getCartItems() {
    return JSON.parse(localStorage.getItem('winkelmandje')) || [];
}


function updateCartItemQuantity(id, size, quantity) {
    let cart = getCartItems();
    
    const itemIndex = cart.findIndex(item => item.id === id && item.size === size);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
        localStorage.setItem('winkelmandje', JSON.stringify(cart));
        updateTotalPrice();
    }
}


function removeCartItem(id, size) {
    let cart = getCartItems();
    
    const newCart = cart.filter(item => !(item.id === id && item.size === size));
    
    localStorage.setItem('winkelmandje', JSON.stringify(newCart));
    loadCart();
}


function updateTotalPrice() {
    const cartItems = getCartItems();
    let total = 0;
    
    cartItems.forEach(item => {
      
        const priceValue = parseFloat(item.price.replace('€', '').replace(',', '.').trim());
        total += priceValue * item.quantity;
    });
    

    document.getElementById('cart-total-price').textContent = `€ ${total.toFixed(2).replace('.', ',')}`;
    
   
    updateCartCounter();
}


function updateCartCounter() {
    const cart = getCartItems();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
  
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'block' : 'none';
    }
}