import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const getforecastWeather = createAsyncThunk(
    'getforecastWeather',
    async ({ latitude, longitude }: { latitude: number, longitude: number }) => {
        try {
            const weather_url = `${process.env.fetchWeatherURL}lat=${latitude}&lon=${longitude}&cnt=${40}&appid=${process.env.API_KEY}`;
            const response = await fetch(weather_url);
            const data = await response.json();
            return data
        }
        catch (error) {
            console.log(error)
        }
    }
);

const forecastWeather = createSlice({
    name: 'getforecastWeather',
    initialState: {
        loading: false,
        forecastData: null,
        error: false
    },
    reducers: {

    },
    extraReducers(builder) {
        builder
            .addCase(getforecastWeather.pending, (state) => {
                state.loading = true,
                    state.forecastData = null,
                    state.error = false
            })
            .addCase(getforecastWeather.fulfilled, (state, action) => {
                state.loading = false,
                    state.forecastData = action.payload,
                    state.error = false
            })
            .addCase(getforecastWeather.rejected, (state) => {
                state.loading = false,
                    state.forecastData = null,
                    state.error = true
            })
    },
});

export default forecastWeather.reducer;