import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/AuthSlice';
import bookDataReducer from './slice/BooksSlice';
import noticeDataReducer from './slice/NoticeSlice';
import dashboardDataReducer from './slice/DashBoardSlice';
import profileDataReducer from './slice/ProfileSlice';


export default configureStore({
    reducer: {
        auth: authReducer,
        bookData: bookDataReducer,
        noticeData: noticeDataReducer,
        dashboardData: dashboardDataReducer,
        profile: profileDataReducer,
    },
});
