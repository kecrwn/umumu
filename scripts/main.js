// Main JavaScript for Anniversary Website
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all features
    initScrollAnimations();
    initPhotoGallery();
    initDurationCounter();
    initInteractiveElements();
    
    // Scroll Animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.duration-card, .quote-card, .memory-item, .chat-message'
        );
        
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                animation: slideInUp 0.6s ease-out forwards;
            }
            
            @keyframes slideInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Photo Gallery with Lightbox
    function initPhotoGallery() {
        const photoItems = document.querySelectorAll('.photo-placeholder, .photo-item');
        
        photoItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                // For now, show upload prompt
                // TODO: Replace with actual lightbox when real photos are added
                showPhotoUploadPrompt(index + 1);
            });
            
            // Add keyboard accessibility
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `Photo ${index + 1} placeholder - click to add photo`);
            
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showPhotoUploadPrompt(index + 1);
                }
            });
        });
    }

    // Show photo upload prompt (placeholder functionality)
    function showPhotoUploadPrompt(photoNumber) {
        // Create a simple prompt for photo upload
        const photoDescription = prompt(`What memory would you like to associate with Photo ${photoNumber}? (This will be the caption)`);
        
        if (photoDescription !== null && photoDescription.trim() !== '') {
            // Update the placeholder with the description
            const placeholder = document.querySelectorAll('.photo-placeholder')[photoNumber - 1];
            const content = placeholder.querySelector('.placeholder-content p');
            const small = placeholder.querySelector('.placeholder-content small');
            
            content.textContent = photoDescription;
            small.textContent = 'Click to replace with actual photo';
            
            // Add visual feedback
            placeholder.style.border = '2px solid #E6A5A3';
            setTimeout(() => {
                placeholder.style.border = 'none';
            }, 2000);
        }
    }

    // Interactive Duration Counter
    function initDurationCounter() {
        const durationCards = document.querySelectorAll('.duration-card');
        
        durationCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                // Animate the card with a pulse effect
                card.style.transform = 'scale(1.1)';
                card.style.transition = 'transform 200ms ease';
                
                setTimeout(() => {
                    card.style.transform = '';
                    card.style.transition = 'all 400ms cubic-bezier(0.25, 0.8, 0.25, 1)';
                }, 200);
                
                // Show fun facts about your relationship
                showDurationFact(index);
            });
        });
    }

    // Show fun facts about relationship duration
    function showDurationFact(index) {
        const facts = [
            "That's 19 months of waking up happy! 😊",
            "579 days of adventures together! ✨",
            "Over 13,896 hours of beautiful memories! ⏰",
            "Countless moments of pure joy! 💕",
            "Every single day has been special! 🌟"
        ];
        
        // Create a temporary tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'duration-tooltip';
        tooltip.textContent = facts[index] || facts[0];
        tooltip.style.cssText = `
            position: fixed;
            background: #E6A5A3;
            color: white;
            padding: 12px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(-50%);
            box-shadow: 0 4px 12px rgba(185, 109, 107, 0.3);
            pointer-events: none;
            opacity: 0;
            transition: opacity 300ms ease;
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip near the clicked card
        const card = document.querySelectorAll('.duration-card')[index];
        const rect = card.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2) + 'px';
        tooltip.style.top = (rect.top - 50) + 'px';
        
        // Show tooltip
        setTimeout(() => tooltip.style.opacity = '1', 100);
        
        // Remove tooltip after 3 seconds
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => document.body.removeChild(tooltip), 300);
        }, 3000);
    }

    // Initialize Interactive Elements
    function initInteractiveElements() {
        // Add click handlers for quote cards to "like" them
        const quoteCards = document.querySelectorAll('.quote-card');
        quoteCards.forEach(card => {
            card.addEventListener('click', () => {
                toggleHeartAnimation(card);
            });
        });

        // Add click handlers for memory items
        const memoryItems = document.querySelectorAll('.memory-item');
        memoryItems.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('expanded');
                if (item.classList.contains('expanded')) {
                    // TODO: Show full memory details
                    showMemoryDetails(item);
                }
            });
        });

        // Add floating hearts animation on load
        createFloatingHearts();
    }

    // Heart animation for quote cards
    function toggleHeartAnimation(card) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.cssText = `
            position: absolute;
            font-size: 24px;
            pointer-events: none;
            z-index: 100;
            animation: heartFloat 2s ease-out forwards;
        `;
        
        // Position heart at click location
        const rect = card.getBoundingClientRect();
        heart.style.left = (rect.left + rect.width / 2) + 'px';
        heart.style.top = (rect.top + rect.height / 2) + 'px';
        
        document.body.appendChild(heart);
        
        // Add heart animation keyframes
        if (!document.querySelector('#heart-animations')) {
            const style = document.createElement('style');
            style.id = 'heart-animations';
            style.textContent = `
                @keyframes heartFloat {
                    0% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-100px) scale(1.5);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove heart after animation
        setTimeout(() => document.body.removeChild(heart), 2000);
    }

    // Show memory details (placeholder)
    function showMemoryDetails(memoryItem) {
        const dateText = memoryItem.querySelector('.memory-date').textContent;
        alert(`Full details for: ${dateText}\n\nThis could show a detailed story, photos, or special notes about this memory. Add your content here!`);
    }

    // Create floating hearts animation
    function createFloatingHearts() {
        const heartContainer = document.createElement('div');
        heartContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
        
        document.body.appendChild(heartContainer);
        
        // Create a few floating hearts
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = ['💕', '❤️', '✨'][Math.floor(Math.random() * 3)];
                heart.style.cssText = `
                    position: absolute;
                    font-size: 20px;
                    opacity: 0.3;
                    animation: float ${5 + Math.random() * 5}s linear infinite;
                    left: ${Math.random() * 100}%;
                    animation-delay: ${Math.random() * 5}s;
                `;
                
                heartContainer.appendChild(heart);
                
                // Add floating animation
                if (!document.querySelector('#float-animation')) {
                    const style = document.createElement('style');
                    style.id = 'float-animation';
                    style.textContent = `
                        @keyframes float {
                            0% {
                                transform: translateY(100vh) rotate(0deg);
                            }
                            100% {
                                transform: translateY(-100px) rotate(360deg);
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
            }, i * 2000);
        }
    }

    // Keyboard navigation enhancement
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add keyboard navigation styles
    const navStyle = document.createElement('style');
    navStyle.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid #E6A5A3 !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(navStyle);

    // Smooth scrolling for any internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Utility function to update relationship duration
function updateRelationshipDuration(startDate) {
    const now = new Date();
    const start = new Date(startDate);
    const diffTime = Math.abs(now - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30.44); // Average days per month
    const diffYears = Math.floor(diffDays / 365.25);
    
    // Update the display
    const durationValues = document.querySelectorAll('.duration-value');
    if (durationValues.length >= 5) {
        durationValues[0].textContent = diffYears;
        durationValues[1].textContent = diffMonths % 12;
        durationValues[2].textContent = diffMonths;
        durationValues[3].textContent = diffWeeks;
        durationValues[4].textContent = diffDays;
    }
    
    // Update hero section
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.textContent = `${diffDays} Days with You`;
    }
    
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.textContent = `${diffYears} Year${diffYears !== 1 ? 's' : ''}, ${diffMonths % 12} Month${(diffMonths % 12) !== 1 ? 's' : ''}`;
    }
    
    // Update footer
    const footerSubtitle = document.querySelector('.footer-subtitle');
    if (footerSubtitle) {
        footerSubtitle.textContent = `${diffDays} days and counting...`;
    }
}

// Example usage: 
// updateRelationshipDuration('2023-04-15'); // Replace with your actual start date