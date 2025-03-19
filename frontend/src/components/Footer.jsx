import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../store/ThemeContext";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const [tokex, settokex] = useState(null);
  const token = localStorage.getItem("token");
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      settokex(token);
    }
  }, []);
  
  return (
    <>
      <footer className={`${theme === 'light' ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'} py-8 md:py-10 w-full`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            {/* Column 1: Logo and Description */}
            <div className="w-full md:w-1/3 mb-6 md:mb-0 px-2">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Vidya Nidhi Schools</h2>
              <p className={`${theme === 'light' ? 'text-gray-300' : 'text-gray-400'} text-sm md:text-base`}>
                Our mission is to nurture students with the values, knowledge,
                and skills needed for holistic development. Join us on a journey
                to learning excellence.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="w-full sm:w-1/2 md:w-1/3 mb-6 md:mb-0 px-2">
              <h3 className="text-lg md:text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about-us" className={`${theme === 'light' ? 'text-gray-300 hover:text-blue-300' : 'text-gray-400 hover:text-yellow-500'} text-sm md:text-base transition-colors duration-200`}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/admission-enquiry" className={`${theme === 'light' ? 'text-gray-300 hover:text-blue-300' : 'text-gray-400 hover:text-yellow-500'} text-sm md:text-base transition-colors duration-200`}>
                    Admissions
                  </Link>
                </li>
                <li>
                  <Link to="/" className={`${theme === 'light' ? 'text-gray-300 hover:text-blue-300' : 'text-gray-400 hover:text-yellow-500'} text-sm md:text-base transition-colors duration-200`}>
                    Courses
                  </Link>
                </li>
                <li>
                  <Link to="/contact-us" className={`${theme === 'light' ? 'text-gray-300 hover:text-blue-300' : 'text-gray-400 hover:text-yellow-500'} text-sm md:text-base transition-colors duration-200`}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Information */}
            <div className="w-full sm:w-1/2 md:w-1/3 mb-6 md:mb-0 px-2">
              <h3 className="text-lg md:text-xl font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className={`${theme === 'light' ? 'text-gray-300' : 'text-gray-400'} text-sm md:text-base flex items-start`}>
                  <MapPin className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>123 Vidya Nidhi Road, City, Country</span>
                </li>
                <li className={`${theme === 'light' ? 'text-gray-300' : 'text-gray-400'} text-sm md:text-base flex items-center`}>
                  <Mail className="mr-2 h-5 w-5 flex-shrink-0" />
                  <span>info@vidyanidhi.com</span>
                </li>
                <li className={`${theme === 'light' ? 'text-gray-300' : 'text-gray-400'} text-sm md:text-base flex items-center`}>
                  <Phone className="mr-2 h-5 w-5 flex-shrink-0" />
                  <span>+123-456-7890</span>
                </li>
              </ul>
              {/* Social Media Icons */}
              <div className="flex items-center mt-4 space-x-4">
                <a href="#" className={`${theme === 'light' ? 'text-gray-300 hover:text-blue-300' : 'text-gray-400 hover:text-yellow-500'} transition-colors`}>
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className={`${theme === 'light' ? 'text-gray-300 hover:text-blue-300' : 'text-gray-400 hover:text-yellow-500'} transition-colors`}>
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className={`${theme === 'light' ? 'text-gray-300 hover:text-blue-300' : 'text-gray-400 hover:text-yellow-500'} transition-colors`}>
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className={`${theme === 'light' ? 'text-gray-300 hover:text-blue-300' : 'text-gray-400 hover:text-yellow-500'} transition-colors`}>
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className={`border-t ${theme === 'light' ? 'border-gray-600' : 'border-gray-700'} mt-6 md:mt-8 pt-4 md:pt-6 text-center ${theme === 'light' ? 'text-gray-300' : 'text-gray-400'}`}>
            <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} Vidya Nidhi Schools. All Rights Reserved.</p>
            <p className="text-xs md:text-sm mt-2">
              <a href="#" className={`${theme === 'light' ? 'hover:text-blue-300' : 'hover:text-yellow-500'} transition-colors`}>
                Privacy Policy
              </a>{" "}
              |{" "}
              <a href="#" className={`${theme === 'light' ? 'hover:text-blue-300' : 'hover:text-yellow-500'} transition-colors`}>
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
