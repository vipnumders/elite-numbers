// Creating a fresh script.js

// Initialize numbers data
let numbersData = [
    ["9823659659","9823659659","AVAILABLE","PRICED","POSTPAID","10620"],
    ["9823685685","9823685685","AVAILABLE","PRICED","POSTPAID","10620"],
    ["9823697697","9823697697","AVAILABLE","PRICED","POSTPAID","10620"],
    ["9823740740","9823740740","AVAILABLE","PRICED","POSTPAID","10620"],
    ["9823746746","9823746746","AVAILABLE","PRICED","POSTPAID","10620"],
    ["9823760760","9823760760","AVAILABLE","PRICED","PREPAID","10620"],
    ["9823769769","9823769769","AVAILABLE","PRICED","POSTPAID","10620"],
    ["9823782782","9823782782","AVAILABLE","PRICED","POSTPAID","10620"],
    ["9823783783","9823783783","AVAILABLE","PRICED","PREPAID","10620"],
    ["9823836836","9823836836","AVAILABLE","PRICED","POSTPAID","10620"],
    ["9823862862","9823862862","AVAILABLE","PRICED","POSTPAID","10620"],
    ["9823932932","9823932932","AVAILABLE","PRICED","POSTPAID","10620"],
    ["9823965965","9823965965","AVAILABLE","PRICED","POSTPAID","10620"],
    ["9823976976","9823976976","AVAILABLE","PRICED","POSTPAID","10620"],
    ["9823980980","9823980980","AVAILABLE","PRICED","POSTPAID","10620"],
    ["9823998998","9823998998","AVAILABLE","PRICED","PREPAID","10620"],
    ["9960152999","9960152999","AVAILABLE","PRICED","POSTPAID","2360"],
    ["9960334181","9960334181","AVAILABLE","PRICED","PREPAID","2360"],
    ["9960334182","9960334182","AVAILABLE","PRICED","PREPAID","2360"],
    ["9960348072","9960348072","AVAILABLE","PRICED","PREPAID","2360"],
    ["9960348073","9960348073","AVAILABLE","PRICED","PREPAID","2360"],
    ["9960348074","9960348074","AVAILABLE","PRICED","PREPAID","2360"],
    ["9960348075","9960348075","AVAILABLE","PRICED","PREPAID","2360"],
    ["9960348076","9960348076","AVAILABLE","PRICED","PREPAID","2360"],
    ["9960348077","9960348077","AVAILABLE","PRICED","PREPAID","2360"]
];

let filteredNumbers = [...numbersData];
let currentPage = 1;
const numbersPerPage = 10;

// User authentication state
let currentUser = null;

// User data storage (in a real app, this would be in a database)
let users = [];

// Cart initialization
let cart = [];
const GST_RATE = 0.18; // 18% GST

// Cart DOM Elements
let cartDropdown;
let cartItemsContainer;
let emptyCartMessage;
let cartCount;
let cartSubtotal;
let cartGST;
let cartTotal;
let checkoutBtn;
let cartBtn;
let closeCartBtn;

// Initialize cart elements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart elements
    cartDropdown = document.getElementById('cartDropdown');
    cartItemsContainer = document.getElementById('cartItems');
    emptyCartMessage = document.getElementById('emptyCartMessage');
    cartCount = document.querySelector('.cart-count');
    cartSubtotal = document.getElementById('cartSubtotal');
    cartGST = document.getElementById('cartGST');
    cartTotal = document.getElementById('cartTotal');
    checkoutBtn = document.getElementById('checkoutBtn');
    cartBtn = document.getElementById('cartBtn');
    closeCartBtn = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');

    // Log cart elements for debugging
    console.log('Cart elements initialized:', {
        cartDropdown: !!cartDropdown,
        cartItemsContainer: !!cartItemsContainer,
        emptyCartMessage: !!emptyCartMessage,
        cartCount: !!cartCount,
        cartSubtotal: !!cartSubtotal,
        cartGST: !!cartGST,
        cartTotal: !!cartTotal,
        checkoutBtn: !!checkoutBtn,
        cartBtn: !!cartBtn,
        closeCartBtn: !!closeCartBtn,
        cartOverlay: !!cartOverlay
    });

    // Load cart from localStorage
    loadCart();
    
    // Set up event listeners
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            console.log('Cart button clicked');
            openCart();
        });
    } else {
        console.error('Cart button not found');
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    } else {
        console.error('Close cart button not found');
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    } else {
        console.error('Checkout button not found');
    }
    
    // Add event listener for cart overlay
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    } else {
        console.error('Cart overlay not found');
    }
    
    // Initialize the display
    displayNumbers();
    setupSearchAndFilters();
});

// Function to calculate sum of digits
function calculateSum(number) {
    const digits = number.split('').map(digit => parseInt(digit));
    const initialSum = digits.reduce((sum, digit) => sum + digit, 0);
    let finalSum = initialSum;
    let steps = [];
    
    if (finalSum > 9) {
        steps.push(initialSum);
        while (finalSum > 9) {
            const tempDigits = finalSum.toString().split('').map(digit => parseInt(digit));
            finalSum = tempDigits.reduce((sum, digit) => sum + digit, 0);
            steps.push(finalSum);
        }
    }
    
    const meanings = [
        "Leadership, independence, originality",
        "Cooperation, diplomacy, sensitivity",
        "Creativity, self-expression, optimism",
        "Stability, practicality, determination",
        "Freedom, adaptability, versatility",
        "Harmony, responsibility, nurturing",
        "Analysis, wisdom, spirituality",
        "Achievement, authority, abundance",
        "Compassion, generosity, humanitarianism"
    ];
    
    return {
        digits: digits,
        initialSum: initialSum,
        steps: steps,
        finalSum: finalSum,
        meaning: meanings[finalSum - 1]
    };
}

