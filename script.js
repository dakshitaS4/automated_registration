// --- 1. View Switching ---
const btnSignup = document.getElementById('btn-signup');
const btnSignin = document.getElementById('btn-signin');
const signUpSection = document.getElementById('signup-section');
const signInSection = document.getElementById('signin-section');

btnSignup.addEventListener('click', () => {
    btnSignup.classList.add('active');
    btnSignin.classList.remove('active');
    signUpSection.classList.remove('hidden');
    signInSection.classList.add('hidden');
});

btnSignin.addEventListener('click', () => {
    btnSignin.classList.add('active');
    btnSignup.classList.remove('active');
    signUpSection.classList.add('hidden');
    signInSection.classList.remove('hidden');
});

// --- 2. Location Data ---
const locationData = {
    "USA": {
        "California": ["Los Angeles", "San Francisco"],
        "New York": ["New York City", "Buffalo"],
        "Texas": ["Houston", "Austin"]
    },
    "India": {
        "Maharashtra": ["Mumbai", "Pune"],
        "Delhi": ["New Delhi", "North Delhi"],
        "Karnataka": ["Bangalore", "Mysore"]
    },
    "UK": {
        "England": ["London", "Manchester"],
        "Scotland": ["Edinburgh", "Glasgow"]
    }
};

const countrySel = document.getElementById('country');
const stateSel = document.getElementById('state');
const citySel = document.getElementById('city');

// Country Change Logic
countrySel.addEventListener('change', function() {
    stateSel.innerHTML = '<option value="">Select State</option>';
    citySel.innerHTML = '<option value="">Select City</option>';
    citySel.disabled = true;

    const code = this.value;
    if (code && locationData[code]) {
        stateSel.disabled = false;
        Object.keys(locationData[code]).forEach(state => {
            stateSel.innerHTML += `<option value="${state}">${state}</option>`;
        });
    } else {
        stateSel.disabled = true;
        stateSel.innerHTML = '<option value="">Select Country First</option>';
    }
    validateForm();
});

// State Change Logic
stateSel.addEventListener('change', function() {
    citySel.innerHTML = '<option value="">Select City</option>';
    const state = this.value;
    const country = countrySel.value;

    if (state && country) {
        citySel.disabled = false;
        locationData[country][state].forEach(city => {
            citySel.innerHTML += `<option value="${city}">${city}</option>`;
        });
    } else {
        citySel.disabled = true;
    }
    validateForm();
});

// --- 3. Password Logic ---
function togglePass(id, icon) {
    const input = document.getElementById(id);
    if (input.type === "password") {
        input.type = "text";
        icon.className = "fa-solid fa-eye toggle-pass";
    } else {
        input.type = "password";
        icon.className = "fa-solid fa-eye-slash toggle-pass";
    }
}

let passScore = 0;
document.getElementById('password').addEventListener('input', function() {
    const val = this.value;
    const bar = document.getElementById('strengthBar');
    const txt = document.getElementById('strengthText');
    
    const hasMix = /[a-z]/.test(val) && /[A-Z]/.test(val) && /[0-9]/.test(val);
    const hasSpecial = /[!@#$%^&*]/.test(val);

    if (!val) {
        bar.style.width = "0%"; txt.textContent = ""; passScore = 0;
    } else if (val.length < 6) {
        bar.style.width = "30%"; bar.style.backgroundColor = "var(--error-color)";
        txt.textContent = "Weak"; txt.style.color = "var(--error-color)"; passScore = 0;
    } else if (val.length >= 6 && (!hasMix || !hasSpecial)) {
        bar.style.width = "60%"; bar.style.backgroundColor = "var(--warning-color)";
        txt.textContent = "Medium"; txt.style.color = "var(--warning-color)"; passScore = 1;
    } else {
        bar.style.width = "100%"; bar.style.backgroundColor = "var(--success-color)";
        txt.textContent = "Strong"; txt.style.color = "var(--success-color)"; passScore = 2;
    }
    validateForm();
});

// --- 4. Validation ---
const inputs = document.querySelectorAll('input, select, textarea');
const submitBtn = document.getElementById('submitBtn');
const alertBox = document.getElementById('topAlert');
const alertList = document.getElementById('alertList');

function checkInput(input) {
    if (!input.required && !input.value) return null; // Skip optional empty fields
    
    if (input.required) {
        if (input.type === 'radio' && !document.querySelector(`input[name="${input.name}"]:checked`)) return "Select a Gender";
        if (input.type === 'checkbox' && !input.checked) return "Accept Terms";
        if (!input.value.trim()) return (input.placeholder || "Field") + " is required";
    }
    
    if (input.type === 'email' && input.value && !/^\S+@\S+\.\S+$/.test(input.value)) return "Invalid Email";
    if (input.id === 'password' && input.value && passScore < 1) return "Password too weak";
    if (input.id === 'confirmPassword' && input.value !== document.getElementById('password').value) return "Passwords mismatch";
    
    return null;
}

function validateForm() {
    let isValid = true;
    let errors = [];

    inputs.forEach(input => {
        const err = checkInput(input);
        if (err) isValid = false;
        
        // Show inline error if touched
        if (input.classList.contains('touched') && err) {
            input.parentElement.classList.add('error');
            if (!errors.includes(err)) errors.push(err);
        } else {
            input.parentElement.classList.remove('error');
        }
    });

    submitBtn.disabled = !isValid;

    if (errors.length > 0) {
        alertBox.style.display = 'block';
        alertList.innerHTML = '';
        errors.forEach(e => alertList.innerHTML += `<li>${e}</li>`);
    } else {
        alertBox.style.display = 'none';
    }
}

// Attach Events
inputs.forEach(input => {
    input.addEventListener('blur', () => { input.classList.add('touched'); validateForm(); });
    input.addEventListener('input', validateForm);
    input.addEventListener('change', () => { input.classList.add('touched'); validateForm(); });
});

document.getElementById('regForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!submitBtn.disabled) {
        alert("Account Created!");
        location.reload();
    }
});