
const products = {
    "1": { 
        name: "Oversized T-Shirt", 
        price: "€ 34,99", 
        color: "Wit",
        image: "media/shirt.png"
    },
    "2": { 
        name: "Oversized T-Shirt", 
        price: "€ 34,99", 
        color: "Grijs",
        image: "media/shirt2.png"
    },
    "3": { 
        name: "Jeans blauw", 
        price: "€ 39,99", 
        color: "Blauw",
        image: "media/jeans-1.webp"
    },
    "4": { 
        name: "Flair Jeans", 
        price: "€ 24,99", 
        color: "Donkerblauw",
        image: "media/jeans-2.png"
    },
    "5": { 
        name: "Arte Sweater", 
        price: "€ 49,99", 
        color: "Zwart",
        image: "media/shirt3.png"
    },
    "6": { 
        name: "Arte Jacket", 
        price: "€ 19,99", 
        color: "Groen",
        image: "media/shirt4.png"
    },
    "7": { 
        name: "Oversized T-Shirt", 
        price: "€ 59,99", 
        color: "Rood",
        image: "media/shirt5.png"
    },
    "8": { 
        name: "Olaf Sweater", 
        price: "€ 14,99", 
        color: "Wit",
        image: "media/shirt6.png"
    },
    "9": { 
        name: "Oversized T-Shirt", 
        price: "€ 29,99", 
        color: "Zwart",
        image: "media/shirt7.png"
    },
    "10": { 
        name: "Oversized Hoodie", 
        price: "€ 44,99", 
        color: "Grijs",
        image: "media/shirt8.png"
    },
    "11": { 
        name: "Lola Sweater", 
        price: "€ 27,99", 
        color: "Groen",
        image: "media/shirt9.png"
    },
    "12": { 
        name: "Black shirt", 
        price: "€ 32,99", 
        color: "Zwart",
        image: "media/shirt10.png"
    },
};


const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id') || "3"; 


function loadProductDetails(id) {
    const product = products[id];
    
    if (product) {
        document.getElementById('product-title').textContent = product.name;
        document.getElementById('product-price').textContent = product.price;
        document.getElementById('product-color').textContent = `Kleur: ${product.color}`;
        document.getElementById('product-img').src = product.image;
        document.getElementById('product-img').alt = product.name;
        document.title = `Stijlspins - ${product.name}`;
    }
}


function updateCartCounter() {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'block' : 'none';
    }
}


function getCart() {
    return JSON.parse(localStorage.getItem('winkelmandje')) || [];
}


function addClickAnimation(element, className) {
    element.classList.add(className);
    setTimeout(() => {
        element.classList.remove(className);
    }, 500);
}


document.addEventListener('DOMContentLoaded', function() {
    loadProductDetails(productId);
    updateCartCounter();
    
  
    let selectedSize = null;
    
    document.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', function() {
           
            document.querySelectorAll('.size-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            
            this.classList.add('selected');
            selectedSize = this.getAttribute('data-size');
            
         
            addClickAnimation(this, 'clicked');
        });
    });
    
   
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    addToCartBtn.addEventListener('click', function() {
      
        addClickAnimation(this, 'clicked');
        
        if (!selectedSize) {
            alert('Selecteer eerst een maat');
            return;
        }
        
        const product = products[productId];
        
   
        let cart = getCart();
        
       
        const existingItemIndex = cart.findIndex(item => 
            item.id === productId && item.size === selectedSize
        );
        
        if (existingItemIndex !== -1) {
           
            cart[existingItemIndex].quantity += 1;
        } else {
           
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                size: selectedSize,
                image: product.image,
                quantity: 1
            });
        }
        
     
        localStorage.setItem('winkelmandje', JSON.stringify(cart));
        
       
        updateCartCounter();
        
        
        setTimeout(() => {
            alert(`${product.name} (maat ${selectedSize}) is toegevoegd aan je winkelmandje!`);
            window.location.href = 'winkel.html';
        }, 300);
    });
});