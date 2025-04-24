// auth.js - Authentication functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing auth.js');
    
    // Check if user is already logged in via simple auth
    if (localStorage.getItem('simpleAuth') === 'true') {
        console.log('User is already logged in via simple auth');
        updateAuthUI(true);
        
        // Get user details if available
        const userName = localStorage.getItem('userName') || 'User';
        showWelcomeMessage({ firstName: userName.split(' ')[0] });
    } 
    // Check for Clerk authentication
    else {
        // Ensure Clerk script is loaded before initializing
        if (typeof window.Clerk !== 'undefined' && window.Clerk.loaded) {
            initClerkAuth();
        } else {
            // Wait for Clerk script to load
            console.log('Waiting for Clerk to load...');
            const clerkLoaded = setInterval(() => {
                if (typeof window.Clerk !== 'undefined' && window.Clerk.loaded) {
                    clearInterval(clerkLoaded);
                    initClerkAuth();
                }
            }, 100);
            
            // Failsafe: If Clerk doesn't load within 5 seconds, show an error
            setTimeout(() => {
                if (!window.clerkInstance) {
                    clearInterval(clerkLoaded);
                    console.error('Clerk failed to load within timeout');
                    updateAuthUI(false);
                    setupManualAuthButtons();
                }
            }, 5000);
        }
    }
    
    // Initialize Clerk authentication
    function initClerkAuth() {
        console.log('Initializing Clerk authentication');
        const publishableKey = 'pk_test_c3RhcnRsaW5nLWNyb2NvZGlsZS0yMC5jbGVyay5hY2NvdW50cy5kZXYk';
        
        try {
            window.Clerk.load({ publishableKey })
                .then(clerk => {
                    console.log('Clerk loaded successfully');
                    window.clerkInstance = clerk; // Store clerk instance globally
                    
                    // Check if user is authenticated with Clerk
                    if (clerk.user) {
                        console.log('User is authenticated with Clerk');
                        updateAuthUI(true);
                        showWelcomeMessage(clerk.user);
                    } else {
                        console.log('User is not authenticated with Clerk');
                        updateAuthUI(false);
                    }
                    
                    // Listen for auth state changes
                    clerk.addListener(({ user }) => {
                        console.log('Auth state changed:', user ? 'logged in' : 'logged out');
                        updateAuthUI(!!user);
                        if (user) {
                            showWelcomeMessage(user);
                        }
                    });
                    
                    // Setup sign-in and sign-up buttons
                    setupClerkButtons(clerk);
                })
                .catch(error => {
                    console.error('Error loading Clerk:', error);
                    setupManualAuthButtons();
                });
        } catch (err) {
            console.error('Exception during Clerk initialization:', err);
            setupManualAuthButtons();
        }
    }
    
    // Setup Clerk authentication buttons
    function setupClerkButtons(clerk) {
        console.log('Setup Clerk buttons: Sign In and Sign Up buttons were removed');
        // Login and signup buttons have been removed from the UI
    }
    
    // Setup manual auth buttons if Clerk fails
    function setupManualAuthButtons() {
        console.log('Setup Manual Auth buttons: Sign In and Sign Up buttons were removed');
        // Login and signup buttons have been removed from the UI
    }
    
    // Setup event handlers for auth-related elements
    setupAuthElements();
    
    // Setup auth-related elements and event listeners
    function setupAuthElements() {
        const userProfileButton = document.getElementById('userProfileButton');
        
        if (userProfileButton) {
            userProfileButton.addEventListener('click', handleUserProfileClick);
        }
    }
    
    // Handle user profile button click
    function handleUserProfileClick() {
        console.log('User profile button clicked');
        
        // If Clerk is available, use it
        if (typeof window.clerkInstance !== 'undefined' && window.clerkInstance.user) {
            try {
                window.clerkInstance.openUserProfile();
            } catch (err) {
                console.error('Error opening Clerk user profile:', err);
                showLogoutConfirmation();
            }
        } else {
            // Otherwise use simple auth logout
            showLogoutConfirmation();
        }
    }
    
    // Show logout confirmation
    function showLogoutConfirmation() {
        if (confirm('Would you like to sign out?')) {
            if (window.clerkInstance) {
                window.clerkInstance.signOut();
            } else {
                localStorage.removeItem('simpleAuth');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('authProvider');
            }
            
            updateAuthUI(false);
            showNotification('You have been signed out successfully', 'success');
        }
    }
    
    // Update auth UI elements based on auth state
    function updateAuthUI(isAuthenticated) {
        console.log('Updating auth UI, authenticated:', isAuthenticated);
        const userButton = document.getElementById('user-button');
        const authButtons = document.getElementById('auth-buttons');
        
        if (!userButton) {
            console.error('User button not found');
            return;
        }
        
        if (isAuthenticated) {
            // User is logged in
            userButton.style.display = 'block';
            
            // Hide auth buttons when user is logged in
            if (authButtons) {
                authButtons.style.display = 'none';
            }
            
            // If there's a user profile picture from Clerk, use it
            if (window.clerkInstance && window.clerkInstance.user && window.clerkInstance.user.imageUrl) {
                const profileButton = document.getElementById('userProfileButton');
                if (profileButton) {
                    profileButton.innerHTML = `<img src="${window.clerkInstance.user.imageUrl}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                }
            }
        } else {
            // User is not logged in
            userButton.style.display = 'none';
            
            // Show auth buttons when user is not logged in
            if (authButtons) {
                authButtons.style.display = 'flex';
            }
        }
    }
    
    // Show welcome message when user signs in
    function showWelcomeMessage(user) {
        let firstName = 'there';
        
        if (user) {
            if (typeof user === 'object') {
                firstName = user.firstName || user.name || user.email || 'there';
            } else {
                firstName = user;
            }
        }
        
        const message = `Welcome, ${firstName}! You're now signed in.`;
        showNotification(message, 'success');
    }
    
    // Show notification
    function showNotification(message, type) {
        console.log('Showing notification:', message, type);
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '8px';
        notification.style.color = 'white';
        notification.style.fontWeight = '600';
        notification.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        notification.style.zIndex = '9999';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        // Add background and border based on type
        if (type === 'success') {
            notification.style.background = 'linear-gradient(to right, #4CAF50, #388E3C)';
            notification.style.borderLeft = '5px solid #2E7D32';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(to right, #F44336, #D32F2F)';
            notification.style.borderLeft = '5px solid #B71C1C';
        } else {
            notification.style.background = 'linear-gradient(to right, #2196F3, #1976D2)';
            notification.style.borderLeft = '5px solid #0D47A1';
        }
        
        // Create notification content with icon
        const iconSpan = document.createElement('span');
        iconSpan.style.marginRight = '10px';
        iconSpan.style.fontSize = '16px';
        
        if (type === 'success') {
            iconSpan.innerHTML = '✓';
        } else if (type === 'error') {
            iconSpan.innerHTML = '✕';
        } else {
            iconSpan.innerHTML = 'ℹ';
        }
        
        notification.appendChild(iconSpan);
        notification.appendChild(document.createTextNode(message));
        
        document.body.appendChild(notification);
        
        // Show notification with animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove notification after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}); 