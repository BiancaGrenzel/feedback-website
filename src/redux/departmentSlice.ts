import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "department",
  initialState: {
    id: "",
    name: "",
    filters: {
      name: '',
      id: '',
    }
  },
  reducers: {
    changeDepartment(state, {payload}) {
        return {
            ...state,
            id : payload.id,
            name : payload.name
        }
    },
    changeDepartmentFilters(state, {payload}) {
        return {
            ...state,
            filters : payload.filters
        }
    }
  },
});

export const { changeDepartment, changeDepartmentFilters } = slice.actions;
export default slice.reducer;
