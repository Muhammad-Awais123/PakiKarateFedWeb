import React from 'react'
import assets from '../assets/assets'
import Title from './Title'
import ServiceCard from './ServiceCard'
import {motion} from 'motion/react'

const Services = () => {

    const servicesData = [
        {
          title: 'Marketing',
          description: 'We help you create effective marketing strategies that increase visibility and attract the right audience.',
          icon: assets.marketing_icon
        },
        {
          title: 'Meta Ads',
          description: 'We help you run targeted Meta ad campaigns that boost conversions and scale your business profitably.',
          
          icon: assets.ads_icon
        },
        {
            title: 'Website Design',
            description: 'We help you design modern, responsive websites that represent your brand and convert visitors into customers.',
            icon: assets.content_icon,
        },
        {
            title: 'Graphic Design',
            description: 'We help you create eye-catching graphic designs that strengthen branding and deliver a lasting visual impact.',
            icon: assets.social_icon,
        },
    ]

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.2 }}
      
    id='services' className='relative flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white'>
        
        <img src={assets.bgImage2} alt="" className='absolute -top-110 -left-70 -z-1 dark:hidden'/>

    <Title title='How can we help?' desc='From strategy to execution, we craft digital solutions that move your business forward.'/>

    <div className='flex flex-col md:grid grid-cols-2'>
        {servicesData.map((service, index)=>(
            <ServiceCard key={index} service={service} index={index}/>
        ))}
    </div>

    </motion.div>
  )
}

export default Services
