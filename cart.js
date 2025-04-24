// Initialize cart array
let cart = [];

// DOM Elements
const cartDropdown = document.getElementById('cartDropdown');
const cartItemsContainer = document.getElementById('cartItems');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const cartCount = document.querySelector('.cart-count');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartGST = document.getElementById('cartGST');
const cartTotal = document.getElementById('cartTotal');
const cartDropdownItems = document.getElementById('cartDropdownItems');
const cartDropdownSubtotal = document.getElementById('cartDropdownSubtotal');
const cartDropdownGST = document.getElementById('cartDropdownGST');
const cartDropdownTotal = document.getElementById('cartDropdownTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCart');

// Load cart from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartUI();
    setupEventListeners();
});

// Load cart from localStorage
function loadCart() {
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
        showNotification('Error loading cart. Please refresh the page.', 'error');
    }
}

// Save cart to localStorage
function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart:', error);
        showNotification('Error saving cart. Please try again.', 'error');
    }
}

// Add item to cart
function addToCart(numberData) {
    try {
        // Validate numberData
        if (!numberData || !numberData.number || !numberData.type || !numberData.price) {
            throw new Error('Invalid item data');
        }

        // Check if item already exists in cart
        const existingItem = cart.find(item => item.number === numberData.number);
        if (existingItem) {
            showNotification('Number already in cart', 'error');
            return false;
        }

        cart.push(numberData);
        saveCart();
        updateCartUI();
        showNotification('Added to cart successfully', 'success');
        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding item to cart. Please try again.', 'error');
        return false;
    }
}

// Remove item from cart
function removeFromCart(index) {
    try {
        if (index < 0 || index >= cart.length) {
            throw new Error('Invalid item index');
        }
        cart.splice(index, 1);
        saveCart();
        updateCartUI();
        showNotification('Item removed from cart', 'success');
    } catch (error) {
        console.error('Error removing from cart:', error);
        showNotification('Error removing item from cart. Please try again.', 'error');
    }
}

// Update cart UI
function updateCartUI() {
    try {
        // Update cart count
        cartCount.textContent = cart.length;

        // Update both main cart and dropdown cart
        updateCartItems(cartItemsContainer, cart);
        updateCartItems(cartDropdownItems, cart);

        // Show/hide empty cart message
        const isEmpty = cart.length === 0;
        emptyCartMessage.style.display = isEmpty ? 'block' : 'none';
        cartItemsContainer.style.display = isEmpty ? 'none' : 'block';

        // Calculate and update totals
        updateCartTotals();
    } catch (error) {
        console.error('Error updating cart UI:', error);
        showNotification('Error updating cart. Please refresh the page.', 'error');
    }
}

// Highlight matching digits in phone number
function highlightNumber(number) {
    console.log("Highlighting number:", number);
    if (!number) {
        console.log("Number is empty, returning empty string");
        return '';
    }
    
    // Convert number to string if it's not already
    const numStr = number.toString();
    console.log("Number as string:", numStr);
    
    // Find repeating patterns (like 666666, 999999, etc.)
    const repeatingPatterns = [];
    for (let i = 0; i < numStr.length; i++) {
        for (let j = i + 1; j < numStr.length; j++) {
            const pattern = numStr.substring(i, j + 1);
            if (pattern.length >= 3 && isRepeatingPattern(pattern)) {
                console.log("Found repeating pattern:", pattern);
                repeatingPatterns.push({
                    start: i,
                    end: j,
                    pattern: pattern
                });
            }
        }
    }
    
    console.log("All repeating patterns:", repeatingPatterns);
    
    // Sort patterns by length (longest first) to prioritize longer patterns
    repeatingPatterns.sort((a, b) => (b.end - b.start) - (a.end - a.start));
    
    // Create highlighted HTML
    let result = '';
    let lastIndex = 0;
    
    // Process each pattern
    for (const pattern of repeatingPatterns) {
        // Add text before the pattern
        if (pattern.start > lastIndex) {
            result += numStr.substring(lastIndex, pattern.start);
        }
        
        // Add highlighted pattern
        result += `<span class="highlight">${pattern.pattern}</span>`;
        
        lastIndex = pattern.end + 1;
    }
    
    // Add remaining text
    if (lastIndex < numStr.length) {
        result += numStr.substring(lastIndex);
    }
    
    console.log("Final highlighted result:", result);
    return result;
}

