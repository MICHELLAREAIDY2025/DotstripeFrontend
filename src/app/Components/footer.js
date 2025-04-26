import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#031626] text-white py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-6 text-center">
        {/* Contact Hours */}
        <p className="text-lg font-semibold">Monday to Saturday 9 AM - 9 PM GMT</p>

        {/* Social Icons */}
        <div className="flex gap-6">
          <a href="https://wa.me/9613734990" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="text-3xl hover:text-green-500 transition" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-3xl hover:text-pink-500 transition" />
          </a>
          <a href="mailto:info@dot-stripe.com">
            <FaEnvelope className="text-3xl hover:text-blue-400 transition" />
          </a>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-700 my-4"></div>

        {/* Footer Bottom */}
        <div className="text-sm space-y-2">
          <p>© 2025 Dot Stripe. All rights reserved.</p>
          <p>Beirut, Lebanon | 75008 Paris, France</p>
          <p>Contact: Info@Dot-Stripe.Com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
