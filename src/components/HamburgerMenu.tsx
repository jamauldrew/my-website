// src/components/HamburgerMenu.tsx
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [foldDownOpen, setFoldDownOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const toggleFoldDown = (event: React.MouseEvent) => {
    event.preventDefault()
    setFoldDownOpen(!foldDownOpen)
  }

  const handleSectionClick = () => {
    setIsOpen(false)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as Element).classList.contains('hamburger-button')
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    const root = document.documentElement
    const styleProperties = [
      ['--light-color', '--dark-color'],
      ['--accent-color', '--dark-accent'],
      ['--accent-opaque', '--dark-accent-opaque'],
      ['--sublight-color', '--subdark-color'],
    ]

    styleProperties.forEach(([lightProp, darkProp]) => {
      const lightModeValue = getComputedStyle(root).getPropertyValue(lightProp)
      const darkModeValue = getComputedStyle(root).getPropertyValue(darkProp)
      root.style.setProperty(
        lightProp,
        isDarkMode ? darkModeValue : lightModeValue
      )
      root.style.setProperty(
        darkProp,
        isDarkMode ? lightModeValue : darkModeValue
      )
    })
  }, [isDarkMode])

  return (
    <div className="hamburger-menu" ref={menuRef}>
      <div className="hamburger-container">
        <button
          className="hamburger-button"
          aria-label="menu"
          onClick={toggleMenu}
        >
          ☰
        </button>
        <nav id="nav-menu" className={isOpen ? 'nav-shown' : 'nav-hidden'}>
          <button className="close-button" onClick={toggleMenu}>
            ✕
          </button>
          <ul>
            <li>
              <Link
                className="bold-selection"
                to="/"
                onClick={handleSectionClick}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                className="bold-selection"
                to="/services"
                onClick={handleSectionClick}
              >
                Services
              </Link>
            </li>
            <li className="fold-down-menu">
              <a className="bold-selection" href="#" onClick={toggleFoldDown}>
                Explore <span className="toggle">&#9662;</span>
              </a>
              <div
                className={`fold-down-content ${foldDownOpen ? 'shown' : ''}`}
              >
                <Link
                  className="bold-href"
                  to="/ndt-traceability"
                  onClick={handleSectionClick}
                >
                  NDT Traceability
                </Link>
                <Link
                  className="bold-href"
                  to="/fluid-system-design"
                  onClick={handleSectionClick}
                >
                  Fluid System Design
                </Link>
                <Link
                  className="bold-href"
                  to="/structural-steel"
                  onClick={handleSectionClick}
                >
                  Structural Steel Design
                </Link>
                <Link
                  className="bold-href"
                  to="/process-piping"
                  onClick={handleSectionClick}
                >
                  Process Piping Design
                </Link>
                <Link
                  className="bold-href"
                  to="/qa-qc"
                  onClick={handleSectionClick}
                >
                  Quality Assurance/Quality Control (QA/QC)
                </Link>
                <Link
                  className="bold-href"
                  to="/cad"
                  onClick={handleSectionClick}
                >
                  Computer-Aided Design (CAD)
                </Link>
              </div>
            </li>
            <li>
              <Link
                className="bold-selection"
                to="/contact"
                onClick={handleSectionClick}
              >
                Contact
              </Link>
            </li>
            <li>
              <button onClick={toggleDarkMode}>
                Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <h1 id="nav-title">
        <Link to="/" onClick={handleSectionClick}>
          Jamaul Drew, LLC
        </Link>
      </h1>
      <div className="logo-container">
        <img className="company-logo" src="./JM_Logo.svg" alt="Company Logo" />
      </div>
    </div>
  )
}

export default HamburgerMenu
