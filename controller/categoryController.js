document.addEventListener('DOMContentLoaded', function () {
    getAllCategories();
    checkAuth();
});

const BASE_URL = "http://localhost:8080/api/v1/category";
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

// ✅ Image Preview
function previewImage(event) {
    const input = event.target;
    const preview = document.getElementById('imagePreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.src = '#';
        preview.style.display = 'none';
    }
}

// ✅ Save Category
function saveCategory() {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const imageFile = document.getElementById('image').files[0];

    if (!name) {
        Swal.fire('Warning', 'Name is required!', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (imageFile) formData.append('image', imageFile);

    $.ajax({
        url: `${BASE_URL}/save`,
        type: 'POST',
        headers: getHeaders(true),
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            Swal.fire('Success!', response.message, 'success');
            clearForm();
            getAllCategories();
        },
        error: function (xhr) {
            Swal.fire('Error!', 'Error saving category: ' + xhr.responseText, 'error');
        }
    });
}

// ✅ Load Category for Editing
function loadCategoryForEdit(category) {
    document.getElementById('name').value = category.name;
    document.getElementById('description').value = category.description;
    window.selectedCategoryId = category.id;

    const preview = document.getElementById('imagePreview');
    if (category.image) {
        let imageUrl = `http://localhost:8080/${category.image.replace(/\\/g, "/")}`;
        preview.src = imageUrl;
        preview.style.display = 'block';
    } else {
        preview.src = "#";
        preview.style.display = 'none';
    }

    document.getElementById('updateBtn').style.display = 'inline-block';
    document.getElementById('saveBtn').style.display = 'none';
}

// ✅ Update Category with Confirmation
function updateCategory() {
    const categoryId = window.selectedCategoryId;
    if (!categoryId) {
        Swal.fire('Warning', 'No category selected for update.', 'warning');
        return;
    }

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const imageFile = document.getElementById('image').files[0];

    if (!name) {
        Swal.fire('Warning', 'Name is required!', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (imageFile) formData.append('image', imageFile);

    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update this category?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${BASE_URL}/update/${categoryId}`,
                type: 'PUT',
                headers: getHeaders(true),
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    Swal.fire('Updated!', response.message, 'success');
                    clearForm();
                    getAllCategories();
                    document.getElementById('updateBtn').style.display = 'none';
                    document.getElementById('saveBtn').style.display = 'inline-block';
                },
                error: function (xhr) {
                    Swal.fire('Error!', 'Error updating category: ' + xhr.responseText, 'error');
                }
            });
        }
    });
}

// ✅ Delete Category with Confirmation
function deleteCategory(categoryId) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${BASE_URL}/delete/${categoryId}`,
                type: 'DELETE',
                headers: getHeaders(),
                success: function (response) {
                    Swal.fire('Deleted!', response.message, 'success');
                    getAllCategories();
                },
                error: function (xhr) {
                    Swal.fire('Error!', 'Error deleting category: ' + xhr.responseText, 'error');
                }
            });
        }
    });
}

// ✅ Fetch All Categories
function getAllCategories() {
    $.ajax({
        url: `${BASE_URL}/getAll`,
        type: 'GET',
        headers: getHeaders(),
        success: function (data) {
            console.log("API Response:", data);
            const tableBody = $('#categoryTableBody');
            tableBody.empty();

            data.data.forEach(category => {
                let imageUrl = category.image ? `http://localhost:8080/${category.image.replace(/\\/g, "/")}` : "placeholder.jpg";

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${category.id}</td>
                    <td>${category.name}</td>
                    <td>${category.description || '-'}</td>
                    <td><img src="${imageUrl}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                    <td class="text-center">
                        <button class="btn btn-warning btn-sm" onclick='loadCategoryForEdit(${JSON.stringify(category)})'>Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.id})">Delete</button>
                    </td>
                `;
                tableBody.append(row);
            });
        },
        error: function (xhr) {
            Swal.fire('Error!', 'Error fetching categories: ' + xhr.responseText, 'error');
        }
    });
}

// ✅ Clear Form
function clearForm() {
    $('#categoryForm')[0].reset();
    $('#imagePreview').attr('src', '#').hide();
    window.selectedCategoryId = null;
}
