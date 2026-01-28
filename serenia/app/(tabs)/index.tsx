import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import MoodChart from "@/components/mood-chart";
import {
  emojiToValue,
  upsertMood,
  timeSeries,
  MoodAggregate,
} from "@/utils/mood";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedMoodIndex, setSelectedMoodIndex] = useState<number | null>(
    null,
  );
  const [moodAgg, setMoodAgg] = useState<Record<string, MoodAggregate>>({});
  const [chartRange, setChartRange] = useState<7 | 30>(7);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Menu Animation
  const MENU_WIDTH = width * 0.75;
  const menuTranslateX = useRef(new Animated.Value(MENU_WIDTH)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    if (isMenuOpen) {
      // Close menu
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
      ]).start(() => setIsMenuOpen(false));
    } else {
      // Open menu
      setIsMenuOpen(true);
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

  const navigateTo = (path: "/profile" | "/settings" | "/help") => {
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
    ]).start(() => setIsMenuOpen(false));
  };

  // Scroll Animation configuration
  const SCROLL_DISTANCE = 50;

  return (
    <View style={styles.container}>
      {/* Fixed Header Section (TopBar) */}
      <Animated.View style={styles.fixedHeader}>
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
          <View style={styles.topBar}>
            <Text style={styles.logoText}>SERANIA</Text>
            <TouchableOpacity onPress={toggleMenu}>
              <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Scrollable Header Section (Greeting) */}
        <View style={styles.scrollableHeader}>
          <View style={styles.safeArea}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>
                Bonjour, Mickael 👋{"\n"}
                Comment vous{"\n"}
                <Text style={styles.boldText}>sentez-vous</Text> aujourd’hui ?
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Que ressentez-vous ?"
                  placeholderTextColor="#5A7D70"
                />
                <TouchableOpacity style={styles.inputIcon}>
                  <Ionicons
                    name="arrow-up-outline"
                    size={20}
                    style={{ transform: [{ rotate: "45deg" }] }}
                    color="#333"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Mood Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mon Humeur Du Jour</Text>
          <View style={styles.moodContainer}>
            {["😊", "😐", "😔", "😭", "😡"].map((emoji, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedMoodIndex(index);
                  const v = emojiToValue(emoji);
                  const next = { ...moodAgg };
                  upsertMood(next, new Date(), v);
                  setMoodAgg(next);
                }}
                style={[
                  styles.moodItem,
                  selectedMoodIndex === index && styles.moodSelected,
                ]}
              >
                <Text style={styles.moodEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.section}>
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Vos progrès</Text>
            <MoodChart
              points={timeSeries(moodAgg, chartRange)}
              range={chartRange}
              onChangeRange={setChartRange}
            />
          </View>
        </View>

        {/* Recent Conversations Section */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <Text style={styles.sectionTitle}>Conversation récentes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recentScroll}
          >
            {[1, 2].map((item) => (
              <View key={item} style={styles.recentCard}>
                <View style={styles.recentHeader}>
                  <View style={styles.tagContainer}>
                    <Text style={styles.tagText}>Aujourd’hui</Text>
                  </View>
                  <Text style={styles.categoryText}>Lecture</Text>
                </View>
                <Text style={styles.recentTitle}>
                  Titre de la conversation en précisant la catégorie
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Animated.ScrollView>

      {/* Menu Overlay and Drawer */}
      {isMenuOpen && (
        <Animated.View style={[styles.menuOverlay, { opacity: fadeAnimation }]}>
          <Pressable style={styles.menuOverlayPressable} onPress={toggleMenu} />
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
                pathname === "/profile" && { backgroundColor: "#F4F9F6" },
              ]}
              onPress={() => navigateTo("/profile")}
            >
              <Ionicons name="person-outline" size={24} color="#1A2E28" />
              <Text style={styles.menuItemText}>Mon Profil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuItem,
                pathname === "/settings" && { backgroundColor: "#F4F9F6" },
              ]}
              onPress={() => navigateTo("/settings")}
            >
              <Ionicons name="settings-outline" size={24} color="#1A2E28" />
              <Text style={styles.menuItemText}>Paramètres</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuItem,
                pathname === "/help" && { backgroundColor: "#F4F9F6" },
              ]}
              onPress={() => navigateTo("/help")}
            >
              <Ionicons name="help-circle-outline" size={24} color="#1A2E28" />
              <Text style={styles.menuItemText}>Aide</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="log-out-outline" size={24} color="#D32F2F" />
              <Text style={[styles.menuItemText, { color: "#D32F2F" }]}>
                Déconnexion
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fixedHeader: {
    backgroundColor: "#C8E6C9", // Minty green
    zIndex: 10,
    marginHorizontal: 20,
    marginTop: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  scrollableHeader: {
    backgroundColor: "#C8E6C9", // Minty green
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 30,
    paddingTop: 10,
    marginHorizontal: 20, // left + right
  },
  safeArea: {
    paddingHorizontal: 20,
  },
  topBar: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    fontStyle: "italic",
  },
  greetingContainer: {
    marginTop: 0,
  },
  greetingText: {
    fontSize: 24,
    color: "#1A2E28",
    lineHeight: 32,
    marginBottom: 20,
  },
  boldText: {
    fontWeight: "bold",
  },
  inputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 95,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1A2E28",
  },
  inputIcon: {
    marginLeft: 10,
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
  },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moodItem: {
    padding: 5,
    borderRadius: 30,
  },
  moodSelected: {
    backgroundColor: "#C8E6C9",
    borderWidth: 2,
    borderColor: "#8FC9B3",
  },
  moodEmoji: {
    fontSize: 32,
  },
  progressCard: {
    backgroundColor: "#D6EAE2",
    borderRadius: 20,
    padding: 20,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A2E28",
    marginBottom: 5,
  },
  progressValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
  },
  chartContainer: {
    height: 120,
    backgroundColor: "#1F202F",
    borderRadius: 15,
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  chartPlaceholder: {
    width: "100%",
    height: "100%",
  },
  chartLine: {},
  chartPoint: {
    position: "absolute",
    top: 40,
    left: "60%",
    zIndex: 10,
  },
  recentScroll: {
    overflow: "visible",
  },
  recentCard: {
    backgroundColor: "#3D6056",
    borderRadius: 15,
    padding: 15,
    width: width * 0.6,
    marginRight: 15,
    height: 120,
    justifyContent: "space-between",
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagContainer: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  tagText: {
    color: "#fff",
    fontSize: 10,
  },
  categoryText: {
    color: "#ccc",
    fontSize: 12,
  },
  recentTitle: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
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
  menuOverlayPressable: {
    flex: 1,
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
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuContent: {
    flex: 1,
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  menuItemsContainer: {
    marginTop: 40,
  },
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
});