// Function to format phone number with spaces
function formatPhoneNumber(phoneNumber) {
    // Remove any existing non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Handle different length phone numbers with different formatting
    if (cleanNumber.length === 10) {
        // Format like: 982 365 9659
        return cleanNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    } else if (cleanNumber.length === 11) {
        // Format like: 1 982 365 9659 (for numbers with country code)
        return cleanNumber.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');
    } else if (cleanNumber.length === 12) {
        // Format like: 91 982 365 9659 (for numbers with country code)
        return cleanNumber.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');
    } else {
        // For other cases, add a space every 3 digits
        return cleanNumber.replace(/(\d{3})(?=\d)/g, '$1 ');
    }
}

// Highlight matching digits in phone number
function highlightNumber(number) {
    if (!number) return '';
    
    // Convert number to string if it's not already
    const numStr = number.toString();
    
    // Get the current search term from the search input
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    
    // If there's no search term, return the number as is
    if (!searchTerm) {
        return numStr;
    }
    
    // Find all occurrences of the search term
    const searchTermLower = searchTerm.toLowerCase();
    const numStrLower = numStr.toLowerCase();
    
    // Create highlighted HTML
    let result = '';
    let lastIndex = 0;
    
    // Find all occurrences of the search term
    let matchIndex;
    while ((matchIndex = numStrLower.indexOf(searchTermLower, lastIndex)) !== -1) {
        // Add text before the match
        if (matchIndex > lastIndex) {
            result += numStr.substring(lastIndex, matchIndex);
        }
        
        // Add highlighted match (using the original case from numStr)
        result += `<span class="highlight">${numStr.substring(matchIndex, matchIndex + searchTerm.length)}</span>`;
        
        lastIndex = matchIndex + searchTerm.length;
    }
    
    // Add remaining text
    if (lastIndex < numStr.length) {
        result += numStr.substring(lastIndex);
    }
    
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

function createNumberCard(number) {
    const sumData = calculateSum(number[0]);
    const card = document.createElement('div');
    card.className = 'number-card';
    
    const digitsDisplay = sumData.digits.map(digit => 
        `<span class="digit-box digit-${digit}">${digit}</span>`
    ).join(' + ');
    
    const reductionSteps = sumData.steps.length > 0 
        ? `<div class="reduction-steps">
             ${sumData.initialSum} → ${sumData.steps.slice(1).join(' → ')}
           </div>`
        : '';
    
    // Format the phone number with proper spacing
    const formattedNumber = formatPhoneNumber(number[0]);
    
    // Highlight the number
    const highlightedNumber = highlightNumber(number[0]);
    
    // Calculate GST
    const price = parseInt(number[5] || 0);
    const gst = Math.round(price * 0.18);
    const total = price + gst;
    
    // Pattern badge HTML
    const patternBadge = number[6] 
        ? `<div class="pattern-badge">${number[6]}</div>` 
        : '';
    
    // Create a unique ID for this card
    const cardId = `card-${number[0]}`;
    card.id = cardId;
    
    card.innerHTML = `
        <div class="number">${highlightedNumber}</div>
        <div class="number-details">
            <div class="status-type">
                <span class="status ${number[2].toLowerCase()}">${number[2]}</span>
                <span class="type">${number[4]}</span>
            </div>
            <div class="price">₹${price.toLocaleString()}</div>
            <div class="sum-details">
                ${digitsDisplay} = ${sumData.finalSum}
                ${reductionSteps}
                <div class="sum-meaning">${sumData.meaning}</div>
            </div>
        </div>
        ${patternBadge}
        <div class="card-actions">
            <button class="add-to-cart-btn" data-number="${number[0]}">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
            <button class="buy-now-btn" data-number="${number[0]}">
                <i class="fas fa-bolt"></i> Buy Now (₹${total.toLocaleString()})
            </button>
        </div>
    `;
    
    // Add event listeners after the card is created
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    const buyNowBtn = card.querySelector('.buy-now-btn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            addToCart(number);
        });
    }
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            handleBuyNow(number);
        });
    }
    
    return card;
}

function displayNumbers() {
    const numbersContainer = document.getElementById('numbersContainer');
    const pagination = document.getElementById('pagination');
    const totalCount = document.getElementById('totalCount');
    
    if (!numbersContainer || !pagination || !totalCount) {
        console.error('Required elements not found');
        return;
    }
    
    numbersContainer.innerHTML = '';
    pagination.innerHTML = '';
    
    const totalPages = Math.ceil(filteredNumbers.length / numbersPerPage);
    totalCount.textContent = `Total Numbers: ${filteredNumbers.length}`;
    
    const startIndex = (currentPage - 1) * numbersPerPage;
    const endIndex = Math.min(startIndex + numbersPerPage, filteredNumbers.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const number = filteredNumbers[i];
        const numberCard = createNumberCard(number);
        numbersContainer.appendChild(numberCard);
    }
    
    createPaginationButtons(totalPages);
}

function createPaginationButtons(totalPages) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    pagination.innerHTML = '';
    
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayNumbers();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    pagination.appendChild(prevButton);
    
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = currentPage === i ? 'active' : '';
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayNumbers();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        pagination.appendChild(pageButton);
    }
    
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayNumbers();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    pagination.appendChild(nextButton);
}

