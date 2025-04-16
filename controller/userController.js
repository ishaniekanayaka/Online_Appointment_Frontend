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
                            window.location.href = "../login.html";  // Redirect to User Dashboard
                        } else if (roleData.role === "GIG") {
                            window.location.href = "../gigRegister.html";  // Redirect to User Dashboard
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


  // Create floating particles
  document.addEventListener('DOMContentLoaded', function() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 2px and 6px
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation duration between 10s and 20s
        const duration = Math.random() * 10 + 10;
        particle.style.animationDuration = `${duration}s`;
        
        // Random delay
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesContainer.appendChild(particle);
    }
    
    // Form submission animation
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Add a ripple effect to the button
        const button = form.querySelector('button');
        button.innerHTML = '<span class="fa fa-spinner fa-spin"></span> Processing';
        button.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
        
        // Simulate processing
        setTimeout(() => {
            button.innerHTML = '<span class="fa fa-check"></span> Success!';
            
            // Add confetti effect
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.classList.add('particle');
                confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
                confetti.style.width = '8px';
                confetti.style.height = '8px';
                confetti.style.left = `${50 + (Math.random() - 0.5) * 20}%`;
                confetti.style.top = '70%';
                confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
                confetti.style.animationName = 'confettiFall';
                document.body.appendChild(confetti);
                
                // Remove confetti after animation
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                button.innerHTML = 'Register Account';
                button.style.background = 'linear-gradient(135deg, #6e8efb, #a777e3)';
            }, 3000);
        }, 2000);
    });
});
