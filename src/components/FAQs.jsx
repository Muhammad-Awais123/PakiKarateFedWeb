import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiArrowDownSLine, 
  RiQuestionMark,
  RiMailSendLine,
  RiCustomerService2Line,
  RiSearchLine,
  RiTrophyLine,
  RiGlobalLine,
  RiGroupLine,
  RiFlashlightLine
} from 'react-icons/ri';

const faqs = [
  {
    question: "What is the Pakistan Karate Federation?",
    answer: "The Pakistan Karate Federation (PKF) is the premier governing body for Karate in Pakistan, officially recognized by the Pakistan Sports Board. Since 1965, we have been dedicated to nurturing talent and producing world-class athletes for the global stage.",
    category: "general"
  },
  {
    question: "How can I join a training program?",
    answer: "Joining is simple! You can visit one of our 50+ affiliated centers or register through our 'Join the Dojo' portal. We offer flexible scheduling for students and professionals.",
    category: "membership"
  },
  {
    question: "Are there age restrictions for training?",
    answer: "Karate is for everyone. Our programs are designed for all age groups—from children to seniors—focusing on fitness, self-defense, and discipline.",
    category: "training"
  },
  {
    question: "How can I participate in competitions?",
    answer: "Athletes must train at an affiliated dojo and qualify through district and provincial championships to reach the national level.",
    category: "competition"
  },
  {
    question: "Do you offer international exposure?",
    answer: "Yes! PKF provides extensive exposure through the Asian Games, World Championships, and South Asian Games.",
    category: "international"
  }
];

const categories = [
  { id: 'all', label: 'All', icon: <RiFlashlightLine /> },
  { id: 'general', label: 'General', icon: <RiCustomerService2Line /> },
  { id: 'membership', label: 'Joining', icon: <RiMailSendLine /> },
  { id: 'training', label: 'Training', icon: <RiGroupLine /> },
  { id: 'competition', label: 'Events', icon: <RiTrophyLine /> },
  { id: 'international', label: 'Global', icon: <RiGlobalLine /> }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="faq" className="relative w-full py-24 lg:py-32 bg-white dark:bg-[#030303] overflow-hidden transition-colors duration-700">
      
      {/* ICY FLOW (Background Decor) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#008000]/30 to-transparent" />
      <div className="absolute top-40 -right-20 w-96 h-96 bg-[#008000]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full bg-[#008000]/10 border border-[#008000]/20 text-[#008000] text-[10px] font-black uppercase tracking-[0.4em] mb-4"
          >
            Knowledge Base
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">
            Common <span className="text-[#008000]">Inquiries</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto font-medium">
            Find everything you need to know about the legacy and operations of PKF.
          </p>
        </div>

        {/* Search & Categories (Icy Style) */}
        <div className="mb-12 space-y-6">
          <div className="relative max-w-xl mx-auto group">
            <RiSearchLine className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#008000] transition-colors" />
            <input
              type="text"
              placeholder="Search for a topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/[0.02] backdrop-blur-md border border-black/5 dark:border-white/10 text-sm outline-none focus:border-[#008000]/50 transition-all dark:text-white placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-sm flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                  selectedCategory === cat.id
                    ? 'bg-[#008000] text-white shadow-lg shadow-green-900/20'
                    : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-black/5 dark:border-white/5 hover:border-[#008000]/30'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items (Glassy Blocks) */}
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.question}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group border-l-4 transition-all duration-500 ${
                  activeIndex === index 
                  ? 'bg-white dark:bg-white/[0.04] border-[#008000] shadow-xl' 
                  : 'bg-gray-50 dark:bg-white/[0.01] border-transparent hover:border-gray-300 dark:hover:border-white/10'
                }`}
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left outline-none"
                >
                  <div className="flex items-center gap-5">
                    <span className={`text-xs font-black transition-colors ${activeIndex === index ? 'text-[#008000]' : 'text-gray-400'}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-tight text-sm md:text-base">
                      {faq.question}
                    </h3>
                  </div>
                  <motion.div 
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    className={`text-xl ${activeIndex === index ? 'text-[#008000]' : 'text-gray-400'}`}
                  >
                    <RiArrowDownSLine />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-16 pb-8 pt-2">
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-3xl">
                          {faq.answer}
                        </p>
                        <div className="mt-6 flex items-center gap-2">
                           <span className="text-[9px] font-black uppercase tracking-widest text-[#008000] bg-[#008000]/10 px-3 py-1">
                             {faq.category}
                           </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Support Footer */}
        <div className="mt-20 text-center">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Still have questions?</p>
          <a 
            href="#contact-us"
            className="inline-flex items-center gap-3 text-black dark:text-white font-black uppercase tracking-widest text-[11px] border-b-2 border-[#008000] pb-2 hover:gap-6 transition-all"
          >
            Contact Support Office <RiMailSendLine className="text-[#008000] text-lg" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;