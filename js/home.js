
document.addEventListener('DOMContentLoaded', function() {
   
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.setProperty('--order', index);
    });

    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
         
            if (!e.target.classList.contains('add-button')) {
                const productId = this.getAttribute('data-id');
                window.location.href = `detail.html?id=${productId}`;
            }
        });
    });

    
    document.querySelectorAll('.add-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productId = this.getAttribute('data-id');
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
 
            const productImg = productCard.querySelector('.product-image img').cloneNode(true);
            const flyingItem = document.createElement('div');
            flyingItem.classList.add('flying-item');
            flyingItem.appendChild(productImg);
            document.body.appendChild(flyingItem);
            
         
            const rect = productCard.getBoundingClientRect();
            flyingItem.style.top = rect.top + 'px';
            flyingItem.style.left = rect.left + 'px';
            
     
            const endX = window.innerWidth - 50;
            const endY = 20;
            
          
            setTimeout(() => {
                flyingItem.style.transform = `translate(${endX - rect.left}px, ${endY - rect.top}px) scale(0.2)`;
                flyingItem.style.opacity = '0';
                
             
                setTimeout(() => {
                    if (document.body.contains(flyingItem)) {
                        document.body.removeChild(flyingItem);
                    }
                    
                    
                    addToCart(productId, productName, productPrice);
                }, 1000);
            }, 100);
        });
    });

  
    function addToCart(id, name, price) {
       
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
     
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
           
            existingItem.quantity += 1;
        } else {
            
            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
      
        const notification = document.createElement('div');
        notification.classList.add('cart-notification');
        notification.textContent = `${name} is toegevoegd aan je winkelmandje!`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show-notification');
            
            setTimeout(() => {
                notification.classList.remove('show-notification');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 500);
            }, 2000);
        }, 100);
        
       
        setTimeout(() => {
            window.location.href = 'winkel.html';
        }, 1500);
    }
});