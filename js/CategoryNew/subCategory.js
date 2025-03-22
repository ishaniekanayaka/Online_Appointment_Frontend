/*
loadCategoryNames();

function loadCategoryNames(){
    const authToken = localStorage.getItem('authToken')
    $.ajax({
        url: "http://localhost:8080/api/v1/category/getCategoryName",
        method: "GET",
        dataType: "json",
        headers: {"Authorization": `Bearer ${authToken}`},
        success: (resp) => {
            let categoryDropdown = $("#sc_name");
            categoryDropdown.empty().append('<option value="">Select Category Name</option>');
            resp.data.forEach(name => {
                categoryDropdown.append(`<option value="${name}">${name}</option>`);
            });
        },
        error: (err) => {
            console.error("Error loading customer IDs:", err);
        }
    });
}*/
loadCategoryNames();

function loadCategoryNames(){
    const authToken = localStorage.getItem('authToken')
    $.ajax({
        url: "http://localhost:8080/api/v1/category/getCategoryName",
        method: "GET",
        dataType: "json",
        headers: {"Authorization": `Bearer ${authToken}`},
        success: (resp) => {
            let categoryDropdown = $("#sc_name");
            categoryDropdown.empty().append('<option value="">Select Category Name</option>');
            resp.data.forEach(name => {
                categoryDropdown.append(`<option value="${name}">${name}</option>`);
            });
        },
        error: (err) => {
            console.error("Error loading customer IDs:", err);
        }
    });
}

$("#sc_name").change(function (){
    const authToken = localStorage.getItem('authToken')
    let selectedName = $(this).val();
    if (selectedName) {
        $.ajax({
            url: `http://localhost:8080/api/v1/category/getCategoryByName/${selectedName}`,
            method: "GET",
            dataType: "json",
            headers: {"Authorization": `Bearer ${authToken}`},
            success: function (resp) {
                if (resp && resp.data) {
                    $("#sc_id").val(resp.data.id);

                } else {
                    $("#sc_id").val("");

                }
            },
            error: function (error) {
                console.error("Error fetching item details:", error);
            }
        });
    } else {
        $("#sc_id").val("");

    }
});

// Function to save a subcategory
function saveSubCategory() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        alert("You are not authenticated. Please log in again.");
        return;
    }

    // Get form values
    const subCategoryId = $("#subCategoryId").val();
    const subCategoryName = $("#subCategoryName").val();
    const subCategoryDescription = $("#subCategoryDescription").val();
    const categoryId = $("#sc_id").val();

    // Form validation
    if (!subCategoryId || !subCategoryName || !categoryId) {
        alert("Please fill in all required fields");
        return;
    }

    // Prepare image data if available
    let imageData = null;
    const fileInput = document.getElementById('subCategoryImage');
    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(event) {
            imageData = event.target.result;
            // Once image is loaded, proceed with saving
            submitSubCategoryData(imageData);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        // No image selected, proceed with saving
        submitSubCategoryData(imageData);
    }

    function submitSubCategoryData(imageData) {
        // Prepare data object
        const subCategoryData = {
            id: subCategoryId,
            name: subCategoryName,
            description: subCategoryDescription,
            categoryId: categoryId,
            image: imageData
        };

        console.log("Saving subcategory data:", subCategoryData);

        // Send AJAX request
        $.ajax({
            url: "http://localhost:8080/api/v1/subCategory/save",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(subCategoryData),
            headers: {"Authorization": `Bearer ${authToken}`},
            success: function(response) {
                console.log("Save response:", response);
                alert("SubCategory saved successfully!");
                clearSubCategoryForm();
                getAllSubCategories(); // Refresh the list
            },
            error: function(xhr, status, error) {
                console.error("Error saving subcategory:", xhr.responseText);
                alert("Failed to save subcategory. Please check console for details.");
            }
        });
    }
}

// Function to clear the form
function clearSubCategoryForm() {
    $("#subCategoryId").val("");
    $("#subCategoryName").val("");
    $("#subCategoryDescription").val("");
    $("#sc_name").val("");
    $("#sc_id").val("");
    $("#subCategoryImage").val("");
    $("#subCategoryImagePreview").attr("src", "#").hide();
}

// Function to preview the image
function previewImage(event) {
    const imagePreview = document.getElementById('subCategoryImagePreview');
    if (event.target.files.length > 0) {
        imagePreview.src = URL.createObjectURL(event.target.files[0]);
        imagePreview.style.display = 'block';
    } else {
        imagePreview.src = '#';
        imagePreview.style.display = 'none';
    }
}

// Function to get all subcategories
function getAllSubCategories() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        console.error("Authentication token not found");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/subcategory/getAll",
        method: "GET",
        dataType: "json",
        headers: {"Authorization": `Bearer ${authToken}`},
        success: function(response) {
            console.log("Subcategories response:", response);

            // Handle different response formats
            let subcategories = [];
            if (response && response.data) {
                subcategories = response.data;
            } else if (Array.isArray(response)) {
                subcategories = response;
            }

            populateSubCategoryTable(subcategories);
        },
        error: function(xhr, status, error) {
            console.error("Error fetching subcategories:", xhr.responseText);
            $("#subCategoryTableBody").html('<tr><td colspan="6" class="text-center">Error loading data</td></tr>');
        }
    });
}

