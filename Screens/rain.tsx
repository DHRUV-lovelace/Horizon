import React, { useEffect, useRef } from "react";
import { View, Dimensions } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    Easing,
    interpolate,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const RainDrop = ({
    element,
    speed,
    angle,
}: {
    element: React.ReactNode;
    speed: number;
    angle: number;
}) => {
    const startX = Math.random() * width;
    const fallDuration = speed + Math.random() * 1000;
    const endX = startX + height * Math.tan((angle * Math.PI) / 180); // Calculate end X based on angle

    const translateY = useSharedValue(-100);
    const translateX = useSharedValue(startX);

    useEffect(() => {
        translateY.value = withRepeat(
            withTiming(height + 100, { duration: fallDuration, easing: Easing.linear }),
            -1,
            false
        );

        translateX.value = withRepeat(
            withTiming(endX, { duration: fallDuration, easing: Easing.linear }),
            -1,
            false
        );
    }, [translateY, translateX, fallDuration, endX]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value },
        ],
        position: "absolute",
        top: -100,
    }));

    return <Animated.View style={animatedStyle}>{element}</Animated.View>;
};

const RainEffect = ({
    element,
    count = 30,
    speed = 3000,
    angle = 0, // Angle in degrees (0 for straight down)
}: {
    element: React.ReactNode;
    count?: number;
    speed?: number;
    angle?: number;
}) => {
    return (
        <View style={{ position: "absolute", width, height, pointerEvents: "none" }}>
            {Array.from({ length: count }).map((_, index) => (
                <RainDrop key={index} element={element} speed={speed} angle={angle} />
            ))}
        </View>
    );
};

export default RainEffect;