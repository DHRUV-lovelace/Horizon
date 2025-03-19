import React, { useEffect } from "react";
import { View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// Individual falling item
const RainDrop = ({ element, speed }: { element: React.ReactNode; speed: number }) => {
  const startX = Math.random() * width;
  const fallDuration = speed + Math.random() * 1000;

  const translateY = useSharedValue(-50);

  // Move this animation trigger to useEffect to avoid modifying the shared value during render
  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(height, { duration: fallDuration }),
      -1, // Infinite loop
      false
    );
  }, [translateY, fallDuration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    position: "absolute",
    left: startX,
    top: -50,
  }));

  return <Animated.View style={animatedStyle}>{element}</Animated.View>;
};

// Rain Effect Wrapper
const RainEffect = ({
  element,
  count = 30,
  speed = 3000,
}: {
  element: React.ReactNode;
  count?: number;
  speed?: number;
}) => {
  return (
    <View style={{ position: "absolute", width, height, pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, index) => (
        <RainDrop key={index} element={element} speed={speed} />
      ))}
    </View>
  );
};

export default RainEffect;