// Search and filter functionality
function setupSearchAndFilters() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const priceFilter = document.getElementById('priceFilter');
    const digitSumBtn = document.getElementById('digitSumBtn');
    const digitSumInput = document.getElementById('digitSumInput');
    const excludeDigitsBtn = document.getElementById('excludeDigitsBtn');
    const excludeDigitsInput = document.getElementById('excludeDigitsInput');
    const searchOptions = document.querySelectorAll('.search-option');
    const sumBadges = document.querySelectorAll('.sum-badge');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    
    // Set up filter state
    let filterState = {
        searchTerm: '',
        searchOption: 'all',
        type: 'all',
        priceRange: 'all',
        digitSum: null,
        excludeDigits: ''
    };
    
    // Apply filters button event
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            // Update filter state with all current form values
            if (searchInput) filterState.searchTerm = searchInput.value.trim();
            if (typeFilter) filterState.type = typeFilter.value;
            if (priceFilter) filterState.priceRange = priceFilter.value;
            if (digitSumInput) filterState.digitSum = digitSumInput.value ? parseInt(digitSumInput.value) : null;
            if (excludeDigitsInput) filterState.excludeDigits = excludeDigitsInput.value.trim();
            
            applyFilters();
        });
    }
    
    // Search button event
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            filterState.searchTerm = searchInput.value.trim();
            applyFilters();
        });
        
        // Also search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterState.searchTerm = searchInput.value.trim();
                applyFilters();
            }
        });
    }
    
    // Search option buttons
    if (searchOptions) {
        searchOptions.forEach(option => {
            option.addEventListener('click', function() {
                searchOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                filterState.searchOption = this.getAttribute('data-filter');
                if (filterState.searchTerm) {
                    applyFilters();
                }
            });
        });
    }
    
    // Type filter
    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            filterState.type = this.value;
            // We no longer apply filters immediately on change
        });
    }
    
    // Price filter
    if (priceFilter) {
        priceFilter.addEventListener('change', function() {
            filterState.priceRange = this.value;
            // We no longer apply filters immediately on change
        });
    }
    
    // Digit sum filter
    if (digitSumBtn && digitSumInput) {
        digitSumBtn.addEventListener('click', function() {
            const sum = parseInt(digitSumInput.value);
            if (sum >= 1 && sum <= 9) {
                filterState.digitSum = sum;
                // Update badge states
                sumBadges.forEach(badge => {
                    if (parseInt(badge.getAttribute('data-sum')) === sum) {
                        badge.classList.add('active');
                    } else {
                        badge.classList.remove('active');
                    }
                });
                applyFilters();
            } else {
                showNotification('Please enter a valid digit sum (1-9)', 'warning');
            }
        });
    }
    
    // Sum badges
    if (sumBadges) {
        sumBadges.forEach(badge => {
            badge.addEventListener('click', function() {
                const sum = parseInt(this.getAttribute('data-sum'));
                
                if (filterState.digitSum === sum) {
                    // If clicking the active badge, deselect it
                    filterState.digitSum = null;
                    this.classList.remove('active');
                } else {
                    // Select the new badge
                    filterState.digitSum = sum;
                    sumBadges.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                }
                
                if (digitSumInput) {
                    digitSumInput.value = filterState.digitSum || '';
                }
                
                applyFilters();
            });
        });
    }
    
    // Exclude digits filter
    if (excludeDigitsBtn && excludeDigitsInput) {
        excludeDigitsBtn.addEventListener('click', function() {
            filterState.excludeDigits = excludeDigitsInput.value.trim();
            applyFilters();
        });
    }
}

// Function to update the UI to indicate which filters are active
function updateActiveFilterUI() {
    const filterIndicators = document.getElementById('activeFilterIndicators');
    
    if (!filterIndicators) {
        return;
    }
    
    // Clear existing indicators
    filterIndicators.innerHTML = '';
    
    // Get all filter elements
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const priceFilter = document.getElementById('priceFilter');
    const digitSumInput = document.getElementById('digitSumInput');
    const excludeDigitsInput = document.getElementById('excludeDigitsInput');
    
    // Create badges for active filters
    const activeFilters = [];
    
    // Search term
    if (searchInput && searchInput.value.trim()) {
        activeFilters.push({
            label: 'Search: ' + searchInput.value.trim(),
            type: 'search'
        });
    }
    
    // Type filter
    if (typeFilter && typeFilter.value !== 'all') {
        activeFilters.push({
            label: 'Type: ' + typeFilter.value,
            type: 'type'
        });
    }
    
    // Price filter
    if (priceFilter && priceFilter.value !== 'all') {
        activeFilters.push({
            label: 'Price: ' + priceFilter.value,
            type: 'price'
        });
    }
    
    // Digit sum filter
    if (digitSumInput && digitSumInput.value) {
        activeFilters.push({
            label: 'Sum: ' + digitSumInput.value,
            type: 'sum'
        });
    }
    
    // Exclude digits filter
    if (excludeDigitsInput && excludeDigitsInput.value) {
        activeFilters.push({
            label: 'Exclude: ' + excludeDigitsInput.value,
            type: 'exclude'
        });
    }
    
    // Add indicators to UI
    if (activeFilters.length > 0) {
        filterIndicators.innerHTML = '<div class="active-filters-label">Active Filters:</div>';
        
        activeFilters.forEach(filter => {
            const badge = document.createElement('div');
            badge.className = `filter-badge ${filter.type}`;
            badge.innerHTML = `${filter.label} <span class="remove-filter" data-type="${filter.type}">×</span>`;
            filterIndicators.appendChild(badge);
        });
        
        // Add event listeners to remove buttons
        const removeButtons = filterIndicators.querySelectorAll('.remove-filter');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterType = this.getAttribute('data-type');
                removeFilter(filterType);
            });
        });
    } else {
        filterIndicators.innerHTML = '<div class="no-filters">No active filters</div>';
    }
}

// Function to remove a specific filter
function removeFilter(filterType) {
    switch(filterType) {
        case 'search':
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = '';
            break;
        case 'type':
            const typeFilter = document.getElementById('typeFilter');
            if (typeFilter) typeFilter.value = 'all';
            break;
        case 'price':
            const priceFilter = document.getElementById('priceFilter');
            if (priceFilter) priceFilter.value = 'all';
            break;
        case 'sum':
            const digitSumInput = document.getElementById('digitSumInput');
            if (digitSumInput) digitSumInput.value = '';
            const sumBadges = document.querySelectorAll('.sum-badge');
            sumBadges.forEach(badge => badge.classList.remove('active'));
            break;
        case 'exclude':
            const excludeDigitsInput = document.getElementById('excludeDigitsInput');
            if (excludeDigitsInput) excludeDigitsInput.value = '';
            break;
    }
    
    // Apply the filters after removing one
    const applyBtn = document.getElementById('applyFiltersBtn');
    if (applyBtn) {
        applyBtn.click(); // Trigger the apply button to update filters
    } else {
        applyFilters(); // Directly apply filters if button not found
    }
}

