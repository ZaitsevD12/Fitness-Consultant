const Router = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");

const router = express.Router();
const pool = require("../dbconfig");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Authorization token is missing or invalid." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = jwt.verify(token, "mern-secret-key");
        req.user = { id: decodedToken.id };
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid token." });
    }
};

router.get("/attend/:id", authMiddleware, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.query(
            `UPDATE users
        SET spec_id = ?
        WHERE id = ?;
        `,
            [req.params.id, req.user.id]
        );
        connection.release();

        return res.json({ status: "success" });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching user data." });
    }
});

module.exports = router;
