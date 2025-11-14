import { useSelector } from "react-redux";
import styles from "./PersonalPage.module.scss";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { getExerciseImg } from "../actions/exes-api";
import EntryFood from "./EntryFood";
import { getFoodImg } from "../actions/food-api";
import classNames from "classnames";
import { Link } from "react-router-dom";

const PersonalPage = () => {
    const user = useSelector((state) => state.auth);
    const currentDate = new Date();

    const [eatenItems, setEatenItems] = useState([]);

    const [currProgress, setCurrProgress] = useState(0);

    const [exes, setExes] = useState([]);
    const [food, setFood] = useState([]);

    useEffect(() => {
        const lastRefresh = localStorage.getItem("lastRefresh");
        const oneDayInMs = 1000 * 60 * 60 * 24;

        if (!lastRefresh || currentDate - new Date(lastRefresh) >= oneDayInMs) {
            localStorage.removeItem("eatenPersonalFood");
            localStorage.setItem("lastRefresh", currentDate.toString());
        }

        if (!localStorage.getItem("eatenPersonalFood")) {
            localStorage.setItem("eatenPersonalFood", "");
            setEatenItems([]);
        } else {
            const items = localStorage.getItem("eatenPersonalFood").split(" ");
            setEatenItems(items);
        }
        if (user) {
            const asyncFunc = async () => {
                if (user.currentUser.food) {
                    const items = localStorage
                        .getItem("eatenPersonalFood")
                        .split(" ");
                    const foodArr = user.currentUser.food.split(", ");
                    for (let i = 0; i < foodArr.length; i++) {
                        const { data } = await axios.get(
                            "http://localhost:5005/food/one?id=" + foodArr[i]
                        );

                        let item = { ...data };

                        if (item.image.slice(0, 4) !== "http") {
                            item = await new Promise(async (res) => {
                                const path = await getFoodImg(item.image);
                                res({ ...item, image: path });
                            });
                        }

                        setFood((prev) => {
                            if (
                                prev &&
                                !prev
                                    .map((elem) => elem.id === item.id)
                                    .includes(true)
                            ) {
                                return [
                                    ...prev,
                                    {
                                        ...item,
                                        isEaten: items.includes(
                                            String(item.id)
                                        ),
                                    },
                                ];
                            } else {
                                return [...prev];
                            }
                        });
                    }
                    if (items.length && items[0]) {
                        setCurrProgress(items.length / foodArr.length);
                    }
                }

                if (user.currentUser.exes) {
                    const exesArr = user.currentUser.exes.split(", ");
                    for (let i = 0; i < exesArr.length; i++) {
                        const { data } = await axios.get(
                            "http://localhost:5005/exes/one?id=" + exesArr[i]
                        );

                        const item = await new Promise(async (res) => {
                            const path = await getExerciseImg(data.image);
                            res({ ...data, image: path });
                        });

                        setExes((prev) => {
                            if (
                                prev &&
                                !prev
                                    .map((elem) => elem.id === item.id)
                                    .includes(true)
                            ) {
                                return [...prev, item];
                            } else {
                                return [...prev];
                            }
                        });
                    }
                }
            };
            asyncFunc();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        localStorage.setItem("eatenPersonalFood", eatenItems.join(" "));
    }, [eatenItems]);

    const eatFood = (e, ind) => {
        e.stopPropagation();
        e.preventDefault();

        if (!eatenItems.includes(String(ind + 1))) {
            setEatenItems((prev) => [...prev, ind + 1]);
        }
        setFood((prev) => {
            prev[ind].isEaten = true;
            return prev;
        });
        const eaten = food
            .map((item, index) => Number(item.isEaten || index === ind))
            .reduce((a, b) => a + b);
        setCurrProgress(eaten / food.length);
    };

    return (
        <div className={styles.container}>
            {!food.length && !exes.length && (
                <div className={styles.empty}>
                    У Вас нет назначенных упражнений или блюд
                </div>
            )}
            {food.length ? (
                <>
                    <p className={styles.header}>
                        Список назначенных Вам блюд:
                    </p>
                    <div className={styles.progress}>
                        <div style={{ width: `${currProgress * 100}%` }}></div>
                    </div>
                    <p className={styles.ration}>Ваш рацион</p>
                    <div className={classNames(styles.list, styles.foodList)}>
                        {food.map((item, ind) => (
                            <Link
                                to={`/food/${item.id}`}
                                key={ind}
                                className={styles.foodLink}>
                                <div
                                    className={styles.item}
                                    onClick={() => console.log("CLICKED")}>
                                    <p>
                                        {ind + 1}. {item.name}
                                    </p>
                                    <img
                                        src={item.image}
                                        alt="food"
                                    />
                                    <button
                                        disabled={
                                            item.isEaten ||
                                            eatenItems.includes(String(ind + 1))
                                        }
                                        onClick={(e) => eatFood(e, ind)}>
                                        Сьесть
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            ) : (
                <div></div>
            )}
            {exes.length ? (
                <>
                    <p className={styles.header}>
                        Список назначенных Вам упражнений:
                    </p>
                    <div className={styles.list}>
                        {exes.map((item, ind) => (
                            <div
                                className={styles.item}
                                key={ind}>
                                <p>
                                    {ind + 1}. {item.name}
                                </p>
                                <img
                                    src={item.image}
                                    alt="food"
                                />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div></div>
            )}
            <EntryFood />
        </div>
    );
};

export default PersonalPage;
