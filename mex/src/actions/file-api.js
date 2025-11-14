import axios from "axios";

export const setFile = (file, fileName, userId) => {
    const formData = new FormData();
    const fileExtension = fileName.split(".").pop(); // Получаем расширение файла из имени файла
    const renamedFileName = `fitness.${fileExtension}`; // Замените 'newFileName' на желаемое имя файла
    const renamedFile = new File([file], renamedFileName); // Создаем новый File объект с переименованным файлом
    formData.append("userId", userId);
    formData.append("file", renamedFile);

    return async (dispatch) => {
        try {
            const response = await axios.post(
                `http://localhost:5005/file/savefile`,
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

export const downloadFile = (file_name) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(
                `http://localhost:5005/file/download/${file_name}`,
                {
                    responseType: "blob", // устанавливаем тип ответа как blob
                }
            );

            // создаем URL для Blob-объекта и открываем его в новой вкладке
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", file_name);
            document.body.appendChild(link);
            link.click();

            // чистим ссылку и объект Blob из памяти
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert(error.response.data.message);
        }
    };
};

export const openFile = (file_name) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(
                `http://localhost:5005/file/open/${file_name}`,
                {
                    responseType: "arraybuffer", // устанавливаем тип ответа как arraybuffer
                }
            );

            const file = new Blob([response.data], {
                type: response.headers["content-type"],
            });

            // Открываем файл в браузере
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                // Для IE/Edge
                window.navigator.msSaveOrOpenBlob(file, file_name);
            } else {
                // Для остальных браузеров
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            }
        } catch (error) {
            alert(error.response.data.message);
        }
    };
};
