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

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
        authToken = storedToken;
    } else {
        // If no token exists, you might want to redirect to login or handle this case
        console.warn('No authentication token found!');
        // You could redirect to login or handle authentication here
    }
    
    fetchUsers();
});

// Helper function to make authenticated API requests
async function makeAuthRequest(url, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
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
async function fetchUsers() {
    try {
        // Show loading indicator
        loadingElement.classList.remove('hidden');
        tableContainer.classList.add('hidden');
        noDataElement.classList.add('hidden');
        
        const response = await makeAuthRequest("http://localhost:8080/api/v1/user/getAll");
        const data = await response.json();
        
        if (data.code === 201 && data.data) {
            allUsers = data.data;
            
            // Filter GIG users
            const gigUsers = allUsers.filter(user => user.role === "GIG");
            
            // Calculate statistics
            updateStatistics(allUsers);
            
            // Update GIG users count
            gigTotalElement.textContent = gigUsers.length;
            
            // Render the table
            renderTable(gigUsers);
        } else {
            console.error("Failed to fetch users:", data.message);
            showNoData();
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        showNoData();
    } finally {
        // Hide loading indicator
        loadingElement.classList.add('hidden');
    }
}

// Update the statistics counters
function updateStatistics(users) {
    // Count only ACTIVE GIG users
    const activeGigUsers = users.filter(user => 
        user.active && user.role === "GIG"
    ).length;

    // Count only INACTIVE GIG users
    const inactiveGigUsers = users.filter(user => 
        !user.active && user.role === "GIG"
    ).length;

    // Update the UI
    activeCountElement.textContent = activeGigUsers;
    inactiveCountElement.textContent = inactiveGigUsers;
    
    // (Optional) Update total GIG users count (active + inactive)
    const totalGigUsers = users.filter(user => user.role === "GIG").length;
    gigTotalElement.textContent = totalGigUsers;
}

// Render the users table
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

// Show 'no data' message
function showNoData() {
    tableContainer.classList.add('hidden');
    noDataElement.classList.remove('hidden');
}

// Activate a user
async function activateUser(id) {
    try {
        const response = await makeAuthRequest(`http://localhost:8080/api/v1/user/activate/${id}`, "PUT");
        const data = await response.json();
        
        if (data.code === 201) {
            // Success - refresh the data
            await fetchUsers();
            showToast('User activated successfully', 'success');
        } else {
            console.error("Failed to activate user:", data.message);
            showToast('Failed to activate user', 'error');
        }
    } catch (error) {
        console.error("Error activating user:", error);
        showToast('Error processing request', 'error');
    }
}

// Deactivate a user
async function deactivateUser(id) {
    try {
        const response = await makeAuthRequest(`http://localhost:8080/api/v1/user/deactivate/${id}`, "PUT");
        const data = await response.json();
        
        if (data.code === 201) {
            // Success - refresh the data
            await fetchUsers();
            showToast('User deactivated successfully', 'success');
        } else {
            console.error("Failed to deactivate user:", data.message);
            showToast('Failed to deactivate user', 'error');
        }
    } catch (error) {
        console.error("Error deactivating user:", error);
        showToast('Error processing request', 'error');
    }
}

// Helper function to show toast notifications
function showToast(message, type = 'info') {
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
function setAuthToken(token) {
    authToken = token;
    localStorage.setItem('authToken', token);
}

// Example of how to handle login response and set the token
function handleLoginResponse(response) {
    if (response && response.data && response.data.token) {
        setAuthToken(response.data.token);
        return true;
    }
    return false;
}