// Modify applyFilters function to update UI indicators
function applyFilters() {
    // Get the filter state from setupSearchAndFilters
    const searchOptions = document.querySelectorAll('.search-option');
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const priceFilter = document.getElementById('priceFilter');
    const digitSumInput = document.getElementById('digitSumInput');
    const excludeDigitsInput = document.getElementById('excludeDigitsInput');
    const sumTotalInput = document.getElementById('sumTotalInput');
    
    // Build filter state from current UI
    let filterState = {
        searchTerm: searchInput ? searchInput.value.trim() : '',
        searchOption: 'all',
        type: typeFilter ? typeFilter.value : 'all',
        priceRange: priceFilter ? priceFilter.value : 'all',
        digitSum: digitSumInput && digitSumInput.value ? parseInt(digitSumInput.value) : null,
        excludeDigits: excludeDigitsInput ? excludeDigitsInput.value.trim() : '',
        sumTotal: sumTotalInput && sumTotalInput.value ? parseInt(sumTotalInput.value) : null
    };
    
    // Get selected search option
    searchOptions.forEach(option => {
        if (option.classList.contains('active')) {
            filterState.searchOption = option.getAttribute('data-filter');
        }
    });
    
    // Apply filters to data
    filteredNumbers = numbersData.filter(number => {
        const numberStr = number[0];
        
        // Search term filter
        if (filterState.searchTerm) {
            const term = filterState.searchTerm.toLowerCase();
            switch (filterState.searchOption) {
                case 'start':
                    if (!numberStr.startsWith(term)) return false;
                    break;
                case 'end':
                    if (!numberStr.endsWith(term)) return false;
                    break;
                default: // 'all' - search anywhere
                    if (!numberStr.includes(term)) return false;
            }
        }
        
        // Type filter
        if (filterState.type !== 'all' && number[4] !== filterState.type) {
            return false;
        }
        
        // Price filter
        if (filterState.priceRange !== 'all') {
            const price = parseInt(number[5]);
            switch (filterState.priceRange) {
                case '0-5000':
                    if (price > 5000) return false;
                    break;
                case '5001-10000':
                    if (price <= 5000 || price > 10000) return false;
                    break;
                case '10001-20000':
                    if (price <= 10000 || price > 20000) return false;
                    break;
                case '20001+':
                    if (price <= 20000) return false;
                    break;
            }
        }
        
        // Digit sum filter
        if (filterState.digitSum !== null) {
            const { finalSum } = calculateSum(numberStr);
            if (finalSum !== filterState.digitSum) {
                return false;
            }
        }
        
        // Sum total filter
        if (filterState.sumTotal !== null) {
            const { finalSum } = calculateSum(numberStr);
            if (finalSum !== filterState.sumTotal) {
                return false;
            }
        }
        
        // Exclude digits filter
        if (filterState.excludeDigits) {
            for (let i = 0; i < filterState.excludeDigits.length; i++) {
                const digit = filterState.excludeDigits[i];
                if (numberStr.includes(digit)) {
                    return false;
                }
            }
        }
        
        // If passed all filters
        return true;
    });
    
    // Reset to first page and update display
    currentPage = 1;
    displayNumbers();
    
    // Update active filter UI indicators
    updateActiveFilterUI();
    
    // Show notification about results
    const resultsText = filteredNumbers.length 
        ? `Found ${filteredNumbers.length} matching numbers` 
        : 'No numbers matched your search criteria';
    
    showNotification(resultsText, filteredNumbers.length ? 'success' : 'warning');
}

// Show notification function
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add icon based on type
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i> ';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i> ';
            break;
        case 'error':
            icon = '<i class="fas fa-times-circle"></i> ';
            break;
        default:
            icon = '<i class="fas fa-info-circle"></i> ';
    }
    
    notification.innerHTML = icon + message;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Function to reset all filters
function resetFilters() {
    // Reset search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    // Reset search options
    const searchOptions = document.querySelectorAll('.search-option');
    searchOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-filter') === 'all') {
            option.classList.add('active');
        }
    });
    
    // Reset type filter
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) typeFilter.value = 'all';
    
    // Reset price filter
    const priceFilter = document.getElementById('priceFilter');
    if (priceFilter) priceFilter.value = 'all';
    
    // Reset digit sum filter
    const digitSumInput = document.getElementById('digitSumInput');
    if (digitSumInput) digitSumInput.value = '';
    
    // Reset sum badges
    const sumBadges = document.querySelectorAll('.sum-badge');
    sumBadges.forEach(badge => badge.classList.remove('active'));
    
    // Reset exclude digits filter
    const excludeDigitsInput = document.getElementById('excludeDigitsInput');
    if (excludeDigitsInput) excludeDigitsInput.value = '';
    
    // Reset sum total filter
    const sumTotalInput = document.getElementById('sumTotalInput');
    if (sumTotalInput) sumTotalInput.value = '';
    
    // Reset filtered numbers
    filteredNumbers = [...numbersData];
    currentPage = 1;
    
    // Update display
    displayNumbers();
    
    // Update the active filter indicators
    updateActiveFilterUI();
    
    // Show notification
    showNotification('All filters have been reset', 'success');
}

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to show auth modal
function showAuthModal(type = 'login') {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <span class="close-modal">&times;</span>
            <div class="auth-tabs">
                <button class="auth-tab ${type === 'login' ? 'active' : ''}" data-tab="login">Login</button>
                <button class="auth-tab ${type === 'signup' ? 'active' : ''}" data-tab="signup">Sign Up</button>
            </div>
            <div class="auth-form ${type === 'login' ? 'active' : ''}" id="loginForm">
                <h2>Login</h2>
                <input type="email" placeholder="Email" id="loginEmail" required>
                <input type="password" placeholder="Password" id="loginPassword" required>
                <button onclick="handleLogin()">Login</button>
            </div>
            <div class="auth-form ${type === 'signup' ? 'active' : ''}" id="signupForm">
                <h2>Sign Up</h2>
                <input type="text" placeholder="Full Name" id="signupName" required>
                <input type="email" placeholder="Email" id="signupEmail" required>
                <input type="password" placeholder="Password" id="signupPassword" required>
                <input type="password" placeholder="Confirm Password" id="signupConfirmPassword" required>
                <button onclick="handleSignup()">Sign Up</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => modal.remove();

    const tabs = modal.querySelectorAll('.auth-tab');
    tabs.forEach(tab => {
        tab.onclick = () => {
            const tabType = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            modal.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            modal.querySelector(`#${tabType}Form`).classList.add('active');
        };
    });

    // Close modal when clicking outside
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
}

