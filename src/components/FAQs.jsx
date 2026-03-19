import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiArrowDownSLine, 
  RiArrowUpSLine,
  RiQuestionMark,
  RiMailSendLine,
  RiCustomerService2Line,
  RiSearchLine,
  RiThumbUpLine,
  RiThumbDownLine
} from 'react-icons/ri';

const faqs = [
  {
    question: "What is the Pakistan Karate Federation?",
    answer: "The Pakistan Karate Federation (PKF) stands as the premier governing body for Karate in Pakistan, officially recognized by the Pakistan Sports Board and affiliated with international karate organizations including the World Karate Federation (WKF) and Asian Karate Federation (AKF). Since 1965, we have been dedicated to nurturing talent, preserving traditional martial arts values, and producing world-class athletes who represent Pakistan on global stages.",
    category: "general"
  },
  {
    question: "How can I join a training program?",
    answer: "Joining our training programs is simple! You can either:\n\n• Visit one of our 50+ affiliated training centers nationwide\n• Register online through our 'Join the Dojo' portal\n• Contact our regional offices for personalized guidance\n\nWe offer trial classes for beginners and flexible scheduling options for working professionals and students.",
    category: "membership"
  },
  {
    question: "Are there age restrictions for training?",
    answer: "Not at all! We believe karate is for everyone. Our programs are thoughtfully designed for various age groups including children, youth, adults, and seniors, tailored for fitness, self-defense, and competition.",
    category: "training"
  },
  {
    question: "How can I participate in competitions?",
    answer: "Competition participation follows a structured pathway. Athletes must train at an affiliated dojo, qualify through district/provincial championships, and get selected for national/international events based on performance.",
    category: "competition"
  },
  {
    question: "Do you offer international exposure?",
    answer: "Yes! PKF provides extensive international exposure through events like Asian Games, World Karate Championships, South Asian Games, and bilateral exchange programs with foreign federations.",
    category: "international"
  }
];

const categories = [
  { id: 'all', label: 'All Questions', icon: <RiQuestionMark /> },
  { id: 'general', label: 'General', icon: <RiCustomerService2Line /> },
  { id: 'membership', label: 'Membership', icon: <RiMailSendLine /> },
  { id: 'training', label: 'Training', icon: <RiQuestionMark /> },
  { id: 'competition', label: 'Competition', icon: <RiQuestionMark /> },
  { id: 'international', label: 'International', icon: <RiQuestionMark /> }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="faq" className="relative w-full py-12 lg:py-16 bg-gray-50 dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1.5 bg-[#008000]/10 rounded-full text-[#008000] text-sm font-semibold mb-3">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008000] to-[#00ff00]">Questions</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm max-w-xl mx-auto">
            Everything you need to know about PKF.
          </p>
        </div>

        {/* Search & Categories */}
        <div className="mb-10 space-y-4">
          <div className="relative max-w-md mx-auto">
            <RiSearchLine className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search your question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008000]/50 focus:border-[#008000] text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-[#008000] text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#008000]/10'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredFAQs.length > 0 ? filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${activeIndex === index ? 'ring-2 ring-[#008000] ring-opacity-50' : ''}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${activeIndex === index ? 'border-[#008000] bg-[#008000] text-white' : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}>
                      <RiQuestionMark />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{faq.question}</h3>
                      <span className="inline-block mt-1 text-xs text-[#008000] bg-[#008000]/10 px-2 py-1 rounded-full">{faq.category}</span>
                    </div>
                  </div>
                  <div className={`text-2xl ${activeIndex === index ? 'text-[#008000]' : 'text-gray-400'}`}>
                    {activeIndex === index ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                  </div>
                </button>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden px-6 pb-6 pl-20"
                    >
                      <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
                        {faq.answer.split('\n').map((line, i) => (
                          <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{line}</p>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Was this helpful?</span>
                        <div className="flex gap-2">
                          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-[#008000]/10 transition-colors"><RiThumbUpLine /></button>
                          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-[#008000]/10 transition-colors"><RiThumbDownLine /></button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )) : (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">No questions found</div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FAQ;