// Function to populate the subcategory table
function populateSubCategoryTable(subcategories) {
    const tableBody = $("#subCategoryTableBody");
    tableBody.empty();

    if (subcategories && subcategories.length > 0) {
        subcategories.forEach(subCategory => {
            let imageHtml = subCategory.image ?
                `<img src="${subCategory.image}" alt="Subcategory Image" style="max-width: 50px; max-height: 50px;">` :
                '<span class="text-muted">No image</span>';

            tableBody.append(`
                <tr data-id="${subCategory.id}" onclick="selectSubCategory(this)">
                    <td>${subCategory.id || ''}</td>
                    <td>${subCategory.name || ''}</td>
                    <td>${subCategory.description || ''}</td>
                    <td class="text-center">${imageHtml}</td>
                    <td>${subCategory.categoryName || ''}</td>
                    <td class="text-center action-buttons">
                        <button class="btn btn-sm btn-primary btn-action" onclick="editSubCategory('${subCategory.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-action" onclick="deleteSubCategory('${subCategory.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    } else {
        tableBody.append('<tr><td colspan="6" class="text-center">No subcategories found</td></tr>');
    }
}

// Function to select a subcategory row
function selectSubCategory(row) {
    // Remove selected class from all rows
    $("#subCategoryTableBody tr").removeClass("selected-row");
    // Add selected class to clicked row
    $(row).addClass("selected-row");
}

// Function to edit a subcategory
function editSubCategory(id) {
    // Prevent the click from bubbling up to the tr element
    event.stopPropagation();
    const authToken = localStorage.getItem('authToken');

    $.ajax({
        url: `http://localhost:8080/api/v1/subcategory/get/${id}`,
        method: "GET",
        dataType: "json",
        headers: {"Authorization": `Bearer ${authToken}`},
        success: function(response) {
            console.log("Edit response:", response);
            let subCategory;

            if (response && response.data) {
                subCategory = response.data;
            } else if (response && !response.data) {
                subCategory = response;
            }

            if (subCategory) {
                // Populate form
                $("#subCategoryId").val(subCategory.id);
                $("#subCategoryName").val(subCategory.name);
                $("#subCategoryDescription").val(subCategory.description || '');

                // Find and select the category in dropdown
                if (subCategory.categoryName) {
                    $("#sc_name").val(subCategory.categoryName).trigger('change');
                } else if (subCategory.categoryId) {
                    $("#sc_id").val(subCategory.categoryId);
                }

                // Show image preview if available
                if (subCategory.image) {
                    $("#subCategoryImagePreview").attr("src", subCategory.image).show();
                } else {
                    $("#subCategoryImagePreview").attr("src", "#").hide();
                }
            }
        },
        error: function(xhr, status, error) {
            console.error("Error fetching subcategory:", xhr.responseText);
            alert("Failed to load subcategory details.");
        }
    });
}

// Function to delete a subcategory
function deleteSubCategory(id) {
    // If called from button, prevent propagation
    if (event && id) {
        event.stopPropagation();
    } else if (!id) {
        // If called from main delete button, get ID from form
        id = $("#subCategoryId").val();
        if (!id) {
            alert("Please select a subcategory to delete");
            return;
        }
    }

    if (confirm("Are you sure you want to delete this subcategory?")) {
        const authToken = localStorage.getItem('authToken');

        $.ajax({
            url: `http://localhost:8080/api/v1/subcategory/delete/${id}`,
            method: "DELETE",
            headers: {"Authorization": `Bearer ${authToken}`},
            success: function(response) {
                console.log("Delete response:", response);
                alert("SubCategory deleted successfully!");
                clearSubCategoryForm();
                getAllSubCategories(); // Refresh the list
            },
            error: function(xhr, status, error) {
                console.error("Error deleting subcategory:", xhr.responseText);
                alert("Failed to delete subcategory.");
            }
        });
    }
}

// Function to update a subcategory
function updateSubCategory() {
    const authToken = localStorage.getItem('authToken');
    const subCategoryId = $("#subCategoryId").val();

    if (!subCategoryId) {
        alert("Please select a subcategory to update");
        return;
    }

    // Get form values
    const subCategoryName = $("#subCategoryName").val();
    const subCategoryDescription = $("#subCategoryDescription").val();
    const categoryId = $("#sc_id").val();

    // Form validation
    if (!subCategoryName || !categoryId) {
        alert("Please fill in all required fields");
        return;
    }

    // Handle image update
    let imageData = null;
    const fileInput = document.getElementById('subCategoryImage');
    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(event) {
            imageData = event.target.result;
            submitUpdateData(imageData);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        // Check if there's an existing image preview
        const imagePreview = document.getElementById('subCategoryImagePreview');
        if (imagePreview.style.display !== 'none' && imagePreview.src !== window.location.href + '#') {
            imageData = imagePreview.src;
        }
        submitUpdateData(imageData);
    }

    function submitUpdateData(imageData) {
        // Prepare data object
        const subCategoryData = {
            id: subCategoryId,
            name: subCategoryName,
            description: subCategoryDescription,
            categoryId: categoryId,
            image: imageData
        };

        console.log("Updating subcategory:", subCategoryData);

        // Send AJAX request
        $.ajax({
            url: "http://localhost:8080/api/v1/subcategory/update",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(subCategoryData),
            headers: {"Authorization": `Bearer ${authToken}`},
            success: function(response) {
                console.log("Update response:", response);
                alert("SubCategory updated successfully!");
                clearSubCategoryForm();
                getAllSubCategories(); // Refresh the list
            },
            error: function(xhr, status, error) {
                console.error("Error updating subcategory:", xhr.responseText);
                alert("Failed to update subcategory.");
            }
        });
    }
}

// Load subcategories when page loads
$(document).ready(function() {
    getAllSubCategories();
});