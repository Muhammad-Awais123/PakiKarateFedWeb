import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiMedalLine,
  RiTrophyLine,
  RiAwardLine,
  RiUserStarLine,
  RiFlag2Line,
  RiCalendarLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import assets from "../assets/assets";

// Legends data
const legends = [
  { id: 1, name: "Kulsoom Hazara", title: "South Asian Gold Medalist", honor: "Pride of Pakistan Awarded By ISPR", era: "2005-2021", social: "@kulsoomhazara", gender: "female", image: assets.kulsoom, stats: { gold: 7, silver: 4, bronze: 2, international: 25 }, achievements: ["01 Gold & 01 Silver at 13th South Asian Games - Kathmandu Nepal, 2019","01 Gold & 01 Silver at 4th South Asian karate championship - Colombo Srilanka, 2017"], participations: ["5th Islamic Solidarity Games Konya 2021","15th AKF Senior Championship - Jordan, 2018"], category: "athlete" },
  { id: 2, name: "Muhammad Kashif Aslam", title: "South Asian Gold Medalist", honor: "WKF Qualified Coach", era: "2023-2024", social: "", gender: "male", image: assets.kashif, stats: { gold: 2, silver: 0, bronze: 1, international: 8 }, achievements: ["01 Gold Medal at 6th South Asian Karate Championship Colombo, Srilanka 2021"], participations: ["WKF Coaches Course 2022 Konya","18th AKF Championship 2022"], category: "coach" },
  { id: 3, name: "Beenish Akbar", title: "South Asian Gold Medalist", honor: "Ex-Coach Pakistan Female Karate Team", era: "2006-2018", social: "", gender: "female", image: assets.benish, stats: { gold: 2, silver: 4, bronze: 1, international: 7 }, achievements: ["02 Gold & 01 Bronze at 1st South Asian Karate Championship 2011"], participations: ["12th Asian Karate Championship 2012 in Uzbekistan"], category: "athlete" },
  { id: 4, name: "Ghulam Ali Hazara", title: "South Asian Gold Medalist", honor: "National Champion 1997-2010", era: "1997-2010", social: "", gender: "male", image: assets.ghulam, stats: { gold: 4, silver: 1, bronze: 0, international: 10 }, achievements: ["02 Gold at 9th South Asian Games 2004 Islamabad"], participations: ["15th Asian Games 2006 in Doha, Qatar"], category: "coach" },
];

// Motion list
const MotionList = ({ items, direction = "left" }) => (
  <div className="space-y-1">
    {items.map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: direction === "left" ? -15 : 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.08 }}
        className="p-1 bg-gray-800/30 dark:bg-gray-700/40 rounded text-sm text-gray-300"
      >
        {item}
      </motion.div>
    ))}
  </div>
);

