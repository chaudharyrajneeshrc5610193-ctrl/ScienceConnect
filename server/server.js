import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();

app.use(cors());
app.use(express.json());

// =========================
// STUDY MATERIAL UPLOAD SETUP
// =========================

const uploadDir = "uploads";

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Make uploaded files accessible
app.use("/uploads", express.static(uploadDir));

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);
  }
});

// Allowed file types
const upload = multer({
  storage: storage,

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".doc",
      ".docx",
      ".ppt",
      ".pptx"
    ];

    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(extension)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF, JPG, PNG, DOC, DOCX, PPT and PPTX files are allowed."
        )
      );
    }
  },

  limits: {
    fileSize: 20 * 1024 * 1024
  }
});

// =========================
// DATABASE
// =========================

const db = new Database("scienceconnect.db");

// =========================
// QUESTIONS TABLE
// =========================

db.prepare(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY,
    studentName TEXT NOT NULL,
    studentClass TEXT NOT NULL,
    subject TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT DEFAULT '',
    answered INTEGER DEFAULT 0,
    teacherName TEXT DEFAULT '',
    askedAt TEXT NOT NULL,
    answeredAt TEXT DEFAULT ''
  )
`).run();

// =========================
// STUDY MATERIAL TABLE
// =========================

db.prepare(`
  CREATE TABLE IF NOT EXISTS study_materials (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    subject TEXT NOT NULL,
    teacherName TEXT NOT NULL,
    fileName TEXT NOT NULL,
    fileUrl TEXT NOT NULL,
    uploadedAt TEXT NOT NULL
  )
`).run();

console.log("Database connected successfully!");
console.log("Study material table ready!");

// =========================
// HOME
// =========================

app.get("/", (req, res) => {
  res.send("ScienceConnect backend is running!");
});

// =========================
// TEST CONNECTION
// =========================

app.get("/api/test", (req, res) => {
  res.json({
    message: "Frontend and backend are connected!"
  });
});

// ======================================================
// QUESTIONS
// ======================================================

// =========================
// GET ALL QUESTIONS
// =========================

app.get("/api/questions", (req, res) => {
  const questions = db
    .prepare("SELECT * FROM questions ORDER BY id ASC")
    .all();

  const formattedQuestions = questions.map((question) => ({
    ...question,
    answered: Boolean(question.answered)
  }));

  res.json(formattedQuestions);
});

// =========================
// ADD NEW QUESTION
// =========================

app.post("/api/questions", (req, res) => {
  const {
    studentName,
    studentClass,
    subject,
    question,
    answer = "",
    answered = false,
    teacherName = "",
    askedAt,
    answeredAt = ""
  } = req.body;

  const id = Date.now();

  db.prepare(`
    INSERT INTO questions (
      id,
      studentName,
      studentClass,
      subject,
      question,
      answer,
      answered,
      teacherName,
      askedAt,
      answeredAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    studentName,
    studentClass,
    subject,
    question,
    answer,
    answered ? 1 : 0,
    teacherName,
    askedAt,
    answeredAt
  );

  const savedQuestion = db
    .prepare("SELECT * FROM questions WHERE id = ?")
    .get(id);

  res.status(201).json({
    ...savedQuestion,
    answered: Boolean(savedQuestion.answered)
  });
});

// =========================
// UPDATE ANSWER
// =========================

app.put("/api/questions/:id", (req, res) => {
  const questionId = Number(req.params.id);

  const { answer, teacherName } = req.body;

  const answeredAt = new Date().toLocaleString();

  const result = db.prepare(`
    UPDATE questions
    SET
      answer = ?,
      answered = 1,
      teacherName = ?,
      answeredAt = ?
    WHERE id = ?
  `).run(
    answer,
    teacherName || "Teacher",
    answeredAt,
    questionId
  );

  if (result.changes === 0) {
    return res.status(404).json({
      message: "Question not found"
    });
  }

  const updatedQuestion = db
    .prepare("SELECT * FROM questions WHERE id = ?")
    .get(questionId);

  res.json({
    ...updatedQuestion,
    answered: Boolean(updatedQuestion.answered)
  });
});

// ======================================================
// STUDY MATERIAL
// ======================================================

// =========================
// GET ALL STUDY MATERIAL
// =========================

app.get("/api/study-materials", (req, res) => {
  try {
    const materials = db
      .prepare(`
        SELECT *
        FROM study_materials
        ORDER BY id DESC
      `)
      .all();

    res.json(materials);

  } catch (error) {
    console.error(
      "Failed to load study materials:",
      error
    );

    res.status(500).json({
      message: "Failed to load study materials."
    });
  }
});

// =========================
// UPLOAD STUDY MATERIAL
// =========================

app.post(
  "/api/study-materials",
  upload.single("file"),
  (req, res) => {

    try {
      const {
        title,
        description = "",
        subject,
        teacherName
      } = req.body;

      // Check required information
      if (!title || !subject || !teacherName) {
        return res.status(400).json({
          message:
            "Title, subject and teacher name are required."
        });
      }

      // Check file
      if (!req.file) {
        return res.status(400).json({
          message: "Please select a file."
        });
      }

      const fileUrl =
        `/uploads/${req.file.filename}`;

      const uploadedAt =
        new Date().toLocaleString();

      const id = Date.now();

      // Save material information
      db.prepare(`
        INSERT INTO study_materials (
          id,
          title,
          description,
          subject,
          teacherName,
          fileName,
          fileUrl,
          uploadedAt
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        title,
        description,
        subject,
        teacherName,
        req.file.originalname,
        fileUrl,
        uploadedAt
      );

      // Get saved material
      const material = db
        .prepare(`
          SELECT *
          FROM study_materials
          WHERE id = ?
        `)
        .get(id);

      res.status(201).json(material);

    } catch (error) {

      console.error(
        "Study material upload failed:",
        error
      );

      // Delete uploaded file if database operation failed
      if (req.file) {
        const uploadedFile =
          path.join(uploadDir, req.file.filename);

        if (fs.existsSync(uploadedFile)) {
          fs.unlinkSync(uploadedFile);
        }
      }

      res.status(500).json({
        message:
          "Failed to upload study material."
      });
    }
  }
);

// =========================
// DELETE STUDY MATERIAL
// =========================

app.delete("/api/study-materials/:id", (req, res) => {

  try {
    const materialId = Number(req.params.id);

    const material = db
      .prepare(`
        SELECT *
        FROM study_materials
        WHERE id = ?
      `)
      .get(materialId);

    if (!material) {
      return res.status(404).json({
        message: "Study material not found."
      });
    }

    // Delete physical file
    const filePath = path.join(
      uploadDir,
      path.basename(material.fileUrl)
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete database record
    db.prepare(`
      DELETE FROM study_materials
      WHERE id = ?
    `).run(materialId);

    res.json({
      message: "Study material deleted successfully."
    });

  } catch (error) {

    console.error(
      "Failed to delete study material:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete study material."
    });
  }
});

// =========================
// ERROR HANDLER
// =========================

app.use((error, req, res, next) => {

  console.error("Server error:", error);

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message: `Upload error: ${error.message}`
    });
  }

  if (error.message) {
    return res.status(400).json({
      message: error.message
    });
  }

  res.status(500).json({
    message: "Something went wrong on the server."
  });
});

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});