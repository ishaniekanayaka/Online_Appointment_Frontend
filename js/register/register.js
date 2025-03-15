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
       /* .then(response => response.json())
        .then(data => {
            if (data.code === 201) {
                alert("Registration successful!");
                window.location.href = "../../login.html";
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Error during registration:", error);
            alert("Registration failed. Please try again.");
        });*/
        .then(response => response.json())
        .then(data => {
            console.log("Response Data:", data);  // Debugging
            if (data.code === 201 || data.success) {  // Adjust based on API response
                alert("Registration successful!");
                window.location.href = "../../login.html";
            } else {
                alert(data.message || "Registration failed.");
            }
        })

});

document.getElementById("loginButton").addEventListener("click", function() {
    window.location.href = "index.html";
});