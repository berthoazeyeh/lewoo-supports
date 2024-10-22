import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { logo } from 'utils';

const ListeningIndicator = () => {
    const scale = useSharedValue(1);

    useEffect(() => {
        // Utiliser withRepeat pour créer une animation qui boucle en continu
        scale.value = withRepeat(
            withTiming(1.5, {
                duration: 1000,
                easing: Easing.inOut(Easing.ease),
            }),
            -1, // Nombre de répétitions (-1 signifie infini)
            true // Revenir à l'état initial après chaque cycle
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <View style={styles.container}>
            <Animated.Image source={logo} style={[styles.circle, animatedStyle]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: 150,
        height: 150,
        borderRadius: 100,
        // backgroundColor: '#00bfff',
        // opacity: 0.5,
    },
});

export default ListeningIndicator;
