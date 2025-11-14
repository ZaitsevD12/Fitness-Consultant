const express = require("express");
const multer = require("multer");
const router = express.Router();
const mysql = require("mysql2/promise");
const path = require("path");
const iconv = require("iconv-lite");
const parse = path.parse;
// Подключение к базе данных
const pool = require("../dbconfig");
let conn;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const parsedPath = parse(file.originalname);
        cb(null, parsedPath.name + "-" + Date.now() + parsedPath.ext);
    },
});

const upload = multer({ storage });

router.post("/savefile", upload.single("file"), async (req, res) => {
    const { userId, fileName } = req.body;
    const { path, filename } = req.file;

    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const newfilename = iconv.decode(
            Buffer.from(filename, "binary"),
            "win1251"
        );
        const parsedPath = parse(newfilename);
        const insertFileQuery =
            "INSERT INTO files(user_id, file_path, file_name) VALUES(?, ?, ?)";
        const values = [userId, path, parsedPath.name + parsedPath.ext];

        const result = await conn.query(insertFileQuery, values);
        const fileId = result[0].insertId;

        await conn.commit();
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.send(`File saved successfully with ID ${fileId}`);
    } catch (error) {
        if (conn) {
            await conn.rollback();
            conn.release();
        }
        console.error(error);
        res.status(500).send("Error saving file to database");
    } finally {
        if (conn) {
            conn.release();
        }
    }
});

router.get("/download/:file_path", (req, res) => {
    const file = req.params.file_path;

    const file_path = path.join(__dirname, "../", "uploads", file);
    res.download(file_path, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send("Unable to download file");
        }
    });
});

router.get("/open/:file_path", (req, res) => {
    const file = req.params.file_path;

    const file_path = path.join(__dirname, "..", "uploads", file);

    // Отправляем файл без использования res.download
    res.sendFile(file_path, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send("Unable to download file");
        }
    });
});
module.exports = router;
