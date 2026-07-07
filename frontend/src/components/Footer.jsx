import {
  FaLinkedinIn,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaFacebookF,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-600 border-t">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h1 className="text-3xl font-bold text-black tracking-tight">
            Foodyy
          </h1>

          <div className="flex gap-4">
            <button className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm">
              🇮🇳 India
            </button>
            <button className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm">
              🌐 English
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mt-14 text-sm">
          {/* About */}
          <div>
            <h4 className="text-black font-semibold tracking-widest mb-4">
              ABOUT FOODY
            </h4>
            <ul className="space-y-2">
              <li>Who We Are</li>
              <li>Blog</li>
              <li>Work With Us</li>
              <li>Investor Relations</li>
              <li>Report Fraud</li>
              <li>Press Kit</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* Zomaverse */}
          <div>
            <h4 className="text-black font-semibold tracking-widest mb-4">
              FOODYY
            </h4>
            <ul className="space-y-2">
              <li>Foodyy</li>
              <li>Blinkit</li>
              <li>District</li>
              <li>Feeding India</li>
              <li>Hyperpure</li>
              <li>Foodyy Live</li>
              <li>Zomaland</li>
              <li>Weather Union</li>
            </ul>
          </div>

          {/* Restaurants */}
          <div>
            <h4 className="text-black font-semibold tracking-widest mb-4">
              FOR RESTAURANTS
            </h4>
            <ul className="space-y-2">
              <li>Partner With Us</li>
              <li>Apps For You</li>
            </ul>
          </div>

          {/* Learn More */}
          <div>
            <h4 className="text-black font-semibold tracking-widest mb-4">
              LEARN MORE
            </h4>
            <ul className="space-y-2">
              <li>Privacy</li>
              <li>Security</li>
              <li>Terms</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-black font-semibold tracking-widest mb-4">
              SOCIAL LINKS
            </h4>

            <div className="flex gap-3 mb-6 text-lg">
              <FaLinkedinIn />
              <FaInstagram />
              <FaTwitter />
              <FaYoutube />
              <FaFacebookF />
            </div>

            <div className="space-y-3">
              <img
                src="https://b.zmtcdn.com/data/o2_assets/df5d5c81bb1d54c3c54f22e36b85cfa71659434160.png"
                alt="App Store"
                className="w-40"
              />
              <img
                src="https://b.zmtcdn.com/data/o2_assets/1c5a2f7c94a2f8d8a98f35f5c90fca6c1659433980.png"
                alt="Play Store"
                className="w-40"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-10" />

        {/* Bottom text */}
        <p className="text-xs text-gray-500 leading-relaxed">
          By continuing past this page, you agree to our Terms of Service,
          Cookie Policy, Privacy Policy and Content Policies. All trademarks are
          properties of their respective owners.
          <br />© 2010–2026 Foodyy Ltd. All rights reserved.
        </p>
      </div>
      <div className="flex items-center justify-center">
        <img src="/Landing%20Page%20Gif.gif" alt="Landing page animation" />
      </div>
    </footer>
  );
};

export default Footer;