// Handle signup
function handleSignup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }

    // Check if user already exists
    if (users.some(user => user.email === email)) {
        showNotification('Email already registered', 'error');
        return;
    }

    // Create new user
    const newUser = {
        name,
        email,
        password, // In a real app, this should be hashed
        cart: []
    };

    users.push(newUser);
    currentUser = newUser;

    // Close modal and update UI
    document.querySelector('.auth-modal').remove();
    updateAuthUI();
    showNotification('Successfully signed up!', 'success');
}

// Handle login
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        showNotification('Invalid email or password', 'error');
        return;
    }

    currentUser = user;

    // Close modal and update UI
    document.querySelector('.auth-modal').remove();
    updateAuthUI();
    showNotification('Successfully logged in!', 'success');
}

// Handle logout
function handleLogout() {
    currentUser = null;
    updateAuthUI();
    showNotification('Successfully logged out', 'success');
}

// Update auth UI
function updateAuthUI() {
    const authContainer = document.getElementById('authContainer');
    if (!authContainer) return;

    if (currentUser) {
        authContainer.innerHTML = `
            <div class="user-info">
                <span>Welcome, ${currentUser.name}</span>
                <button onclick="handleLogout()">Logout</button>
            </div>
        `;
    } else {
        authContainer.innerHTML = `
            <button onclick="showAuthModal('login')">Login</button>
            <button onclick="showAuthModal('signup')">Sign Up</button>
        `;
    }
}

// Add styles for auth components
document.addEventListener('DOMContentLoaded', function() {
    const authStyle = document.createElement('style');
    authStyle.textContent = `
        .auth-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
        }

        .auth-modal-content {
            background: white;
            padding: 30px;
            border-radius: 16px;
            width: 90%;
            max-width: 420px;
            position: relative;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            animation: modalSlideIn 0.4s ease-out;
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .close-modal {
            position: absolute;
            right: 20px;
            top: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }

        .close-modal:hover {
            background: #f5f5f5;
            color: #333;
            transform: rotate(90deg);
        }

        .auth-tabs {
            display: flex;
            margin-bottom: 30px;
            border-bottom: 2px solid #f0f0f0;
            gap: 20px;
        }

        .auth-tab {
            padding: 12px 24px;
            border: none;
            background: none;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            color: #666;
            position: relative;
            transition: all 0.3s ease;
        }

        .auth-tab.active {
            color: #2196F3;
        }

        .auth-tab.active:after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 2px;
            background: #2196F3;
            animation: tabSlide 0.3s ease-out;
        }

        @keyframes tabSlide {
            from {
                width: 0;
            }
            to {
                width: 100%;
            }
        }

        .auth-form {
            display: none;
            animation: formFadeIn 0.4s ease-out;
        }

        @keyframes formFadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .auth-form.active {
            display: block;
        }

        .auth-form h2 {
            font-size: 24px;
            font-weight: 700;
            color: #333;
            margin-bottom: 25px;
            text-align: center;
        }

        .auth-form input {
            width: 100%;
            padding: 14px 20px;
            margin: 12px 0;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            font-size: 15px;
            transition: all 0.3s ease;
            background-color: #f9f9f9;
        }

        .auth-form input:focus {
            outline: none;
            border-color: #2196F3;
            background-color: #fff;
            box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.1);
        }

        .auth-form input::placeholder {
            color: #999;
            font-size: 14px;
        }

        .auth-form button {
            width: 100%;
            padding: 14px;
            background: linear-gradient(to right, #2196F3, #1976D2);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
        }

        .auth-form button:hover {
            background: linear-gradient(to right, #1976D2, #1565C0);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
        }

        .auth-form button:active {
            transform: translateY(0);
        }

        #authContainer {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 100;
        }

        #authContainer button {
            padding: 10px 20px;
            margin-left: 10px;
            background: linear-gradient(to right, #2196F3, #1976D2);
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
        }

        #authContainer button:hover {
            background: linear-gradient(to right, #1976D2, #1565C0);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 12px;
            background: white;
            padding: 10px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .user-info span {
            color: #333;
            font-weight: 600;
            font-size: 15px;
        }

        .user-info button {
            padding: 8px 16px;
            background: #f5f5f5;
            color: #666;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .user-info button:hover {
            background: #e0e0e0;
            color: #333;
        }
    `;
    document.head.appendChild(authStyle);

    // Create auth container
    const authContainer = document.createElement('div');
    authContainer.id = 'authContainer';
    document.body.appendChild(authContainer);

    // Initialize auth UI
    updateAuthUI();
});

