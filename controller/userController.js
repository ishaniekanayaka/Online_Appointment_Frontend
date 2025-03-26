document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const dob = document.getElementById("dob").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const repeatPassword = document.getElementById("repeatPassword").value;
    const role = document.getElementById("role").value;

    if (password !== repeatPassword) {
        alert("Passwords do not match!");
        return;
    }

    if (!name || !dob || !email || !password || !repeatPassword || !role) {
        alert("Please fill all the fields.");
        return;
    }


    const user = { name, email, dob, password, role };


    fetch("http://localhost:8080/api/v1/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })

        .then(response => response.json())
        // .then(data => {
        //     console.log("Response Data:", data);  // Debugging
        //     if (data.code === 201 || data.success) {  // Adjust based on API response
        //         alert("Registration successful!");
        //         window.location.href = "../login.html";
        //     } else {
        //         alert(data.message || "Registration failed.");
        //     }
        // })
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
                            window.location.href = "../login.html";  // Redirect to Admin Dashboard
                        } else if (roleData.role === "USER") {
                            window.location.href = "../userSetting.html";  // Redirect to User Dashboard
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

