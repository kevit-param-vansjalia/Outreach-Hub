"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token = localStorage.getItem('access_token');
if (!token) {
    alert('Please login first.');
    window.location.href = 'login.html';
}
//# sourceMappingURL=home.js.map