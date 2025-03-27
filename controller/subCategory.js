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

// Add event listener to category dropdown
document.addEventListener('DOMContentLoaded', function () {
    getAllCategoryNames();
    getAllSubCategories();
    checkAuth();

    // Add event listener to category name dropdown
    const categorySelect = document.getElementById('sc_name');
    if (categorySelect) {
        categorySelect.addEventListener('change', getCategoryIdByName);
    }
});

// ✅ Image Preview
function previewImage(event) {
    const input = event.target;
    const preview = document.getElementById('subCategoryImagePreview');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.src = '#';
        preview.style.display = 'none';
    }
}

