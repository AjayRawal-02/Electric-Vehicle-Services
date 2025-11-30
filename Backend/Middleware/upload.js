import multer from "multer";

const storage = multer.memoryStorage(); // store file in memory (buffer) instead of folder

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

export default upload;
