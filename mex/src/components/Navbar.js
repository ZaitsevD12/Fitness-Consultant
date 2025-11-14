import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../assets/images/Logo.png";
import { logout } from "../reducers/authReducer";
const Navbar = ({ isAuth }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);

    const location = useLocation();

    return (
        <Stack
            direction="row"
            justifyContent="space-around"
            sx={{
                gap: { xs: "40px" },
                mt: { sm: "32px", xs: "20px" },
                justifyContent: "none",
            }}
            px="20px"
        >
            <Link to="/">
                <img
                    src={Logo}
                    alt="logo"
                    style={{
                        width: "48px",
                        height: "48px",
                        margin: "0px 20px",
                    }}
                />
            </Link>
            <Stack
                direction="row"
                gap="40px"
                fontFamily="Alegreya"
                fontSize="21px"
                alignItems="flex-end"
            >
                <Link
                    to="/"
                    style={{
                        textDecoration: "none",
                        color: "#3A1212",
                        borderBottom:
                            location?.pathname === "/"
                                ? "3px solid #FF2625"
                                : "",
                    }}
                >
                    Главная
                </Link>
                {isAuth && (
                    <Link
                        to="/exercises"
                        style={{
                            textDecoration: "none",
                            color: "#3A1212",
                            borderBottom:
                                location?.pathname === "/exercises"
                                    ? "3px solid #FF2625"
                                    : "",
                        }}
                    >
                        Упражнения
                    </Link>
                )}
                {isAuth && user.currentUser.is_sub ? (
                    <Link
                        to="/specialists"
                        style={{
                            textDecoration: "none",
                            color: "#3A1212",
                            borderBottom:
                                location?.pathname === "/specialists"
                                    ? "3px solid #FF2625"
                                    : "",
                        }}
                    >
                        Специалисты
                    </Link>
                ) : (
                    <></>
                )}
                {isAuth && user.currentUser.is_sub ? (
                    <Link
                        to="/personal"
                        style={{
                            textDecoration: "none",
                            color: "#3A1212",
                            borderBottom:
                                location?.pathname === "/personal"
                                    ? "3px solid #FF2625"
                                    : "",
                        }}
                    >
                        Персональное
                    </Link>
                ) : (
                    <></>
                )}
                {(isAuth && user.currentUser.role === "SPEC") ||
                user.currentUser.role === "ADMIN" ? (
                    <Link
                        to="/addNew"
                        style={{
                            textDecoration: "none",
                            color: "#3A1212",
                            borderBottom:
                                location?.pathname === "/addNew"
                                    ? "3px solid #FF2625"
                                    : "",
                        }}
                    >
                        Добавить
                    </Link>
                ) : (
                    <></>
                )}

                <svg
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                        user && user.isAuth === true
                            ? (window.location.href = "/admin")
                            : (window.location.href = "/login")
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    id="Outline"
                    viewBox="0 0 24 24"
                    width="30"
                    height="30"
                >
                    <path d="M12,12A6,6,0,1,0,6,6,6.006,6.006,0,0,0,12,12ZM12,2A4,4,0,1,1,8,6,4,4,0,0,1,12,2Z" />
                    <path d="M12,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,2,0,7,7,0,0,1,14,0,1,1,0,0,0,2,0A9.01,9.01,0,0,0,12,14Z" />
                </svg>
                {isAuth && (
                    <svg
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            dispatch(logout());
                            window.location.reload();
                            window.location.href = "/";
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        id="Layer_1"
                        data-name="Layer 1"
                        viewBox="0 0 24 24"
                        width="30"
                        height="30"
                    >
                        <path d="M11.5,16A1.5,1.5,0,0,0,10,17.5v.8A2.7,2.7,0,0,1,7.3,21H5.7A2.7,2.7,0,0,1,3,18.3V5.7A2.7,2.7,0,0,1,5.7,3H7.3A2.7,2.7,0,0,1,10,5.7v.8a1.5,1.5,0,0,0,3,0V5.7A5.706,5.706,0,0,0,7.3,0H5.7A5.706,5.706,0,0,0,0,5.7V18.3A5.706,5.706,0,0,0,5.7,24H7.3A5.706,5.706,0,0,0,13,18.3v-.8A1.5,1.5,0,0,0,11.5,16Z" />
                        <path d="M22.561,9.525,17.975,4.939a1.5,1.5,0,0,0-2.121,2.122l3.411,3.411L7,10.5a1.5,1.5,0,0,0,0,3H7l12.318-.028-3.467,3.467a1.5,1.5,0,0,0,2.121,2.122l4.586-4.586A3.505,3.505,0,0,0,22.561,9.525Z" />
                    </svg>
                )}
            </Stack>
        </Stack>
    );
};

export default Navbar;
