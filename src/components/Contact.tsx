// src/components/Contact.tsx
// import React, { useState } from 'react'
//
// const Contact: React.FC = () => {
//   const [status, setStatus] = useState<string>('')
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: '',
//   })
//
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target
//     setFormData(prevData => ({ ...prevData, [name]: value }))
//   }
//
//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault()
//     const form = event.currentTarget
//     const data = new FormData(form)
//
//     try {
//       const response = await fetch(form.action, {
//         method: 'POST',
//         body: data,
//         headers: {
//           Accept: 'application/json',
//         },
//       })
//
//       if (response.ok) {
//         setStatus('Thanks for your submission!')
//         setFormData({ name: '', email: '', message: '' })
//       } else {
//         throw new Error('Form submission failed')
//       }
//     } catch (error) {
//       setStatus('Oops! There was a problem submitting your form')
//     }
//   }
//
//   return (
//     <section>
//       <h2>Contact</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="name">Name:</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="message">Message:</label>
//           <textarea
//             id="message"
//             name="message"
//             value={formData.message}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button type="submit">Send</button>
//       </form>
//       <div id="my-form-status">{status}</div>
//     </section>
//   )
// }
//
// export default Contact

// src/components/Contact.tsx
import React, { useState } from 'react'

const Contact: React.FC = () => {
  const [status, setStatus] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: {
          Accept: 'application/json',
        },
      })

      if (response.ok) {
        setStatus('Thanks for your submission!')
        setFormData({ name: '', email: '', message: '' })
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      setStatus('Oops! There was a problem submitting your form')
    }
  }

  return (
    <section>
      <h2>Contact</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Send</button>
      </form>
      <div id="my-form-status">{status}</div>
    </section>
  )
}

export default Contact
