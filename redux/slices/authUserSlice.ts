import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const getAuthUser = createAsyncThunk(
    'getAuthUser',
    async (accessToken: string | null) => {
        try {
            const userData = await fetch(`${process.env.currentAuthURL}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                credentials: 'include'
            })
            const data = await userData.json()
            return data
        }
        catch (error) {
            console.log(error)
        }
    }
);

const AuthUser = createSlice({
    name: 'getAuthUser',
    initialState: {
        loading: false,
        authData: null,
        error: false
    },
    reducers: {

    },
    extraReducers(builder) {
        builder
            .addCase(getAuthUser.pending, (state) => {
                state.loading = true,
                    state.authData = null,
                    state.error = false
            })
            .addCase(getAuthUser.fulfilled, (state, action) => {
                state.loading = false,
                    state.authData = action.payload,
                    state.error = false
            })
            .addCase(getAuthUser.rejected, (state) => {
                state.loading = false,
                    state.authData = null,
                    state.error = true
            })
    },

});

export default AuthUser.reducer;