const Router = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const multer = require("multer");
const path = require("path");
const parse = path.parse;
const iconv = require("iconv-lite");

const router = express.Router();
const pool = require("../dbconfig");

router.get("/getusers", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [userRows] = await connection.query(
            "SELECT id, email, role, file_name, file_path, exes, spec_id, food FROM users"
        );
        const [fileRows] = await connection.query(
            "SELECT id, user_id, file_path, file_name FROM files"
        );

        const users = userRows.map((user) => {
            const files = fileRows.filter((file) => file.user_id === user.id);
            return { ...user, files };
        });

        connection.release();

        return res.json(users);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching users." });
    }
});

router.post("/getuser", async (req, res) => {
    const { id } = req.body;
    try {
        const connection = await pool.getConnection();
        const [
            userRows,
        ] = await connection.query(
            "SELECT id, email, role, food, exes FROM users WHERE id=?",
            [id]
        );
        const [
            fileRows,
        ] = await connection.query(
            "SELECT id, user_id, file_path, file_name FROM files WHERE user_id=?",
            [id]
        );

        const user = userRows[0];
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const files = fileRows.map((file) => ({
            id: file.id,
            filePath: file.file_path,
            fileName: file.file_name,
        }));
        user.files = files;

        connection.release();

        return res.json(user);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching user by id." });
    }
});

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

router.post("/saveblank", upload.single("file"), async (req, res) => {
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

        const insertFileQuery = `
              UPDATE users
              SET file_name = ?, file_path = ?
              WHERE id = ?
            `;
        const values = [parsedPath.name + parsedPath.ext, path, userId];

        const result = await conn.query(insertFileQuery, values);
        const fileId = result[0].insertId;

        await conn.commit();
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.json({ status: "success" });
    } catch (error) {
        if (conn) {
            await conn.rollback();
            conn.release();
        }
        res.status(500).json({ status: "error" });
    } finally {
        if (conn) {
            conn.release();
        }
    }
});

router.post("/exes", async (req, res) => {
    const { data, id } = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.query(
            `UPDATE users SET exes = '${data}' WHERE id = ${id}`
        );
        connection.release();

        res.json({ status: "success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error" });
    }
});

router.post("/food", async (req, res) => {
    const { data, id } = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.query(
            `UPDATE users SET food = '${data}' WHERE id = ${id}`
        );
        connection.release();

        res.json({ status: "success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error" });
    }
});

router.get("/pay", async (req, res) => {
    try {
        const { id } = req.query;
        const connection = await pool.getConnection();
        await connection.query(`UPDATE users SET is_sub = 1 WHERE id = ${id}`);
        connection.release();
        res.json({ status: "success" });
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.get("/dismiss", async (req, res) => {
    try {
        const { id } = req.query;
        const connection = await pool.getConnection();
        await connection.query(`UPDATE users SET is_sub = 0 WHERE id = ${id}`);
        connection.release();
        res.json({ status: "success" });
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

module.exports = router;
