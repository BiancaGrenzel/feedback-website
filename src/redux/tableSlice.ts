import { createSlice } from "@reduxjs/toolkit";

interface TableState {
  reload: boolean;
  name: string;
}

const initialState: TableState = {
  reload: false,
  name: "",
};

const slice = createSlice({
  name: "table",
  initialState,
  reducers: {
    onReload(state, { payload }) {
      return {
        ...state,
        reload: payload.reload,
        name: payload.name,
      };
    },
  },
});

export const { onReload } = slice.actions;

export default slice.reducer;
