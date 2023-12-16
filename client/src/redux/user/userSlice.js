import { createSlice } from "@reduxjs/toolkit";

// create a slice to update the state   
const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};

// create user slice to update the user data in the database
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signinStart: (state) =>{
            state.loading = true;
        },
        signinSuccess: (state, action) =>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null; 
        },
        signinFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const {signinStart, signinSuccess, signinFailure} = userSlice.actions;

export default userSlice.reducer;