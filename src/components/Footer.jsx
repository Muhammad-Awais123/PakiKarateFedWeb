import React from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebookF, FaTiktok, FaMapMarkerAlt } from "react-icons/fa";
import { RiShieldStarLine } from "react-icons/ri";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 bg-gradient-to-b from-[#021f02] via-[#053905] to-[#008000] text-white overflow-hidden">
      
      {/* ICY GLASS OVERLAY (Animated Glows) */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,255,102,0.1),transparent)] pointer-events-none"
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-10">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">

          {/* Logo / Brand Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
                <RiShieldStarLine size={24} className="text-green-400" />
              </div>
              <span className="font-black uppercase tracking-tighter text-xl">
                PKF <span className="text-green-400 italic">Official</span>
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed font-medium">
              The premier governing body of Karate in Pakistan. Forging champions with discipline, honor, and national pride since 1965.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-400 mb-6 underline decoration-green-400/30 underline-offset-8">Navigation</h3>
            <ul className="space-y-3 text-white/80 text-xs font-bold uppercase tracking-widest">
              <li><a href="#events" className="hover:text-green-400 transition-all hover:translate-x-1 inline-block">Championships</a></li>
              <li><a href="#rankings" className="hover:text-green-400 transition-all hover:translate-x-1 inline-block">Global Rankings</a></li>
              <li><a href="#faq" className="hover:text-green-400 transition-all hover:translate-x-1 inline-block">Knowledge Base</a></li>
              <li><a href="#contact-us" className="hover:text-green-400 transition-all hover:translate-x-1 inline-block">Support Portal</a></li>
            </ul>
          </div>

          {/* Social Glass Tiles */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-400 mb-6 underline decoration-green-400/30 underline-offset-8">Digital Presence</h3>
            <div className="flex gap-3">
              {[
                { icon: <FaInstagram />, link: "https://www.instagram.com/pakistan_karate_federation" },
                { icon: <FaFacebookF />, link: "https://www.facebook.com/share/18RLt3uLrp/" },
                { icon: <FaTiktok />, link: "https://www.tiktok.com/@pakistan_karate_f" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.2)" }}
                  href={social.link}
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-sm text-white transition-all duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* HQ Location Block */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-400 mb-6 underline decoration-green-400/30 underline-offset-8">Headquarters</h3>
            <div className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm group hover:border-green-400/40 transition-colors">
              <FaMapMarkerAlt className="mt-1 text-green-400 group-hover:scale-110 transition-transform" size={16} />
              <p className="text-white/70 text-[11px] leading-relaxed font-bold uppercase tracking-tighter">
                Olympic House 2, Hameed Nizami, Temple Rd, Lahore, 54000
              </p>
            </div>
          </div>

        </div>

        {/* Minimal Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">
            © {year} Pakistan Karate Federation <span className="mx-2 opacity-20">|</span> Heritage & Power
          </div>
          
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40">
            <span>Architected by</span>
            <a
              href="https://awaisweb.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-green-400 transition-colors border-b border-green-400/50"
            >
              Muhammad Awais
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;