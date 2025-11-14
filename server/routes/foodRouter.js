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
        cb(null, "uploads/food");
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
        const [diet] = await connection.query(`SELECT * FROM food`);
        connection.release();

        const foodArray = [];

        const setItem = (curInd) => {
            const ind = Math.floor(Math.random() * 22);
            if (
                foodArray
                    .map((item) => item.name === diet[ind].name)
                    .includes(true)
            ) {
                setItem();
            } else {
                foodArray.push({ ...diet[ind], idMeal: curInd });
            }
        };

        for (let i = 0; i < 6; i++) {
            setItem(i);
        }

        return res.json(foodArray);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching user data." });
    }
});

router.get("/all", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [diet] = await connection.query(`SELECT * FROM food`);
        connection.release();

        return res.json(diet);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching user data." });
    }
});

router.get("/one", async (req, res) => {
    const { id } = req.query;
    try {
        const connection = await pool.getConnection();
        const [item] = await connection.query(
            `SELECT * FROM food WHERE id = ${id}`
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
            `SELECT * FROM food WHERE id IN (${list.join(", ")})`
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

router.get("/getSrc/:file_path", async (req, res) => {
    const file = req.params.file_path;

    const file_path = path.join(__dirname, "..", "uploads/food/", file);

    res.sendFile(file_path, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send("Unable to download file");
        }
    });
});

router.post("/saveitem", upload.single("file"), async (req, res) => {
    try {
        const { name, calories, baking } = req.body;
        const { path, filename } = req.file;
        const connection = await pool.getConnection();
        pool.query(`
            INSERT INTO food (name, image, calories, baking)
            VALUES ('${name}', '${filename}', '${calories} ккал', '${baking}')
            `);
        connection.release();
        res.json({ status: "success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error" });
    }
});

module.exports = router;
