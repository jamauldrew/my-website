// Utility function to toggle dark mode styles
function toggleDarkModeStyles() {
  const root = document.documentElement
  const logo = document.getElementById('logo')

  // Toggle CSS variables
  const styleProperties = [
    ['--light-color', '--dark-color'],
    ['--accent-color', '--dark-accent'],
    ['--accent-opaque', '--dark-accent-opaque'],
    ['--sublight-color', '--subdark-color'],
    ['--light-logo', '--dark-logo'],
  ]

  styleProperties.forEach(([lightProp, darkProp]) => {
    const lightModeValue = getComputedStyle(root).getPropertyValue(lightProp)
    const darkModeValue = getComputedStyle(root).getPropertyValue(darkProp)
    root.style.setProperty(lightProp, darkModeValue)
    root.style.setProperty(darkProp, lightModeValue)
  })

  // Check current src and toggle
  const isLightLogo = logo.src.includes('JamLog.png')
  console.log('Current logo:', logo.src)
  console.log('Is light logo?', isLightLogo)

  if (isLightLogo) {
    logo.src = '/images/JamLogDark.png'
  } else {
    logo.src = '/images/JamLog.png'
  }

  console.log('New logo src:', logo.src)
}

// Primary function to handle DOMContentLoaded
function initializePage() {
  document
    .getElementById('logo')
    .addEventListener('click', toggleDarkModeStyles)

  // // Image zoom functionality
  // document.querySelectorAll('.polaroid img').forEach(image => {
  //   image.addEventListener('click', function () {
  //     this.classList.toggle('zoomed')
  //     this.style.transform = this.classList.contains('zoomed') ? 'scale(2)' : ''
  //   })
  // })

  // Scroll to top functionality
  document.getElementById('scroll-button').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  // // Form submission handling
  // document
  //   .getElementById('contact-form')
  //   .addEventListener('submit', async event => {
  //     event.preventDefault()
  //     const form = event.target
  //     const formData = new FormData(form)
  //     const honeypot = formData.get('honeypot')
  //     const status = document.getElementById('form-status')

  //     if (honeypot) {
  //       status.textContent = 'Form submission failed.'
  //       return
  //     }

  //     // Basic email validation
  //     const email = formData.get('email')
  //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  //     if (!emailRegex.test(email)) {
  //       status.textContent = 'Please enter a valid email address.'
  //       return
  //     }

  //     // Check if reCAPTCHA is filled
  //     const recaptchaResponse = grecaptcha.getResponse()
  //     if (!recaptchaResponse) {
  //       status.textContent = 'Please complete the reCAPTCHA.'
  //       return
  //     }

  //     // Simulate form submission delay
  //     status.textContent = 'Submitting...'
  //     await new Promise(resolve => setTimeout(resolve, 1000))

  //     try {
  //       const response = await fetch(form.action, {
  //         method: form.method,
  //         body: formData,
  //         headers: {
  //           Accept: 'application/json',
  //         },
  //       })

  //       if (response.ok) {
  //         status.textContent = 'Thank you for your submission!'
  //         form.reset()
  //         grecaptcha.reset()
  //       } else {
  //         throw new Error('Form submission failed')
  //       }
  //     } catch (error) {
  //       console.error('Submission error:', error)
  //       status.textContent = 'Oops! There was a problem submitting your form'
  //     }
  //   })

  // Form submission handling
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form')
    const submitButton = document.getElementById('submit-button')
    const buttonText = submitButton.querySelector('.button-text')
    const spinner = submitButton.querySelector('.spinner')
    const statusMessage = document.getElementById('status-message')

    const validateEmail = email => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }

    const validatePhone = phone => {
      const re = /^\d{10,15}$/
      return re.test(phone)
    }

    const showStatus = (type, message) => {
      statusMessage.textContent = message
      statusMessage.className = 'status-message ' + type
    }

    const setLoadingState = isLoading => {
      submitButton.disabled = isLoading
      buttonText.textContent = isLoading ? 'Sending...' : 'Send Message'
      spinner.classList.toggle('hidden', !isLoading)
    }

    const validateForm = () => {
      const email = form.querySelector('#email').value
      const phone = form.querySelector('#phone').value

      if (!validateEmail(email)) {
        showStatus('error', 'Please enter a valid email address')
        return false
      }

      if (!validatePhone(phone)) {
        showStatus('error', 'Please enter a valid phone number (10-15 digits)')
        return false
      }

      return true
    }

    form.addEventListener('submit', async event => {
      event.preventDefault()

      // Check honeypot
      const honeypot = form.querySelector('#honeypot').value
      if (honeypot) {
        return
      }

      if (!validateForm()) {
        return
      }

      setLoadingState(true)
      showStatus('loading', 'Sending your message...')

      try {
        const formData = new FormData(form)
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        })

        if (response.ok) {
          showStatus(
            'success',
            'Thank you! Your message has been sent successfully.'
          )
          form.reset()
        } else {
          throw new Error('Form submission failed')
        }
      } catch (error) {
        console.error('Submission error:', error)
        showStatus(
          'error',
          'Sorry, there was an error sending your message. Please try again.'
        )
      } finally {
        setLoadingState(false)
      }
    })

    // Clear status message when user starts typing again
    form.addEventListener('input', () => {
      statusMessage.className = 'status-message hidden'
    })
  })

  // document.getElementById('my-form').addEventListener('submit', async event => {
  //   event.preventDefault()
  //   const status = document.getElementById('my-form-status')
  //   const data = new FormData(event.target)

  //   try {
  //     const response = await fetch(event.target.action, {
  //       method: 'POST',
  //       body: data,
  //       headers: {
  //         Accept: 'application/json',
  //       },
  //     })

  //     if (response.ok) {
  //       status.textContent = 'Thanks for your submission!'
  //       event.target.reset()
  //     } else {
  //       throw new Error('Form submission failed')
  //     }
  //   } catch (error) {
  //     status.textContent = 'Oops! There was a problem submitting your form'
  //   }
  // })

  // Enhanced Intersection Observer configuration
  const observerOptions = {
    root: null,
    threshold: 0.2,
    rootMargin: '-50px',
  }

  // Refined observer callback with staggered animations
  const observerCallback = (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay for smoother appearance
        setTimeout(() => {
          entry.target.classList.add('show')
        }, index * 150)

        observer.unobserve(entry.target)
      }
    })
  }

  // Initialize observer
  const observer = new IntersectionObserver(observerCallback, observerOptions)

  // Observe all polaroid elements
  document.querySelectorAll('.polaroid-hidden').forEach(el => {
    observer.observe(el)
  })

  // Enhanced image interaction with zoom functionality
  document.querySelectorAll('.polaroid-hidden img').forEach(image => {
    let isZoomed = false

    image.addEventListener('click', function () {
      const wrapper = this.closest('.polaroid-hidden')
      isZoomed = !isZoomed

      if (isZoomed) {
        this.style.transform = 'scale(1.8)'
        this.classList.add('zoomed')
        wrapper.style.zIndex = '100'
      } else {
        this.style.transform = 'none'
        this.classList.remove('zoomed')
        wrapper.style.zIndex = '1'
      }
    })

    // Reset zoom on mouse leave
    image
      .closest('.polaroid-hidden')
      .addEventListener('mouseleave', function () {
        if (isZoomed) {
          isZoomed = false
          image.style.transform = 'none'
          image.classList.remove('zoomed')
          this.style.zIndex = '1'
        }
      })
  })

  // Dynamic z-index management for hover states
  document.querySelectorAll('.polaroid-wrapper').forEach(wrapper => {
    const cards = wrapper.querySelectorAll('.polaroid-hidden')

    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        cards.forEach(otherCard => {
          if (otherCard !== card) {
            otherCard.style.zIndex = '1'
          }
        })
        card.style.zIndex = '5'
      })
    })
  })

  // Load external badge script
  const badgeScript = document.createElement('script')
  badgeScript.src = '//cdn.credly.com/assets/utilities/embed.js'
  badgeScript.onload = () => {
    document.querySelector('#badge-container img')
    if (imgElement) imgElement.style.display = 'none'
  }
  document.head.appendChild(badgeScript)
}

document.addEventListener('DOMContentLoaded', initializePage)
