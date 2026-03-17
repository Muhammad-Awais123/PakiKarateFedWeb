import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosConfig.js";

const WorldRankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const { data } = await axiosInstance.get("/rankings");
        setRankings(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching rankings:", error);
        setRankings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading world rankings...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">World Rankings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rankings && rankings.length > 0 ? (
          rankings.map((r) => (
            <div key={r._id} className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{r.rank}. {r.name}</h3>
              <p className="text-gray-600 mb-1">Country: {r.country}</p>
              <p className="text-gray-600 mb-1">Category: {r.category}</p>
              <p className="text-gray-600 mb-2">Points: {r.points}</p>
              {r.description && <p className="text-gray-700 mb-2">{r.description}</p>}
              {r.image && (
                <img
                  src={r.image}
                  alt={r.name}
                  className="h-32 w-full object-cover rounded mb-2"
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No rankings available</p>
        )}
      </div>
    </div>
  );
};

export default WorldRankings;