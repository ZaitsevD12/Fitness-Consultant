const Router = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");

const router = express.Router();
const pool = require("../dbconfig");

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const connection = await pool.getConnection();

        const [
            rows,
        ] = await connection.query(
            "SELECT id, email, password,role FROM users WHERE email = ?",
            [email]
        );
        if (rows.length === 0) {
            connection.release();
            return res
                .status(401)
                .json({ message: "Invalid email or password." });
        }

        const hashedPassword = rows[0].password;

        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatch) {
            connection.release();
            return res
                .status(401)
                .json({ message: "Invalid email or password." });
        }

        const token = jwt.sign({ id: rows[0].id }, "mern-secret-key", {
            expiresIn: "24h",
        });

        connection.release();

        const user = {
            id: rows[0].id,
            email: rows[0].email,
            role: rows[0].role,
        };
        return res.json({ user, token });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "An error occurred while logging in." });
    }
});

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
        return res.status(401).json({ message: "Invalid token." });
    }
};

router.get("/auth", authMiddleware, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [
            rows,
        ] = await connection.query("SELECT * FROM users WHERE id = ?", [
            req.user.id,
        ]);
        connection.release();

        if (rows.length === 0) {
            return res.status(401).json({ message: "User not found." });
        }

        // Создаем объект, содержащий токен и данные пользователя
        const responseJson = {
            token: req.headers.authorization.split(" ")[1], // получаем токен из заголовка Authorization
            user: rows[0], // данные пользователя из базы данных
        };

        return res.json(responseJson);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching user data." });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const connection = await pool.getConnection();

        const [
            existingUsers,
        ] = await connection.query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);

        if (existingUsers.length > 0) {
            connection.release();
            return res
                .status(409)
                .json({ message: "Email is already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [
            result,
        ] = await connection.query(
            'INSERT INTO users (email, password, role, file_path, file_name) VALUES (?, ?, ?, "", "")',
            [email, hashedPassword, role]
        );

        connection.release();

        const userId = result.insertId;

        // JWT token
        const token = jwt.sign({ id: userId }, "mern-secret-key", {
            expiresIn: "24h",
        });

        const user = { id: userId, email, role };
        return res
            .status(201)
            .json({ message: "User registered successfully.", user, token });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "An error occurred while registering the user." });
    }
});

module.exports = router;