// Function to generate a random phone number
function generateRandomNumber() {
    // Choose a pattern type randomly
    const patternType = Math.floor(Math.random() * 5);
    
    // Define common prefixes for Indian mobile numbers
    const prefixes = ['982', '990', '986', '995', '996', '981', '988', '987', '970', '977', '997', '985'];
    
    // Randomly select a prefix
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    let phoneNumber;
    let patternName;
    
    // Generate based on pattern type
    switch(patternType) {
        case 0: // Repeating digits (e.g., 9823459999)
            patternName = "Premium - Repeating Digits";
            let repeatingDigit = Math.floor(Math.random() * 10);
            let middlePart = '';
            for (let i = 0; i < 3; i++) {
                middlePart += Math.floor(Math.random() * 10);
            }
            phoneNumber = prefix + middlePart + repeatingDigit.toString().repeat(4);
            break;
            
        case 1: // Ascending/descending sequence (e.g., 9823451234 or 9823459876)
            let middleDigits = '';
            for (let i = 0; i < 3; i++) {
                middleDigits += Math.floor(Math.random() * 10);
            }
            
            // Decide between ascending or descending
            if (Math.random() > 0.5) {
                // Ascending
                patternName = "Premium - Ascending Sequence";
                const start = Math.floor(Math.random() * 7); // Start digit (0-6)
                let sequence = '';
                for (let i = 0; i < 4; i++) {
                    sequence += (start + i) % 10;
                }
                phoneNumber = prefix + middleDigits + sequence;
            } else {
                // Descending
                patternName = "Premium - Descending Sequence";
                const start = Math.floor(Math.random() * 7) + 3; // Start digit (3-9)
                let sequence = '';
                for (let i = 0; i < 4; i++) {
                    sequence += (start - i + 10) % 10;
                }
                phoneNumber = prefix + middleDigits + sequence;
            }
            break;
            
        case 2: // Mirror pattern (e.g., 9823451234)
            patternName = "Premium - Mirror Pattern";
            let middle = '';
            for (let i = 0; i < 2; i++) {
                middle += Math.floor(Math.random() * 10);
            }
            
            // Create mirror pattern for last 4 digits
            phoneNumber = prefix + middle + middle.split('').reverse().join('') + 
                           middle + middle.split('').reverse().join('');
            break;
            
        case 3: // Double pairs (e.g., 9823453322)
            patternName = "Special - Double Pairs";
            let pairs = '';
            for (let i = 0; i < 2; i++) {
                const digit = Math.floor(Math.random() * 10);
                pairs += digit.toString().repeat(2);
            }
            
            let middleRandom = '';
            for (let i = 0; i < 3; i++) {
                middleRandom += Math.floor(Math.random() * 10);
            }
            
            phoneNumber = prefix + middleRandom + pairs;
            break;
            
        case 4: // Special combinations like ABBA pattern (e.g., 9823451221)
            patternName = "Special - ABBA Pattern";
            let firstDigit = Math.floor(Math.random() * 10);
            let secondDigit = Math.floor(Math.random() * 10);
            
            let randomMiddle = '';
            for (let i = 0; i < 3; i++) {
                randomMiddle += Math.floor(Math.random() * 10);
            }
            
            // ABBA pattern
            phoneNumber = prefix + randomMiddle + firstDigit + secondDigit + secondDigit + firstDigit;
            break;
            
        default: // Completely random
            patternName = "Standard";
            let remainingDigits = '';
            for (let i = 0; i < 7; i++) {
                remainingDigits += Math.floor(Math.random() * 10);
            }
            phoneNumber = prefix + remainingDigits;
    }
    
    // Generate random price between 1000 and 20000
    // Premium patterns get higher prices
    let price;
    if (patternType === 0) { // Repeating digits - most premium
        price = Math.floor(Math.random() * 5000) + 15000;
    } else if (patternType === 1 || patternType === 2) { // Sequences - premium
        price = Math.floor(Math.random() * 5000) + 10000;
    } else {
        price = Math.floor(Math.random() * 9000) + 1000;
    }
    
    // Randomly select POSTPAID or PREPAID
    const type = Math.random() > 0.5 ? 'POSTPAID' : 'PREPAID';
    
    // Return with the pattern name included
    return [phoneNumber, phoneNumber, 'AVAILABLE', 'PRICED', type, price.toString(), patternName];
}

// Function to add random numbers to the data
function addRandomNumbers(count = 5, specificPattern = null) {
    const newNumbers = [];
    
    for (let i = 0; i < count; i++) {
        // If a specific pattern is requested, use that
        const randomNumber = specificPattern !== null ? 
            generateSpecificPatternNumber(specificPattern) : 
            generateRandomNumber();
            
        newNumbers.push(randomNumber);
        numbersData.unshift(randomNumber); // Add to the beginning of the array
    }
    
    // Update filtered numbers if no filters applied
    if (filteredNumbers.length === numbersData.length - count) {
        filteredNumbers = [...numbersData];
    }
    
    // Reset to first page and update display
    currentPage = 1;
    displayNumbers();
    
    const patternText = specificPattern !== null ? 
        `with ${getPatternName(specificPattern)} pattern` : '';
    showNotification(`Added ${count} random numbers ${patternText}`, 'success');
    return newNumbers;
}

// Function to get pattern name based on pattern ID
function getPatternName(patternId) {
    const patternNames = [
        "Repeating Digits",
        "Sequence",
        "Mirror Pattern",
        "Double Pairs",
        "ABBA Pattern"
    ];
    return patternNames[patternId] || "Standard";
}

// Function to generate a specific pattern number
function generateSpecificPatternNumber(patternType) {
    // Force the specific pattern but make the rest random
    return generatePatternNumber(patternType);
}

