const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
	console.log(entry)
	if (entry.isIntersecting) {
	    entry.target.classList.add('show');
	} else {
	    entry.target.classList.remove('show');
	}
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

document.addEventListener('DOMContentLoaded', function() {
    // Select all images within elements having the class 'polaroid'
    const images = document.querySelectorAll('.polaroid img');

    images.forEach(image => {
        image.addEventListener('click', function() {
            // Toggle class to control zoom state
            if (this.classList.contains('zoomed')) {
                this.style.transform = ''; // Reset zoom
                this.classList.remove('zoomed');
            } else {
                this.style.transform = 'scale(2)'; // Adjust the scale to control the zoom level
                this.classList.add('zoomed');
            }
        });
    });
});

// Get the button
var mybutton = document.getElementById("myBtn");

// Function to scroll to the top
// Function to scroll to the top
function topFunction() {
    // Scroll to top for non-touch devices
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

    // Scroll to top for touch devices
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth scrolling animation
    });
}
