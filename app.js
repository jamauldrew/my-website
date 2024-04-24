document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show');
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // Image Zoom
    const images = document.querySelectorAll('.polaroid img');
    images.forEach(image => {
        image.addEventListener('click', toggleImageZoom);
    });

    function toggleImageZoom() {
        if (this.classList.contains('zoomed')) {
            this.style.transform = '';
            this.classList.remove('zoomed');
        } else {
            this.style.transform = 'scale(2)';
            this.classList.add('zoomed');
        }
    }

    // Scroll to Top Button
    const scrollToTopButton = document.getElementById("scroll-button");
    scrollToTopButton.addEventListener('click', scrollToTop);

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

var form = document.getElementById("my-form");

async function handleSubmit(event) {
    event.preventDefault();
    var status = document.getElementById("my-form-status");
    var data = new FormData(event.target);
    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            status.innerHTML = "Thanks for your submission!";
            form.reset()
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
                } else {
                    status.innerHTML = "Oops! There was a problem submitting your form"
                }
            })
        }
    }).catch(error => {
        status.innerHTML = "Oops! There was a problem submitting your form"
    });
}
form.addEventListener("submit", handleSubmit);

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

///////////
// badge
///////////
document.addEventListener('DOMContentLoaded', function() {
  var badgeScript = document.createElement('script');
  badgeScript.src = "//cdn.credly.com/assets/utilities/embed.js";

  badgeScript.onload = function() {
    // Correctly target the static badge by using the correct ID or class
    var staticBadge = document.querySelector('#badge-container img'); // Assuming the first img is the static badge
    if (staticBadge) {
      staticBadge.style.display = 'none';
    }
  };

  badgeScript.onerror = function() {
    // The static badge is already displayed as a fallback, so we do nothing here
  };

  document.head.appendChild(badgeScript);
});
