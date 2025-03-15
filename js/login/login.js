document.getElementById("loginButton").addEventListener("click",function (event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Please enter both email and password.");
        return;
    }


    let user = {
        email: email,
        password: password
    };

    fetch("http://localhost:8080/api/v1/auth/authenticate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 201) {

                localStorage.setItem("authToken", data.data.token);

                window.location.href = "dashboard.html";
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Error during login:", error);
            alert("Login failed. Please try again.");
        });
});
/*document.getElementById("registerButton").addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "register.html";
});*/

