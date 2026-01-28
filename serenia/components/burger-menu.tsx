import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Pressable,
  Text,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

const { width } = Dimensions.get("window");

export default function BurgerMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const MENU_WIDTH = width * 0.75;
  const menuTranslateX = useRef(new Animated.Value(MENU_WIDTH)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(menuTranslateX, {
          toValue: MENU_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.parallel([
        Animated.timing(menuTranslateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const isActive = (segment: "profile" | "settings" | "help" | "patient") => {
    return pathname?.endsWith(`/${segment}`);
  };

  const navigateTo = (
    path:
      | "/(tabs)/profile"
      | "/(tabs)/settings"
      | "/(tabs)/help"
      | "/(tabs)/patient",
  ) => {
    router.push(path);
    Animated.parallel([
      Animated.timing(menuTranslateX, {
        toValue: MENU_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setIsOpen(false));
  };

  return (
    <>
      <TouchableOpacity style={styles.trigger} onPress={toggleMenu}>
        <Ionicons name="menu" size={24} color="#1A2E28" />
      </TouchableOpacity>
      {isOpen && (
        <Animated.View style={[styles.menuOverlay, { opacity: fadeAnimation }]}>
          <Pressable style={{ flex: 1 }} onPress={toggleMenu} />
        </Animated.View>
      )}
      <Animated.View
        style={[
          styles.menuDrawer,
          { transform: [{ translateX: menuTranslateX }] },
        ]}
      >
        <SafeAreaView style={styles.menuContent}>
          <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
            <Ionicons name="close" size={30} color="#1A2E28" />
          </TouchableOpacity>
          <View style={styles.menuItemsContainer}>
            <TouchableOpacity
              style={[
                styles.menuItem,
                isActive("profile") && styles.activeItem,
              ]}
              onPress={() => navigateTo("/(tabs)/profile")}
            >
              <Ionicons name="person-outline" size={24} color="#1A2E28" />
              <Text style={styles.menuItemText}>Mon Profil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.menuItem,
                isActive("settings") && styles.activeItem,
              ]}
              onPress={() => navigateTo("/(tabs)/settings")}
            >
              <Ionicons name="settings-outline" size={24} color="#1A2E28" />
              <Text style={styles.menuItemText}>Paramètres</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, isActive("help") && styles.activeItem]}
              onPress={() => navigateTo("/(tabs)/help")}
            >
              <Ionicons name="help-circle-outline" size={24} color="#1A2E28" />
              <Text style={styles.menuItemText}>Aide</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.menuItem,
                isActive("patient") && styles.activeItem,
              ]}
              onPress={() => navigateTo("/(tabs)/patient")}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="#1A2E28"
              />
              <Text style={styles.menuItemText}>Espace Patient</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 20,
  },
  menuDrawer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "75%",
    backgroundColor: "#fff",
    zIndex: 30,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuContent: { flex: 1, padding: 20 },
  closeButton: { alignSelf: "flex-end", padding: 10 },
  menuItemsContainer: { marginTop: 40 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#1A2E28",
    fontWeight: "500",
  },
  activeItem: { backgroundColor: "#F4F9F6" },
});
