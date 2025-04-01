import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getLocation = createAsyncThunk(
    'getLocation',
    async (city: string) => {
        try {
            const city_url = `${process.env.fetchLocationURL}q=${city}&limit=1&appid=${process.env.API_KEY}`
            const response = await fetch(city_url);
            const data = await response.json();
            return data
        }
        catch (error) {
            console.log(error)
        }
    }
);

const Location = createSlice({
    name: 'getLocation',
    initialState: {
        loading: false,
        location: null,
        error: false
    },
    reducers: {
    },
    extraReducers(builder) {
        builder
            .addCase(getLocation.pending, (state) => {
                state.loading = true,
                    state.location = null,
                    state.error = false
            })
            .addCase(getLocation.fulfilled, (state, action) => {
                state.loading = false,
                    state.location = action.payload,
                    state.error = false
            })
            .addCase(getLocation.rejected, (state) => {
                state.loading = false,
                    state.location = null,
                    state.error = true
            })
    },
});

export default Location.reducer;