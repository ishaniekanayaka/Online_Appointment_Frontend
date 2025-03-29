
        function showToast(message, type = 'info') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = 'toast';
            
            // Add type class
            if (type === 'error') {
                toast.classList.add('error');
            } else if (type === 'success') {
                toast.classList.add('success');
            }
            
            // Show toast
            setTimeout(() => {
                toast.classList.add('show');
            }, 10);
            
            // Hide after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Login form submission
        document.getElementById("loginForm").addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const loginButton = document.getElementById("loginButton");

            if (!email || !password) {
                showToast("Please enter both email and password.", "error");
                return;
            }

            // Change button to loading state
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating';
            loginButton.disabled = true;

            const user = { email, password };

            fetch("http://localhost:8080/api/v1/auth/authenticate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            })
            .then(response => {
                if (response.status === 404) {
                    throw new Error("User not found. Please check your email.");
                } else if (response.status === 401) {
                    throw new Error("Invalid email or password.");
                } else if (response.status === 406) {
                    throw new Error("Your account is inactive. Please contact support.");
                } else if (response.status === 409) {
                    throw new Error("Authorization failure! Please try again.");
                } else if (!response.ok) {
                    throw new Error("Network error. Please try again.");
                }
                return response.json();
            })
            .then(response => {
                if (response.code === 201 && response.data.token) {
                    // Store token properly
                    localStorage.setItem("authToken", response.data.token);
                    showToast("Login successful!", "success");

                    // Fetch user role
                    fetch("http://localhost:8080/api/v1/admin/checkRole", {
                        method: "GET",
                        headers: { 
                            "Authorization": `Bearer ${response.data.token}`,
                            "Content-Type": "application/json"
                        }
                    })
                    .then(roleResponse => {
                        if (!roleResponse.ok) {
                            throw new Error('Role check failed');
                        }
                        return roleResponse.json();
                    })
                    .then(roleData => {
                        console.log("Role:", roleData.role);

                        // Redirect based on role
                        if (roleData.role === "ADMIN") {
                            setTimeout(() => {
                                window.location.href = "../adminContain.html";
                            }, 1500);
                        } else if (roleData.role === "USER") {
                            setTimeout(() => {
                                window.location.href = "../UserInterface.html";
                            }, 1500);
                        } else if (roleData.role === "GIG") {
                            setTimeout(() => {
                                window.location.href = "../userSetting.html";
                            }, 1500);
                        } else {
                            showToast("User role not recognized.", "error");
                            loginButton.innerHTML = 'Login';
                            loginButton.disabled = false;
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching role:", error);
                        showToast("Failed to determine user role.", "error");
                        loginButton.innerHTML = 'Login';
                        loginButton.disabled = false;
                    });
                } else {
                    throw new Error(response.message || "Login failed");
                }
            })
            .catch(error => {
                console.error("Login error:", error);
                showToast(error.message || "Login failed. Please try again.", "error");
                loginButton.innerHTML = 'Login';
                loginButton.disabled = false;
            });
        });

        // Register link
        document.getElementById("register-btn").addEventListener("click", function(e) {
            e.preventDefault();
            showToast("Redirecting to registration...");
            window.location.href = "register.html"; // Uncomment when you have registration page
        });
   