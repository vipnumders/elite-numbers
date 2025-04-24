// Common authentication functionality for all pages

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userData = isLoggedIn ? JSON.parse(localStorage.getItem('userData')) : null;
    
    // Get DOM elements
    const userInfo = document.getElementById('user-info');
    const logoutBtn = document.getElementById('logout-btn');
    const authButtons = document.getElementById('auth-buttons');
    const userName = document.getElementById('user-name');
    
    // Update UI based on login state
    if (isLoggedIn && userData) {
        // Show user info and hide auth buttons
        if (userInfo) userInfo.style.display = 'flex';
        if (authButtons) authButtons.style.display = 'none';
        
        // Update username display
        if (userName) {
            userName.textContent = `Welcome, ${userData.name || userData.email}`;
        }
        
        // Show premium features
        const premiumElements = document.querySelectorAll('.premium-content');
        premiumElements.forEach(element => {
            element.classList.remove('hidden');
        });
        
        // Handle cart items persistence
        if (typeof loadCartFromStorage === 'function') {
            loadCartFromStorage();
        }
    } else {
        // Hide user info and show auth buttons
        if (userInfo) userInfo.style.display = 'none';
        if (authButtons) authButtons.style.display = 'flex';
        
        // Hide premium features
        const premiumElements = document.querySelectorAll('.premium-content');
        premiumElements.forEach(element => {
            element.classList.add('hidden');
        });
    }
    
    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Save cart items to anonymous storage before logout
            if (typeof cartItems !== 'undefined' && cartItems.length > 0) {
                localStorage.setItem('numberCart_anonymous', JSON.stringify(cartItems));
            }
            
            // Clear localStorage user data
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('userData');
            
            // Show logout message
            showMessage('Logged out successfully', 'success');
            
            // Redirect to homepage after logout
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
    
    // Helper function to show messages
    function showMessage(message, type) {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}); 