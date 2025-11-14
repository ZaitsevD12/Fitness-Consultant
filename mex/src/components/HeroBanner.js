import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import "./HeroBanner.scss";

import HeroBannerImage from "../assets/images/banner.png";
import sports1 from "../assets/images/sports1.jpg";
import { useNavigate } from "react-router-dom";
import SpecList from "./SpecList";
import { useSelector } from "react-redux";
import axios from "axios";
import { useState } from "react";

const HeroBanner = ({ isAuth }) => {
    const user = useSelector((state) => state.auth);
    const modalRef = useRef();
    const [isShowModal, setIsShowModal] = useState(false);

    const navigate = useNavigate();

    const handlePay = async () => {
        try {
            await axios.get(
                "http://localhost:5005/users/pay?id=" + user.currentUser.id
            );
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            alert("При оплате что-то пошло не так");
        }
    };

    const handleDismiss = async () => {
        try {
            await axios.get(
                "http://localhost:5005/users/dismiss?id=" + user.currentUser.id
            );
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            alert("При отмене подписки что-то пошло не так");
        }
    };

    useEffect(() => {
        if (modalRef.current) {
            if (isShowModal) {
                modalRef.current.style.opacity = 1;
                modalRef.current.style.zIndex = 20;
            } else {
                modalRef.current.style.opacity = 0;
                setTimeout(() => {
                    modalRef.current.style.zIndex = -20;
                }, 500);
            }
        }
    }, [modalRef, isShowModal]);

    return (
        <Box
            position="relative"
            sx={{ mt: { lg: "102px", xs: "70px" }, ml: { sm: "50px" } }}
            p="20px"
        >
            <img
                src={HeroBannerImage}
                alt="hero-banner"
                className="hero-banner-img"
            />
            <div
                onClick={(e) =>
                    e.target === e.currentTarget && setIsShowModal(false)
                }
                ref={modalRef}
                className="modal"
            >
                <div className="modalBody">
                    <p className="header">Оформление подписки</p>
                    <button onClick={handlePay} className="pay">
                        Оплатить
                    </button>
                </div>
            </div>
            <div className="info1">
                <div>
                    <Typography
                        color="#FF2625"
                        fontWeight="600"
                        fontSize="26px"
                    >
                        Фитнесс консультант
                    </Typography>
                    <Typography
                        fontWeight={700}
                        sx={{ fontSize: { lg: "44px", xs: "40px" } }}
                        mb="23px"
                        mt="30px"
                    >
                        Потей, улыбайся <br />И повторяй
                    </Typography>
                    <Typography
                        fontSize="22px"
                        fontFamily="Alegreya"
                        lineHeight="35px"
                    >
                        Ознакомьтесь с наиболее эффективными упражнениями,{" "}
                        <br />
                        подобранными специально для вас
                    </Typography>
                    {user.currentUser.is_sub ? (
                        <div className="subscribe">
                            <p style={{ marginTop: 15 }}>Подписка оформлена</p>
                            <button
                                style={{
                                    cursor: "pointer",
                                    marginTop: "25px",
                                    width: "200px",
                                    textAlign: "center",
                                    background: "rgb(255, 38, 37)",
                                    padding: "5px 10px",
                                    fontSize: "18px",
                                    color: "white",
                                    border: "none",
                                }}
                                onClick={handleDismiss}
                            >
                                Отменить подписку
                            </button>
                        </div>
                    ) : (
                        <div className="filesSection">
                            <button
                                onClick={() => {
                                    if (!isAuth) {
                                        navigate("/login");
                                    }
                                    setIsShowModal(true);
                                }}
                                style={{
                                    cursor: "pointer",
                                    marginTop: "45px",
                                    width: "200px",
                                    textAlign: "center",
                                    background: "rgb(255, 38, 37)",
                                    padding: "14px",
                                    fontSize: "22px",
                                    color: "white",
                                    border: "none",
                                }}
                            >
                                Оформить подписку
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="info2">
                <p className="header">
                    Наш сервис поможет Вам добиться идеальной фигуры
                </p>
                <div>
                    <img src={sports1} alt="hero-banner" />
                    <div className="list">
                        <div className="item">
                            <p className="itemText">
                                Следуйте назначенной диете
                            </p>
                        </div>
                        <div className="item">
                            <p className="itemText">
                                Выполняйте самые эффективные упражнения
                            </p>
                        </div>
                        <div className="item">
                            <p className="itemText">
                                Получайте консультации от лучших специалистов
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <SpecList />
        </Box>
    );
};

export default HeroBanner;
