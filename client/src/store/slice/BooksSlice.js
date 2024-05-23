import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    bookList: null,
    bookCatagory: null,
    bookData: null,
    bookWatchList: null,
};

const bookDataSlice = createSlice({
    name: 'bookData',
    initialState,
    reducers: {
        addBookList(state, action) {
            state.bookList = action.payload;
        },
        deleteBookList(state, action) {
            state.bookList = null;
        },
        addBookCatagory(state, action) {
            state.bookCatagory = action.payload;
        },
        deleteBookCatagory(state, action) {
            state.bookCatagory = null;
        },
        addBookData(state, action) {
            state.bookData = action.payload;
        },
        deleteBookData(state, action) {
            state.bookData = null;
        },
        addBookWatchList(state, action) {
            state.bookWatchList = action.payload;
        },
        deleteBookWatchList(state, action) {
            state.bookWatchList = null;
        },
    }
});

export const {
    addBookList,
    deleteBookList,
    addBookCatagory,
    deleteBookCatagory,
    addBookData,
    deleteBookData,
    addBookWatchList,
    deleteBookWatchList
} = bookDataSlice.actions;

export default bookDataSlice.reducer;

