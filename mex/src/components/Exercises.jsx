import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchData } from "../utils/fetchData";
import styles from "./Exercises.module.scss";
import { getExerciseImg } from "../actions/exes-api";

const Exercises = () => {
    const [search, setSearch] = useState("");
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        const fetchExercisesData = async () => {
            let data = await fetchData("http://localhost:5005/exes/list");

            data = await Promise.all(
                data.map(async (item) => {
                    const path = await getExerciseImg(item.image);
                    return { ...item, image: path };
                })
            );

            setTimeout(() => {
                setExercises([...data]);
            }, 1000);
        };

        fetchExercisesData();
    }, []);

    const handleSearch = async () => {
        let data = await fetchData(
            "http://localhost:5005/exes/list?query=" + search
        );

        data = await Promise.all(
            data.map(async (item) => {
                const path = await getExerciseImg(item.image);
                return { ...item, image: path };
            })
        );

        setTimeout(() => {
            setExercises([...data]);
        }, 1000);
    };

    return (
        <div className={styles.container}>
            <Box
                style={{
                    display: "flex",
                    justifyContent: "center",
                }}
                position="relative"
                mb="72px">
                <TextField
                    height="76px"
                    sx={{
                        input: {
                            fontWeight: "700",
                            border: "none",
                            borderRadius: "4px",
                        },
                        width: { lg: "1170px", xs: "350px" },
                        backgroundColor: "#fff",
                        borderRadius: "40px",
                    }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value.toLowerCase())}
                    placeholder="Поиск упражнений"
                    type="text"
                />
                <Button
                    className="search-btn"
                    sx={{
                        bgcolor: "#FF2625",
                        color: "#fff",
                        textTransform: "none",
                        width: { lg: "173px", xs: "80px" },
                        height: "56px",
                        // position: "absolute",
                        right: "0px",
                        fontSize: { lg: "20px", xs: "14px" },
                    }}
                    onClick={handleSearch}>
                    Поиск
                </Button>
            </Box>
            <div className={styles.list}>
                {exercises.map((item, ind) => {
                    console.log(item);
                    return (
                        <div
                            key={ind}
                            className={styles.item}>
                            <p className={styles.header}>{item.name}</p>
                            <p className={styles.muscules}>
                                Основные группы мышщ: {item.muscules}
                            </p>
                            <img
                                src={item.image}
                                alt="exersise"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Exercises;