// Modified function to generate number with a specific pattern
function generatePatternNumber(patternType) {
    // Define common prefixes for Indian mobile numbers
    const prefixes = ['982', '990', '986', '995', '996', '981', '988', '987', '970', '977', '997', '985'];
    
    // Randomly select a prefix
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    let phoneNumber;
    let patternName;
    
    // Generate based on pattern type
    switch(patternType) {
        case 0: // Repeating digits (e.g., 9823459999)
            patternName = "Premium - Repeating Digits";
            let repeatingDigit = Math.floor(Math.random() * 10);
            let middlePart = '';
            for (let i = 0; i < 3; i++) {
                middlePart += Math.floor(Math.random() * 10);
            }
            phoneNumber = prefix + middlePart + repeatingDigit.toString().repeat(4);
            break;
            
        case 1: // Ascending/descending sequence
            // Decide between ascending or descending
            if (Math.random() > 0.5) {
                // Ascending
                patternName = "Premium - Ascending Sequence";
                let middleDigits = '';
                for (let i = 0; i < 3; i++) {
                    middleDigits += Math.floor(Math.random() * 10);
                }
                const start = Math.floor(Math.random() * 7); // Start digit (0-6)
                let sequence = '';
                for (let i = 0; i < 4; i++) {
                    sequence += (start + i) % 10;
                }
                phoneNumber = prefix + middleDigits + sequence;
            } else {
                // Descending
                patternName = "Premium - Descending Sequence";
                let middleDigits = '';
                for (let i = 0; i < 3; i++) {
                    middleDigits += Math.floor(Math.random() * 10);
                }
                const start = Math.floor(Math.random() * 7) + 3; // Start digit (3-9)
                let sequence = '';
                for (let i = 0; i < 4; i++) {
                    sequence += (start - i + 10) % 10;
                }
                phoneNumber = prefix + middleDigits + sequence;
            }
            break;
            
        case 2: // Mirror pattern (e.g., 9823451234)
            patternName = "Premium - Mirror Pattern";
            let middle = '';
            for (let i = 0; i < 2; i++) {
                middle += Math.floor(Math.random() * 10);
            }
            
            // Create mirror pattern for last 4 digits
            phoneNumber = prefix + middle + middle.split('').reverse().join('') + 
                           middle + middle.split('').reverse().join('');
            break;
            
        case 3: // Double pairs (e.g., 9823453322)
            patternName = "Special - Double Pairs";
            let pairs = '';
            for (let i = 0; i < 2; i++) {
                const digit = Math.floor(Math.random() * 10);
                pairs += digit.toString().repeat(2);
            }
            
            let middleRandom = '';
            for (let i = 0; i < 3; i++) {
                middleRandom += Math.floor(Math.random() * 10);
            }
            
            phoneNumber = prefix + middleRandom + pairs;
            break;
            
        case 4: // Special combinations like ABBA pattern (e.g., 9823451221)
            patternName = "Special - ABBA Pattern";
            let firstDigit = Math.floor(Math.random() * 10);
            let secondDigit = Math.floor(Math.random() * 10);
            
            let randomMiddle = '';
            for (let i = 0; i < 3; i++) {
                randomMiddle += Math.floor(Math.random() * 10);
            }
            
            // ABBA pattern
            phoneNumber = prefix + randomMiddle + firstDigit + secondDigit + secondDigit + firstDigit;
            break;
            
        default: // Completely random
            patternName = "Standard";
            let remainingDigits = '';
            for (let i = 0; i < 7; i++) {
                remainingDigits += Math.floor(Math.random() * 10);
            }
            phoneNumber = prefix + remainingDigits;
    }
    
    // Generate random price based on pattern type
    let price;
    if (patternType === 0) { // Repeating digits - most premium
        price = Math.floor(Math.random() * 5000) + 15000;
    } else if (patternType === 1 || patternType === 2) { // Sequences - premium
        price = Math.floor(Math.random() * 5000) + 10000;
    } else {
        price = Math.floor(Math.random() * 9000) + 1000;
    }
    
    // Randomly select POSTPAID or PREPAID
    const type = Math.random() > 0.5 ? 'POSTPAID' : 'PREPAID';
    
    // Return with the pattern name included
    return [phoneNumber, phoneNumber, 'AVAILABLE', 'PRICED', type, price.toString(), patternName];
}

