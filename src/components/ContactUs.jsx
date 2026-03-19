import React from 'react';
import Title from './Title';
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import { RiUser3Line, RiMailSendLine, RiChat3Line, RiSendPlane2Fill } from 'react-icons/ri';

const ContactUs = () => {

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("access_key", "29434e4f-7d15-41f7-826b-e58664b70447");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Your message has been delivered!');
        event.target.reset();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <section id='contact-us' className='relative py-24 lg:py-36 bg-[#f8fafc] dark:bg-[#030303] overflow-hidden transition-colors duration-700'>
      
      {/* ICY AMBIENCE - Animated Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className='max-w-4xl mx-auto px-6 relative z-10'>
        
        {/* NEW ELITE TITLE */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4"
          >
            Communication Portal
          </motion.div>
          
          <Title 
            title={
              <span className="text-4xl md:text-6xl font-black text-center uppercase tracking-tighter text-gray-900 dark:text-white leading-none">
                Elite <span className="text-[#008000]">Inquiries</span>
              </span>
            } 
            desc='Connect with the official representatives of Pakistan Karate Federation for memberships, event details, or technical guidance.' 
          />
        </div>

        {/* THE ICY GLASS FORM */}
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "circOut" }}
          viewport={{ once: true }}
          onSubmit={onSubmit}
          className='relative group bg-white/30 dark:bg-white/[0.02] backdrop-blur-2xl p-8 md:p-14 border border-white/20 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none'
        >
          {/* Decorative Horizontal Lines */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#008000]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#008000]/40 to-transparent" />

          <div className="grid sm:grid-cols-2 gap-10">
            
            {/* Field: Name */}
            <div className='relative group'>
              <label className='flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400'>
                <RiUser3Line className="text-[#008000]" /> Full Name
              </label>
              <input 
                name="name" 
                type="text" 
                placeholder='e.g. Muhammad Ali' 
                className='w-full bg-transparent border-b border-gray-200 dark:border-white/10 p-4 text-sm outline-none focus:border-[#008000] transition-all dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-700' 
                required
              />
            </div>

            {/* Field: Email */}
            <div className='relative group'>
              <label className='flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400'>
                <RiMailSendLine className="text-[#008000]" /> Email Address
              </label>
              <input 
                name="email" 
                type="email" 
                placeholder='contact@example.com' 
                className='w-full bg-transparent border-b border-gray-200 dark:border-white/10 p-4 text-sm outline-none focus:border-[#008000] transition-all dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-700' 
                required
              />
            </div>

            {/* Field: Message */}
            <div className='sm:col-span-2 relative group'>
              <label className='flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400'>
                <RiChat3Line className="text-[#008000]" /> Your Message
              </label>
              <textarea
                name="message"
                rows={4}
                placeholder='How can we assist you in your Karate journey?'
                className='w-full bg-transparent border-b border-gray-200 dark:border-white/10 p-4 text-sm outline-none focus:border-[#008000] transition-all dark:text-white resize-none placeholder:text-gray-400 dark:placeholder:text-gray-700'
                required
              />
            </div>

            {/* Icy Action Button */}
            <div className='sm:col-span-2 flex justify-center mt-6'>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className='relative overflow-hidden group bg-transparent border border-[#008000] text-[#008000] dark:text-white font-black uppercase tracking-[0.4em] text-[11px] px-16 py-5 transition-all duration-500'
              >
                <span className="relative z-10 flex items-center gap-3">
                  Send Message <RiSendPlane2Fill className='text-lg' />
                </span>
                
                {/* Hover Fill Effect */}
                <div className="absolute inset-0 bg-[#008000] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </motion.button>
            </div>
          </div>
        </motion.form>

        {/* REFINED BOTTOM TEXT */}
        <div className="mt-16 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400 dark:text-gray-600">
            Official Correspondence • Martial Arts Excellence
          </p>
          <div className="mt-4 flex justify-center gap-6 text-[9px] font-black uppercase tracking-widest text-green-700/60 dark:text-green-500/40">
            <span>Integrity</span>
            <span>Honor</span>
            <span>Discipline</span>
          </div>
        </div>

      </div>
    </section>
  )
}

export default ContactUs;