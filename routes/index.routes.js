const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const authMiddleWare = require("../middleware/auth");
const { createClient } = require("@supabase/supabase-js");

const { uploadToSupabase } = require("../config/supabaseUpload");

const fileModel = require("../models/files.model");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.get("/home", authMiddleWare, async (req, res) => {
  try {
    const files = await fileModel
      .find({ user: req.user.userId })
      .sort({ createdAt: -1 });

    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        if (file.path) {
          const { data: signedData, error } = await supabase.storage
            .from("uploads")
            .createSignedUrl(file.path, 60 * 60); // 1 hour

          if (error || !signedData?.signedUrl) {
            return { ...file.toObject(), url: null };
          }

          return { ...file.toObject(), url: signedData.signedUrl };
        }
        return file;
      })
    );

    res.render("home", {
      files: filesWithUrls.filter((f) => f.url),
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching files");
  }
});

router.post(
  "/upload",
  authMiddleWare,
  upload.single("file"),
  async (req, res) => {
    try {
      const supabaseFile = await uploadToSupabase(
        req.file.path,
        req.file.originalname,
        req.file.mimetype,
        req.user.userId
      );

      const newFile = await fileModel.create({
        path: supabaseFile.storagePath,
        originalname: req.file.originalname,
        url: supabaseFile.url,
        user: req.user.userId,
      });

      res.redirect("/home");
    } catch (err) {
      console.error("Upload error:", err.message);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

module.exports = router;
