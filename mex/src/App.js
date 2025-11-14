import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.scss";
import Home from "./pages/Home";
import Food from "./pages/Food";
import Login from "./pages/login";
import { Register } from "./pages/Register";
import { useDispatch, useSelector } from "react-redux";
import { auth, initializeApp } from "./actions/user-api";
import { Users } from "./pages/Users";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Box } from "@mui/material";
import Loader from "./components/Loader";
import EntryFood from "./pages/EntryFood";
import { Logout } from "./components/Logout";
import Specs from "./pages/Specs";
import ExercisesPage from "./pages/ExercisesPage";
import PersonalPage from "./pages/PersonalPage";
import AddNew from "./pages/AddNew";
import FoodItem from "./pages/FoodItem";
const App = () => {
    const user = useSelector((state) => state.auth);
    const isAuth = useSelector((state) => state.auth.isAuth);
    const isAdmin = useSelector(
        (state) => state.auth.currentUser.role === "ADMIN"
    );
    const initialize = useSelector((state) => state.app.initialize);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeApp());
        if (localStorage.getItem("token")) {
            dispatch(auth());
        }
    }, []);

    if (!initialize) {
        return <Loader />;
    }

    return (
        <Box width="400px" sx={{ width: { xl: "1488px" } }} m="auto">
            <Navbar isAuth={isAuth} />
            <Routes>
                <Route path="/" element={<Home isAuth={isAuth} />} />
                <Route
                    path="/food"
                    element={<Food users={[]} />}
                    isAuth={isAuth}
                />
                <Route
                    path="/food/:id"
                    element={<FoodItem />}
                    isAuth={isAuth}
                />
                <Route
                    path="/admin"
                    element={<Users role={user.currentUser.role} />}
                />
                <Route
                    path="/exercises"
                    element={<ExercisesPage />}
                    isAuth={isAuth}
                />
                <Route path="/specialists" element={<Specs />} />
                <Route path="/personal" element={<PersonalPage />} />
                <Route path="/addNew" element={<AddNew />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
            <Footer />
        </Box>
    );
};

export default App;
