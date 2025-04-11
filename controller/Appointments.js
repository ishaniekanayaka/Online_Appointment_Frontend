document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const bookedCountElement = document.getElementById('booked-count');
    const pendingCountElement = document.getElementById('pending-count');
    const appointmentsTotalElement = document.getElementById('appointments-total');
    const loadingElement = document.getElementById('loading');
    const tableContainer = document.getElementById('table-container');
    const noDataElement = document.getElementById('no-data');
    const appointmentsTableBody = document.getElementById('appointments-table-body');
    const refreshButton = document.getElementById('refresh-appointments');
    
    // Function to load appointments data
    function loadAppointmentsData() {
        console.log("Loading appointments data...");
        
        // Show loading, hide table and no-data
        loadingElement.classList.remove('hidden');
        tableContainer.classList.add('hidden');
        noDataElement.classList.add('hidden');
        
        // Get auth token
        const token = localStorage.getItem('authToken') || '';
        
        // Make API request
        fetch('http://localhost:8080/api/v1/availability/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log("Data received:", data);
            
            if (!data || data.length === 0) {
                showNoDataMessage();
                return;
            }
            
            // Count by status
            const booked = data.filter(item => item.status === "BOOKING").length;
            const cancelled = data.filter(item => item.status === "CANCELLED").length;
            
            // Update counters
            bookedCountElement.textContent = booked;
            pendingCountElement.textContent = cancelled;
            appointmentsTotalElement.textContent = data.length;
            
            // Clear and update table
            appointmentsTableBody.innerHTML = '';
            
            // Add rows for each appointment
            data.forEach(appointment => {
                const row = document.createElement('tr');
                
                // Format date
                const date = new Date(appointment.dateTime);
                const formattedDate = date.toLocaleString();
                
                // Status class
                let statusClass = '';
                if (appointment.status === 'BOOKING') {
                    statusClass = 'bg-green-100 text-green-800';
                } else if (appointment.status === 'CANCELLED') {
                    statusClass = 'bg-red-100 text-red-800';
                }
                
                // Set row content
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${appointment.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formattedDate}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${appointment.userFullName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${appointment.gigName}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                            ${appointment.status}
                        </span>
                    </td>
                `;
                
                appointmentsTableBody.appendChild(row);
            });
            
            // Show table
            tableContainer.classList.remove('hidden');
        })
        .catch(error => {
            console.error("Error:", error);
            showNoDataMessage();
        })
        .finally(() => {
            loadingElement.classList.add('hidden');
        });
    }
    
    // Show no data message
    function showNoDataMessage() {
        tableContainer.classList.add('hidden');
        noDataElement.classList.remove('hidden');
        
        // Zero out counters
        bookedCountElement.textContent = '0';
        pendingCountElement.textContent = '0';
        appointmentsTotalElement.textContent = '0';
    }
    
    // Set up refresh button
    refreshButton.addEventListener('click', loadAppointmentsData);
    
    // Load data on page load
    loadAppointmentsData();
});