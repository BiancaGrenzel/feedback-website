import { configureStore } from '@reduxjs/toolkit'; 
import teamReducer from './teamSlice';
import departmentReducer from './departmentSlice';
import feedbackReducer from './feedbackSlice';
import modalReducer from './modalSlice';
import tableReducer from './tableSlice';

const store = configureStore({
    reducer: {
        team: teamReducer,
        modal: modalReducer,
        table: tableReducer,
        department: departmentReducer,
        feedback: feedbackReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;