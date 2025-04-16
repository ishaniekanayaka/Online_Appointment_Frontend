   // Toast Notification Function
   function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast';
    
    if (type === 'error') {
        toast.classList.add('error');
    } else if (type === 'success') {
        toast.classList.add('success');
    }
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Password Reset Modal Logic
const forgotModal = document.getElementById('forgotModal');
const forgotLink = document.querySelector('.forgot-link');
const closeModal = document.querySelector('.close-modal');
const steps = document.querySelectorAll('.step');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const forgotEmail = document.getElementById('forgotEmail');
const otpInputs = document.querySelectorAll('.otp-input');
const newPassword = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');
const resendOtp = document.getElementById('resendOtp');
const countdown = document.getElementById('countdown');
const otpError = document.getElementById('otpError');
const passwordError = document.getElementById('passwordError');

let currentStep = 1;
let email = '';
let countdownInterval;
let timeLeft = 60;

// Open modal when forgot password is clicked
forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    forgotModal.classList.add('show');
});

// Close modal
closeModal.addEventListener('click', () => {
    closeForgotModal();
});

// Close modal when clicking outside
forgotModal.addEventListener('click', (e) => {
    if (e.target === forgotModal) {
        closeForgotModal();
    }
});

function closeForgotModal() {
    forgotModal.classList.remove('show');
    resetModal();
}

function resetModal() {
    currentStep = 1;
    updateSteps();
    forgotEmail.value = '';
    otpInputs.forEach(input => input.value = '');
    newPassword.value = '';
    confirmPassword.value = '';
    otpError.style.display = 'none';
    passwordError.style.display = 'none';
    clearInterval(countdownInterval);
    timeLeft = 60;
    updateCountdown();
}

function updateSteps() {
    steps.forEach(step => step.classList.remove('active'));
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
    
    if (currentStep === 3) {
        nextBtn.textContent = 'Reset Password';
    } else {
        nextBtn.textContent = 'Next';
    }
}

function startCountdown() {
    clearInterval(countdownInterval);
    timeLeft = 60;
    updateCountdown();
    resendOtp.classList.add('disabled');
    
    countdownInterval = setInterval(() => {
        timeLeft--;
        updateCountdown();
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            resendOtp.classList.remove('disabled');
        }
    }, 1000);
}

