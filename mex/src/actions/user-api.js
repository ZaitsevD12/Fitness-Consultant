import axios from "axios";
import { initializeSuccess } from "../reducers/appReducer";
import { setUser } from "../reducers/authReducer";

export const registration = (email, password, role = "USER") => {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                "http://localhost:5005/api/register",
                { email, password, role }
            );
            dispatch(setUser(response.data.user));
            localStorage.setItem("token", response.data.token);
        } catch (e) {
            console.log(e.response.data.message);
        }
    };
};

export const login = (email, password) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                `http://localhost:5005/api/login`,
                {
                    email,
                    password,
                }
            );
            dispatch(setUser(response.data.user));
            localStorage.setItem("token", response.data.token);
            window.location.reload();
        } catch (e) {
            alert(e.response.data.message);
        }
    };
};

export const auth = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`http://localhost:5005/api/auth`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            dispatch(setUser(response.data.user));
            localStorage.setItem("token", response.data.token);
        } catch (e) {
            console.log(e.response.data.message);
            localStorage.removeItem("token");
        }
    };
};

export const initializeApp = () => {
    return async (dispatch) => {
        try {
            let promise = dispatch(auth());
            Promise.all([promise]).then((data) => {
                dispatch(initializeSuccess());
            });
        } catch (error) {
            alert(error);
        }
    };
};

export const setBlank = (file, fileName, userId) => {
    const formData = new FormData();
    const fileExtension = fileName.split(".").pop(); // Получаем расширение файла из имени файла
    const renamedFileName = `fitness.${fileExtension}`; // Замените 'newFileName' на желаемое имя файла
    const renamedFile = new File([file], renamedFileName); // Создаем новый File объект с переименованным файлом
    formData.append("userId", userId);
    formData.append("file", renamedFile);

    return async (dispatch) => {
        try {
            console.log(formData.get("file"));
            const response = await axios.post(
                `http://localhost:5005/users/saveblank`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            alert(error.response.data.message);
        }
    };
};
