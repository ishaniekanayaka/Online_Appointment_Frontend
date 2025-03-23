const API_URL = 'http://localhost:8080/api/v1/user';
let userData = [];
let successToast;
let errorToast;

// Initialize when document is ready
$(document).ready(function() {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        // Redirect to login page if not authenticated
        window.location.href = '/index.html';
        return;
    }

    // Initialize Toasts
    successToast = new bootstrap.Toast(document.getElementById('successToast'));
    errorToast = new bootstrap.Toast(document.getElementById('errorToast'));

    loadUsers();

    // Event listeners
    $('#saveUserBtn').on('click', saveUser);
    $('#updateUserBtn').on('click', updateUser);
    $('#confirmDeleteBtn').on('click', deleteUser);

    // Search functionality
    $('#searchInput').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        filterUsers(searchTerm);
    });

    // Delegate events for dynamic buttons
    $('#userTable').on('click', '.edit-btn', function() {
        const userId = $(this).data('id');
        fillEditForm(userId);
    });

    $('#userTable').on('click', '.delete-btn', function() {
        const userId = $(this).data('id');
        $('#deleteUserId').val(userId);
        $('#deleteUserModal').modal('show');
    });

    $('#userTable').on('click', '.activate-btn', function() {
        const userId = $(this).data('id');
        activateUser(userId);
    });

    $('#userTable').on('click', '.deactivate-btn', function() {
        const userId = $(this).data('id');
        deactivateUser(userId);
    });
});

// Show/hide loading overlay
function toggleLoading(show) {
    if (show) {
        $('#loadingOverlay').removeClass('d-none');
    } else {
        $('#loadingOverlay').addClass('d-none');
    }
}

// Show success toast
function showSuccess(message = 'Operation completed successfully!') {
    $('#successToast .toast-body').text(message);
    successToast.show();
}

// Show error toast
function showError(message = 'An error occurred. Please try again.') {
    $('#errorToastMessage').text(message);
    errorToast.show();
}

// Get auth token for API requests
function getAuthHeaders() {
    const authToken = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    };
}

// Handle unauthorized responses
function handleUnauthorized() {
    localStorage.removeItem('authToken');
    window.location.href = '/login.html';
}

// Filter users based on search term
function filterUsers(searchTerm) {
    const filteredUsers = userData.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
    );

    renderUserTable(filteredUsers);
}

