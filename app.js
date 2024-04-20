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
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// Variables to manage the timer
var timer = null;

// Show or hide the button when scrolling
window.addEventListener("scroll", function() {
    // Whenever the user scrolls, show the button
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }

    // Reset the timer every time the user scrolls
    clearTimeout(timer);

    // Set a new timer
    timer = setTimeout(function() {
        // If 20 seconds have passed without scrolling, hide the button
        mybutton.style.display = "none";
    }, 20000); // 20 seconds
});
