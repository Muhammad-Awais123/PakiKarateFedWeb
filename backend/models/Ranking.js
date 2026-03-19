import mongoose from "mongoose";

const rankingSchema = new mongoose.Schema({
  rank: { 
    type: Number, 
    required: [true, "Rank is required"] 
  },
  name: { 
    type: String, 
    required: [true, "Athlete name is required"] 
  },
  country: { 
    type: String, 
    required: [true, "Country is required"] 
  },
  points: { 
    type: Number, 
    required: [true, "Points are required"] 
  },
  category: { 
    type: String, 
    enum: ["Kata", "Kumite"], 
    required: [true, "Category is required"] 
  },
  image: { 
    type: String, 
    default: "" // optional field
  },
  description: { 
    type: String, 
    default: "" // optional field
  }
}, { 
  timestamps: true // auto-manages createdAt & updatedAt
});

export default mongoose.model("Ranking", rankingSchema);