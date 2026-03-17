import fs from "fs";
import path from "path";
import multer from "multer";

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

const uploadsRoot = path.join(process.cwd(), "uploads");
const registrationUploads = path.join(uploadsRoot, "registrations");
const eventUploads = path.join(uploadsRoot, "events");
const paymentUploads = path.join(uploadsRoot, "payments");
ensureDir(registrationUploads);
ensureDir(eventUploads);
ensureDir(paymentUploads);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, registrationUploads);
  },
  filename: (req, file, cb) => {
    const safeBase = (file.originalname || "upload")
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]/g, "-")
      .slice(0, 80);
    const unique = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    cb(null, `${unique}-${safeBase}`);
  },
});

export const uploadRegistrationPhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.mimetype);
    if (!ok) return cb(new Error("Invalid file type. Only JPG/PNG/WEBP images are allowed."));
    cb(null, true);
  },
});

const eventStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, eventUploads);
  },
  filename: (req, file, cb) => {
    const safeBase = (file.originalname || "upload")
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]/g, "-")
      .slice(0, 80);
    const unique = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    cb(null, `${unique}-${safeBase}`);
  },
});

export const uploadEventImage = multer({
  storage: eventStorage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.mimetype);
    if (!ok) return cb(new Error("Invalid file type. Only JPG/PNG/WEBP images are allowed."));
    cb(null, true);
  },
});

const paymentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, paymentUploads);
  },
  filename: (req, file, cb) => {
    const safeBase = (file.originalname || "upload")
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]/g, "-")
      .slice(0, 80);
    const unique = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    cb(null, `${unique}-${safeBase}`);
  },
});

export const uploadPaymentScreenshot = multer({
  storage: paymentStorage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.mimetype);
    if (!ok) return cb(new Error("Invalid file type. Only JPG/PNG/WEBP images are allowed."));
    cb(null, true);
  },
});

