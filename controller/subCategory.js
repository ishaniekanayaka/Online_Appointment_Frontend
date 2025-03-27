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

// ✅ Get Category ID by Name
// function getAllSubCategories() {
//     const tableBody = $('#subCategoryTableBody');

//     // Clear the table completely and show loading
//     tableBody.empty();
//     const loadingRow = `<tr><td colspan="6" class="text-center text-muted">Loading...</td></tr>`;
//     tableBody.append(loadingRow);

//     $.ajax({
//         url: `${SUBCATEGORY_BASE_URL}/getAll`,
//         type: 'GET',
//         headers: getHeaders(),
//         success: function (data) {
//             // Clear loading row
//             tableBody.empty();

//             if (!data.data || data.data.length === 0) {
//                 // If no subcategories, show an "Empty" message
//                 tableBody.append(`<tr><td colspan="6" class="text-center text-muted">No subcategories found</td></tr>`);
//                 return;
//             }

//             data.data.forEach(subcategory => {
//                 // Sanitize image URL
//                 let imageUrl = subcategory.image 
//                     ? `http://localhost:8080/${subcategory.image.replace(/\\/g, "/")}`
//                     : "placeholder.jpg";

//                 // Get category name safely
//                 let categoryName = subcategory.category 
//                     ? (subcategory.category.name || '-') 
//                     : '-';

//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td>${subcategory.id || '-'}</td>
//                     <td>${subcategory.name || '-'}</td>
//                     <td>${subcategory.description || '-'}</td>
//                     <td>
//                         <img src="${imageUrl}" 
//                              style="width: 50px; height: 50px; object-fit: cover;" 
//                              onerror="this.src='placeholder.jpg'; this.onerror=null;">
//                     </td>
//                     <td>${categoryName}</td>
//                     <td class="text-center">
//                         <button class="btn btn-warning btn-sm" onclick='loadSubCategoryForEdit(${JSON.stringify(subcategory)})'>Edit</button>
//                         <button class="btn btn-danger btn-sm" onclick="deleteSubCategory(${subcategory.id})">Delete</button>
//                     </td>
//                 `;
//                 tableBody.append(row);
//             });

//             // Show success notification
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Refreshed!',
//                 text: 'Subcategory list updated successfully!',
//                 toast: true,
//                 position: 'top-end',
//                 showConfirmButton: false,
//                 timer: 1500
//             });
//         },
//         error: function (xhr) {
//             // Clear table and show error
//             tableBody.empty();
//             tableBody.append(`<tr><td colspan="6" class="text-center text-danger">Error loading data</td></tr>`);
            
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error!',
//                 text: 'Error fetching subcategories: ' + xhr.responseText,
//                 toast: true,
//                 position: 'top-end'
//             });
//         }
//     });
// }
// ✅ Populate Categories Dropdown with Names
function getAllCategoryNames() {
    $.ajax({
        url: `${BASE_URL}/names`,
        type: 'GET',
        headers: getHeaders(true),
        success: function (data) {
            const categorySelect = document.getElementById('sc_name');
            categorySelect.innerHTML = '<option value="">Select Category</option>';
            
            // Ensure data.data exists and is an array
            if (data.data && Array.isArray(data.data)) {
                data.data.forEach(categoryName => {
                    const option = document.createElement('option');
                    option.value = categoryName;
                    option.textContent = categoryName;
                    categorySelect.appendChild(option);
                });
            }
        },
        error: function (xhr) {
            Swal.fire('Error!', 'Error fetching category names: ' + xhr.responseText, 'error');
        }
    });
}