function updateCountdown() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    countdown.textContent = `Resend available in ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function getOtp() {
    let otp = '';
    otpInputs.forEach(input => {
        otp += input.value;
    });
    return otp;
}

// OTP input auto-focus
otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && index > 0 && e.target.value.length === 0) {
            otpInputs[index - 1].focus();
        }
    });
});

// Next/Previous button logic
nextBtn.addEventListener('click', async () => {
    if (currentStep === 1) {
        // Step 1: Send OTP
        email = forgotEmail.value.trim();
        if (!email) {
            showToast('Please enter your email address', 'error');
            return;
        }
        
        try {
            nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending';
            nextBtn.disabled = true;
            
            const response = await fetch('http://localhost:8080/api/v1/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            
            if (!response.ok) {
                throw new Error('Failed to send OTP');
            }
            
            currentStep++;
            updateSteps();
            startCountdown();
            showToast('OTP sent to your email', 'success');
        } catch (error) {
            showToast(error.message || 'Failed to send OTP', 'error');
        } finally {
            nextBtn.innerHTML = 'Next';
            nextBtn.disabled = false;
        }
    } else if (currentStep === 2) {
        // Step 2: Verify OTP
        const otp = getOtp();
        if (otp.length !== 6) {
            otpError.textContent = 'Please enter a 6-digit OTP';
            otpError.style.display = 'block';
            return;
        }
        
        // Move to password step without verification yet
        currentStep++;
        updateSteps();
        otpError.style.display = 'none';
        
    } else if (currentStep === 3) {
        // Step 3: Verify OTP and Reset Password (combined as per your backend)
        const otp = getOtp();
        const password = newPassword.value;
        const confirm = confirmPassword.value;
        
        if (password !== confirm) {
            passwordError.textContent = 'Passwords do not match';
            passwordError.style.display = 'block';
            return;
        }
        
        if (password.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters';
            passwordError.style.display = 'block';
            return;
        }
        
        try {
            nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting';
            nextBtn.disabled = true;
            
            const response = await fetch('http://localhost:8080/api/v1/auth/verify-otp', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email, 
                    otp: otp,
                    newPassword: password
                })
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to reset password');
            }
            
            showToast('Password reset successfully!', 'success');
            
            // Auto-fill the login form with the reset credentials
            document.getElementById('email').value = email;
            document.getElementById('password').value = password;
            
            setTimeout(() => {
                closeForgotModal();
            }, 1500);
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            nextBtn.innerHTML = 'Reset Password';
            nextBtn.disabled = false;
        }
    }
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateSteps();
    }
});

// Resend OTP
resendOtp.addEventListener('click', async () => {
    if (resendOtp.classList.contains('disabled')) return;
    
    try {
        resendOtp.classList.add('disabled');
        showToast('Resending OTP...', 'info');
        
        const response = await fetch('http://localhost:8080/api/v1/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        if (!response.ok) {
            throw new Error('Failed to resend OTP');
        }
        
        startCountdown();
        showToast('OTP resent to your email', 'success');
    } catch (error) {
        showToast(error.message || 'Failed to resend OTP', 'error');
        resendOtp.classList.remove('disabled');
    }
});

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

    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating';
    loginButton.disabled = true;

    const user = { email, password };

    fetch("http://localhost:8080/api/v1/auth/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (response.status === 404) throw new Error("User not found");
        if (response.status === 401) throw new Error("Invalid credentials");
        if (response.status === 406) throw new Error("Account inactive");
        if (!response.ok) throw new Error("Network error");
        return response.json();
    })
    .then(response => {
        if (response.code === 201 && response.data.token) {
            localStorage.setItem("authToken", response.data.token);
            showToast("Login successful!", "success");

            // First get user details by email
            fetch(`http://localhost:8080/api/v1/user/email/${encodeURIComponent(email)}`, {
                headers: {
                    "Authorization": `Bearer ${response.data.token}`
                }
            })
            .then(userResponse => {
                if (!userResponse.ok) throw new Error('Failed to fetch user details');
                return userResponse.json();
            })
            .then(userData => {
                const userId = userData.data.id;
                const role = userData.data.role;
                localStorage.setItem("userId", userId);
                
                // Handle role-based redirection
                // if (role === "ADMIN") {
                //     setTimeout(() => window.location.href = "adminContain.html", 1500);
                // } else if (role === "USER") {
                //     setTimeout(() => window.location.href = "userInterface.html", 1500);
                if (role === "USER" || role === "ADMIN") {
                        // Check if profile exists
                        fetch(`http://localhost:8080/api/v1/profile/exists/${userId}`, {
                            headers: {
                                "Authorization": `Bearer ${response.data.token}`
                            }
                        })
                        .then(profileResponse => {
                            if (!profileResponse.ok) throw new Error('Failed to check profile');
                            return profileResponse.json();
                        })
                        .then(profileExists => {
                            if (profileExists) {
                                setTimeout(() => {
                                    if (role === "USER") {
                                        window.location.href = "userInterface.html";
                                    } else {
                                        window.location.href = "adminContain.html";
                                    }
                                }, 1500);
                            } else {
                                // No profile – go to profile creation page
                                setTimeout(() => {
                                    window.location.href = "createProfile.html"; // 👈 your profile form page
                                }, 1500);
                            }
                        })
                        .catch(profileError => {
                            console.error("Profile check error:", profileError);
                            showToast("Error checking profile", "error");
                            loginButton.innerHTML = 'Login';
                            loginButton.disabled = false;
                        });
                    

                } else if (role === "GIG") {
                    // Fetch gig details for this user
                    fetch(`http://localhost:8080/api/v1/user/${userId}/gigs`, {
                        headers: {
                            "Authorization": `Bearer ${response.data.token}`
                        }
                    })
                    .then(gigResponse => {
                        if (!gigResponse.ok) throw new Error('Failed to fetch gigs');
                        return gigResponse.json();
                    })
                    .then(gigData => {
                        if (gigData.length > 0) {
                            localStorage.setItem("gigProfile", JSON.stringify(gigData[0]));
                            setTimeout(() => {
                                window.location.href = "gigProfile.html";
                            }, 1500);
                        } else {
                            setTimeout(() => {
                                window.location.href = "gigRegister.html";
                            }, 1500);
                        }
                    })
                    .catch(gigError => {
                        console.error("Gig fetch error:", gigError);
                        showToast("Error loading gig profile", "error");
                        loginButton.innerHTML = 'Login';
                        loginButton.disabled = false;
                    });
                } else {
                    throw new Error("Unknown user role");
                }
            })
            .catch(userError => {
                console.error("User fetch error:", userError);
                showToast("Error loading user details", "error");
                loginButton.innerHTML = 'Login';
                loginButton.disabled = false;
            });
        } else {
            throw new Error(response.message || "Login failed");
        }
    })
    .catch(error => {
        console.error("Login error:", error);
        showToast(error.message || "Login failed", "error");
        loginButton.innerHTML = 'Login';
        loginButton.disabled = false;
    });
});

document.getElementById("register-btn").addEventListener("click", function(e) {
    e.preventDefault();
    showToast("Redirecting to registration...");
    window.location.href = "register.html";
});