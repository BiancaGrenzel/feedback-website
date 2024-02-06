import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  name: string;
}

const initialState: ModalState = {
  isOpen: false,
  name: "",
};

const slice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    changeModal(state, {payload}) {
        return {
            ...state,
            isOpen : payload.isOpen,
            name : payload.name
        }
    }
  },
});

export const { changeModal } = slice.actions;

export default slice.reducer;
