import React, { useEffect, useState } from "react";
import styles from "./Users.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../actions/users-api";
import { downloadFile, openFile, setFile } from "../actions/file-api";
import { useRef } from "react";
import axios from "axios";

export const Users = ({ role }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);
    const [users, setUsers] = useState("");
    const [isShowModal, setIsShowModal] = useState(false);
    const [curType, setCurType] = useState("food");
    const [curInd, setCurInd] = useState(0);

    const [listExes, setListExes] = useState([]);
    const [listFood, setListFood] = useState([]);

    const [listExesState, setListExesState] = useState([]);
    const [listFoodState, setListFoodState] = useState([]);

    const modalRef = useRef();

    useEffect(() => {
        const getUsersData = async () => {
            const users = await dispatch(getUsers());
            setUsers(users);

            const exes = await axios.get("http://localhost:5005/exes/list");
            setListExes(exes.data);
            setListExesState(
                Array.from(Array(exes.data.length)).map(() => false)
            );
            const food = await axios.get("http://localhost:5005/food/all");
            setListFood(food.data);
            setListFoodState(
                Array.from(Array(food.data.length)).map(() => false)
            );
        };

        getUsersData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const handleChange = (type, ind) => {
        setIsShowModal(true);
        setCurType(type);
        setCurInd(ind);
    };

    const handleClick = () => {
        try {
            if (curType === "food") {
                const arr = listFoodState
                    .map((item, ind) => (item ? ind + 1 : 0))
                    .filter((el) => el);
                axios.post(`http://localhost:5005/users/food`, {
                    data: arr.join(", "),
                    id: curInd,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 300);
            } else {
                const arr = listExesState
                    .map((item, ind) => (item ? ind + 1 : 0))
                    .filter((el) => el);
                axios.post(`http://localhost:5005/users/exes`, {
                    data: arr.join(", "),
                    id: curInd,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 300);
            }

            return;
        } catch (error) {
            alert("Something went wrong");
        }
    };

    const handleCheckInput = (e, ind, type) => {
        const state = e.target.checked;
        if (type === "food") {
            setListFoodState((prev) => {
                prev[ind] = state;
                return [...prev];
            });
        } else {
            setListExesState((prev) => {
                prev[ind] = state;
                return [...prev];
            });
        }
    };

    const newUsers =
        users &&
        Object.values(users).map((userItem, index) => {
            if (
                String(userItem.spec_id) !==
                    String(user.currentUser.email[4] - 1) &&
                role !== "ADMIN"
            ) {
                return <div></div>;
            }
            return (
                <tr key={index}>
                    <td>{userItem.id}</td>
                    <td>{userItem.email.trim()}</td>
                    <td>{userItem.role === "ADMIN" ? "Yes" : "No"}</td>
                    <td>
                        <div className={styles.food}>
                            <p>{userItem.food ? userItem.food : "Пусто"}</p>
                            <p
                                onClick={() =>
                                    handleChange("food", userItem.id)
                                }
                                className={styles.change}>
                                Изменить
                            </p>
                        </div>
                    </td>
                    <td>
                        <div className={styles.exes}>
                            <p>{userItem.exes ? userItem.exes : "Пусто"}</p>
                            <p
                                onClick={() =>
                                    handleChange("exes", userItem.id)
                                }
                                className={styles.change}>
                                Изменить
                            </p>
                        </div>
                    </td>
                    {userItem.file_name ? (
                        <td
                            className={styles.blank}
                            onClick={() => {
                                dispatch(openFile(userItem.file_name));
                            }}>
                            {userItem.file_name}
                        </td>
                    ) : (
                        <td>
                            <div></div>
                        </td>
                    )}
                    <td>
                        {userItem.files.length ? (
                            userItem.files.map((file, i) => (
                                <div key={i}>
                                    <p>{file.file_name}</p>
                                    <p
                                        style={{
                                            cursor: "pointer",
                                            color: "rgb(255, 38, 37)",
                                        }}
                                        onClick={() =>
                                            dispatch(
                                                downloadFile(file.file_name)
                                            )
                                        }>
                                        скачать
                                    </p>
                                    <p
                                        style={{
                                            cursor: "pointer",
                                            color: "cornflowerblue",
                                        }}
                                        onClick={() =>
                                            dispatch(openFile(file.file_name))
                                        }>
                                        посмотреть
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div></div>
                        )}
                    </td>
                    <td>
                        <span
                            style={{
                                cursor: "pointer",
                                color: "rgb(255, 38, 37)",
                            }}
                            onClick={() =>
                                attachFile(userItem.id, userItem.files)
                            }>
                            Прикрепить
                        </span>
                    </td>
                </tr>
            );
        });

    const attachFile = (userId, files) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx";

        input.addEventListener("change", (event) => {
            const file = event.target.files[0];
            // Здесь нужно сохранить информацию о прикрепленном файле в базу данных вместе с идентификатором пользователя
            dispatch(setFile(file, file.name, userId)).then(() => {
                window.location.reload();
            });
        });

        input.click();

        // Отображаем список уже загруженных файлов для пользователя
    };

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

    return (
        <>
            <div
                onClick={(e) =>
                    e.target === e.currentTarget && setIsShowModal(false)
                }
                ref={modalRef}
                className={styles.modal}>
                {role === "USER" ? (
                    <div className={styles.modalBody}>
                        <p className={styles.header}>Оформление подписки</p>
                        <button
                            onClick={handlePay}
                            className={styles.pay}>
                            Оплатить
                        </button>
                    </div>
                ) : (
                    <div className={styles.modalBody}>
                        <p className={styles.header}>
                            Выберите{" "}
                            {curType === "food" ? "блюда" : "упражнения"} из
                            списка:
                        </p>
                        {curType === "food" ? (
                            <div className={styles.list}>
                                {listFood.length &&
                                    listFood.map((item, ind) => (
                                        <div
                                            key={ind}
                                            className={styles.item}>
                                            <input
                                                onInput={(e) =>
                                                    handleCheckInput(
                                                        e,
                                                        ind,
                                                        curType
                                                    )
                                                }
                                                id={`input${ind}`}
                                                type="checkbox"
                                            />
                                            <label htmlFor={`input${ind}`}>
                                                {item.name}
                                            </label>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className={styles.list}>
                                <div className={styles.list}>
                                    {listExes.length &&
                                        listExes.map((item, ind) => (
                                            <div
                                                key={ind}
                                                className={styles.item}>
                                                <input
                                                    onInput={(e) =>
                                                        handleCheckInput(
                                                            e,
                                                            ind,
                                                            curType
                                                        )
                                                    }
                                                    id={`input${ind}`}
                                                    type="checkbox"
                                                />
                                                <label htmlFor={`input${ind}`}>
                                                    {item.name}
                                                </label>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                        <button onClick={handleClick}>Отправить</button>
                    </div>
                )}
            </div>
            {role === "ADMIN" && (
                <div className={styles.container}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "20px",
                        }}>
                        <span style={{ fontWeight: "bold" }}>Пользователи</span>
                    </div>
                    <table className={styles.actTable}>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Email</th>
                                <th>Admin</th>
                                <th>Еда</th>
                                <th>Упражнения</th>
                                <th>Бланк</th>
                                <th>Files</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>{newUsers}</tbody>
                    </table>
                </div>
            )}
            {role === "SPEC" && (
                <div className={styles.container}>
                    <div
                        onClick={(e) =>
                            e.target === e.currentTarget &&
                            setIsShowModal(false)
                        }
                        ref={modalRef}
                        className={styles.modal}>
                        <div className={styles.modalBody}>
                            <p className={styles.header}>
                                Выберите{" "}
                                {curType === "food" ? "блюда" : "упражнения"} из
                                списка:
                            </p>
                            {curType === "food" ? (
                                <div className={styles.list}>
                                    {listFood.length &&
                                        listFood.map((item, ind) => (
                                            <div
                                                key={ind}
                                                className={styles.item}>
                                                <input
                                                    onInput={(e) =>
                                                        handleCheckInput(
                                                            e,
                                                            ind,
                                                            curType
                                                        )
                                                    }
                                                    id={`input${ind}`}
                                                    type="checkbox"
                                                />
                                                <label htmlFor={`input${ind}`}>
                                                    {item.name}
                                                </label>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className={styles.list}>
                                    <div className={styles.list}>
                                        {listExes.length &&
                                            listExes.map((item, ind) => (
                                                <div
                                                    key={ind}
                                                    className={styles.item}>
                                                    <input
                                                        onInput={(e) =>
                                                            handleCheckInput(
                                                                e,
                                                                ind,
                                                                curType
                                                            )
                                                        }
                                                        id={`input${ind}`}
                                                        type="checkbox"
                                                    />
                                                    <label
                                                        htmlFor={`input${ind}`}>
                                                        {item.name}
                                                    </label>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                            <button onClick={handleClick}>Отправить</button>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "20px",
                        }}>
                        <span style={{ fontWeight: "bold" }}>Пользователи</span>
                    </div>
                    <table className={styles.actTable}>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Email</th>
                                <th>Admin</th>
                                <th>Еда (номера позиций от 1 до 22)</th>
                                <th>Упражнения (номера от 1 до 12)</th>
                                <th>Бланк</th>
                                <th>Files</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>{newUsers}</tbody>
                    </table>
                </div>
            )}
            {role === "USER" && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                    }}>
                    <div>
                        <h2
                            style={{
                                textAlign: "center",
                                marginTop: "50px",
                                padding: "20px 0",
                            }}>
                            Мой профиль
                        </h2>
                        <h2
                            style={{
                                textAlign: "center",
                                margin: "10px 0 30px",
                                padding: "10px",
                            }}>
                            Ваша почта: {user.currentUser.email}
                        </h2>
                    </div>
                    {user.currentUser.is_sub ? (
                        <div className={styles.subscribe}>
                            <p>Подписка оформлена</p>
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
                                onClick={handleDismiss}>
                                Отменить подписку
                            </button>
                        </div>
                    ) : (
                        <div className={styles.filesSection}>
                            <button
                                onClick={() => setIsShowModal(true)}
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
                                }}>
                                Оформить подписку
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};
