// auth.js

// Secure password hashing using PBKDF2 with WebCrypto API
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await window.crypto.subtle.importKey('raw', encoder.encode(password), {'name': 'PBKDF2'}, false, ['deriveBits', 'deriveKey']);
    const key = await window.crypto.subtle.deriveKey({
        'name': 'PBKDF2',
        'salt': salt,
        'iterations': 100000,
        'hash': 'SHA-256'
    }, keyMaterial, {'name': 'AES-GCM', 'length': 256}, false, ['encrypt']);
    return { key, salt };
}

// Function to encrypt a session token
async function encryptSessionToken(token) {
    const { key } = await hashPassword('session_password'); // replace 'session_password' with a strong password
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedToken = await window.crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv
    }, key, new TextEncoder().encode(token));
    return { encryptedToken, iv };
}

// CSRF token management
let csrfToken = null;
function generateCsrfToken() {
    csrfToken = window.crypto.getRandomValues(new Uint8Array(32)).toString(); // Simple CSRF token
    return csrfToken;
}

function validateCsrfToken(token) {
    return csrfToken === token;
}

// Login function
async function login(username, password) {
    const hashedPassword = await hashPassword(password);
    // Store hashedPassword securely (e.g., local storage)
    console.log(`User ${username} logged in with hashed password`);
}

// Logout function
function logout() {
    console.log('User logged out');
    // Clear session and tokens
}

export { login, logout, generateCsrfToken, validateCsrfToken };