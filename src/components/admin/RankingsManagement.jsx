import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig.js";

const RankingsManagement = () => {
  const [rankings, setRankings] = useState([]);
  const [newRanking, setNewRanking] = useState({ rank: "", name: "", country: "", points: "", category: "", description: "", image: "" });

  const fetchRankings = async () => {
    const { data } = await axios.get("/rankings");
    setRankings(Array.isArray(data?.data) ? data.data : []);
  };

  useEffect(() => { fetchRankings(); }, []);

  const handleAdd = async () => {
    await axios.post("/admin/rankings", newRanking);
    setNewRanking({ rank: "", name: "", country: "", points: "", category: "", description: "", image: "" });
    fetchRankings();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/admin/rankings/${id}`);
    fetchRankings();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Rankings</h2>
      {/* ... form + list same as your code ... */}
    </div>
  );
};

export default RankingsManagement;