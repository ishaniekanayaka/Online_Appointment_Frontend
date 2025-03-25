document.addEventListener('DOMContentLoaded', function () {
    getAllCategories();
    checkAuth();
});

const BASE_URL = "http://localhost:8080/api/v1/category";
const AUTH_TOKEN = localStorage.getItem('authToken');

// ✅ Check Authentication
function checkAuth() {
    if (!AUTH_TOKEN) {
        alert('You are not authenticated. Please login.');
        window.location.href = '/login.html';
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

    if (!name) return alert('Name is required!');
    
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
            alert(response.message);
            clearForm();
            getAllCategories();
        },
        error: function (xhr) {
            alert('Error saving category: ' + xhr.responseText);
        }
    });
}

// ✅ Load Category for Editing
function loadCategoryForEdit(category) {
    document.getElementById('name').value = category.name;
    document.getElementById('description').value = category.description;

    // Store category ID in a global variable
    window.selectedCategoryId = category.id;

    // Display existing image preview if available
    const preview = document.getElementById('imagePreview');
    if (category.image) {
        let imageUrl = `http://localhost:8080/${category.image.replace(/\\/g, "/")}`;
        preview.src = imageUrl;
        preview.style.display = 'block';
    } else {
        preview.src = "#";
        preview.style.display = 'none';
    }

    // Show the Update button and hide the Save button
    document.getElementById('updateBtn').style.display = 'inline-block';
    document.getElementById('saveBtn').style.display = 'none';
}

// ✅ Update Category Function
function updateCategory() {
    const categoryId = window.selectedCategoryId;
    if (!categoryId) {
        alert('No category selected for update.');
        return;
    }

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const imageFile = document.getElementById('image').files[0];

    if (!name) return alert('Name is required!');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (imageFile) formData.append('image', imageFile);

    $.ajax({
        url: `${BASE_URL}/update/${categoryId}`,
        type: 'PUT',
        headers: getHeaders(true),
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            alert(response.message);
            clearForm();
            getAllCategories();

            // Hide update button and show save button again
            document.getElementById('updateBtn').style.display = 'none';
            document.getElementById('saveBtn').style.display = 'inline-block';
        },
        error: function (xhr) {
            alert('Error updating category: ' + xhr.responseText);
        }
    });
}

// ✅ Ensure update button has the correct ID in HTML
document.getElementById('updateBtn').addEventListener('click', updateCategory);



// // ✅ Get All Categories

function getAllCategories() {
    $.ajax({
        url: `${BASE_URL}/getAll`,
        type: 'GET',
        headers: getHeaders(),
        success: function (data) {
            console.log("API Response:", data); // Debugging

            const tableBody = $('#categoryTableBody');
            tableBody.empty();

            data.data.forEach(category => {
                // Fix image path by replacing backslashes with forward slashes
                let imageUrl = category.image ? `http://localhost:8080/${category.image.replace(/\\/g, "/")}` : "placeholder.jpg";
                console.log(imageUrl)
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
            alert('Error fetching categories: ' + xhr.responseText);
        }
    });
}

//     $.ajax({
//         url: `${BASE_URL}/getAll`,
//         type: 'GET',
//         headers: {
//             ...getHeaders(), // Spread existing headers
//             // Add any additional authentication headers if needed
//             // For example:
//             // 'Authorization': 'Bearer ' + yourAuthToken
//         },
//         success: function (data) {
//             console.log("API Response:", data);
//             const tableBody = $('#categoryTableBody');
//             tableBody.empty();
//             data.data.forEach(category => {
//                 // Additional debug logging
//                 console.log("Category Image Path:", category.image);
                
//                 let imageUrl = category.image 
//                     ? `${BASE_URL}/${category.image.replace(/\\/g, '/')}`
//                     : "placeholder.jpg";
                
//                 console.log("Constructed Image URL:", imageUrl);

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
//             console.error('Full XHR error:', xhr);
//             alert('Error fetching categories: ' + xhr.responseText);
//         }
//     });
// }


// ✅ Load Category for Editing


// ✅ Delete Category
function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    $.ajax({
        url: `${BASE_URL}/delete/${categoryId}`,
        type: 'DELETE',
        headers: getHeaders(),
        success: function (response) {
            alert(response.message);
            getAllCategories();
        },
        error: function (xhr) {
            alert('Error deleting category: ' + xhr.responseText);
        }
    });
}

// ✅ Clear Form
function clearForm() {
    $('#categoryForm')[0].reset();
    $('#imagePreview').attr('src', '#').hide();
    window.selectedCategoryId = null;
}
