import axios from "axios";

export const attendToSpec = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(
                `http://localhost:5005/spec/attend/` + id,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
        } catch (e) {
            console.log(e.response.data.message);
        }
    };
};
