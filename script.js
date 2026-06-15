// Form validation and handling
const form = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

// Validation rules
const validationRules = {
    name: {
        validate: (value) => value.trim().length >= 2,
        error: 'Name must be at least 2 characters long'
    },
    email: {
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        error: 'Please enter a valid email address'
    },
    phone: {
        validate: (value) => {
            if (value.trim() === '') return true;
            return /^[\d\s\-\+\(\)]+$/.test(value) && value.replace(/\D/g, '').length >= 10;
        },
        error: 'Please enter a valid phone number'
    },
    subject: {
        validate: (value) => value.trim().length >= 3,
        error: 'Subject must be at least 3 characters long'
    },
    message: {
        validate: (value) => value.trim().length >= 10,
        error: 'Message must be at least 10 characters long'
    },
    terms: {
        validate: (checkbox) => checkbox.checked,
        error: 'You must agree to the privacy policy'
    }
};

// Validate individual field
function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}Error`);
    const rule = validationRules[fieldName];

    if (!rule) return true;

    let isValid = false;
    
    if (fieldName === 'terms') {
        isValid = rule.validate(field);
    } else {
        isValid = rule.validate(field.value);
    }

    if (!isValid) {
        field.classList.add('error');
        errorElement.textContent = rule.error;
        errorElement.classList.add('show');
        return false;
    } else {
        field.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        return true;
    }
}

// Validate entire form
function validateForm() {
    let isFormValid = true;
    const fieldNames = ['name', 'email', 'phone', 'subject', 'message', 'terms'];

    fieldNames.forEach(fieldName => {
        if (!validateField(fieldName)) {
            isFormValid = false;
        }
    });

    return isFormValid;
}

// Real-time validation
['name', 'email', 'phone', 'subject', 'message'].forEach(fieldName => {
    const field = document.getElementById(fieldName);
    field.addEventListener('blur', () => validateField(fieldName));
    field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
            validateField(fieldName);
        }
    });
});

document.getElementById('terms').addEventListener('change', () => validateField('terms'));

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        console.log('Form validation failed');
        return;
    }

    // Disable button during submission
    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        // Collect form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const timestamp = new Date().toLocaleString();

        console.log('Sending email with data:', { name, email, phone, subject, message });

        // Send email via EmailJS
        const response = await emailjs.send(
            'service_contact_form',
            'template_contact_form',
            {
                to_email: 'bhebhezoxonto@gmail.com',
                from_name: name,
                from_email: email,
                phone: phone || 'Not provided',
                subject: subject,
                message: message,
                timestamp: timestamp,
                reply_to: email
            }
        );

        console.log('EmailJS Response:', response);

        if (response.status === 200) {
            // Show success message
            successMessage.textContent = '✓ Message sent successfully to Zeph Khoza! I\'ll get back to you soon.';
            successMessage.style.borderColor = '#10b981';
            successMessage.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            successMessage.style.color = '#10b981';
            successMessage.classList.add('show');

            // Reset form
            form.reset();
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
        } else {
            throw new Error('Failed to send email: ' + response.status);
        }

    } catch (error) {
        console.error('Error submitting form:', error);
        console.error('Error details:', error.text || error.message);
        
        let errorMsg = '✗ There was an error sending your message. ';
        if (error.text) {
            errorMsg += 'Details: ' + error.text;
        } else if (error.message) {
            errorMsg += 'Details: ' + error.message;
        } else {
            errorMsg += 'Please check the console for more details.';
        }
        
        successMessage.textContent = errorMsg;
        successMessage.style.borderColor = '#ef4444';
        successMessage.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        successMessage.style.color = '#ef4444';
        successMessage.classList.add('show');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message to Zeph Khoza';
    }
}
);

// Initialize EmailJS
console.log('Initializing EmailJS with public key: CNuHYniH32CU2Thkv');
emailjs.init('CNuHYniH32CU2Thkv');

console.log('Contact Form initialized and ready to use');