// Legend Card
const LegendCard = ({ legend, isActive, onClick }) => {
  const cardBg = "bg-white dark:bg-gray-900 text-gray-900 dark:text-white";

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group cursor-pointer rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 ${isActive ? "lg:col-span-2" : ""}`}
      onClick={onClick}
    >
      <div className={`${cardBg} flex flex-col h-full transition-colors duration-300`}>
        <div className="w-full h-40 md:h-48 lg:h-52 overflow-hidden flex justify-center items-center bg-gray-100 dark:bg-gray-800">
          <img src={legend.image} alt={legend.name} className="max-h-full max-w-full object-contain" />
        </div>
        <div className="p-3 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: '#008000', color: '#008000', backgroundColor: 'rgba(0,128,0,0.1)' }}>
              {legend.category.toUpperCase()}
            </span>
            <span className="flex items-center gap-1 text-gray-400 text-xs"><RiCalendarLine /> {legend.era}</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold mb-0.5">{legend.name}</h3>
          <p className="text-sm font-medium" style={{ color: '#008000' }}>{legend.title}</p>
          {legend.honor && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#008000' }}><RiAwardLine /> {legend.honor}</p>}

          {/* Stats */}
          <div className="grid grid-cols-4 gap-1 mt-2 mb-1">
            {["gold","silver","bronze","international"].map((stat)=>(
              <div key={stat} className="text-center p-1 rounded-md bg-gray-100 dark:bg-gray-800/30">
                {stat === "gold" && <RiTrophyLine className="mx-auto mb-0.5 text-yellow-400" />}
                {stat === "silver" && <RiMedalLine className="mx-auto mb-0.5 text-gray-400" />}
                {stat === "bronze" && <RiMedalLine className="mx-auto mb-0.5 text-[#CD7F32]" />}
                {stat === "international" && <RiFlag2Line className="mx-auto mb-0.5 text-blue-400" />}
                <span className="font-bold text-sm block">{legend.stats[stat]}</span>
                <span className="text-xs block">{stat === "international" ? "Events" : stat.charAt(0).toUpperCase()+stat.slice(1)}</span>
              </div>
            ))}
          </div>

          <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-sm mt-auto flex items-center gap-1 justify-end" style={{ color: '#008000' }}>
            {isActive ? "Show Less" : "View Full Profile"} <RiArrowRightSLine />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Expanded View
const ExpandedView = ({ legend, onClose }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="col-span-full bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-xl border border-green-400/30 mb-6">
    <div className="w-full h-56 relative overflow-hidden">
      <img src={legend.image} alt={legend.name} className="w-full h-full object-cover object-center opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end p-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">{legend.name}</h2>
          <div className="flex gap-1 mt-1 flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-[#008000] text-white text-xs">{legend.title}</span>
            {legend.honor && <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500 text-yellow-500 text-xs">{legend.honor}</span>}
          </div>
        </div>
        <button onClick={onClose} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm">Close</button>
      </div>
    </div>
    <div className="p-4 md:p-6 grid md:grid-cols-2 gap-4 md:gap-6">
      <div>
        <h3 className="text-lg font-bold mb-1 flex items-center gap-1" style={{ color: '#008000' }}><RiTrophyLine /> Achievements</h3>
        <MotionList items={legend.achievements} direction="left" />
      </div>
      <div>
        <h3 className="text-lg font-bold mb-1 flex items-center gap-1" style={{ color: '#008000' }}><RiFlag2Line /> Participations</h3>
        <MotionList items={legend.participations} direction="right" />
        {legend.social && <div className="mt-2 p-2 bg-gray-800/30 rounded-md border border-gray-700 text-sm"><p className="font-semibold" style={{ color: '#008000' }}>Follow: {legend.social}</p></div>}
      </div>
    </div>
  </motion.div>
);

// Main Legends Component
const Legends = () => {
  const [activeLegend, setActiveLegend] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredLegends = legends.filter(l => (filter === "all" || l.category === filter) && l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="w-full py-12 lg:py-16 bg-white dark:bg-black transition-colors duration-700">
      <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8 mb-10">
        <div className="inline-block p-3 bg-[#008000]/20 rounded-full mb-4"><RiUserStarLine className="text-4xl" style={{ color: '#008000' }} /></div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #008000, #00b000)' }}>Legends</span></h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">Honoring the heroes who brought glory to Pakistan through Karate.</p>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          <input type="text" placeholder="Search Legends..." value={search} onChange={(e)=>setSearch(e.target.value)} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#008000]/50 text-sm"/>
        </div>
        <div className="flex justify-center gap-2 mt-3">
          {["all","athlete","coach"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1 rounded-full text-sm transition-all duration-300"
              style={{
                backgroundColor: filter===f ? '#008000' : undefined,
                color: filter===f ? '#ffffff' : undefined
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="wait">
            {filteredLegends.map(legend => (
              <React.Fragment key={legend.id}>
                <LegendCard legend={legend} isActive={activeLegend===legend.id} onClick={()=>setActiveLegend(activeLegend===legend.id?null:legend.id)} />
                {activeLegend===legend.id && <ExpandedView legend={legend} onClose={()=>setActiveLegend(null)} />}
              </React.Fragment>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Legends;