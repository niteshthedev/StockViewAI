import React, { useState, useEffect, useRef } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";
import Login from "../pages/Login";

const NavbarMenu = [
  { id: 1, title: "Services", path: "services" },
  { id: 2, title: "About Us", path: "about-us" },
  { id: 3, title: "Contact Us", path: "contact-us" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const menuRef = useRef(null);

  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false); 
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <>
      <nav
        className="sticky top-0 z-50 shadow-sm w-full backdrop-blur-md "
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="container py-5 flex justify-between items-center"
        >
          <div>
            <a href="/">
            <h1 className="font-bold text-2xl">
              Stock<span className="text-secondary font-extrabold">View</span>
              </h1>
              </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex">
            <ul className="flex items-center gap-6">
              {NavbarMenu.map((menu) => (
                <li key={menu.id}>
                  <button
                    onClick={() => handleScroll(menu.path)}
                    className="inline-block py-2 px-3 hover:text-secondary relative group"
                  >
                    <div className="w-2 h-2 bg-secondary absolute mt-4 rounded-full left-1/2 -translate-x-1/2 top-1/2 bottom-0 group-hover:block hidden"></div>
                    {menu.title}
                  </button>
                </li>
              ))}
              <button
                onClick={() => setShowLoginModal(true)}
                className="primary-btn"
              >
                Sign In
              </button>
            </ul>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="hamburger">
              {isOpen ? (
                <IoMdClose className="text-4xl" />
              ) : (
                <IoMdMenu className="text-4xl" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            ref={menuRef}
            className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-6 flex flex-col z-50 mobile-menu"
          >
            <ul className="space-y-4">
              {NavbarMenu.map((menu) => (
                <li key={menu.id}>
                  <button
                    onClick={() => handleScroll(menu.path)}
                    className="block py-2 px-3 hover:text-secondary"
                  >
                    {menu.title}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowLoginModal(true)}
              className="primary-btn mt-6 w-full"
            >
              Sign In
            </button>
          </motion.div>
        )}
      </nav>

      {/* Render Login Modal */}
      {showLoginModal && (
        <Login showModal={showLoginModal} setShowModal={setShowLoginModal} />
      )}
    </>
  );
};

export default Navbar;
