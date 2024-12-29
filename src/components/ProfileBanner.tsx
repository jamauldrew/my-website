import React from 'react'

const ProfileBanner: React.FC = () => {
  return (
    <div className="profile-banner">
      <div className="profile-image">
        <img
          className="profile-pic"
          src="./images/IMG_2075.jpg"
          alt="Profile Picture"
        />
      </div>
      <div className="profile-text">
        <h2>
          <span className="profile-banner-item">Engineering Excellence</span>
          <span className="profile-banner-item">Oil and Gas Expertise</span>
          <span className="profile-banner-item">Innovative Solutions</span>
        </h2>
        <h3>Empowering the Permian Basin with Advanced Engineering</h3>
      </div>
    </div>
  )
}
export default ProfileBanner
