const API_BASE_URL = "http://localhost:8080/api/v1/user";

const getAuthToken = () => localStorage.getItem('authToken');

let userProfile = null;

// Fetch logged-in user profile
const fetchUserProfile = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch profile');
        userProfile = await response.json();

        // Profile image logic
        const imageUrl = userProfile.imagePath
            ? `http://localhost:8080/${userProfile.imagePath.replace(/\\/g, "/")}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name || 'User')}&background=random&size=80`;

        // Set profile image and name in navbar
        const profilePic = document.getElementById("profilePic");
        profilePic.src = imageUrl;
        profilePic.style.width = "50px";
        profilePic.style.height = "50px";
        profilePic.style.objectFit = "cover";
        profilePic.style.borderRadius = "50%";

        document.getElementById("admin1Name").textContent = userProfile.name;

    } catch (error) {
        console.error("Error fetching profile:", error);
    }
};

// Show/hide profile card
const toggleProfileCard = () => {
    const card = document.getElementById("profileCard");

    if (card.style.display === "none") {
        if (userProfile) {
            const imageUrl = userProfile.imagePath
                ? `http://localhost:8080/${userProfile.imagePath.replace(/\\/g, "/")}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name || 'User')}&background=random&size=80`;

            document.getElementById("cardProfilePic").src = imageUrl;
            document.getElementById("cardName").textContent = userProfile.name;
            document.getElementById("cardEmail").textContent = userProfile.email;
            document.getElementById("cardBirthday").textContent = userProfile.dob;
            document.getElementById("cardRole").textContent = userProfile.role;
        }
        card.style.display = "block";
    } else {
        card.style.display = "none";
    }
};

// Load profile on page load
window.onload = () => {
    if (getAuthToken()) {
        fetchUserProfile();
    }
};
