const express = require("express");
const multer = require("multer");
const router = express.Router();
const mysql = require("mysql2/promise");
const path = require("path");
const iconv = require("iconv-lite");
const parse = path.parse;
// Подключение к базе данных
const pool = require("../dbconfig");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/exes");
    },
    filename: (req, file, cb) => {
        const parsedPath = parse(file.originalname);
        cb(null, parsedPath.name + "-" + Date.now() + parsedPath.ext);
    },
});

const upload = multer({ storage });

router.get("/list", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const query = req.query.query;
        if (!query) {
            const [exes] = await connection.query(`SELECT * FROM exes`);
            return res.json(exes);
        }
        const [exes1] = await connection.query(
            `SELECT * FROM exes WHERE name LIKE '%` + query + `%'`
        );
        const [exes2] = await connection.query(
            `SELECT * FROM exes WHERE muscules LIKE '%` + query + `%'`
        );
        connection.release();

        return res.json([...exes1, ...exes2]);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching user data." });
    }
});

router.get("/getSrc/:file_path", async (req, res) => {
    const file = req.params.file_path;

    const file_path = path.join(__dirname, "..", "uploads/exes/", file);

    res.sendFile(file_path, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send("Unable to download file");
        }
    });
});

router.get("/one", async (req, res) => {
    const { id } = req.query;
    try {
        const connection = await pool.getConnection();
        const [item] = await connection.query(
            `SELECT * FROM exes WHERE id = ${id}`
        );
        connection.release();

        return res.json(item[0]);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching user data." });
    }
});

router.post("/getList", async (req, res) => {
    const { list } = req.body;
    try {
        const connection = await pool.getConnection();
        const [data] = await connection.query(
            `SELECT * FROM exes WHERE id IN (${list.join(", ")})`
        );

        connection.release();

        return res.json(data);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching user data." });
    }
});

router.post("/saveitem", upload.single("file"), async (req, res) => {
    try {
        const { name, muscules } = req.body;
        const { path, filename } = req.file;
        const connection = await pool.getConnection();
        pool.query(`
            INSERT INTO exes (name, image, muscules)
            VALUES ('${name}', '${filename}', '${muscules}')
            `);
        connection.release();
        res.json({ status: "success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error" });
    }
});

module.exports = router;
