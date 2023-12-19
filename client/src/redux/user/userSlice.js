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
        updateUserStart: (state) =>{
            state.loading = true;
        },
        updateUserSuccess: (state, action) =>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null; 
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteUserStart: (state) =>{
            state.loading = true;
        },
        deleteUserSuccess: (state, action) =>{
            state.currentUser = null    ;
            state.loading = false;
            state.error = null; 
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        signoutStart: (state) =>{
            state.loading = true;
        },
        signoutSuccess: (state, action) =>{
            state.currentUser = null    ;
            state.loading = false;
            state.error = null; 
        },
        signoutFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const {
    signinStart, 
    signinSuccess, 
    signinFailure, 
    updateUserStart, 
    updateUserSuccess, 
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutStart,
    signoutSuccess,
    signoutFailure
    } = userSlice.actions;

export default userSlice.reducer;