// Check if a string is a repeating pattern
function isRepeatingPattern(str) {
    // Check for same digit repeated (e.g., 666666)
    if (/^(\d)\1+$/.test(str)) return true;
    
    // Check for alternating pattern (e.g., 121212)
    if (str.length >= 4) {
        const half = Math.floor(str.length / 2);
        const firstHalf = str.substring(0, half);
        const secondHalf = str.substring(half);
        if (firstHalf === secondHalf) return true;
    }
    
    // Check for sequential numbers (e.g., 123456)
    if (/^(\d)(\d)(\d)(\d)(\d)(\d)$/.test(str)) {
        const digits = str.split('').map(Number);
        let isSequential = true;
        for (let i = 1; i < digits.length; i++) {
            if (digits[i] !== (digits[i-1] + 1) % 10) {
                isSequential = false;
                break;
            }
        }
        if (isSequential) return true;
    }
    
    return false;
}

// Update cart items container
function updateCartItems(container, items) {
    console.log("Updating cart items container:", container.id);
    console.log("Items to display:", items);
    
    container.innerHTML = '';
    items.forEach((item, index) => {
        console.log("Processing item:", item);
        
        const cartItem = document.createElement('div');
        cartItem.className = container.id === 'cartDropdownItems' ? 'cart-dropdown-item' : 'cart-item';
        
        // Highlight the number
        const highlightedNumber = highlightNumber(item.number);
        console.log("Highlighted number:", highlightedNumber);
        
        cartItem.innerHTML = `
            <div class="${container.id === 'cartDropdownItems' ? 'cart-dropdown-item-number' : 'cart-item-number'}">${highlightedNumber}</div>
            <div class="${container.id === 'cartDropdownItems' ? 'cart-dropdown-item-details' : 'cart-item-details'}">
                <div class="${container.id === 'cartDropdownItems' ? 'cart-dropdown-item-type' : 'cart-item-type'}">${item.type}</div>
                <div class="${container.id === 'cartDropdownItems' ? 'cart-dropdown-item-price' : 'cart-item-price'}">₹${item.price}</div>
            </div>
            <button class="${container.id === 'cartDropdownItems' ? 'cart-dropdown-remove' : 'remove-item'}" onclick="removeFromCart(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(cartItem);
    });
}

// Update cart totals
function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
    const gst = subtotal * 0.18; // 18% GST
    const total = subtotal + gst;

    // Update main cart totals
    cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    cartGST.textContent = `₹${gst.toFixed(2)}`;
    cartTotal.textContent = `₹${total.toFixed(2)}`;

    // Update dropdown cart totals
    cartDropdownSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    cartDropdownGST.textContent = `₹${gst.toFixed(2)}`;
    cartDropdownTotal.textContent = `₹${total.toFixed(2)}`;
}

// Clear cart
function clearCart() {
    try {
        cart = [];
        saveCart();
        updateCartUI();
        showNotification('Cart cleared', 'success');
    } catch (error) {
        console.error('Error clearing cart:', error);
        showNotification('Error clearing cart. Please try again.', 'error');
    }
}

// Toggle cart dropdown
function toggleCart() {
    cartDropdown.classList.toggle('show');
    document.getElementById('cartOverlay').classList.toggle('show');
}

// Close cart dropdown
function closeCart() {
    cartDropdown.classList.remove('show');
    document.getElementById('cartOverlay').classList.remove('show');
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Cart is empty', 'error');
        return;
    }

    // Save cart state before proceeding
    saveCart();
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 4px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                opacity: 0;
                transform: translateY(-20px);
                transition: all 0.3s ease;
            }
            .notification.success {
                background-color: #4CAF50;
            }
            .notification.error {
                background-color: #f44336;
            }
        `;
        document.head.appendChild(style);
    }

    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if (!cartDropdown.contains(e.target) && 
            !e.target.closest('.cart-btn') && 
            cartDropdown.classList.contains('show')) {
            closeCart();
        }
    });

    // Close cart when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartDropdown.classList.contains('show')) {
            closeCart();
        }
    });
}

// Event Listeners
cartBtn.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', toggleCart);

// Handle checkout button click
checkoutBtn.addEventListener('click', proceedToCheckout); 