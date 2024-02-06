import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "feedback",
  initialState: {
    id: "",
    date: "",
    feedback: "",
    id_rated_user: "",
    id_user: "",
  },
  reducers: {
    changeFeedback(state, {payload}) {
        return {
            ...state,
            id : payload.id,
            date : payload.date,
            feedback : payload.feedback,
            id_rated_user : payload.id_rated_user,
            id_user : payload.id_user
        }
    },
  },
});

export const { changeFeedback } = slice.actions;
export default slice.reducer;
