import axios from "axios";

export const getUsers = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(
                `http://localhost:5005/users/getusers`
            );
            return response.data;
        } catch (e) {
            alert(e.response.data.message);
        }
    };
};

export const getUser = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                `http://localhost:5005/users/getuser`,
                { id }
            );
            return response.data;
        } catch (e) {
            alert(e.response.data.message);
        }
    };
};
