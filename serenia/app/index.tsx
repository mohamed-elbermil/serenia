import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStart = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      {/* Background Decor */}
      <View style={styles.circleBackground} />
      <View style={styles.circleBackgroundSmall} />

      <SafeAreaView style={styles.content}>
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.logoText}>SERANIA</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.illustrationContainer,
            { opacity: fadeAnim, transform: [{ scale: fadeAnim }] },
          ]}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="leaf" size={80} color="#3D6056" />
          </View>
          {/* Decorative elements around */}
          <Ionicons
            name="sparkles"
            size={24}
            color="#C8E6C9"
            style={styles.sparkle1}
          />
          <Ionicons
            name="heart"
            size={20}
            color="#FFCC80"
            style={styles.sparkle2}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.title}>Bienvenue sur Serenia</Text>
          <Text style={styles.subtitle}>
            Votre compagnon quotidien pour cultiver le calme, suivre vos
            émotions et grandir en toute sérénité.
          </Text>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            width: "100%",
            alignItems: "center",
            marginTop: 40,
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Commencer l’aventure</Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color="#fff"
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F9F6", // Very light mint/white
    position: "relative",
    overflow: "hidden",
  },
  circleBackground: {
    position: "absolute",
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#C8E6C9", // Mint Green
    opacity: 0.3,
  },
  circleBackgroundSmall: {
    position: "absolute",
    bottom: 50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#3D6056", // Dark Green
    opacity: 0.05,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  header: {
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#3D6056",
    letterSpacing: 1,
  },
  illustrationContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3D6056",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  sparkle1: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  sparkle2: {
    position: "absolute",
    bottom: 30,
    left: 30,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A2E28",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#5A7D70",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#3D6056",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "100%",
    shadowColor: "#3D6056",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
});
