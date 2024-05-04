// Utility function to toggle dark mode styles
function toggleDarkModeStyles() {
  const root = document.documentElement;
  const styleProperties = [
    '--light-color', '--dark-color',
    '--accent-color', '--dark-accent',
    '--light-text-shadow', '--dark-text-shadow',
    '--accent-opaque', '--dark-accent-opaque'
  ];

  styleProperties.forEach(prop => {
    const lightModeValue = getComputedStyle(root).getPropertyValue(prop);
    const darkModeValue = getComputedStyle(root).getPropertyValue(prop.replace('light', 'dark').replace('dark', 'temp')); // Temporarily swap names
    root.style.setProperty(prop.replace('dark', 'light').replace('temp', 'dark'), lightModeValue);
    root.style.setProperty(prop, darkModeValue);
  });
}

// Primary function to handle DOMContentLoaded
function initializePage() {
  document.getElementById('nav-title').addEventListener('click', toggleDarkModeStyles);

  // Image zoom functionality
  document.querySelectorAll('.polaroid img').forEach(image => {
    image.addEventListener('click', function () {
      this.classList.toggle('zoomed');
      this.style.transform = this.classList.contains('zoomed') ? 'scale(2)' : '';
    });
  });

  // Scroll to top functionality
  document.getElementById("scroll-button").addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Form submission handling
  document.getElementById("my-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("my-form-status");
    const data = new FormData(event.target);

    try {
      const response = await fetch(event.target.action, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        status.textContent = "Thanks for your submission!";
        event.target.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      status.textContent = "Oops! There was a problem submitting your form";
    }
  });

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
  };

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

  // Load external badge script
  const badgeScript = document.createElement('script');
  badgeScript.src = "//cdn.credly.com/assets/utilities/embed.js";
  badgeScript.onload = () => {
    document.querySelector('#badge-container img');
    if (imgElement) imgElement.style.display = 'none';
  };
  document.head.appendChild(badgeScript);
}

document.addEventListener('DOMContentLoaded', initializePage);
