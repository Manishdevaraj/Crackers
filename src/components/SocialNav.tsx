//@ts-nocheck
// SocialNavBar.tsx
import { FaYoutube, FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";

const SocialNavBar = () => {
  return (
    <div className="w-full bg-purple-100 py-4 px-6 flex flex-wrap justify-center gap-4">
      <SocialButton
        icon={<FaYoutube className="text-red-600" />}
        label="YouTube"
        href="https://youtube.com"
      />
      <SocialButton
        icon={<BsWhatsapp className="text-green-500" />}
        label="+91 80568 19191"
        href="https://wa.me/918056819191"
      />
      <SocialButton
        icon={<FaFacebookF className="text-blue-600" />}
        label="Facebook"
        href="https://facebook.com"
      />
      <SocialButton
        icon={<FaInstagram className="text-pink-600" />}
        label="Instagram"
        href="https://instagram.com"
      />
      <SocialButton
        icon={<FaTwitter className="text-sky-500" />}
        label="Twitter"
        href="https://twitter.com"
      />
    </div>
  );
};

const SocialButton = ({ icon, label, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-white rounded-full shadow px-4 py-2 hover:scale-105 transition-transform"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
};

export default SocialNavBar;
