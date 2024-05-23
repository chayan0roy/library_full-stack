import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notice: null,
};

const noticeDataSlice = createSlice({
    name: 'noticeData',
    initialState,
    reducers: {
        addNotice(state, action) {
            state.notice = action.payload;
        },
        deleteNotice(state, action) {
            state.notice = null;
        },
    }
});

export const { addNotice, deleteNotice } = noticeDataSlice.actions;

export default noticeDataSlice.reducer;

