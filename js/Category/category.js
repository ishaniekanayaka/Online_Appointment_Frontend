document.addEventListener("DOMContentLoaded", function () {
    loadCategories();
});

// Initialize variables
let categories = [];
let editingCategoryId = null;
let deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
let categoryToDelete = null;

// DOM elements
const categoryForm = document.getElementById('categoryForm');
const categoryId = document.getElementById('categoryId');
const categoryName = document.getElementById('categoryName');
const categoryDescription = document.getElementById('categoryDescription');
const categoryImage = document.getElementById('categoryImage');
const imagePreview = document.getElementById('imagePreview');
const formTitle = document.getElementById('formTitle');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const categoryTableBody = document.getElementById('categoryTableBody');
const emptyMessage = document.getElementById('emptyMessage');
const alertContainer = document.getElementById('alertContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Event listeners
categoryForm.addEventListener('submit', handleFormSubmit);
resetBtn.addEventListener('click', resetForm);
confirmDeleteBtn.addEventListener('click', confirmDelete);
searchBtn.addEventListener('click', searchCategories);
searchInput.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        searchCategories();
    }
});

// Handle image file selection
categoryImage.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = '<i class="fas fa-image text-muted"></i>';
    }
});

// Load categories from backend
/*
function loadCategories() {
    const authToken = localStorage.getItem('authToken');
    $.ajax({
        url: "http://localhost:8080/api/v1/category",
        type: "GET",
        headers: { "Authorization": `Bearer ${authToken}` },
        success: function (response) {
            categories = response.data || [];
            renderCategories();
        },
        error: function (xhr) {
            console.error('Error fetching categories:', xhr.responseText);
            showAlert('Failed to load categories. Please try again later.', 'danger');
        }
    });
}
*/

// Render categories to table
function renderCategories(filteredCategories = null) {
    const categoriesToRender = filteredCategories || categories;
    categoryTableBody.innerHTML = '';

    if (categoriesToRender.length === 0) {
        emptyMessage.classList.remove('d-none');
    } else {
        emptyMessage.classList.add('d-none');

        categoriesToRender.forEach(category => {
            const row = document.createElement('tr');
            row.className = 'fade-in';
            row.innerHTML = `
                <td>
                    <img src="${category.image || '/api/placeholder/50/50'}" alt="${category.name}" class="category-image">
                </td>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>${category.description || '-'}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-warning edit-btn" data-id="${category.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${category.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            categoryTableBody.appendChild(row);
        });

        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', () => editCategory(button.dataset.id));
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', () => showDeleteModal(button.dataset.id));
        });
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    const authToken = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('id', categoryId.value);
    formData.append('name', categoryName.value);
    formData.append('description', categoryDescription.value);
    if (categoryImage.files[0]) {
        formData.append('image', categoryImage.files[0]);
    }

    const method = editingCategoryId ? 'PUT' : 'POST';
    const url = editingCategoryId ? `http://localhost:8080/api/v1/category/${editingCategoryId}` : 'http://localhost:8080/api/v1/category/save';

    $.ajax({
        url: url,
        type: method,
        headers: { "Authorization": `Bearer ${authToken}` },
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (editingCategoryId) {
                showAlert('Category updated successfully!', 'success');
            } else {
                showAlert('Category added successfully!', 'success');
            }
            loadCategories();
            resetForm();
        },
        error: function (xhr) {
            console.error('Error saving category:', xhr.responseText);
            showAlert('Failed to save category. Please try again later.', 'danger');
        }
    });
}

// Edit category
function editCategory(id) {
    const category = categories.find(cat => cat.id === id);
    if (category) {
        categoryId.value = category.id;
        categoryName.value = category.name;
        categoryDescription.value = category.description;
        if (category.image) {
            imagePreview.innerHTML = `<img src="${category.image}" alt="Preview">`;
        } else {
            imagePreview.innerHTML = '<i class="fas fa-image text-muted"></i>';
        }
        formTitle.textContent = 'Edit Category';
        saveBtn.innerHTML = '<i class="fas fa-save me-2"></i>Update Category';
        editingCategoryId = id;
    }
}

// Show delete confirmation modal
function showDeleteModal(id) {
    categoryToDelete = id;
    deleteModal.show();
}

// Confirm delete
function confirmDelete() {
    const authToken = localStorage.getItem('authToken');
    $.ajax({
        url: `http://localhost:8080/api/v1/category/${categoryToDelete}`,
        type: "DELETE",
        headers: { "Authorization": `Bearer ${authToken}` },
        success: function () {
            showAlert('Category deleted successfully!', 'success');
            loadCategories();
        },
        error: function (xhr) {
            console.error('Error deleting category:', xhr.responseText);
            showAlert('Failed to delete category. Please try again later.', 'danger');
        }
    });

    deleteModal.hide();
}

// Reset form
function resetForm() {
    categoryForm.reset();
    imagePreview.innerHTML = '<i class="fas fa-image text-muted"></i>';
    formTitle.textContent = 'Add New Category';
    saveBtn.innerHTML = '<i class="fas fa-save me-2"></i>Save Category';
    editingCategoryId = null;
}

// Show alert message
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fade-in`;
    alert.textContent = message;
    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.classList.add('fade-out');
        setTimeout(() => alert.remove(), 500);
    }, 3000);
}

// Search categories
function searchCategories() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm) ||
        cat.description.toLowerCase().includes(searchTerm)
    );
    renderCategories(filteredCategories);
}