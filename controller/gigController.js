// Global variables
let allUsers = [];
let authToken = ''; // Store the auth token

// DOM Elements
const activeCountElement = document.getElementById('active-count');
const inactiveCountElement = document.getElementById('inactive-count');
const gigTotalElement = document.getElementById('gig-total');
const loadingElement = document.getElementById('loading');
const tableContainer = document.getElementById('table-container');
const noDataElement = document.getElementById('no-data');
const usersTableBody = document.getElementById('users-table-body');
const gigDetailsModal = document.getElementById('gig-details-modal');
const gigDetailsContent = document.getElementById('gig-details-content');
const closeModalButton = document.getElementById('close-modal');

// ... (same global variables and DOM elements)

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
        authToken = storedToken;
    } else {
        console.warn('No authentication token found!');
    }

    fetchUsers();

    closeModalButton.addEventListener('click', () => {
        gigDetailsModal.classList.add('hidden');
    });

    gigDetailsModal.addEventListener('click', (e) => {
        if (e.target === gigDetailsModal) {
            gigDetailsModal.classList.add('hidden');
        }
    });
});

async function makeAuthRequest(url, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    };

    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }

    return fetch(url, options);
}

async function fetchUsers() {
    try {
        loadingElement.classList.remove('hidden');
        tableContainer.classList.add('hidden');
        noDataElement.classList.add('hidden');

        const response = await makeAuthRequest("http://localhost:8080/api/v1/user/getAll");
        const data = await response.json();

        if (data.code === 201 && data.data) {
            allUsers = data.data;
            const gigUsers = allUsers.filter(user => user.role === "GIG");

            updateStatistics(allUsers);
            gigTotalElement.textContent = gigUsers.length;

            renderTable(gigUsers);
        } else {
            console.error("Failed to fetch users:", data.message);
            showNoData();
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        showNoData();
    } finally {
        loadingElement.classList.add('hidden');
    }
}

function updateStatistics(users) {
    const activeGigUsers = users.filter(user => user.active && user.role === "GIG").length;
    const inactiveGigUsers = users.filter(user => !user.active && user.role === "GIG").length;

    activeCountElement.textContent = activeGigUsers;
    inactiveCountElement.textContent = inactiveGigUsers;

    const totalGigUsers = users.filter(user => user.role === "GIG").length;
    gigTotalElement.textContent = totalGigUsers;
}

function renderTable(users) {
    usersTableBody.innerHTML = '';

    if (users.length === 0) {
        showNoData();
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.dob}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${user.active 
                    ? '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>'
                    : '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>'
                }
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="viewGigDetails('${user.email}')" class="text-blue-600 hover:text-blue-800 mr-2">View</button>
                ${user.active
                    ? `<button onclick="deactivateUser(${user.id})" class="text-red-600 hover:text-red-800 mr-2">Deactivate</button>`
                    : `<button onclick="activateUser(${user.id})" class="text-green-600 hover:text-green-800 mr-2">Activate</button>`
                }
            </td>
        `;

        usersTableBody.appendChild(row);
    });

    tableContainer.classList.remove('hidden');
}

async function viewGigDetails(email) {
    try {
        gigDetailsModal.classList.remove('hidden');
        gigDetailsContent.innerHTML = `
            <div class="text-center py-8">
                <div class="loader mx-auto h-8 w-8 border-4 border-gray-200 rounded-full"></div>
                <p class="mt-4 text-gray-500">Loading gig details...</p>
            </div>
        `;

        const response = await makeAuthRequest(`http://localhost:8080/api/v1/gig/gigs/email/${email}`);
        const data = await response.json();

        if (response.ok && data) {
            gigDetailsContent.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div class="col-span-2 flex justify-center">
                        <img src="${data.image ? 'http://localhost:8080/' + data.image.replace(/\\/g, '/') : 'https://via.placeholder.com/150'}" 
                             alt="Gig Image" 
                             class="h-40 w-40 rounded-full object-cover">
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500">Full Name</h4>
                        <p class="mt-1 text-sm text-gray-900">${data.fullName || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500">Degree</h4>
                        <p class="mt-1 text-sm text-gray-900">${data.degree || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500">Experience</h4>
                        <p class="mt-1 text-sm text-gray-900">${data.experience || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500">Charge Amount</h4>
                        <p class="mt-1 text-sm text-gray-900">${data.amountCharge || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500">Location</h4>
                        <p class="mt-1 text-sm text-gray-900">${data.location || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500">Contact Number</h4>
                        <p class="mt-1 text-sm text-gray-900">${data.contactNumber || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500">Max Appointments/Day</h4>
                        <p class="mt-1 text-sm text-gray-900">${data.maxAppointmentsPerDay || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500">Status</h4>
                        <p class="mt-1 text-sm text-gray-900">
                            ${data.active 
                                ? '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>'
                                : '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>'
                            }
                        </p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500">Category</h4>
                        <p class="mt-1 text-sm text-gray-900">${data.categoryName || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500">Sub Category</h4>
                        <p class="mt-1 text-sm text-gray-900">${data.subCategoryName || 'N/A'}</p>
                    </div>
                </div>
            `;
        } else {
            gigDetailsContent.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
                    <p class="text-gray-700">Failed to load gig details</p>
                    <p class="text-sm text-gray-500 mt-2">${data?.message || 'Unknown error occurred'}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error fetching gig details:", error);
        gigDetailsContent.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
                <p class="text-gray-700">Error loading gig details</p>
                <p class="text-sm text-gray-500 mt-2">${error.message}</p>
            </div>
        `;
    }
}

function showNoData() {
    tableContainer.classList.add('hidden');
    noDataElement.classList.remove('hidden');
}

async function activateUser(id) {
    try {
        const response = await makeAuthRequest(`http://localhost:8080/api/v1/user/activate/${id}`, "PUT");
        const data = await response.json();

        if (data.code === 201) {
            await fetchUsers();
            showToast('User activated successfully', 'success');
        } else {
            showToast('Failed to activate user', 'error');
        }
    } catch (error) {
        console.error("Error activating user:", error);
        showToast('Error processing request', 'error');
    }
}

async function deactivateUser(id) {
    try {
        const response = await makeAuthRequest(`http://localhost:8080/api/v1/user/deactivate/${id}`, "PUT");
        const data = await response.json();

        if (data.code === 201) {
            await fetchUsers();
            showToast('User deactivated successfully', 'success');
        } else {
            showToast('Failed to deactivate user', 'error');
        }
    } catch (error) {
        console.error("Error deactivating user:", error);
        showToast('Error processing request', 'error');
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white`;
    toast.style.zIndex = '9999';
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('opacity-0');
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
}

function setAuthToken(token) {
    authToken = token;
    localStorage.setItem('authToken', token);
}

function handleLoginResponse(response) {
    if (response && response.data && response.data.token) {
        setAuthToken(response.data.token);
        return true;
    }
    return false;
}
