import { useEffect, useState } from "react";

const Footer = () => {
  const [tokex, settokex] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      settokex(token);
    }
  }, []);
  return (
    <>
      <footer className="bg-gray-900 text-white py-10 w-[99vw] mx-auto absolute left-0 ">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            {/* Column 1: Logo and Description */}
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-4">Vidya Nidhi Schools</h2>
              <p className="text-gray-400">
                Our mission is to nurture students with the values, knowledge,
                and skills needed for holistic development. Join us on a journey
                to learning excellence.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-yellow-500">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-yellow-500">
                    Admissions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-yellow-500">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-yellow-500">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Information */}
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">
                  123 Vidya Nidhi Road, City, Country
                </li>
                <li className="text-gray-400">Email: info@vidyanidhi.com</li>
                <li className="text-gray-400">Phone: +123-456-7890</li>
              </ul>
              {/* Social Media Icons */}
              <div className="flex justify-center items-center mt-4 space-x-4">
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  <i className="fab fa-facebook fa-lg"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  <i className="fab fa-twitter fa-lg"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  <i className="fab fa-instagram fa-lg"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  <i className="fab fa-linkedin fa-lg"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; 2024 Vidya Nidhi Schools. All Rights Reserved.</p>
            <p className="text-sm mt-2">
              <a href="#" className="hover:text-yellow-500">
                Privacy Policy
              </a>{" "}
              |{" "}
              <a href="#" className="hover:text-yellow-500">
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
