document.addEventListener('DOMContentLoaded', function () {
    //getAllCategories();
    checkAuth();
});


//subcategory base url
const SUBCATEGORY_BASE_URL = "http://locathost:8080/api/vi/subcategory";
const AUTH_TOKEN = localStorage.getItem('authToken');

// ✅ Check Authentication
function checkAuth() {
    if (!AUTH_TOKEN) {
        Swal.fire('Unauthorized', 'You are not authenticated. Please login.', 'error').then(() => {
            window.location.href = '/login.html';
        });
    }
}

// ✅ Headers for API Requests
function getHeaders(isMultipart = false) {
    return isMultipart ? { 'Authorization': `Bearer ${AUTH_TOKEN}` } : {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
    };
}