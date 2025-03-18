document.getElementById("loginButton").addEventListener("click", function (event) {
    event.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    let user = { email, password };

    fetch("http://localhost:8080/api/v1/auth/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .then(response => {
            if (response.code === 201 && response.data.token) {
                // Store token properly
                localStorage.setItem("authToken", response.data.token);

                // Fetch user role
                fetch("http://localhost:8080/api/v1/admin/checkRole", {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${response.data.token}` }
                })
                    .then(response => response.json())
                    .then(roleData => {
                        console.log("Role:", roleData.role);

                        if (roleData.role === "ADMIN") {
                            window.location.href = "../../test.html";  // Redirect to Admin Dashboard
                        } else if (roleData.role === "USER") {
                            window.location.href = "../../forget_password.html";  // Redirect to User Dashboard
                        } else {
                            alert("User role not recognized.");
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching role:", error);
                        alert("Failed to determine user role.");
                    });
            } else {
                alert(response.message || "Login failed.");
            }
        })
        .catch(error => {
            console.error("Login error:", error);
            alert("Login failed. Please try again.");
        });
});
