require('dotenv').config();


// Get current date in format DD-MM-YYYY
function getCurrentDate() {
    const date = new Date();
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

// Calculate index from date digits
function calculateDateIndex() {
    const date = getCurrentDate();
    const sum = date.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    return sum.toString().split('').reduce((acc, val) => acc + parseInt(val), 0);
}

// Get current hour (0-23)
function getCurrentHour() {
    return new Date().getHours();
}

// Apply the SS cipher pattern
function applyPattern(message, index, pattern, isEncoding = true) {
    let result = '';
    const hourAdjustment = getCurrentHour();
    const adjustedIndex = (index + hourAdjustment) % 26;

    for (let i = 0; i < message.length; i++) {
        const char = message[i];
        if (!/[a-zA-Z]/.test(char)) {
            result += char;
            continue;
        }

        const isUpperCase = char === char.toUpperCase();
        const baseCharCode = isUpperCase ? 65 : 97;
        const charCode = message.charCodeAt(i);
        const normalizedChar = charCode - baseCharCode;
        
        let shift = (pattern[i % pattern.length] === '+') ? adjustedIndex : -adjustedIndex;
        if (!isEncoding) shift = -shift;

        let newChar = ((normalizedChar + shift) % 26 + 26) % 26 + baseCharCode;
        result += String.fromCharCode(newChar);
    }

    return result;
}

// Define patterns for each database letter
const patterns = {
    'A': ['+','-','+','-','+','-','+','-','+','-','+','-','+','-','+','-','+','-','+','-','+','-','+','-','+','-'],
    'B': ['+','+','-','-','+','+','-','-','+','+','-','-','+','+','-','-','+','+','-','-','+','+','-','-','+','+'],
    'C': ['+','+','+','-','-','-','+','+','+','-','-','-','+','+','+','-','-','-','+','+','+','-','-','-','+','+'],
    'D': ['+','+','+','+','-','-','-','-','+','+','+','+','-','-','-','-','+','+','+','+','-','-','-','-','+','+'],
    'E': ['+','-','-','+','+','-','-','+','+','-','-','+','+','-','-','+','+','-','-','+','+','-','-','+','+','-'],
    'F': ['+','+','-','-','-','+','+','+','-','-','-','+','+','+','-','-','-','+','+','+','-','-','-','+','+','+'],
    'G': ['+','-','+','-','-','+','-','+','-','-','+','-','+','-','-','+','-','+','-','-','+','-','+','-','-','+'],
    'H': ['+','+','+','-','-','-','-','+','+','+','-','-','-','-','+','+','+','-','-','-','-','+','+','+','-','-'],
    'I': ['+','-','-','-','+','-','-','-','+','-','-','-','+','-','-','-','+','-','-','-','+','-','-','-','+','-'],
    'J': ['+','+','-','-','+','-','-','+','+','-','-','+','-','-','+','+','-','-','+','-','-','+','+','-','-','+'],
    'K': ['+','+','+','-','-','+','-','-','+','+','+','-','-','+','-','-','+','+','+','-','-','+','-','-','+','+'],
    'L': ['+','-','+','+','-','+','-','-','+','-','+','+','-','+','-','-','+','-','+','+','-','+','-','-','+','-'],
    'M': ['+','+','-','-','-','-','+','+','-','-','-','-','+','+','-','-','-','-','+','+','-','-','-','-','+','+'],
    'N': ['+','-','-','+','-','+','+','-','-','+','-','+','+','-','-','+','-','+','+','-','-','+','-','+','+','-'],
    'O': ['+','+','+','+','-','-','-','-','-','+','+','+','+','-','-','-','-','-','+','+','+','+','-','-','-','-'],
    'P': ['+','-','+','-','+','+','-','-','-','+','-','+','-','+','+','-','-','-','+','-','+','-','+','+','-','-'],
    'Q': ['+','+','-','-','+','+','+','-','-','-','+','+','-','-','+','+','+','-','-','-','+','+','-','-','+','+'],
    'R': ['+','-','-','-','-','+','+','+','+','-','-','-','-','+','+','+','+','-','-','-','-','+','+','+','+','-'],
    'S': ['+','+','+','+','+','-','-','-','-','-','+','+','+','+','+','-','-','-','-','-','+','+','+','+','+','-'],
    'T': ['+','-','+','-','+','-','-','+','+','-','-','+','-','+','-','+','-','-','+','+','-','-','+','-','+','-'],
    'U': ['+','+','-','+','-','-','+','+','-','+','-','-','+','+','-','+','-','-','+','+','-','+','-','-','+','+'],
    'V': ['+','-','-','-','+','+','+','+','-','-','-','-','+','+','+','+','-','-','-','-','+','+','+','+','-','-'],
    'W': ['+','+','+','-','-','-','+','-','-','-','+','+','+','-','-','-','+','-','-','-','+','+','+','-','-','-'],
    'X': ['+','-','+','+','-','-','+','-','+','+','-','-','+','-','+','+','-','-','+','-','+','+','-','-','+','-'],
    'Y': ['+','+','-','-','-','+','+','-','-','-','+','+','-','-','-','+','+','-','-','-','+','+','-','-','-','+'],
    'Z': ['+','-','-','+','+','+','-','-','+','+','+','-','-','+','+','+','-','-','+','+','+','-','-','+','+','+']
};

function encodeMessage(databaseLetter, index, message) {
    if (!patterns[databaseLetter.toUpperCase()]) {
        alert('Invalid database letter! Please use A-Z.');
        return '';
    }
    
    const pattern = patterns[databaseLetter.toUpperCase()];
    let result = applyPattern(message, index, pattern, true);
    
    // Apply Caesar cipher using date-based index
    const dateIndex = calculateDateIndex();
    result = applyPattern(result, dateIndex, ['+'], true);
    
    // Convert to Base64
    return btoa(result);
}

function decodeMessage(databaseLetter, index, message) {
    try {
        // Decode from Base64
        let result = atob(message);
        
        // Reverse Caesar cipher using date-based index
        const dateIndex = calculateDateIndex();
        result = applyPattern(result, dateIndex, ['+'], false);
        
        if (!patterns[databaseLetter.toUpperCase()]) {
            alert('Invalid database letter! Please use A-Z.');
            return '';
        }
        
        const pattern = patterns[databaseLetter.toUpperCase()];
        return applyPattern(result, index, pattern, false);
    } catch (e) {
        alert('Invalid encoded message! Please check your input.');
        return '';
    }
}

// Login credentials (in real-world application, this should be server-side)
const CREDENTIALS = {
    'Sam': 'SI96305',
    'Ishu': 'SI96305'
};

document.getElementById('loginBtn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    if (CREDENTIALS[username] && CREDENTIALS[username] === password) {
        // Store login state and username
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('currentUser', username);
        // Redirect to home page
        window.location.href = 'home.html';
    } else {
        errorMessage.textContent = 'Invalid username or password!';
    }
});

// Check if user is already logged in
window.addEventListener('load', function() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true' && !window.location.href.includes('home.html')) {
        window.location.href = 'home.html';
    }
});

// Event Listeners
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('encodeBtn').addEventListener('click', function() {
        const databaseLetter = document.getElementById('database').value;
        const index = parseInt(document.getElementById('index').value);
        const message = document.getElementById('message').value;

        if (!databaseLetter || !index || !message) {
            alert('Please fill in all fields!');
            return;
        }

        if (index < 1 || index > 25) {
            alert('Index must be between 1 and 25!');
            return;
        }

        const encodedMessage = encodeMessage(databaseLetter, index, message);
        document.getElementById('output').value = encodedMessage;
    });
});

document.getElementById('decodeBtn').addEventListener('click', function() {
    const databaseLetter = document.getElementById('database').value;
    const index = parseInt(document.getElementById('index').value);
    const message = document.getElementById('message').value;

    if (!databaseLetter || !index || !message) {
        alert('Please fill in all fields!');
        return;
    }

    if (index < 1 || index > 25) {
        alert('Index must be between 1 and 25!');
        return;
    }

    const decodedMessage = decodeMessage(databaseLetter, index, message);
    document.getElementById('output').value = decodedMessage;
});
