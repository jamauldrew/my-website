///////////
// Function to toggle dark mode
///////////
function toggleDarkMode() {
  // Get the current computed styles
  const rootStyles = getComputedStyle(document.documentElement);

  // Get the current color values
  const lightColor = rootStyles.getPropertyValue('--light-color');
  const darkColor = rootStyles.getPropertyValue('--dark-color');
  const accentColor = rootStyles.getPropertyValue('--accent-color');
  const darkAccent = rootStyles.getPropertyValue('--dark-accent');
  const lightTextShadow = rootStyles.getPropertyValue('--light-text-shadow');
  const darkTextShadow = rootStyles.getPropertyValue('--dark-text-shadow');
  const lightAccentOpaque = rootStyles.getPropertyValue('--accent-opaque');
  const darkAccentOpaque = rootStyles.getPropertyValue('--dark-accent-opaque');

  // Swap light and dark colors
  document.documentElement.style.setProperty('--light-color', darkColor);
  document.documentElement.style.setProperty('--dark-color', lightColor);
  document.documentElement.style.setProperty('--accent-color', darkAccent);
  document.documentElement.style.setProperty('--dark-accent', accentColor);
  document.documentElement.style.setProperty('--light-text-shadow', darkTextShadow);
  document.documentElement.style.setProperty('--dark-text-shadow', lightTextShadow);
  document.documentElement.style.setProperty('--accent-opaque', darkAccentOpaque);
  document.documentElement.style.setProperty('--dark-accent-opaque', lightAccentOpaque);
}
// Listen for clicks on the nav title to toggle dark mode
document.getElementById('nav-title').addEventListener('click', toggleDarkMode);

document.addEventListener('DOMContentLoaded', () => {
    // Toggle image zoom
    const images = document.querySelectorAll('.polaroid img');
    images.forEach(image => {
        image.addEventListener('click', function () {
            if (this.classList.contains('zoomed')) {
                this.style.transform = '';
                this.classList.remove('zoomed');
            } else {
                this.style.transform = 'scale(2)';
                this.classList.add('zoomed');
            }
        });
    });

    // Scroll to top
    const scrollToTopButton = document.getElementById("scroll-button");
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Form submission
    const form = document.getElementById("my-form");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = document.getElementById("my-form-status");
        const data = new FormData(event.target);
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                status.innerHTML = "Thanks for your submission!";
                form.reset();
            } else {
                const errorData = await response.json();
                status.innerHTML = errorData.errors ? errorData.errors.map(error => error.message).join(", ") : "Oops! There was a problem submitting your form";
            }
        } catch (error) {
            status.innerHTML = "Oops! There was a problem submitting your form";
        }
    });

    // Toggle dark mode
    const toggleDarkMode = () => {
        // Skipping the detailed implementation for brevity
    };
    document.getElementById('nav-title').addEventListener('click', toggleDarkMode);

    // Load external script and handle badges
    const badgeScript = document.createElement('script');
    badgeScript.src = "//cdn.credly.com/assets/utilities/embed.js";
    badgeScript.onload = () => {
        const staticBadge = document.querySelector('#badge-container img');
        if (staticBadge) {
            staticBadge.style.display = 'none';
        }
    };
    document.head.appendChild(badgeScript);

    // Initialize IntersectionObserver for hidden elements
    const initObserver = () => {
        const observerOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px'
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        entry.target.classList.add('show');
                        observer.unobserve(entry.target);
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('.hidden').forEach(el => {
            observer.observe(el);
        });
    };
    initObserver();

    // Function to be called for dynamically added elements
    window.addEventListener('addDynamicContent', initObserver);
});
