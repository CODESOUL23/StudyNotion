import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    signupData: null,
    token : localStorage.getItem("token")? JSON.parse(localStorage.getItem("token")) : null,
    loading: false,
    //Humne yaha pr local storage se isiliye fetch kiya hai coz agar hum apna browser ya computer
    //band bhi karde toh local storage mei value saved rehti hai...
};

const authSlice = createSlice({
    name : "auth",
    initialState : initialState,
    reducers : {
        setSignupData(state, value) {
            state.signupData = value.payload;
        },
        setToken(state , value){
            state.token = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
    },
});

export const {setSignupData, setToken, setLoading} = authSlice.actions;
export default  authSlice.reducer;