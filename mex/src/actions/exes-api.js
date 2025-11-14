import axios from "axios";

export const getExerciseImg = async (file_name) => {
    try {
        const response = await axios.get(
            `http://localhost:5005/exes/getSrc/${file_name}`,
            {
                responseType: "arraybuffer", // устанавливаем тип ответа как arraybuffer
            }
        );

        const file = new Blob([response.data], {
            type: response.headers["content-type"],
        });

        const fileURL = URL.createObjectURL(file);
        return fileURL;
    } catch (error) {
        // alert(error.response.data.message);
    }
};
