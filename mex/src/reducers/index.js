import {applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import thunkMiddleware from "redux-thunk"
import appReducer from "./appReducer";
import authReducer from "./authReducer";

let reducers = combineReducers({
    app: appReducer,
    auth: authReducer,
})
let store = createStore(reducers,applyMiddleware(thunkMiddleware))
window.store=store

export default store