// SubCategory Base URL
const SUBCATEGORY_BASE_URL = "http://localhost:8080/api/v1/subcategory";


// ✅ Get Category ID by Name when Category is Selected
function getCategoryIdByName() {
    const selectedCategoryName = document.getElementById('sc_name').value;
    
    if (!selectedCategoryName) {
        document.getElementById('sc_id').value = '';
        return;
    }

    $.ajax({
        url: `${BASE_URL}/name/${selectedCategoryName}`,
        type: 'GET',
        headers: getHeaders(),
        success: function (data) {
            if (data.data && data.data.id) {
                document.getElementById('sc_id').value = data.data.id;
            } else {
                Swal.fire('Warning', 'Could not retrieve category ID', 'warning');
            }
        },
        error: function (xhr) {
            Swal.fire('Error!', 'Error fetching category ID: ' + xhr.responseText, 'error');
        }
    });
}

// ✅ Save SubCategory
function saveSubCategory() {
    const subCategoryName = document.getElementById('subCategoryName').value;
    const subCategoryDescription = document.getElementById('subCategoryDescription').value;
    const selectedCategoryId = document.getElementById('sc_id').value;
    const imageFile = document.getElementById('subCategoryImage').files[0];

    // Validation
    if (!subCategoryName) {
        Swal.fire('Warning', 'SubCategory Name is required!', 'warning');
        return;
    }

    if (!selectedCategoryId) {
        Swal.fire('Warning', 'Please select a Category!', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append('name', subCategoryName);
    formData.append('description', subCategoryDescription);
    formData.append('categoryId', selectedCategoryId);
    if (imageFile) formData.append('image', imageFile);

    $.ajax({
        url: `${SUBCATEGORY_BASE_URL}/save`,
        type: 'POST',
        headers: getHeaders(true),
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            Swal.fire('Success!', response.message, 'success');
            clearSubCategoryForm();
            getAllSubCategories();
        },
        error: function (xhr) {
            Swal.fire('Error!', 'Error saving subcategory: ' + xhr.responseText, 'error');
        }
    });
}

// ✅ Clear SubCategory Form
function clearSubCategoryForm() {
    document.getElementById('subCategoryForm').reset();
    document.getElementById('subCategoryImagePreview').src = '#';
    document.getElementById('subCategoryImagePreview').style.display = 'none';
    document.getElementById('sc_id').value = '';
}


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


function getAllCategoryNames() {
    $.ajax({
        url: `${BASE_URL}/names`,
        type: 'GET',
        headers: getHeaders(),
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

// ✅ Fetch All SubCategories with Detailed Information
function getAllSubCategories() {
    const tableBody = $('#subCategoryTableBody');

    tableBody.empty();
    const loadingRow = `<tr><td colspan="6" class="text-center text-muted">Loading...</td></tr>`;
    tableBody.append(loadingRow);

    $.ajax({
        url: `${SUBCATEGORY_BASE_URL}/getAll`,
        type: 'GET',
        headers: getHeaders(),
        success: function (data) {
            tableBody.empty();

            if (!data.data || data.data.length === 0) {
                tableBody.append(`<tr><td colspan="6" class="text-center text-muted">No subcategories found</td></tr>`);
                return;
            }

            data.data.forEach(subcategory => {
                // Directly use the image path from the backend
                let imageUrl = subcategory.image 
                    ? `http://localhost:8080/${subcategory.image}` 
                    : "https://via.placeholder.com/50";

                let categoryName = '-';
                if (subcategory.category) {
                    categoryName = subcategory.category.name || '-';
                } else if (subcategory.categoryId) {
                    categoryName = subcategory.categoryId.toString();
                }

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${subcategory.id}</td>
                    <td>${subcategory.name}</td>
                    <td>${subcategory.description || '-'}</td>
                
                    <td><img src="${imageUrl}" style="width: 50px; height: 50px; object-fit: cover;"></td>

                    <td>${categoryName}</td>
                    <td class="text-center">
                        <button class="btn btn-warning btn-sm" onclick='loadSubCategoryForEdit(${JSON.stringify(subcategory)})'>Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteSubCategory(${subcategory.id})">Delete</button>
                    </td>
                `;
                tableBody.append(row);
            });

            Swal.fire({
                icon: 'success',
                title: 'Refreshed!',
                text: 'Subcategory list updated successfully!',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (xhr) {
            tableBody.empty();
            tableBody.append(`<tr><td colspan="6" class="text-center text-danger">Error loading data</td></tr>`);

            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error fetching subcategories: ' + xhr.responseText,
                toast: true,
                position: 'top-end'
            });
        }
    });
}
// Similarly update the image preview in loadSubCategoryForEdit function
// function loadSubCategoryForEdit(subcategory) {
//     // Previous code remains the same...

//     // Improved image preview
//     const preview = document.getElementById('subCategoryImagePreview');
//     if (subcategory.image) {
//         let imageUrl = `http://localhost:8080/${subcategory.image.replace(/\\/g, "/")}`;
//         preview.src = imageUrl;
//         preview.onerror = function() {
//             this.src = 'https://via.placeholder.com/200';
//         };
//         preview.style.display = 'block';
//     } else {
//         preview.src = "https://via.placeholder.com/200";
//         preview.style.display = 'block';
//     }

//     // Store the subcategory ID for update
//     window.selectedSubCategoryId = subcategory.id;
// }

// ✅ Load SubCategory for Editing
function loadSubCategoryForEdit(subcategory) {
    // Fill form fields
    document.getElementById('subCategoryName').value = subcategory.name || '';
    document.getElementById('subCategoryDescription').value = subcategory.description || '';
    
    // Set category dropdown
    if (subcategory.category && subcategory.category.name) {
        const categorySelect = document.getElementById('sc_name');
        categorySelect.value = subcategory.category.name;
        
        // Trigger category ID retrieval
        getCategoryIdByName();
    }

    // Preview image
    const preview = document.getElementById('subCategoryImagePreview');
    if (subcategory.image) {
        let imageUrl = `http://localhost:8080/${subcategory.image.replace(/\\/g, "/")}`;
        preview.src = imageUrl;
        preview.style.display = 'block';
    } else {
        preview.src = "#";
        preview.style.display = 'none';
    }

    // Store the subcategory ID for update
    window.selectedSubCategoryId = subcategory.id;
}

// ✅ Update SubCategory Function
function updateSubCategory() {
    const subcategoryId = window.selectedSubCategoryId;
    if (!subcategoryId) {
        Swal.fire('Warning', 'No subcategory selected for update.', 'warning');
        return;
    }

    const subCategoryName = document.getElementById('subCategoryName').value;
    const subCategoryDescription = document.getElementById('subCategoryDescription').value;
    const selectedCategoryId = document.getElementById('sc_id').value;
    const imageFile = document.getElementById('subCategoryImage').files[0];

    // Validation
    if (!subCategoryName) {
        Swal.fire('Warning', 'SubCategory Name is required!', 'warning');
        return;
    }

    if (!selectedCategoryId) {
        Swal.fire('Warning', 'Please select a Category!', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append('name', subCategoryName);
    formData.append('description', subCategoryDescription);
    formData.append('categoryId', selectedCategoryId);
    if (imageFile) formData.append('image', imageFile);

    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update this subcategory?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${SUBCATEGORY_BASE_URL}/update/${subcategoryId}`,
                type: 'PUT',
                headers: getHeaders(true),
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    Swal.fire('Updated!', response.message, 'success');
                    clearSubCategoryForm();
                    getAllSubCategories();
                },
                error: function (xhr) {
                    Swal.fire('Error!', 'Error updating subcategory: ' + xhr.responseText, 'error');
                }
            });
        }
    });
}

// ✅ Delete SubCategory Function
function deleteSubCategory(subcategoryId) {
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
                url: `${SUBCATEGORY_BASE_URL}/delete/${subcategoryId}`,
                type: 'DELETE',
                headers: getHeaders(),
                success: function (response) {
                    Swal.fire('Deleted!', response.message, 'success');
                    getAllSubCategories();
                },
                error: function (xhr) {
                    Swal.fire('Error!', 'Error deleting subcategory: ' + xhr.responseText, 'error');
                }
            });
        }
    });
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

