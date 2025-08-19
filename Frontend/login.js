"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginForm = document.getElementById('loginForm');
loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput?.value ?? '';
    const password = passwordInput?.value ?? '';
    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        console.log(data);
        if (data && data.access_token) {
            const token = data.access_token;
            const payload = token ? atob(token.split('.')[1]) : '';
            console.log(payload);
            console.log(token);
            localStorage.setItem('userData', payload);
            localStorage.setItem('access_token', token);
            alert("Login Successful");
            window.location.href = "index.html";
        }
        else {
            alert(data.message || "Login Failed");
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
});
//# sourceMappingURL=login.js.map