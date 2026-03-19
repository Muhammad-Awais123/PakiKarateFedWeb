import mongoose from "mongoose";
import dotenv from "dotenv";
import RegistrationConfig from "../models/RegistrationConfig.js";
import EventCategory from "../models/EventCategory.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import Ranking from "../models/Ranking.js";

dotenv.config();

const connect = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const meta = {
  eventCategoryFieldName: "eventCategory",
  eventFieldName: "eventId",
  eventDateFieldName: "eventDate",
  eventsOptionsKey: "events",
  categoriesOptionsKey: "categories",
  autoFillEventDate: true,
};

const schema = {
  title: "WKF-Style Event Registration",
  subtitle: "Please complete all required fields and upload a recent photo.",
  submitLabel: "Submit Registration",
  footerNote: "Your registration will be reviewed by the federation.",
  meta,
  sections: [
    {
      id: "personal",
      title: "Personal Information",
      description: "Athlete identity and contact details.",
      fields: [
        { name: "fullName", label: "Full name", type: "text", required: true, autoComplete: "name", placeholder: "As per passport/ID" },
        { name: "dob", label: "Date of birth", type: "date", required: true },
        { name: "gender", label: "Gender", type: "radio", required: true, optionsKey: "gender" },
        { name: "nationality", label: "Nationality", type: "text", required: true, placeholder: "e.g. Pakistan" },
        { name: "wkfId", label: "WKF ID", type: "text", required: false, placeholder: "Optional" },
        { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", placeholder: "name@example.com" },
        { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel", placeholder: "+92..." },
        { name: "photo", label: "Photo upload", type: "file", required: true, accept: "image/*", hint: "Recent passport-style photo." , colSpan: 2},
      ],
    },
    {
      id: "ranking",
      title: "Ranking & Category Info",
      description: "Competitive profile and divisions.",
      fields: [
        { name: "wkfWorldRanking", label: "WKF world ranking", type: "text", required: false, placeholder: "Optional" },
        { name: "mainCategory", label: "Main competitive category", type: "select", required: true, optionsKey: "mainCategory" },
        { name: "weightDivision", label: "Weight division", type: "select", required: true, optionsKey: "weightDivision" },
        { name: "ageDivision", label: "Age division", type: "select", required: true, optionsKey: "ageDivision" },
      ],
    },
    {
      id: "eventSelection",
      title: "Event Selection",
      description: "Choose category and event.",
      fields: [
        { name: "eventCategory", label: "Event category", type: "radio", required: true, optionsKey: "categories" },
        { name: "eventId", label: "Select event", type: "select", required: true, placeholder: "Select an event" },
        { name: "eventDate", label: "Event date", type: "date", required: true, hint: "Auto-filled when enabled; can be adjusted if needed." },
      ],
    },
    {
      id: "coachClub",
      title: "Coach & Club Details",
      description: "Affiliation information.",
      fields: [
        { name: "clubName", label: "Club name", type: "text", required: true },
        { name: "coachName", label: "Coach name", type: "text", required: true },
        { name: "coachWkfLicense", label: "Coach WKF license number", type: "text", required: false, placeholder: "Optional" },
        { name: "nationalFederation", label: "National federation", type: "select", required: true, optionsKey: "nationalFederation" },
      ],
    },
    {
      id: "emergency",
      title: "Emergency Contact",
      description: "Who to contact in case of emergency.",
      fields: [
        { name: "emergencyName", label: "Name", type: "text", required: true },
        { name: "emergencyRelationship", label: "Relationship", type: "text", required: true },
        { name: "emergencyPhonePrimary", label: "Phone (primary)", type: "tel", required: true },
        { name: "emergencyPhoneSecondary", label: "Phone (secondary)", type: "tel", required: false, placeholder: "Optional" },
        { name: "medicalConditions", label: "Medical conditions / allergies", type: "textarea", required: false, colSpan: 2, placeholder: "List any conditions, allergies, medications..." },
      ],
    },
    {
      id: "declarations",
      title: "Declarations & Agreements",
      description: "Consents required for participation.",
      fields: [
        { name: "agreeWkfRules", label: "WKF rules", type: "checkbox", required: true, checkboxLabel: "I agree to abide by WKF competition rules." , colSpan: 2},
        { name: "agreeAntiDoping", label: "Anti-doping consent", type: "checkbox", required: true, checkboxLabel: "I consent to anti-doping rules and testing.", colSpan: 2 },
        { name: "agreeDataConsent", label: "Data consent", type: "checkbox", required: true, checkboxLabel: "I consent to processing my data for registration purposes.", colSpan: 2 },
        { name: "confirmAccuracy", label: "Information accuracy", type: "checkbox", required: true, checkboxLabel: "I confirm all information provided is accurate.", colSpan: 2 },
        { name: "agreeTerms", label: "Terms & conditions", type: "checkbox", required: true, checkboxLabel: "I accept the terms & conditions.", colSpan: 2 },
      ],
    },
    {
      id: "payment",
      title: "Payment Details",
      description: "Fee and payment method.",
      fields: [
        { name: "fee", label: "Fee", type: "number", required: true, placeholder: "e.g. 5000" },
        { name: "paymentMethod", label: "Payment method", type: "select", required: true, optionsKey: "paymentMethod" },
        { name: "transactionId", label: "Transaction ID", type: "text", required: false, placeholder: "Required for bank transfer/PayPal" },
      ],
    },
  ],
};

const options = {
  gender: [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ],
  mainCategory: [
    { value: "Kumite", label: "Kumite" },
    { value: "Kata", label: "Kata" },
  ],
  weightDivision: [
    { value: "-55kg", label: "-55kg" },
    { value: "-60kg", label: "-60kg" },
    { value: "-67kg", label: "-67kg" },
    { value: "-75kg", label: "-75kg" },
    { value: "+75kg", label: "+75kg" },
  ],
  ageDivision: [
    { value: "Cadet", label: "Cadet" },
    { value: "Junior", label: "Junior" },
    { value: "U21", label: "U21" },
    { value: "Senior", label: "Senior" },
  ],
  nationalFederation: [
    { value: "Pakistan Karate Federation", label: "Pakistan Karate Federation" },
  ],
  paymentMethod: [
    { value: "Credit Card", label: "Credit Card" },
    { value: "Bank Transfer", label: "Bank Transfer" },
    { value: "PayPal", label: "PayPal" },
    { value: "Pay at Venue", label: "Pay at Venue" },
  ],
};

const seedCategories = [
  { name: "National", slug: "national", description: "National-level events and championships." },
  { name: "International", slug: "international", description: "International multi-sport games and world events." },
];

const seedEvents = (categoryBySlug) => [
  // National
  {
    name: "Quaid-e-Azam Games",
    categoryId: categoryBySlug.national._id,
    startDate: new Date("2026-04-10"),
    endDate: new Date("2026-04-12"),
    type: "National",
    location: "Pakistan",
    description: "",
  },
  {
    name: "National Games",
    categoryId: categoryBySlug.national._id,
    startDate: new Date("2026-05-05"),
    endDate: new Date("2026-05-09"),
    type: "National",
    location: "Pakistan",
    description: "",
  },
  {
    name: "National Championship",
    categoryId: categoryBySlug.national._id,
    startDate: new Date("2026-06-15"),
    endDate: new Date("2026-06-16"),
    type: "National",
    location: "Pakistan",
    description: "",
  },
  {
    name: "Al Kabir Karate Club Championship",
    categoryId: categoryBySlug.national._id,
    startDate: new Date("2026-07-20"),
    endDate: new Date("2026-07-21"),
    type: "National",
    location: "Pakistan",
    description: "",
  },
  // International
  {
    name: "Asian Games",
    categoryId: categoryBySlug.international._id,
    startDate: new Date("2026-09-01"),
    endDate: new Date("2026-09-10"),
    type: "International",
    location: "Asia",
    description: "",
  },
  {
    name: "South Asian Games",
    categoryId: categoryBySlug.international._id,
    startDate: new Date("2026-10-10"),
    endDate: new Date("2026-10-18"),
    type: "International",
    location: "South Asia",
    description: "",
  },
  {
    name: "Islamic Solidarity Games",
    categoryId: categoryBySlug.international._id,
    startDate: new Date("2026-11-12"),
    endDate: new Date("2026-11-20"),
    type: "International",
    location: "OIC",
    description: "",
  },
  {
    name: "World Championships",
    categoryId: categoryBySlug.international._id,
    startDate: new Date("2026-12-05"),
    endDate: new Date("2026-12-10"),
    type: "International",
    location: "Global",
    description: "",
  },
];

const run = async () => {
  try {
    await connect();
    console.log("MongoDB Connected ✅");

    await Event.deleteMany({});
    await EventCategory.deleteMany({});
    await Ranking.deleteMany({});
    await RegistrationConfig.deleteMany({ key: "active" });

    const categories = await EventCategory.insertMany(seedCategories);
    const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
    await Event.insertMany(seedEvents(categoryBySlug));

    await Ranking.insertMany([
      {
        rank: 1,
        name: "Athlete One",
        country: "Pakistan",
        points: 950,
        category: "Kumite",
        image: "",
        description: "Sample seeded ranking",
      },
      {
        rank: 2,
        name: "Athlete Two",
        country: "Pakistan",
        points: 900,
        category: "Kata",
        image: "",
        description: "Sample seeded ranking",
      },
      {
        rank: 3,
        name: "Athlete Three",
        country: "Pakistan",
        points: 850,
        category: "Kumite",
        image: "",
        description: "Sample seeded ranking",
      },
    ]);

    // Create a demo admin account (does not touch existing accounts)
    const demoAdminEmail = "admin.demo@pkf.com";
    const existingDemo = await User.findOne({ email: demoAdminEmail });
    if (!existingDemo) {
      await User.create({
        name: "Demo Admin",
        email: demoAdminEmail,
        password: "Admin@1234",
        role: "admin",
      });
      console.log("Demo admin created ✅ (admin.demo@pkf.com / Admin@1234)");
    } else {
      console.log("Demo admin already exists ✅");
    }

    await RegistrationConfig.create({
      key: "active",
      schema,
      options,
      meta,
    });

    console.log("Seeded categories + events + rankings + registration schema ✅");
    process.exit(0);
  } catch (e) {
    console.error("Seed failed:", e);
    process.exit(1);
  }
};

run();

