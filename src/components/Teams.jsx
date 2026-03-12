import React from 'react';
import { teamData } from '../assets/assets';

export default function TeamSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Our Team
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300 text-base max-w-xl mx-auto">
            The people who shape ideas, build strategies, and drive BrandLift forward.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {teamData.map((member, index) => (
            <div
              key={index}
              className="bg-white/10 dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700
                         hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-gray-300 dark:border-gray-600 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 rounded-full blur-lg opacity-0 
                                  bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 
                                  hover:opacity-30 transition-all duration-500">
                  </div>
                </div>
              </div>

              <div className="text-center mt-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-indigo-400 font-medium text-sm mt-1">
                  {member.title}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 leading-relaxed">
                  Supporting BrandLift with creativity, strategy, and dedication.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
