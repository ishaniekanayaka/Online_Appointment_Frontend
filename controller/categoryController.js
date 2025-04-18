
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


// ✅ Fetch All Categories and Load into Table
function getAllCategories() {
    const tableBody = $('#categoryTableBody');

    // Clear the table completely and show loading
    tableBody.empty();
    const loadingRow = `<tr><td colspan="5" class="text-center text-muted">Loading...</td></tr>`;
    tableBody.append(loadingRow);

    $.ajax({
        url: `${BASE_URL}/getAll`,
        type: 'GET',
        headers: getHeaders(),
        success: function (data) {
            // Clear loading row
            tableBody.empty();

            if (!data.data || data.data.length === 0) {
                // If no categories, show an "Empty" message
                tableBody.append(`<tr><td colspan="5" class="text-center text-muted">No categories found</td></tr>`);
                return;
            }

            console.log("API Response:", data);

            data.data.forEach(category => {
                // Sanitize image URL
                let imageUrl = category.image 
                    ? `http://localhost:8080/${category.image.replace(/\\/g, "/")}`
                    : "placeholder.jpg";

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

            // Show success notification
            Swal.fire({
                icon: 'success',
                title: 'Refreshed!',
                text: 'Category list updated successfully!',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (xhr) {
            // Clear table and show error
            tableBody.empty();
            tableBody.append(`<tr><td colspan="5" class="text-center text-danger">Error loading data</td></tr>`);
            
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error fetching categories: ' + xhr.responseText,
                toast: true,
                position: 'top-end'
            });
        }
    });
}

// Refresh Button Click - Calls getAllCategories()
function getAllCategory() {
    getAllCategories();
}


//         url: `${BASE_URL}/getAll`,
//         type: 'GET',
//         headers: getHeaders(),
//         success: function (data) {
//             console.log("API Response:", data);
//             const tableBody = $('#categoryTableBody');
//             tableBody.empty();

//             data.data.forEach(category => {
//                 let imageUrl = category.image ? `http://localhost:8080/${category.image.replace(/\\/g, "/")}` : "placeholder.jpg";

//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td>${category.id}</td>
//                     <td>${category.name}</td>
//                     <td>${category.description || '-'}</td>
//                     <td><img src="${imageUrl}" style="width: 50px; height: 50px; object-fit: cover;"></td>
//                     <td class="text-center">
//                         <button class="btn btn-warning btn-sm" onclick='loadCategoryForEdit(${JSON.stringify(category)})'>Edit</button>
//                         <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.id})">Delete</button>
//                     </td>
//                 `;
//                 tableBody.append(row);
//             });
//         },
//         error: function (xhr) {
//             Swal.fire('Error!', 'Error fetching categories: ' + xhr.responseText, 'error');
//         }
//     });
// }

// ✅ Clear Form
function clearForm() {
    $('#categoryForm')[0].reset();
    $('#imagePreview').attr('src', '#').hide();
    window.selectedCategoryId = null;
}
