/* src/components/About.tsx */
import React, { useEffect } from 'react'

/* interface AboutProps {
 *   isActive: boolean
 * } */

const About: React.FC = () => {
  useEffect(() => {
    const badgeScript = document.createElement('script')
    badgeScript.src = '//cdn.credly.com/assets/utilities/embed.js'
    badgeScript.onload = () => {
      const imgElement = document.querySelector(
        '#badge-container img'
      ) as HTMLImageElement | null
      if (imgElement) {
        imgElement.style.display = 'none'
      }
    }
    document.head.appendChild(badgeScript)
    return () => {
      document.head.removeChild(badgeScript)
    }
  }, [])
  return (
    <div id="about" className="card">
      <div className="gold-banner"></div>
      <link rel="icon" type="image/svg+xml" href="/JM_Logo.svg" />
      <div className="badge-container">
        <a
          href="https://www.credly.com/badges/21b672c8-6319-4264-bc56-27579d99ece8/public_url"
          target="_blank"
        >
          <img
            src="./images/autodesk-certified-professional-in-autocad-for-design-and-drafting.png"
            alt="Autodesk Certification Badge"
          />
        </a>
        <div
          className="credly-badge"
          data-share-badge-id="21b672c8-6319-4264-bc56-27579d99ece8"
          data-share-badge-host="https://www.credly.com"
        >
          <script
            type="text/javascript"
            async
            src="//cdn.credly.com/assets/utilities/embed.js"
          ></script>
          <noscript>
            <img
              id="fallback-image"
              src="https://www.credly.com/badges/da41bbf4-44bd-4709-bdf0-1419cb1added/public_url"
              alt="Badge"
              style={{ display: 'block' }}
            />
          </noscript>
        </div>
      </div>
      <div className="about-section">
        <ul className="about-list">
          <li>
            Specialized Fluid System Engineering for Oil and Gas Production
          </li>
          <li>Advanced CAD Services for Pipeline and Process Engineering</li>
          <li>Innovative Solutions for the Permian Basin</li>
          <li>Compliance with Industry Standards and Safety Regulations</li>
        </ul>
        <p className="about-text">
          I provide top-tier engineering and CAD services tailored to the unique
          needs of the oil and gas industry in the Permian Basin. Using
          cutting-edge technology and leveraging my extensive experience, I
          offer precision engineering support for a wide range of projects, from
          well pad designs to complex processing facilities.
        </p>
      </div>
      <h3 className="subtitle">Our Expertise:</h3>
      <ul className="technical-list">
        <li>
          <h3>Fluid System Engineering</h3>
          <ul>
            <li>Design and Optimization of Production Facilities</li>
            <li>Simulation and Refinement of Fluid Systems</li>
            <li>Gate Stations (Metering & Regulating)</li>
            <li>District Regulator Stations</li>
            <li>Large Volume Meter Sets</li>
            <li>Liquefied Natural Gas (LNG) Systems</li>
          </ul>
        </li>
        <li>
          <h3>Computer-Aided Design (CAD)</h3>
          <ul>
            <li>Advanced 3D Modeling for Oil and Gas Facilities</li>
            <li>Integration of CAD with Fluid Dynamics Simulations</li>
            <li>Isometric Drawings for Fabrication</li>
            <li>Detailed Piping Plans and Section Views</li>
            <li>Process Flow Diagrams (PFD)</li>
            <li>Piping & Instrumentation Diagrams (P&ID)</li>
          </ul>
        </li>
        <li>
          <h3>Engineering Programming</h3>
          <ul>
            <li>Custom Scripts for CAD and CFD Integration</li>
            <li>Automation of Repetitive Design Tasks</li>
            <li>Python and C++ Solutions for Engineering Applications</li>
            <li>Technical Website Design for Engineering Services</li>
          </ul>
        </li>
        <li>
          <h3>Quality and Safety Assurance</h3>
          <ul>
            <li>Compliance with US DOT 49 CFR Part 192 and 193</li>
            <li>Adherence to NFPA 59A Standards</li>
            <li>Implementation of Safety-First Engineering Practices</li>
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default About
