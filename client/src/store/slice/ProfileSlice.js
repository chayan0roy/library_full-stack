import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    profile: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        addProfileData(state, action) {
            state.profile = action.payload;
        },
        deleteProfileData(state) {
            state.profile = null;
        },
    },
});


export const { addProfileData, deleteProfileData } = profileSlice.actions;
export default profileSlice.reducer;


