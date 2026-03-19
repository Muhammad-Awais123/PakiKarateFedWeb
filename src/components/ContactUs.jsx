import React from 'react';
import Title from './Title';
import { motion } from "motion/react";
import toast from 'react-hot-toast';

// Placeholder icons (agar assets missing ho)
const person_icon = "https://img.icons8.com/ios-filled/50/ffffff/user.png";
const email_icon = "https://img.icons8.com/ios-filled/50/ffffff/new-post.png";
const arrow_icon = "https://img.icons8.com/ios-filled/50/ffffff/arrow.png";

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
        toast.success('Thank you for your submission!');
        event.target.reset();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.2 }}
      id='contact-us'
      className='flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-12 text-gray-700 dark:text-white'
    >
      <Title title='Reach out to Pakistan Karate Federation' desc='Join us, ask questions, or register for upcoming championships!' />

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        onSubmit={onSubmit}
        className='grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-2xl w-full'
      >
        <div>
          <p className='mb-2 text-sm font-medium'>Your name</p>
          <div className='flex pl-3 rounded-lg border border-gray-300 dark:border-gray-600'>
            <img
              src={person_icon}
              alt="person"
              loading="lazy"
              className="w-5 h-5 my-auto"
            />
            <input name="name" type="text" placeholder='Enter your name' className='w-full p-3 text-sm outline-none bg-transparent' required/>
          </div>
        </div>

        <div>
          <p className='mb-2 text-sm font-medium'>Email id</p>
          <div className='flex pl-3 rounded-lg border border-gray-300 dark:border-gray-600'>
            <img
              src={email_icon}
              alt="email"
              loading="lazy"
              className="w-5 h-5 my-auto"
            />
            <input name="email" type="email" placeholder='Enter your email' className='w-full p-3 text-sm outline-none bg-transparent' required/>
          </div>
        </div>

        <div className='sm:col-span-2'>
          <p className='mb-2 text-sm font-medium'>Message</p>
          <textarea
            name="message"
            rows={8}
            placeholder='Enter your message'
            className='w-full p-3 text-sm outline-none rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent'
            required
          />
        </div>

        <button type="submit" className='w-max flex gap-2 bg-[#008000] text-white text-sm px-10 py-3 rounded-full cursor-pointer hover:scale-103 transition-all'>
          Submit <img src={arrow_icon} alt="arrow" loading="lazy" className='w-4'/>
        </button>

      </motion.form>
    </motion.div>
  )
}

export default ContactUs;