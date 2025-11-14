import React, { useState, useEffect } from "react";
import { getUser } from "../actions/users-api";
import { useDispatch, useSelector } from "react-redux";
import styles from "./EntryFood.module.css";
import Food from "./Food";
import { downloadFile, openFile, setFile } from "../actions/file-api";
import { Navigate } from "react-router-dom";

const EntryFood = (props) => {
    const [users, setUsers] = useState("");
    const [file, setFiles] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.currentUser);

    const text = props.text
        ? props.text
        : "Специалист ещё не прикреплял файлов";

    useEffect(() => {
        const getUsersData = async () => {
            const users = await dispatch(getUser(currentUser.id));
            setUsers(users);
        };
        getUsersData();
    }, []);

    const handleFileChange = (event) => {
        setFiles(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch(setFile(file, file.name, users.id)).then(() => {
            console.log("???");
        });
        setShowModal(false);
        // Handle form submission logic here
    };

    if (users.files && users.files.length > 0) {
        const Myfile =
            users.files &&
            users.files.map((file, i) => (
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
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "30px",
                }}
            >
                <h4
                    style={{
                        fontSize: 23,
                        fontFamily:
                            '"Roboto", "Helvetica", "Arial", sans-serif',
                    }}
                >
                    Мои файлы
                </h4>
                <div style={{ display: "flex", marginTop: 15 }}>{Myfile}</div>
            </div>
        );
        // };
    }

    if (props.isAuth && props.isAuth === false) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <p className={styles.noFile}>{text}</p>
            <div
                onClick={(e) => {
                    e.target === e.currentTarget && setShowModal(false);
                }}
                className={`${styles.modalOverlay} ${
                    file ? styles.overlayActive : ""
                } ${showModal ? styles.overlayActive : ""}`}
            >
                <div className={styles.modal}>
                    <h2>Прикрепите файл</h2>
                    <form
                        style={{ background: "white" }}
                        onSubmit={handleSubmit}
                    >
                        <input type="file" onChange={handleFileChange} />
                        <button type="submit">готово</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EntryFood;
