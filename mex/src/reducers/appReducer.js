let initialState = {
    initialize: false,
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case "INITIALIZE_SUCCESS":
            return {
                ...state,
                initialize: true,
            };
        default:
            return state;
    }
};

export const initializeSuccess = () => ({ type: "INITIALIZE_SUCCESS" });

export default appReducer;