// Update the UI to allow pattern selection
document.addEventListener('DOMContentLoaded', function() {
    // Create random number generator button
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls-container';
    controlsContainer.innerHTML = `
        <div class="random-generator">
            <button id="generateRandomBtn">
                <i class="fas fa-random"></i> Generate Random Numbers
            </button>
            <select id="randomCount">
                <option value="1">1 Number</option>
                <option value="3">3 Numbers</option>
                <option value="5" selected>5 Numbers</option>
                <option value="10">10 Numbers</option>
            </select>
            <select id="patternType">
                <option value="-1">Any Pattern</option>
                <option value="0">Repeating Digits</option>
                <option value="1">Sequence</option>
                <option value="2">Mirror Pattern</option>
                <option value="3">Double Pairs</option>
                <option value="4">ABBA Pattern</option>
            </select>
        </div>
    `;
    
    // Add the controls before the numbers container
    const numbersContainer = document.getElementById('numbersContainer');
    if (numbersContainer) {
        numbersContainer.parentNode.insertBefore(controlsContainer, numbersContainer);
    } else {
        document.body.appendChild(controlsContainer);
    }
    
    // Add event listener to the generate button
    const generateBtn = document.getElementById('generateRandomBtn');
    const randomCountSelect = document.getElementById('randomCount');
    const patternTypeSelect = document.getElementById('patternType');
    
    if (generateBtn && randomCountSelect && patternTypeSelect) {
        generateBtn.addEventListener('click', function() {
            const count = parseInt(randomCountSelect.value);
            const patternType = parseInt(patternTypeSelect.value);
            addRandomNumbers(count, patternType >= 0 ? patternType : null);
        });
    }
    
    // Add styles for the random generator
    const style = document.createElement('style');
    style.textContent += `
        .controls-container {
            margin-bottom: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .random-generator {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        #generateRandomBtn {
            padding: 10px 15px;
            background: #673AB7;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        #generateRandomBtn:hover {
            background: #5E35B1;
        }
        
        #randomCount, #patternType {
            padding: 8px 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);
});

// Add CSS styles for pattern badge
document.addEventListener('DOMContentLoaded', function() {
    // Existing code...
    
    // Add styles for pattern badge
    const style = document.createElement('style');
    style.textContent += `
        .pattern-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            background: #673AB7;
            color: white;
            opacity: 0.9;
        }
        
        .number-card {
            position: relative;
        }
    `;
    document.head.appendChild(style);
    
    // Rest of existing code...
});

// Add apply button to filter UI
document.addEventListener('DOMContentLoaded', function() {
    // Find the filter options container
    const filterOptions = document.querySelector('.filter-options');
    
    if (filterOptions) {
        // Create the apply button
        const applyButton = document.createElement('button');
        applyButton.id = 'applyFiltersBtn';
        applyButton.className = 'apply-filters-btn';
        applyButton.innerHTML = '<i class="fas fa-filter"></i> Apply Filters';
        
        // Add the button before the reset button (if it exists)
        const resetButton = document.getElementById('resetFiltersBtn');
        if (resetButton) {
            filterOptions.insertBefore(applyButton, resetButton);
        } else {
            filterOptions.appendChild(applyButton);
        }
        
        // Add styles for the apply button
        const style = document.createElement('style');
        style.textContent += `
            .apply-filters-btn {
                padding: 10px 15px;
                background: #2196F3;
                color: white;
                border: none;
                border-radius: 4px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                margin-right: 10px;
            }
            
            .apply-filters-btn:hover {
                background: #1976D2;
            }
            
            .filter-options {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
            }
            
            .reset-filters-btn {
                padding: 10px 15px;
                background: #f44336;
                color: white;
                border: none;
                border-radius: 4px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .reset-filters-btn:hover {
                background: #d32f2f;
            }
        `;
        document.head.appendChild(style);
    }
});

// Add filter indicators container to the UI
document.addEventListener('DOMContentLoaded', function() {
    // Create active filter indicators container
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.id = 'activeFilterIndicators';
    indicatorsContainer.className = 'active-filter-indicators';
    
    // Add it after the filter-options container
    const filterOptions = document.querySelector('.filter-options');
    if (filterOptions) {
        filterOptions.parentNode.insertBefore(indicatorsContainer, filterOptions.nextSibling);
    }
    
    // Add styles for the indicators
    const style = document.createElement('style');
    style.textContent += `
        .active-filter-indicators {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            margin-bottom: 15px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 6px;
        }
        
        .active-filters-label {
            font-weight: 500;
            color: #555;
            margin-right: 5px;
        }
        
        .no-filters {
            color: #888;
            font-style: italic;
        }
        
        .filter-badge {
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .filter-badge.search {
            background: #e3f2fd;
            color: #1565c0;
        }
        
        .filter-badge.type {
            background: #e8f5e9;
            color: #2e7d32;
        }
        
        .filter-badge.price {
            background: #fff8e1;
            color: #ff8f00;
        }
        
        .filter-badge.sum {
            background: #f3e5f5;
            color: #7b1fa2;
        }
        
        .filter-badge.exclude {
            background: #ffebee;
            color: #c62828;
        }
        
        .remove-filter {
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            margin-left: 3px;
        }
        
        .remove-filter:hover {
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize the active filter UI
    updateActiveFilterUI();
});

// Cart Functions
function addToCart(item) {
    try {
        // Check if item already exists in cart
        const existingItem = cart.find(cartItem => cartItem[0] === item[0]);
        if (existingItem) {
            showNotification('Number already in cart', 'warning');
            return false;
        }

        cart.push(item);
        updateCartUI();
        saveCart();
        showNotification('Item added to cart successfully!', 'success');
        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding item to cart', 'error');
        return false;
    }
}

function handleBuyNow(item) {
    try {
        const price = parseInt(item[5] || 0);
        const gst = Math.round(price * GST_RATE);
        const total = price + gst;
        
        const confirmMessage = `Confirm purchase of ${item[0]}?\n\nPrice: ₹${price.toLocaleString()}\nGST (18%): ₹${gst.toLocaleString()}\nTotal: ₹${total.toLocaleString()}`;
        
        if (confirm(confirmMessage)) {
            if (addToCart(item)) {
                proceedToCheckout();
            }
        }
    } catch (error) {
        console.error('Error in buy now:', error);
        showNotification('Error processing buy now request', 'error');
    }
}

function removeFromCart(index) {
    try {
        if (index < 0 || index >= cart.length) {
            throw new Error('Invalid item index');
        }
        cart.splice(index, 1);
        updateCartUI();
        saveCart();
        showNotification('Item removed from cart', 'success');
    } catch (error) {
        console.error('Error removing from cart:', error);
        showNotification('Error removing item from cart', 'error');
    }
}

function updateCartUI() {
    try {
        // Update cart count
        if (cartCount) {
            cartCount.textContent = cart.length;
        }

        // Clear existing items
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
        }

        // Show/hide empty cart message
        const isEmpty = cart.length === 0;
        if (emptyCartMessage) {
            emptyCartMessage.style.display = isEmpty ? 'block' : 'none';
        }
        if (cartItemsContainer) {
            cartItemsContainer.style.display = isEmpty ? 'none' : 'block';
        }

        // Calculate totals
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += parseInt(item[5] || 0);
        });

        // Calculate GST (18%)
        const gst = Math.round(subtotal * GST_RATE);
        const total = subtotal + gst;

        // Update cart items
        cart.forEach((item, index) => {
            const price = parseInt(item[5] || 0);
            
            // Create cart item
            if (cartItemsContainer) {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-number">${highlightNumber(item[0])}</div>
                    <div class="cart-item-details">
                        <div class="cart-item-type">${item[4]}</div>
                        <div class="cart-item-price">₹${price.toLocaleString()}</div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(cartItem);
            }
        });

        // Update totals
        if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal.toLocaleString()}`;
        if (cartGST) cartGST.textContent = `₹${gst.toLocaleString()} (18%)`;
        if (cartTotal) cartTotal.textContent = `₹${total.toLocaleString()}`;
    } catch (error) {
        console.error('Error updating cart UI:', error);
        showNotification('Error updating cart', 'error');
    }
}

function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart:', error);
        showNotification('Error saving cart', 'error');
    }
}

function loadCart() {
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
        showNotification('Error loading cart', 'error');
    }
}

function openCart() {
    if (cartDropdown) {
        cartDropdown.classList.add('show');
    }
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.classList.add('show');
    }
}

function closeCart() {
    if (cartDropdown) {
        cartDropdown.classList.remove('show');
    }
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.classList.remove('show');
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Cart is empty', 'warning');
        return;
    }
    
    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + parseInt(item[5] || 0), 0);
    const gst = Math.round(subtotal * GST_RATE);
    const total = subtotal + gst;
    
    // Show checkout confirmation
    const confirmMessage = `Confirm checkout for ${cart.length} item(s)?\n\nSubtotal: ₹${subtotal.toLocaleString()}\nGST (18%): ₹${gst.toLocaleString()}\nTotal: ₹${total.toLocaleString()}`;
    
    if (confirm(confirmMessage)) {
        // In a real application, this would redirect to a payment gateway
        // For now, we'll just show a success message and clear the cart
        showNotification('Order placed successfully!', 'success');
        cart = [];
        saveCart();
        updateCartUI();
        closeCart();
    }
}
