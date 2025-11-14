import { useParams } from "react-router-dom";
import styles from "./FoodItem.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { getFoodImg } from "../actions/food-api";

const FoodItem = () => {
    const { id } = useParams();
    const [foodItem, setFoodItem] = useState();

    useEffect(() => {
        const asyncFunc = async () => {
            try {
                const { data } = await axios.get(
                    process.env.REACT_APP_SERVER_PATH + "/food/one?id=" + id
                );

                let food = { ...data };
                if (data.image.slice(0, 4) !== "http") {
                    const path = await getFoodImg(data.image);
                    food = { ...food, image: path };
                }

                console.log(food);

                setFoodItem(food);
            } catch (error) {
                alert("Этой страницы не существует");
                window.location = "/";
            }
        };
        asyncFunc();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.container}>
            {foodItem && (
                <div className={styles.info}>
                    <p className={styles.header}>Блюдо {foodItem.id}</p>
                    <p className={styles.subheader}>{foodItem.name}</p>
                    <img
                        src={foodItem.image}
                        alt="food"
                    />
                    <p className={styles.subheader}>
                        Количество калорий: {foodItem.calories}
                    </p>
                    <p className={styles.subheader}>Способ приготовления:</p>
                    <p className={styles.text}>{foodItem.baking}</p>
                </div>
            )}
        </div>
    );
};

export default FoodItem;
