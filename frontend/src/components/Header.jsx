import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../assets/logo.png";
import ThemeToggle from "./ThemeToggle";
import { ThemeContext } from "../store/ThemeContext";
import { useViewport } from "../utils/responsive";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem("token");
  const { theme } = useContext(ThemeContext);
  const { isMobile } = useViewport();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(!!token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryTime");
    setIsLoggedIn(false);
    toast.error("Logged out Successfully");
    navigate("/login");
  };

  // Function to close mobile menu when a link is clicked
  const handleLinkClick = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className={`fixed w-full top-0 left-0 z-30 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'} shadow-md`}>
        <nav
          aria-label="Global"
          className={`flex justify-between items-center py-2 md:py-4 lg:py-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'} px-4 md:px-6 lg:px-10`}
        >
          <div className="flex items-center">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Vidya Nidhi Schools</span>
              <img
                alt="logo"
                src={Logo}
                className="w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] lg:w-[100px] lg:h-[100px]"
              />
            </Link>
          </div>

          {/* Theme Toggle and Mobile menu button */}
          <div className="flex items-center space-x-4 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`inline-flex items-center justify-center rounded-md p-2 ${theme === 'light' ? 'text-gray-700' : 'text-white'}`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex lg:gap-x-6 lg:gap-y-0 lg:items-center">
            <Link
              to="/"
              className={`text-sm md:text-base lg:text-lg font-semibold leading-6 ${
                location.pathname === "/" 
                  ? "text-blue-500" 
                  : theme === 'light' ? "text-gray-900" : "text-white"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about-us"
              className={`text-sm md:text-base lg:text-lg font-semibold leading-6 ${
                location.pathname === "/about-us"
                  ? "text-blue-500"
                  : theme === 'light' ? "text-gray-900" : "text-white"
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact-us"
              className={`text-sm md:text-base lg:text-lg font-semibold leading-6 ${
                location.pathname === "/contact-us"
                  ? "text-blue-500"
                  : theme === 'light' ? "text-gray-900" : "text-white"
              }`}
            >
              Contact Us
            </Link>
            <Link
              to="/fee-submission"
              className={`text-sm md:text-base lg:text-lg font-semibold leading-6 ${
                location.pathname === "/fee-submission"
                  ? "text-blue-500"
                  : theme === 'light' ? "text-gray-900" : "text-white"
              }`}
            >
              Fee Submission
            </Link>
            <Link
              to="/admission-enquiry"
              className={`text-sm md:text-base lg:text-lg font-semibold leading-6 ${
                location.pathname === "/admission-enquiry"
                  ? "text-blue-500"
                  : theme === 'light' ? "text-gray-900" : "text-white"
              }`}
            >
              Admission Enquiry
            </Link>
            <ThemeToggle />
          </div>

          {/* Login / Logout Button - Desktop */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-md lg:text-lg font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Logout <span aria-hidden="true">&rarr;</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="text-md lg:text-lg font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu Dialog */}
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className={`fixed inset-y-0 right-0 z-50 w-full overflow-y-auto ${theme === 'light' ? 'bg-white' : 'bg-gray-900'} px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10`}>
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5" onClick={handleLinkClick}>
                <span className="sr-only">Vidya Nidhi Schools</span>
                <img alt="logo" src={Logo} className="w-[50px] h-[50px]" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className={`-m-2.5 rounded-md p-2.5 ${theme === 'light' ? 'text-gray-700' : 'text-white'}`}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Link
                    to="/"
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                      location.pathname === "/"
                        ? "text-blue-500"
                        : theme === 'light' ? "text-gray-900" : "text-white"
                    } hover:bg-gray-50 dark:hover:bg-gray-800`}
                    onClick={handleLinkClick}
                  >
                    Home
                  </Link>
                  <Link
                    to="/about-us"
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                      location.pathname === "/about-us"
                        ? "text-blue-500"
                        : theme === 'light' ? "text-gray-900" : "text-white"
                    } hover:bg-gray-50 dark:hover:bg-gray-800`}
                    onClick={handleLinkClick}
                  >
                    About Us
                  </Link>
                  <Link
                    to="/contact-us"
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                      location.pathname === "/contact-us"
                        ? "text-blue-500"
                        : theme === 'light' ? "text-gray-900" : "text-white"
                    } hover:bg-gray-50 dark:hover:bg-gray-800`}
                    onClick={handleLinkClick}
                  >
                    Contact Us
                  </Link>
                  <Link
                    to="/fee-submission"
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                      location.pathname === "/fee-submission"
                        ? "text-blue-500"
                        : theme === 'light' ? "text-gray-900" : "text-white"
                    } hover:bg-gray-50 dark:hover:bg-gray-800`}
                    onClick={handleLinkClick}
                  >
                    Fee Submission
                  </Link>
                  <Link
                    to="/admission-enquiry"
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                      location.pathname === "/admission-enquiry"
                        ? "text-blue-500"
                        : theme === 'light' ? "text-gray-900" : "text-white"
                    } hover:bg-gray-50 dark:hover:bg-gray-800`}
                    onClick={handleLinkClick}
                  >
                    Admission Enquiry
                  </Link>
                </div>
                <div className="py-6">
                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        handleLinkClick();
                      }}
                      className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 ${theme === 'light' ? 'text-gray-900 hover:bg-gray-50' : 'text-white hover:bg-gray-800'}`}
                    >
                      Log Out
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 ${theme === 'light' ? 'text-gray-900 hover:bg-gray-50' : 'text-white hover:bg-gray-800'}`}
                      onClick={handleLinkClick}
                    >
                      Log In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
      {/* Spacer to account for fixed header height */}
      <div className="h-[60px] sm:h-[80px] lg:h-[120px]"></div>
    </>
  );
}

export default Header;
