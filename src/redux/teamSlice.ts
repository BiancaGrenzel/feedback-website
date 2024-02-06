import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "team",
  initialState: {
    id: "",
    name: "",
    filters: {
      name: '',
      id: '',
    }
  },
  reducers: {
    changeTeam(state, {payload}) {
        return {
            ...state,
            id : payload.id,
            name : payload.name
        }
    },
    changeTeamFilters(state, {payload}) {
        return {
            ...state,
            filters : payload.filters
        }
    }
  },
});

export const { changeTeam, changeTeamFilters } = slice.actions;
export default slice.reducer;
