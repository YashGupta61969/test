import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: '',
    user: {}
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser: (state, { payload }) => {
            state.token = payload.token;
            state.user = payload.user;
        },
    }
})

export default userSlice.reducer

export const { addUser } = userSlice.actions