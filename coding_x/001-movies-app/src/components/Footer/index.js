import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'

import './index.css'

const Footer = () => (
  <div className="footer-container">
    <div className="footer-icons-container">
      <FaGoogle className="icon-element google-icon" />

      <FaTwitter className="icon-element twitter-icon" />
      <FaInstagram className="icon-element instagram-icon" />
      <FaYoutube className="icon-element youtube-icon" />
    </div>
    <p className="contact-us-paragraph">Contact Us</p>
  </div>
)

export default Footer
