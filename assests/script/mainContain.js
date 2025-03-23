// Sidebar toggle functionality
let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".sidebarBtn");

sidebarBtn.onclick = function() {
    sidebar.classList.toggle("active");
    if(sidebar.classList.contains("active")) {
        sidebarBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    } else {
        sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
    }
}

// Profile dropdown functionality
const profileDetails = document.querySelector(".profile-details");

// Prevent document click from immediately closing the dropdown
profileDetails.addEventListener("click", function(event) {
    event.stopPropagation(); // This is crucial - stops event bubbling
    this.classList.toggle("active");
});

// Close dropdown when clicking elsewhere on the document
document.addEventListener("click", function(event) {
    if (!profileDetails.contains(event.target)) {
        profileDetails.classList.remove("active");
    }
});

