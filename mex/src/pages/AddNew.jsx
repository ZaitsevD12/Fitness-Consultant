import { useEffect, useRef, useState } from "react";
import styles from "./AddNew.module.scss";
import axios from "axios";

const AddNew = () => {
    const [type, setType] = useState("food");
    const [file, setFile] = useState();
    const imgRef = useRef();

    const initialState = {
        foodName: "",
        foodCalories: "",
        foodBaking: "",
        exesName: "",
        exesMuscules: "",
    };

    const [inputsData, setInputsData] = useState({ ...initialState });

    const handleFileChange = (e) => {
        const currFile = e.target.files[0];
        if (!currFile) return;
        if (
            !["jpg", "png", "jpeg", "gif"].includes(
                currFile.name.split(".").pop()
            )
        ) {
            alert("Вы прикрепили не изображение (.jpg, .png, .jpeg, .gif)");
            e.target.value = "";
            return;
        }
        setFile(currFile);
        const fr = new FileReader();
        fr.onload = () => {
            imgRef.current.src = fr.result;
        };
        fr.readAsDataURL(currFile);
    };

    useEffect(() => {
        setFile();
    }, [type]);

    const submit = async () => {
        if (!file) {
            alert("Вы не прикрепили файл");
            return;
        }
        if (type === "food") {
            if (!inputsData.foodName || !inputsData.foodCalories) {
                alert("Вы заполнили не все поля");
                return;
            }
            const formData = new FormData();
            const fileExtension = file.name.split(".").pop();
            const renamedFileName = `fitness.${fileExtension}`;
            const renamedFile = new File([file], renamedFileName);
            formData.append("name", inputsData.foodName);
            formData.append("calories", inputsData.foodCalories);
            formData.append("baking", inputsData.foodBaking);
            formData.append("file", renamedFile);
            const res = await axios.post(
                "http://localhost:5005/food/saveitem",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (res.data.status === "success") {
                alert("Добавление прошло успешно");
                setInputsData({ ...initialState });
                setFile();
            }
        } else {
            if (!inputsData.exesMuscules || !inputsData.exesName) {
                alert("Вы заполнили не все поля");
                return;
            }
            const formData = new FormData();
            const fileExtension = file.name.split(".").pop();
            const renamedFileName = `fitness.${fileExtension}`;
            const renamedFile = new File([file], renamedFileName);
            formData.append("name", inputsData.exesName);
            formData.append("muscules", inputsData.exesMuscules);
            formData.append("file", renamedFile);
            const res = await axios.post(
                "http://localhost:5005/exes/saveitem",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (res.data.status === "success") {
                alert("Добавление прошло успешно");
                setInputsData({ ...initialState });
                setFile();
            }
        }
    };

    return (
        <div className={styles.container}>
            <p className={styles.header}>
                Добавление {type === "food" ? "блюда" : "упражнения"}
            </p>
            <button
                className={styles.change}
                onClick={() =>
                    setType((prev) => (prev === "food" ? "exes" : "food"))
                }>
                Сменить на добавление {type === "food" ? "упражнения" : "блюда"}
            </button>
            {type === "food" ? (
                <div className={styles.form}>
                    <input
                        value={inputsData.foodName}
                        onChange={(e) =>
                            setInputsData((prev) => {
                                return { ...prev, foodName: e.target.value };
                            })
                        }
                        className={styles.input}
                        placeholder="Введите название"
                        type="text"
                    />
                    <input
                        value={inputsData.foodCalories}
                        onChange={(e) =>
                            setInputsData((prev) => {
                                return {
                                    ...prev,
                                    foodCalories: e.target.value,
                                };
                            })
                        }
                        className={styles.input}
                        placeholder="Введите количество калорий"
                        type="number"
                    />
                    <textarea
                        value={inputsData.foodBaking}
                        onChange={(e) =>
                            setInputsData((prev) => {
                                return {
                                    ...prev,
                                    foodBaking: e.target.value,
                                };
                            })
                        }
                        className={styles.input}
                        placeholder="Введите способ приготовления"
                        type="text"
                    />
                    <input
                        accept=".jpg,.jpeg,.png,.gif"
                        type="file"
                        onChange={handleFileChange}
                    />
                    {file && (
                        <img
                            ref={imgRef}
                            src=""
                            alt="thumb"
                            className={styles.thumb}
                        />
                    )}
                    <button
                        onClick={submit}
                        className={styles.submit}>
                        Отправить
                    </button>
                </div>
            ) : (
                <div className={styles.form}>
                    <input
                        value={inputsData.exesName}
                        onChange={(e) =>
                            setInputsData((prev) => {
                                return { ...prev, exesName: e.target.value };
                            })
                        }
                        className={styles.input}
                        placeholder="Введите название"
                        type="text"
                    />
                    <input
                        value={inputsData.exesMuscules}
                        onChange={(e) =>
                            setInputsData((prev) => {
                                return {
                                    ...prev,
                                    exesMuscules: e.target.value,
                                };
                            })
                        }
                        className={styles.input}
                        placeholder={
                            type === "food"
                                ? "Введите количество калорий"
                                : "Введите список мышц"
                        }
                        type={type === "food" ? "number" : "text"}
                    />
                    <input
                        accept=".jpg,.jpeg,.png,.gif"
                        type="file"
                        onChange={handleFileChange}
                    />
                    {file && (
                        <img
                            ref={imgRef}
                            src=""
                            alt="thumb"
                            className={styles.thumb}
                        />
                    )}
                    <button
                        onClick={submit}
                        className={styles.submit}>
                        Отправить
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddNew;
