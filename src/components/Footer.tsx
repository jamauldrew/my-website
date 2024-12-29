import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="scroll-container">
        <button
          onClick={() => (window as any).topFunction()}
          id="scroll-button"
          title="Scroll to top"
        >
          Top
        </button>
      </div>
      <p className="footer-text">
        &copy; 2024 Jamaul Drew, LLC. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
