import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getLogin = createAsyncThunk(
    'getLogin',
    async ({ userName, password }: { userName: string, password: string }) => {
        try {
            const response = await fetch(`${process.env.getTokenURL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: (userName).toLowerCase(),
                    password: (password).toLowerCase(),
                    expiresInMins: 30,
                }),
                credentials: 'include'
            });
            const data = await response.json();
            return data
        }
        catch (error) {
            console.log(error)
        }
    }
);

const Login = createSlice({
    name: 'getLogin',
    initialState: {
        loading: false,
        loginData: null,
        error: false
    },
    reducers: {
        clearLogin: (state) => {
            state.loading = false,
                state.loginData = null,
                state.error = false
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getLogin.pending, (state) => {
                state.loading = true,
                    state.loginData = null,
                    state.error = false
            })
            .addCase(getLogin.fulfilled, (state, action) => {
                state.loading = false,
                    state.loginData = action.payload,
                    state.error = false
            })
            .addCase(getLogin.rejected, (state) => {
                state.loading = false,
                    state.loginData = null,
                    state.error = true
            })
    },
});

export const { clearLogin } = Login.actions;

export default Login.reducer;