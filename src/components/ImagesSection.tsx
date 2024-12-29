// src/components/ImagesSection.tsx
import React, { useState } from 'react'

type Section =
  | 'ndtTraceability'
  | 'processPiping'
  | 'structuralSteel'
  | 'pAndId'
  | 'qaQc'
  | 'isometrics'

const ImagesSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState({
    ndtTraceability: false,
    processPiping: false,
    structuralSteel: false,
    pAndId: false,
    qaQc: false,
    isometrics: false,
  })

  const [zoomedImages, setZoomedImages] = useState<{ [key: string]: boolean }>(
    {}
  )

  const toggleSection = (section: Section) => {
    setIsOpen(prevState => ({
      ...prevState,
      [section]: !prevState[section],
    }))
  }

  const toggleZoom = (imageId: string) => {
    setZoomedImages(prev => ({
      ...prev,
      [imageId]: !prev[imageId],
    }))
  }

  return (
    <>
      <section
        id="ndt-traceability"
        className={isOpen.ndtTraceability ? '' : 'hidden'}
      >
        <div className="card" onClick={() => toggleSection('ndtTraceability')}>
          <span className="subtitle">NDT Traceability</span>
          <div className="gold-banner"></div>
          <p className="lightGrey"></p>
          <div className="polaroid-wrapper">
            <div className="polaroid hidden">
              <p className="title">Isometric Weld Maps</p>
              <img
                src="/images/Page 1.png"
                alt="Isometric Weld Maps"
                onClick={e => {
                  e.stopPropagation()
                  toggleZoom('ndt-1')
                }}
                style={{
                  transform: zoomedImages['ndt-1'] ? 'scale(2)' : 'scale(1)',
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
              />
            </div>
            <div className="polaroid hidden">
              <p className="title">Shop Drawings</p>
              <img
                src="/images/Page 2.png"
                alt="Shop Drawings"
                onClick={e => {
                  e.stopPropagation()
                  toggleZoom('ndt-2')
                }}
                style={{
                  transform: zoomedImages['ndt-2'] ? 'scale(2)' : 'scale(1)',
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="process-piping"
        className={isOpen.processPiping ? '' : 'hidden'}
      >
        <div className="card" onClick={() => toggleSection('processPiping')}>
          <span className="subtitle">Process Piping</span>
          <div className="gold-banner"></div>
          <p className="lightGrey"></p>
          <div className="polaroid-wrapper">
            <div className="polaroid hidden">
              <p className="title">Propane-Air</p>
              <img
                src="/images/process-piping-1.png"
                alt="Propane-Air"
                onClick={e => {
                  e.stopPropagation()
                  toggleZoom('processPiping-1')
                }}
                style={{
                  transform: zoomedImages['processPiping-1']
                    ? 'scale(2)'
                    : 'scale(1)',
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
              />
            </div>
            <div className="polaroid hidden">
              <p className="title">Water Glycol</p>
              <img
                src="/images/piping-sections-isometrics.png"
                alt="Water Glycol"
                onClick={e => {
                  e.stopPropagation()
                  toggleZoom('processPiping-2')
                }}
                style={{
                  transform: zoomedImages['processPiping-2']
                    ? 'scale(2)'
                    : 'scale(1)',
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="structural-steel"
        className={isOpen.structuralSteel ? '' : 'hidden'}
      >
        <div className="card" onClick={() => toggleSection('structuralSteel')}>
          <span className="subtitle">Structural Steel</span>
          <div className="gold-banner"></div>
          <p className="lightGrey"></p>
          <div className="polaroid-wrapper">
            <div className="polaroid hidden">
              <p className="title">Pipe Supports</p>
              <img
                src="/images/structural-steel-pipe-support.png"
                alt="Pipe Supports"
                onClick={e => {
                  e.stopPropagation()
                  toggleZoom('structuralSteel-1')
                }}
                style={{
                  transform: zoomedImages['structuralSteel-1']
                    ? 'scale(2)'
                    : 'scale(1)',
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
              />
            </div>
            <div className="polaroid hidden">
              <p className="title">Pump Skids</p>
              <img
                src="/images/structural-steel-skid.png"
                alt="Pump Skids"
                onClick={e => {
                  e.stopPropagation()
                  toggleZoom('structuralSteel-2')
                }}
                style={{
                  transform: zoomedImages['structuralSteel-2']
                    ? 'scale(2)'
                    : 'scale(1)',
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="p-and-id" className={isOpen.pAndId ? '' : 'hidden'}>
        <div className="card" onClick={() => toggleSection('pAndId')}>
          <span className="subtitle">P&ID/PFD Schematics</span>
          <div className="gold-banner"></div>
          <p className="lightGrey"></p>
          <div className="polaroid-wrapper">
            <div className="polaroid hidden">
              <p className="title">Piping & Instrumentation Diagrams</p>
              <img
                src="/images/pid-1.png"
                alt="Piping & Instrumentation Diagrams"
                onClick={e => {
                  e.stopPropagation()
                  toggleZoom('pAndId-1')
                }}
                style={{
                  transform: zoomedImages['pAndId-1'] ? 'scale(2)' : 'scale(1)',
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
              />
            </div>
            <div className="polaroid hidden">
              <p className="title">Process Flow Diagrams</p>
              <img
                src="/images/pid-2.png"
                alt="Process Flow Diagrams"
                onClick={e => {
                  e.stopPropagation()
                  toggleZoom('pAndId-2')
                }}
                style={{
                  transform: zoomedImages['pAndId-2'] ? 'scale(2)' : 'scale(1)',
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="qa-qc-section" className={isOpen.qaQc ? '' : 'hidden'}>
        <div className="card" onClick={() => toggleSection('qaQc')}>
          <span className="subtitle">QA/QC</span>
          <div className="gold-banner"></div>
          <p className="lightGrey"></p>
          <div className="polaroid-wrapper">
            <div className="polaroid hidden">
              <p className="title">Orthographic Piping Sections</p>
              <img
                src="/images/regulator-run-1.png"
                alt="Orthographic Piping Sections"
                onClick={e => {
                  e.stopPropagation()
                  toggleZoom('qaQc-1')
                }}
                style={{
                  transform: zoomedImages['qaQc-1'] ? 'scale(2)' : 'scale(1)',
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
              />
            </div>
            <div className="polaroid hidden">
              <p className="title">MTR Tracking</p>
              <img
                src="/images/material-test-reports.png"
                alt="MTR Tracking"
                onClick={e => {
                  e.stopPropagation()
                  toggleZoom('qaQc-2')
                }}
                style={{
                  transform: zoomedImages['qaQc-2'] ? 'scale(2)' : 'scale(1)',
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="isometrics-section"
        className={isOpen.isometrics ? '' : 'hidden'}
      >
        <div className="card" onClick={() => toggleSection('isometrics')}>
          <span className="subtitle">Isometrics</span>
          <div className="gold-banner"></div>
          <p className="lightGrey"></p>
          <div className="polaroid-wrapper">
            <div className="polaroid hidden">
              <p className="title">Piping Sections</p>
              <img
                src="/images/isometrics-1.png"
                alt="Piping Sections"
                onClick={e => {
                  e.stopPropagation()
                  toggleZoom('isometrics-1')
                }}
                style={{
                  transform: zoomedImages['isometrics-1']
                    ? 'scale(2)'
                    : 'scale(1)',
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
              />
            </div>
            <div className="polaroid hidden">
              <p className="title">Component Breakdown</p>
              <img
                src="/images/isometrics-2.png"
                alt="Component Breakdown"
                onClick={e => {
                  e.stopPropagation()
                  toggleZoom('isometrics-2')
                }}
                style={{
                  transform: zoomedImages['isometrics-2']
                    ? 'scale(2)'
                    : 'scale(1)',
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ImagesSection
