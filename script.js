document.addEventListener('DOMContentLoaded', () => {
    // Current Year Update
    document.getElementById('year').textContent = new Date().getFullYear();

    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }));

    // Typewriter Effect
    const texts = ['Developer', 'Designer', 'Creative Thinker'];
    let count = 0;
    let index = 0;
    let currentText = '';
    let letter = '';
    let isDeleting = false;
    
    const type = () => {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];

        if (isDeleting) {
            letter = currentText.slice(0, --index);
        } else {
            letter = currentText.slice(0, ++index);
        }

        const typeWriterEl = document.querySelector('.typewriter');
        if (typeWriterEl) {
            typeWriterEl.textContent = letter;
        }

        let typeSpeed = 100;

        if (isDeleting) {
            typeSpeed /= 2;
        }

        if (!isDeleting && letter.length === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && letter.length === 0) {
            isDeleting = false;
            count++;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    };

    // Start Typing Effect
    type();

    // Form Submission Details (Connecting to local Node.js backend)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            try {
                // Pointing to local backend which will be set up with Express & MongoDB
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to send message.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                
                // Show the actual error to help figure out what's wrong
                formStatus.textContent = 'Connection Error: ' + error.message;
                formStatus.className = 'form-status error';
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            }
        });
    }
});
