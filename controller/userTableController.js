// Global variables for all users
let allUsersList = [];
let allAuthToken = ''; // Store the auth token

// DOM Elements with new IDs
const allActiveCountElement = document.getElementById('all-active-count');
const allInactiveCountElement = document.getElementById('all-inactive-count');
const allUsersTotalElement = document.getElementById('all-users-total');
const allLoadingElement = document.getElementById('all-loading');
const allTableContainer = document.getElementById('all-table-container');
const allNoDataElement = document.getElementById('all-no-data');
const allUsersTableBody = document.getElementById('all-users-table-body');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
        allAuthToken = storedToken;
    } else {
        // If no token exists, you might want to redirect to login or handle this case
        console.warn('No authentication token found!');
        // You could redirect to login or handle authentication here
    }
    
    fetchAllUsers();
});

// Helper function to make authenticated API requests
async function makeAllAuthRequest(url, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${allAuthToken}`
    };
    
    const options = {
        method,
        headers
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    return fetch(url, options);
}

// Fetch all users from the API
async function fetchAllUsers() {
    try {
        // Show loading indicator
        allLoadingElement.classList.remove('hidden');
        allTableContainer.classList.add('hidden');
        allNoDataElement.classList.add('hidden');
        
        const response = await makeAllAuthRequest("http://localhost:8080/api/v1/user/getAll");
        const data = await response.json();
        
        if (data.code === 201 && data.data) {
            allUsersList = data.data;
            
            // Calculate statistics
            updateAllStatistics(allUsersList);
            
            // Update total users count
            allUsersTotalElement.textContent = allUsersList.length;
            
            // Render the table with all users
            renderAllTable(allUsersList);
        } else {
            console.error("Failed to fetch users:", data.message);
            showAllNoData();
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        showAllNoData();
    } finally {
        // Hide loading indicator
        allLoadingElement.classList.add('hidden');
    }
}

// Update the statistics counters
function updateAllStatistics(users) {
    // Count active users (all roles)
    const activeUsers = users.filter(user => user.active).length;

    // Count inactive users (all roles)
    const inactiveUsers = users.filter(user => !user.active).length;

    // Update the UI
    allActiveCountElement.textContent = activeUsers;
    allInactiveCountElement.textContent = inactiveUsers;
}

// Render the users table
function renderAllTable(users) {
    allUsersTableBody.innerHTML = '';
    
    if (users.length === 0) {
        showAllNoData();
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.dob}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.role || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${user.active 
                    ? '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>'
                    : '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>'
                }
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                ${user.active
                    ? `<button onclick="deactivateAllUser(${user.id})" class="text-red-600 hover:text-red-800 mr-2">Deactivate</button>`
                    : `<button onclick="activateAllUser(${user.id})" class="text-green-600 hover:text-green-800 mr-2">Activate</button>`
                }
            </td>
        `;
        
        allUsersTableBody.appendChild(row);
    });
    
    allTableContainer.classList.remove('hidden');
}

// Show 'no data' message
function showAllNoData() {
    allTableContainer.classList.add('hidden');
    allNoDataElement.classList.remove('hidden');
}

// Activate a user
async function activateAllUser(id) {
    try {
        const response = await makeAllAuthRequest(`http://localhost:8080/api/v1/user/activate/${id}`, "PUT");
        const data = await response.json();
        
        if (data.code === 201) {
            // Success - refresh the data
            await fetchAllUsers();
            showAllToast('User activated successfully', 'success');
        } else {
            console.error("Failed to activate user:", data.message);
            showAllToast('Failed to activate user', 'error');
        }
    } catch (error) {
        console.error("Error activating user:", error);
        showAllToast('Error processing request', 'error');
    }
}

// Deactivate a user
async function deactivateAllUser(id) {
    try {
        const response = await makeAllAuthRequest(`http://localhost:8080/api/v1/user/deactivate/${id}`, "PUT");
        const data = await response.json();
        
        if (data.code === 201) {
            // Success - refresh the data
            await fetchAllUsers();
            showAllToast('User deactivated successfully', 'success');
        } else {
            console.error("Failed to deactivate user:", data.message);
            showAllToast('Failed to deactivate user', 'error');
        }
    } catch (error) {
        console.error("Error deactivating user:", error);
        showAllToast('Error processing request', 'error');
    }
}

// Helper function to show toast notifications
function showAllToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white`;
    toast.style.zIndex = '9999';
    toast.textContent = message;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0');
        toast.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 500);
    }, 3000);
}

// Function to set the auth token (can be called after login)
function setAllAuthToken(token) {
    allAuthToken = token;
    localStorage.setItem('authToken', token);
}