// Render user table with provided data
function renderUserTable(users) {
    const tableBody = $('#userTableBody');
    tableBody.empty();

    if (users.length === 0) {
        $('#emptyState').show();
        return;
    }

    $('#emptyState').hide();

    users.forEach((user, index) => {
        const statusBadge = user.active
            ? '<span class="badge bg-success rounded-pill px-3">Active</span>'
            : '<span class="badge bg-danger rounded-pill px-3">Inactive</span>';

        const activeButton = user.active
            ? `<button class="btn btn-sm btn-warning deactivate-btn" data-id="${user.id}"><i class="fas fa-user-slash"></i></button>`
            : `<button class="btn btn-sm btn-success activate-btn" data-id="${user.id}"><i class="fas fa-user-check"></i></button>`;

        const row = `
                    <tr class="animate__animated animate__fadeIn animate__faster" style="animation-delay: ${index * 0.05}s">
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <div class="btn-group" role="group">
                                ${activeButton}
                                <button class="btn btn-sm btn-primary edit-btn" data-id="${user.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${user.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
        tableBody.append(row);
    });
}

// Load all users
function loadUsers() {
    toggleLoading(true);

    fetch(`${API_URL}/getAll`, {
        method: 'GET',
        headers: getAuthHeaders()
    })
        .then(response => {
            if (response.status === 401) {
                handleUnauthorized();
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (!data) return;

            if (data.code === 201 && data.data) {
                userData = data.data;
                renderUserTable(userData);
            } else {
                showError('Failed to load users');
                $('#emptyState').show();
            }
        })
        .catch(error => {
            console.error('Error loading users:', error);
            showError('Failed to load users');
            $('#emptyState').show();
        })
        .finally(() => {
            toggleLoading(false);
        });
}

// Save new user
function saveUser() {
    // Validate form
    const addUserForm = document.getElementById('addUserForm');
    if (!addUserForm.checkValidity()) {
        addUserForm.reportValidity();
        return;
    }

    // Get form data
    const userData = {
        name: $('#name').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        dob: $('#dob').val(),
        role: $('#role').val(),
        active: true
    };

    toggleLoading(true);

    // Send API request
    fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (response.status === 401) {
                handleUnauthorized();
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (!data) return;

            if (data.code === 201) {
                // Success
                $('#addUserModal').modal('hide');
                addUserForm.reset();
                showSuccess('User added successfully');
                loadUsers();
            } else {
                // Error
                showError(data.message || 'Failed to add user');
            }
        })
        .catch(error => {
            console.error('Error adding user:', error);
            showError('Failed to add user');
        })
        .finally(() => {
            toggleLoading(false);
        });
}

// Fill edit form with user data
function fillEditForm(userId) {
    const user = userData.find(user => user.id == userId);

    if (user) {
        $('#editUserId').val(user.id);
        $('#editName').val(user.name);
        $('#editEmail').val(user.email);
        $('#editPW').val(user.password);
        $('#editDob').val(user.dob);
        $('#editRole').val(user.role);

        $('#editUserModal').modal('show');
    }
}

// Update user
function updateUser() {
    // Validate form
    const editUserForm = document.getElementById('editUserForm');
    if (!editUserForm.checkValidity()) {
        editUserForm.reportValidity();
        return;
    }

    // Get form data
    const userData = {
        id: $('#editUserId').val(),
        name: $('#editName').val(),
        email: $('#editEmail').val(),
        password: $('#editPW').val(),
        dob: $('#editDob').val(),
        role: $('#editRole').val()
    };

    toggleLoading(true);

    // Send API request
    fetch(`${API_URL}/update`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (response.status === 401) {
                handleUnauthorized();
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (!data) return;

            if (data.code === 201) {
                // Success
                $('#editUserModal').modal('hide');
                showSuccess('User updated successfully');
                loadUsers();
            } else {
                // Error
                showError(data.message || 'Failed to update user');
            }
        })
        .catch(error => {
            console.error('Error updating user:', error);
            showError('Failed to update user');
        })
        .finally(() => {
            toggleLoading(false);
        });
}

// Delete user (using deactivate in this case as there's no direct delete endpoint)
function deleteUser() {
    const userId = $('#deleteUserId').val();

    toggleLoading(true);

    // Using deactivate as delete alternative
    fetch(`${API_URL}/deactivate/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders()
    })
        .then(response => {
            if (response.status === 401) {
                handleUnauthorized();
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (!data) return;

            if (data.code === 201) {
                // Success
                $('#deleteUserModal').modal('hide');
                showSuccess('User deleted successfully');
                loadUsers();
            } else {
                // Error
                showError(data.message || 'Failed to delete user');
            }
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            showError('Failed to delete user');
        })
        .finally(() => {
            toggleLoading(false);
        });
}

// Activate user
function activateUser(userId) {
    toggleLoading(true);

    fetch(`${API_URL}/activate/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders()
    })
        .then(response => {
            if (response.status === 401) {
                handleUnauthorized();
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (!data) return;

            if (data.code === 201) {
                // Success
                showSuccess('User activated successfully');
                loadUsers();
            } else {
                // Error
                showError(data.message || 'Failed to activate user');
            }
        })
        .catch(error => {
            console.error('Error activating user:', error);
            showError('Failed to activate user');
        })
        .finally(() => {
            toggleLoading(false);
        });
}

// Deactivate user
function deactivateUser(userId) {
    toggleLoading(true);

    fetch(`${API_URL}/deactivate/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders()
    })
        .then(response => {
            if (response.status === 401) {
                handleUnauthorized();
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (!data) return;

            if (data.code === 201) {
                // Success
                showSuccess('User deactivated successfully');
                loadUsers();
            } else {
                // Error
                showError(data.message || 'Failed to deactivate user');
            }
        })
        .catch(error => {
            console.error('Error deactivating user:', error);
            showError('Failed to deactivate user');
        })
        .finally(() => {
            toggleLoading(false);
        });
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '/login.html';
}