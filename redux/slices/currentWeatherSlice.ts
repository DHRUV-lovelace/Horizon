import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const getCurrentWeather = createAsyncThunk(
    'getCurrentWeather',
    async ({ latitude, longitude }: { latitude: number, longitude: number }) => {
        try {
            const weather_url = `${process.env.fetchWeatherURL}lat=${latitude}&lon=${longitude}&appid=${process.env.API_KEY}`;
            const response = await fetch(weather_url);
            const data = await response.json();
            return data
        }
        catch (error) {
            console.log(error)
        }
    }
);

const currentWeather = createSlice({
    name: 'getCurrentWeather',
    initialState: {
        loading: false,
        currentWeather: null,
        error: false
    },
    reducers: {
    },
    extraReducers(builder) {
        builder
            .addCase(getCurrentWeather.pending, (state) => {
                state.loading = true,
                    state.currentWeather = null,
                    state.error = false
            })
            .addCase(getCurrentWeather.fulfilled, (state, action) => {
                state.loading = false,
                    state.currentWeather = action.payload,
                    state.error = false
            })
            .addCase(getCurrentWeather.rejected, (state) => {
                state.loading = false,
                    state.currentWeather = null,
                    state.error = true
            })
    },
});

export default currentWeather.reducer;