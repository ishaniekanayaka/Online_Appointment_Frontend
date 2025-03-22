$(document).ready(function() {
    getAllCategory();

    // Show image preview when an image is selected
    $('#image').on('change', function() {
        $('#imagePreview').show();
    });
});

function saveCategory() {
    const authToken = localStorage.getItem('authToken');

    let name = $('#name').val().trim();
    let description = $('#description').val().trim();
    let image = $('#image')[0].files[0];

    if (!name) {
        showAlert("Name field is required!", "danger");
        return;
    }

    let formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", image);

    $.ajax({
        url: "http://localhost:8080/api/v1/category/save",
        method: "POST",
        headers: { "Authorization": `Bearer ${authToken}` },
        processData: false,
        contentType: false,
        data: formData,
        success: function(response) {
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
    let image = $('#image')[0].files[0]; // Optional file

    if (!id || !name) {
        showAlert("Category ID and Name are required!", "danger");
        return;
    }

    let formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("description", description);
    if (image) formData.append("image", image); // Append only if a new image is selected

    $.ajax({
        url: "http://localhost:8080/api/v1/category/update",
        method: "PUT",
        headers: { "Authorization": `Bearer ${authToken}` },
        processData: false,
        contentType: false,
        data: formData,
        success: function(response) {
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

    if (!id) {
        showAlert("Category ID is required to delete!", "warning");
        return;
    }

    if (!confirm("Are you sure you want to delete this category?")) return;

    $.ajax({
        url: `http://localhost:8080/api/v1/category/delete/${id}`,
        method: "DELETE",
        headers: { "Authorization": `Bearer ${authToken}` },
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

function getAllCategory() {
    const authToken = localStorage.getItem('authToken');
    let tableBody = $('#categoryTableBody');

    tableBody.html('<tr><td colspan="5" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>');

    $.ajax({
        url: "http://localhost:8080/api/v1/category/getAll",
        method: "GET",
        headers: { "Authorization": `Bearer ${authToken}` },
        success: function(response) {
            tableBody.empty();
            const categories = response.data || [];

            if (categories.length === 0) {
                tableBody.html('<tr><td colspan="5" class="text-center">No categories found</td></tr>');
                return;
            }

            categories.forEach(cat => {
                tableBody.append(`
                    <tr class="fade-in">
                        <td>${cat.id}</td>
                        <td>${cat.name}</td>
                        <td>${cat.description || ''}</td>
                        <td>
                            ${cat.image ?
                    `<img src="${cat.image}" alt="${cat.name}" width="60" class="img-thumbnail">` :
                    '<span class="text-muted"><i class="fas fa-image"></i> No image</span>'
                }
                        </td>
                        <td>
                            <button class="btn btn-info btn-sm" onclick="fillForm('${cat.id}')"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-danger btn-sm" onclick="deleteCategory('${cat.id}')"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function(xhr) {
            showAlert("Failed to load categories!", "danger");
        }
    });
}

function fillForm(id) {
    const authToken = localStorage.getItem('authToken');

    $('#categoryTableBody tr').removeClass('selected-row');
    $(`#categoryTableBody tr td:first-child:contains('${id}')`).parent().addClass('selected-row');

    const row = $(`#categoryTableBody tr td:first-child:contains('${id}')`).parent().find('td');

    $('#id').val(row.eq(0).text());
    $('#name').val(row.eq(1).text());
    $('#description').val(row.eq(2).text());

    const imgSrc = row.eq(3).find('img').attr('src');
    $('#imagePreview').attr('src', imgSrc).toggle(!!imgSrc);
}

function clearForm() {
    $('#id, #name, #description').val('');
    $('#image').val('');
    $('#imagePreview').hide();
    $('#categoryTableBody tr').removeClass('selected-row');
}

function showAlert(message, type) {
    $('.alert-message').remove();
    const alertHTML = `<div class="alert alert-${type} alert-dismissible fade show">${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;

    $('.card').before(alertHTML);
    setTimeout(() => $('.alert-message').remove(), 3000);
}
