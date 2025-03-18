$(document).ready(function() {
    getAllCategory();

    // Show image preview on load if an image URL is present
    $('#image').on('change', function() {
        $('#imagePreview').show();
    });
});

function saveCategory() {
    const authToken = localStorage.getItem('authToken');

    let id = $('#id').val().trim();
    let name = $('#name').val().trim();
    let description = $('#description').val().trim();
    let image = $('#image').val().trim();

    if (!id || !name) {
        showAlert("Code and Name fields are required!", "danger");
        return;
    }

    let category = { id, name, description, image };

    $.ajax({
        url: "http://localhost:8080/api/v1/category/save",
        method: "POST",
        headers: {"Authorization": `Bearer ${authToken}`},
        contentType: "application/json",
        data: JSON.stringify(category),
        success: function() {
            showAlert("Category Saved Successfully!", "success");
            getAllCategory();
            clearForm();
        },
        error: function(xhr, status, error) {
            console.error("Save error:", status, error, xhr.responseText);
            showAlert("Error saving category!", "danger");
        }
    });
}

function updateCategory() {
    const authToken = localStorage.getItem('authToken');
    let id = $('#id').val().trim();
    let name = $('#name').val().trim();
    let description = $('#description').val().trim();
    let image = $('#image').val().trim();

    if (!id) {
        showAlert("Category Code is required to update!", "warning");
        return;
    }

    let category = { id, name, description, image };

    $.ajax({
        url: "http://localhost:8080/api/v1/category/update",
        method: "PUT",
        headers: {"Authorization": `Bearer ${authToken}`},
        contentType: "application/json",
        data: JSON.stringify(category),
        success: function() {
            showAlert("Category Updated Successfully!", "success");
            getAllCategory();
            clearForm();
        },
        error: function(xhr, status, error) {
            console.error("Update error:", status, error, xhr.responseText);
            showAlert("Error updating category!", "danger");
        }
    });
}

function deleteCategory(id) {
    const authToken = localStorage.getItem('authToken');

    // If id is not passed as parameter, get it from the form
    if (!id) {
        id = $('#id').val().trim();
    }

    if (!id) {
        showAlert("Category Code is required to delete!", "warning");
        return;
    }

    if (!confirm("Are you sure you want to delete this category?")) {
        return;
    }

    $.ajax({
        url: `http://localhost:8080/api/v1/category/delete/${id}`,
        method: "DELETE",
        headers: {"Authorization": `Bearer ${authToken}`},
        success: function() {
            showAlert("Category Deleted Successfully!", "success");
            getAllCategory();
            clearForm();
        },
        error: function(xhr, status, error) {
            console.error("Delete error:", status, error, xhr.responseText);
            showAlert("Error deleting category!", "danger");
        }
    });
}

const getAllCategory = () => {
    const authToken = localStorage.getItem('authToken');
    let tableBody = $('#categoryTableBody');

    // Show loading spinner
    tableBody.html('<tr><td colspan="5" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>');

    $.ajax({
        url: "http://localhost:8080/api/v1/category/getAll",
        method: "GET",
        dataType: "json",
        headers: {"Authorization": `Bearer ${authToken}`},
        success: (resp) => {
            console.log("API Response:", resp);

            tableBody.empty();

            let categories = Array.isArray(resp) ? resp : resp.data;
            if (!Array.isArray(categories)) {
                console.error("Invalid response format", resp);
                showAlert("Unexpected data format received from the server!", "danger");
                return;
            }

            if (categories.length === 0) {
                tableBody.html('<tr><td colspan="5" class="text-center">No categories found</td></tr>');
                return;
            }

            categories.forEach(category => {
                tableBody.append(`
                            <tr class="fade-in">
                                <td>${category.id}</td>
                                <td>${category.name}</td>
                                <td>${category.description || ''}</td>
                                <td>
                                    ${category.image ?
                    `<img src="${category.image}" alt="${category.name}" width="60" height="60" class="img-thumbnail">` :
                    `<span class="text-muted"><i class="fas fa-image"></i> No image</span>`}
                                </td>
                                <td class="text-center action-buttons">
                                    <button class="btn btn-sm btn-info btn-action" onclick="fillForm('${category.id}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger btn-action" onclick="deleteCategory('${category.id}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `);
            });
        },
        error: (xhr, status, error) => {
            console.error("Error fetching categories:", status, error, xhr.responseText);
            showAlert("Error loading category data!", "danger");
            tableBody.html('<tr><td colspan="5" class="text-center text-danger"><i class="fas fa-exclamation-circle"></i> Failed to load data</td></tr>');
        }
    });
};

function fillForm(id) {
    const authToken = localStorage.getItem('authToken');

    // Clear any previously selected row
    $('#categoryTableBody tr').removeClass('selected-row');

    // Find the row with the matching ID and highlight it
    $(`#categoryTableBody tr td:first-child:contains('${id}')`).parent().addClass('selected-row');

    // Get values from the selected row
    const row = $(`#categoryTableBody tr td:first-child:contains('${id}')`).parent().find('td');

    $('#id').val(row.eq(0).text());
    $('#name').val(row.eq(1).text());
    $('#description').val(row.eq(2).text());

    // For image, we're just showing what's in the database
    const imgSrc = row.eq(3).find('img').attr('src');
    if (imgSrc) {
        $('#imagePreview').attr('src', imgSrc).show();
    } else {
        $('#imagePreview').hide();
    }

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#categoryForm").offset().top - 20
    }, 500);
}

function clearForm() {
    $('#id, #name, #description').val('');
    $('#image').val('');
    $('#imagePreview').hide();
    $('#categoryTableBody tr').removeClass('selected-row');
}

function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const output = document.getElementById('imagePreview');
        output.src = reader.result;
        output.style.display = 'block';
    };
    reader.readAsDataURL(event.target.files[0]);
}

function showAlert(message, type) {
    // Remove any existing alerts
    $('.alert-message').remove();

    // Create new alert
    const alertHtml = `
                <div class="alert alert-${type} alert-dismissible fade show animate__animated animate__fadeIn alert-message" role="alert">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;

    // Insert the alert before the form
    $('.card').before(alertHtml);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        $('.alert-message').fadeOut(500, function() {
            $(this).remove();
        });
    }, 3000);
}