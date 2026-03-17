// import React from "react";
// import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-white py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        
//         {/* Developer Credit */}
//         <div className="mb-4 md:mb-0 text-center md:text-left">
//           <p>
//             Developed by{" "}
//             <a
//               href="https://awaisweb.vercel.app"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-[#008000] font-semibold hover:underline"
//             >
//               Muhamad Awais
//             </a>
//           </p>
//         </div>

//         {/* Social Media Links */}
//         <div className="flex gap-4 text-lg">
//           <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#008000] transition">
//             <FaFacebookF />
//           </a>
//           <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#008000] transition">
//             <FaTwitter />
//           </a>
//           <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#008000] transition">
//             <FaInstagram />
//           </a>
//           <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#008000] transition">
//             <FaLinkedinIn />
//           </a>
//           <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#008000] transition">
//             <FaGithub />
//           </a>
//         </div>
//       </div>

//       {/* Bottom Text */}
//       <div className="mt-6 text-center text-gray-400 text-sm">
//         &copy; {new Date().getFullYear()} Pakistan Karate Federation. All rights reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from "react";
import { motion } from "motion/react";
import { FaInstagram, FaFacebookF, FaTiktok, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-8 bg-gradient-to-b from-[#021f02] via-[#053905] to-[#008000] text-white overflow-hidden">

      {/* Animated background blobs */}
      <motion.div
        animate={{ x: [0, 50, -50, 0], y: [0, -40, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-96 h-96 bg-[#00ff66]/10 rounded-full blur-3xl -top-20 -left-20"
      />

      <motion.div
        animate={{ x: [0, -60, 60, 0], y: [0, 40, -40, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute w-[500px] h-[500px] bg-[#00ff88]/10 rounded-full blur-3xl bottom-0 right-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* Top Section */}
        <div className="grid md:grid-cols-4 gap-10">

          {/* Logo / About */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white">Pakistan Karate Federation</h2>
            <p className="text-white/80 text-sm">
              Experience the power, discipline, and thrill of Pakistan’s premier martial arts championships.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li><a href="#events" className="hover:text-[#00ff66] transition-colors">Events</a></li>
              <li><a href="#registration" className="hover:text-[#00ff66] transition-colors">Register</a></li>
              <li><a href="#rankings" className="hover:text-[#00ff66] transition-colors">Rankings</a></li>
              <li><a href="#contact" className="hover:text-[#00ff66] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="https://www.instagram.com/pakistan_karate_federation?igsh=MWtjb25tN2x2c3M0bA=="
                target="_blank" rel="noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition"
              >
                <FaInstagram className="text-[#fff]" size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="https://www.facebook.com/share/18RLt3uLrp/?mibextid=wwXIfr"
                target="_blank" rel="noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition"
              >
                <FaFacebookF className="text-[#fff]" size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="https://www.tiktok.com/@pakistan_karate_f?_r=1&_t=ZS-94dN3BPuDg2"
                target="_blank" rel="noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition"
              >
                <FaTiktok className="text-[#fff]" size={20} />
              </motion.a>
            </div>
          </div>

          {/* Office Location */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Our Office</h3>
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="mt-1 text-[#00ff66]" size={18} />
              <p className="text-white/80 text-sm">
                Olympic House 2, Hameed Nizami, Temple Rd, Mozang Chungi, Lahore, 54000
              </p>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-white/20 pt-6 flex flex-col sm:flex-row justify-between items-center text-white/70 text-sm">
          <span>&copy; {year} Pakistan Karate Federation. All rights reserved.</span>
          <span>
            Developed &amp; Designed by{" "}
            <a
              href="https://awaisweb.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="text-[#00ff66] hover:underline transition"
            >
              Muhammad Awais
            </a>
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;