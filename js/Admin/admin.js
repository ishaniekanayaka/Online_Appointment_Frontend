
    // Function to load dynamic content
    function loadContent(contentId) {
    const dynamicContent = document.getElementById('dynamicContent');
    let content = '';

    switch (contentId) {
    case 'updateUser':
    content = `

                    <div id="loadingOverlay" class="position-fixed top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex justify-content-center align-items-center d-none" style="z-index: 9999;">
    <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>

<div class="toast-container position-fixed top-0 end-0 p-3">
    <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" id="successToast">
        <div class="d-flex">
            <div class="toast-body">
                Operation completed successfully!
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>

    <div class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true" id="errorToast">
        <div class="d-flex">
            <div class="toast-body" id="errorToastMessage">
                An error occurred.
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>
</div>

<div class="container-fluid py-4">
    <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
            <div class="card shadow-sm border-0 rounded-3 animate__animated animate__fadeIn">
                <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <h5 class="mb-0 fw-bold">Users</h5>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addUserModal">
                        <i class="fas fa-plus me-1"></i> Add User
                    </button>
                </div>
                <div class="card-body">
                    <div class="position-relative mb-4">
                        <div class="input-group">
                                <span class="input-group-text bg-white border-end-0">
                                    <i class="fas fa-search text-muted"></i>
                                </span>
                            <input type="text" class="form-control border-start-0" id="searchInput" placeholder="Search users...">
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover align-middle" id="userTable">
                            <thead class="bg-light">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody id="userTableBody">
                            <!-- Table data will be populated dynamically -->
                            </tbody>
                        </table>
                        <div id="emptyState" class="text-center py-5 text-muted">
                            <i class="fas fa-users-slash fs-1 mb-3"></i>
                            <p>No users found</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Add User Modal -->
<div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-light">
                <h5 class="modal-title fw-bold" id="addUserModalLabel">Add New User</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="addUserForm">
                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" class="form-control" id="name" required>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" required>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" required>
                    </div>
                    <div class="mb-3">
                        <label for="dob" class="form-label">Date of Birth</label>
                        <input type="date" class="form-control" id="dob" required>
                    </div>
                    <div class="mb-3">
                        <label for="role" class="form-label">Role</label>
                        <select class="form-select" id="role">
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer bg-light">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="saveUserBtn">Save User</button>
            </div>
        </div>
    </div>
</div>

<!-- Edit User Modal -->
<div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-light">
                <h5 class="modal-title fw-bold" id="editUserModalLabel">Edit User</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="editUserForm">
                    <input type="hidden" id="editUserId">
                    <div class="mb-3">
                        <label for="editName" class="form-label">Name</label>
                        <input type="text" class="form-control" id="editName" required>
                    </div>
                    <div class="mb-3">
                        <label for="editEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="editEmail" required>
                    </div>
                    <div class="mb-3">
                        <label for="editDob" class="form-label">Date of Birth</label>
                        <input type="date" class="form-control" id="editDob" required>
                    </div>
                    <div class="mb-3">
                        <label for="editPW" class="form-label">Password</label>
                        <input type="password" class="form-control" id="editPW" required>
                    </div>
                    <div class="mb-3">
                        <label for="editRole" class="form-label">Role</label>
                        <select class="form-select" id="editRole">
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer bg-light">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="updateUserBtn">Update User</button>
            </div>
        </div>
    </div>
</div>

<!-- Delete Confirmation Modal -->
<div class="modal fade" id="deleteUserModal" tabindex="-1" aria-labelledby="deleteUserModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-light">
                <h5 class="modal-title fw-bold" id="deleteUserModalLabel">Confirm Delete</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                <input type="hidden" id="deleteUserId">
            </div>
            <div class="modal-footer bg-light">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
            </div>
        </div>
    </div>
</div>
                    `;
    break;
    case 'members':
    content = `
<h2 class="mb-4 form-header animate__animated animate__fadeIn">Manage Categories</h2>

<div class="card p-4 mb-4 animate__animated animate__fadeInUp">
    <form id="categoryForm">
        <div class="row">

            <div class="col-md-6 mb-3">
                <label for="name" class="form-label">Name</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-tag"></i></span>
                    <input type="text" id="name" class="form-control" required>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <label for="description" class="form-label">Description</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-align-left"></i></span>
                    <input type="text" id="description" class="form-control">
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <label for="image" class="form-label">Image</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-image"></i></span>
                    <input type="file" id="image" class="form-control" accept="image/*" onchange="previewImage(event)">
                </div>
                <img id="imagePreview" src="#" alt="Image preview" style="max-width: 100px; margin-top: 10px;">
            </div>
        </div>

        <div class="d-flex justify-content-between mt-3">
            <div>
                <button type="button" class="btn btn-primary btn-action" id="saveBtn" onclick="saveCategory()">
                    <i class="fas fa-save me-2"></i>Save
                </button>
                <button type="button" class="btn btn-success btn-action" onclick="updateCategory()">
                    <i class="fas fa-edit me-2"></i>Update
                </button>
                <button type="button" class="btn btn-danger btn-action" onclick="deleteCategory()">
                    <i class="fas fa-trash me-2"></i>Delete
                </button>
            </div>
            <button type="button" class="btn btn-secondary btn-action" id="resetBtn" onclick="clearForm()">
                <i class="fas fa-undo me-2"></i>Reset
            </button>
        </div>
    </form>
</div>

<div class="d-flex justify-content-between align-items-center mb-3">
    <h3 class="form-header animate__animated animate__fadeIn">Category List</h3>
    <button class="btn btn-outline-primary" onclick="getAllCategory()">
        <i class="fas fa-sync-alt me-1"></i> Refresh
    </button>
</div>

<div class="table-responsive animate__animated animate__fadeIn">
    <table class="table table-bordered table-hover">
        <thead class="table-dark">
        <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            <th class="text-center">Actions</th>
        </tr>
        </thead>
        <tbody id="categoryTableBody"></tbody>
    </table>
</div>
`;
    break;
    case 'meetings':
    content = `<h2 class="mb-4 form-header animate__animated animate__fadeIn">Manage SubCategories</h2>

<div class="card p-4 mb-4 animate__animated animate__fadeInUp">
    <form id="subCategoryForm">
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="subCategoryId" class="form-label">SubCategory Code</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-hashtag"></i></span>
                    <input type="text" id="subCategoryId" class="form-control" required>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <label for="subCategoryName" class="form-label">SubCategory Name</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-tag"></i></span>
                    <input type="text" id="subCategoryName" class="form-control" required>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <label for="subCategoryDescription" class="form-label">Description</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-align-left"></i></span>
                    <input type="text" id="subCategoryDescription" class="form-control">
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <label for="subCategoryImage" class="form-label">Image</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-image"></i></span>
                    <input type="file" id="subCategoryImage" class="form-control" accept="image/*" onchange="previewImage(event)">
                </div>
                <img id="subCategoryImagePreview" src="#" alt="Image preview" style="max-width: 100px; margin-top: 10px;">
            </div>
            <div class="col-md-6 mb-3">
                <label for="sc_name" class="form-label">SubCategory Name</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-tag"></i></span>
                    <select id="sc_name" class="form-select" required>
                        <option value="">Select Category</option>
                        <!-- SubCategories will be dynamically populated here -->
                    </select>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <label for="sc_id" class="form-label">SubCategory Id</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-hashtag"></i></span>
                    <input type="text" id="sc_id" class="form-control" disabled>
                </div>

            </div>
        </div>

        <div class="d-flex justify-content-between mt-3">
            <div>
                <button type="button" class="btn btn-primary btn-action" id="saveSubCategoryBtn" onclick="saveSubCategory()">
                    <i class="fas fa-save me-2"></i>Save
                </button>
                <button type="button" class="btn btn-success btn-action" onclick="updateSubCategory()">
                    <i class="fas fa-edit me-2"></i>Update
                </button>
                <button type="button" class="btn btn-danger btn-action" onclick="deleteSubCategory()">
                    <i class="fas fa-trash me-2"></i>Delete
                </button>
            </div>
            <button type="button" class="btn btn-secondary btn-action" id="resetSubCategoryBtn" onclick="clearSubCategoryForm()">
                <i class="fas fa-undo me-2"></i>Reset
            </button>
        </div>
    </form>
</div>

<div class="d-flex justify-content-between align-items-center mb-3">
    <h3 class="form-header animate__animated animate__fadeIn">SubCategory List</h3>
    <button class="btn btn-outline-primary" onclick="getAllSubCategories()">
        <i class="fas fa-sync-alt me-1"></i> Refresh
    </button>
</div>

<div class="table-responsive animate__animated animate__fadeIn">
    <table class="table table-bordered table-hover">
        <thead class="table-dark">
        <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            <th>Category</th>
            <th class="text-center">Actions</th>
        </tr>
        </thead>
        <tbody id="subCategoryTableBody"></tbody>
    </table>
</div>
`;
    break;
    case 'events':
    content = `<h3>Events Content</h3>`;
    break;
    case 'eventFacility':
    content = `<h3>Event Facility Content</h3>`;
    break;
    case 'eventType':
    content = `<h3>Event Type Content</h3>`;
    break;
    case 'meetingAttendance':
    content = `<h3>Meeting Attendance Content</h3>`;
    break;
    default:
    content = `
                        <div class="row">
                            <div class="col-md-3">
                                <div class="card text-center p-4">
                                    <i class="fas fa-users card-icon"></i>
                                    <h5 class="mt-3">Users</h5>
                                    <p class="text-muted">Total: 1,234</p>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card text-center p-4">
                                    <i class="fas fa-chart-line card-icon"></i>
                                    <h5 class="mt-3">Revenue</h5>
                                    <p class="text-muted">$12,345</p>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card text-center p-4">
                                    <i class="fas fa-shopping-cart card-icon"></i>
                                    <h5 class="mt-3">Orders</h5>
                                    <p class="text-muted">Total: 567</p>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card text-center p-4">
                                    <i class="fas fa-tasks card-icon"></i>
                                    <h5 class="mt-3">Tasks</h5>
                                    <p class="text-muted">Completed: 89%</p>
                                </div>
                            </div>
                        </div>
                    `;
}

    dynamicContent.innerHTML = content;
}

    // Function to toggle theme
    function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    const themeIcon = document.querySelector('.theme-toggle-btn i');

    // Toggle between moon and sun icons for dark/light mode
    if (body.classList.contains('dark-mode')) {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
} else {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
}
}

    // Add event listeners to sidebar links
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        // Remove active class from all links
        document.querySelectorAll('.sidebar .nav-link').forEach(link => link.classList.remove('active'));
        // Add active class to the clicked link
        this.classList.add('active');
        // Load the corresponding content
        const contentId = this.getAttribute('data-content');
        loadContent(contentId);
    });
});

    // Load default content (Dashboard)
    loadContent('dashboard');


    //User Setiing=======================================
    // Global variables
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


    ///////////////////////////=================Category
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
