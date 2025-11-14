import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import "./Food.css";
import { useDispatch } from "react-redux";
import { downloadFile, openFile } from "../actions/file-api";
import axios from "axios";

export default function Food(props) {
    const currentDate = new Date();
    const [food, setFoods] = useState(() => {
        const savedFoods = localStorage.getItem("foods");
        return savedFoods ? JSON.parse(savedFoods) : [];
    });
    const [ateFoods, setAteFoods] = useState(() => {
        const savedAteFoods = localStorage.getItem("ateFoods");
        return savedAteFoods ? Number(savedAteFoods) : 0;
    });
    const [foodLength, setFoodLength] = useState(0);

    useEffect(() => {
        const getFood = async () => {
            const { data } = await axios.get("http://localhost:5005/food/list");

            setFoods(data);
            setFoodLength(100 / data.length);
            setAteFoods(0);
            localStorage.setItem("foods", JSON.stringify(data));
            localStorage.setItem("ateFoods", 0);
        };

        const lastRefresh = localStorage.getItem("lastRefresh");
        const oneDayInMs = 1000 * 60 * 60 * 24;

        if (!lastRefresh || currentDate - new Date(lastRefresh) >= oneDayInMs) {
            getFood();
            localStorage.setItem("lastRefresh", currentDate.toString());
        } else {
            const savedFoods = localStorage.getItem("foods");
            setFoods(savedFoods ? JSON.parse(savedFoods) : []);
            setFoodLength(savedFoods ? 100 / JSON.parse(savedFoods).length : 0);

            const savedAteFoods = localStorage.getItem("ateFoods");
            setAteFoods(savedAteFoods ? Number(savedAteFoods) : 0);
        }

        const ateFoodsIntervalId = setInterval(() => {
            setAteFoods(0);
            localStorage.setItem("ateFoods", 0);
        }, oneDayInMs);

        const refreshIntervalId = setInterval(() => {
            getFood();
            localStorage.setItem("lastRefresh", currentDate.toString());
        }, oneDayInMs);

        return () => {
            clearInterval(ateFoodsIntervalId);
            clearInterval(refreshIntervalId);
        };
    }, []);

    function markFoodAsEaten(id) {
        setFoods((prevFoods) => {
            const updatedFoods = prevFoods.map((foodItem) => {
                console.log(foodItem);
                if (foodItem.idMeal === id) {
                    return { ...foodItem, isEaten: true };
                }
                return foodItem;
            });
            localStorage.setItem("foods", JSON.stringify(updatedFoods));
            const newAteFoods = ateFoods + 1;
            setAteFoods(newAteFoods);
            localStorage.setItem("ateFoods", newAteFoods);
            return updatedFoods;
        });
    }
    const dispatch = useDispatch();

    const MyFiles = (props) => {
        const Myfile =
            props.users.files &&
            props.users.files.map((file, i) => (
                <div
                    key={i}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        marginLeft: "10px",
                        cursor: "pointer",
                    }}
                >
                    <p>
                        <svg
                            id="Layer_1"
                            height="30"
                            viewBox="0 0 24 24"
                            width="30"
                            xmlns="http://www.w3.org/2000/svg"
                            data-name="Layer 1"
                        >
                            <path d="m17 14a1 1 0 0 1 -1 1h-8a1 1 0 0 1 0-2h8a1 1 0 0 1 1 1zm-4 3h-5a1 1 0 0 0 0 2h5a1 1 0 0 0 0-2zm9-6.515v8.515a5.006 5.006 0 0 1 -5 5h-10a5.006 5.006 0 0 1 -5-5v-14a5.006 5.006 0 0 1 5-5h4.515a6.958 6.958 0 0 1 4.95 2.05l3.484 3.486a6.951 6.951 0 0 1 2.051 4.949zm-6.949-7.021a5.01 5.01 0 0 0 -1.051-.78v4.316a1 1 0 0 0 1 1h4.316a4.983 4.983 0 0 0 -.781-1.05zm4.949 7.021c0-.165-.032-.323-.047-.485h-4.953a3 3 0 0 1 -3-3v-4.953c-.162-.015-.321-.047-.485-.047h-4.515a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3z" />
                        </svg>
                    </p>
                    <p onClick={() => dispatch(downloadFile(file.fileName))}>
                        Скачать
                    </p>
                    <p onClick={() => dispatch(openFile(file.fileName))}>
                        Посмотреть
                    </p>
                </div>
            ));
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "30px",
                }}
            >
                <h4>Мои файлы</h4>
                {Myfile}
            </div>
        );
    };

    return (
        <div
            style={{
                padding: "20px",
                marginTop: "40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
            className="mainBox"
        >
            <MyFiles users={props.users} />
            <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ fontSize: { lg: "44px", xs: "30px" } }}
                mb="46px"
                style={{ alignSelf: "start" }}
            >
                Рацион на {currentDate.toLocaleDateString()}
            </Typography>
            <div style={{ position: "relative", width: "100%" }}>
                <div
                    style={{
                        width: "100%",
                        height: "10px",
                        borderRadius: "10px",
                        backgroundColor: "gray",
                        position: "absolute",
                    }}
                ></div>
                <div
                    style={{
                        width: `${ateFoods * foodLength}%`,
                        height: "10px",
                        borderRadius: "10px",
                        transitionDuration: "0.5s",
                        backgroundColor: "red",
                        position: "absolute",
                    }}
                ></div>
            </div>
            <div
                style={{
                    display: "grid",
                    rowGap: "50px",
                    columnGap: "50px",
                    justifyContent: "space-between",
                    width: "fit-content",
                    marginTop: "40px",
                }}
                className="gridBox"
            >
                {food.map((food) => (
                    <div
                        key={food.idMeal}
                        className="food-item"
                        style={{
                            display: "flex",
                            borderTop: "3px solid red",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <img
                            src={food.image}
                            alt={food.name}
                            style={{ width: "100%" }}
                        />

                        <h3>{food.name}</h3>
                        <h3>Калории (100г): {food.calories}</h3>
                        {food.isEaten ? (
                            <button
                                style={{
                                    width: "100%",
                                    transitionDuration: "0.5s",
                                    fontSize: "15px",
                                    height: "40px",
                                    backgroundColor: "gray",
                                    cursor: "pointer",
                                    color: "white",
                                    border: "none",
                                }}
                            >
                                Съедено !
                            </button>
                        ) : (
                            <button
                                onClick={() => markFoodAsEaten(food.idMeal)}
                                style={{
                                    width: "100%",
                                    height: "40px",
                                    backgroundColor: "rgb(255, 38, 37)",
                                    cursor: "pointer",
                                    color: "white",
                                    transitionDuration: "0.5s",
                                    fontSize: "15px",
                                    border: "none",
                                }}
                            >
                                Съедено !
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
