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
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toLocaleString()
        };

        // Send email via EmailJS
        // You need to set up EmailJS first at https://www.emailjs.com/
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: 'service_contact_form',
                template_id: 'template_contact_form',
                user_id: 'YOUR_EMAILJS_PUBLIC_KEY', // Replace with your EmailJS public key
                template_params: {
                    to_email: 'bhebhezoxonto@gmail.com',
                    from_name: formData.name,
                    from_email: formData.email,
                    phone: formData.phone,
                    subject: formData.subject,
                    message: formData.message,
                    timestamp: formData.timestamp
                }
            })
        });

        if (response.ok) {
            // Show success message
            successMessage.textContent = '✓ Message sent successfully to Zeph Khoza! I\'ll get back to you soon.';
            successMessage.classList.add('show');

            // Reset form
            form.reset();
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
        } else {
            throw new Error('Failed to send email');
        }

    } catch (error) {
        console.error('Error submitting form:', error);
        successMessage.textContent = '✗ There was an error sending your message. Please try again.';
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

console.log('Contact Form initialized and ready to use');
