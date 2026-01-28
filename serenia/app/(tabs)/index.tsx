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
import { useRouter } from "expo-router";
import BurgerMenu from "@/components/burger-menu";
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
  const [selectedMoodIndex, setSelectedMoodIndex] = useState<number | null>(
    null,
  );
  const [moodAgg, setMoodAgg] = useState<Record<string, MoodAggregate>>({});
  const [chartRange, setChartRange] = useState<7 | 30>(7);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Scroll Animation configuration
  const SCROLL_DISTANCE = 50;

  return (
    <View style={styles.container}>
      {/* Fixed Header Section (TopBar) */}
      <Animated.View style={styles.fixedHeader}>
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
          <View style={styles.topBar}>
            <Text style={styles.logoText}>SERANIA</Text>
            <View style={{ width: 28 }} />
          </View>
        </SafeAreaView>
      </Animated.View>
      <BurgerMenu />

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

        {/* Actions rapides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.quickRow}>
            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => router.push("/(tabs)/patient")}
            >
              <Ionicons name="flash-outline" size={18} color="#1A2E28" />
              <Text style={styles.quickText}>Commencer un exercice</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => router.push("/(tabs)/patient")}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={18}
                color="#1A2E28"
              />
              <Text style={styles.quickText}>Ouvrir Espace Patient</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.quickRow, { marginTop: 8 }]}>
            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => router.push("/(tabs)/help")}
            >
              <Ionicons name="help-circle-outline" size={18} color="#1A2E28" />
              <Text style={styles.quickText}>Voir l’aide</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <Ionicons name="person-outline" size={18} color="#1A2E28" />
              <Text style={styles.quickText}>Mon profil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recommandations */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Recommandations pour vous</Text>
            <View style={styles.recoRow}>
              <View style={styles.recoChip}>
                <Text style={styles.recoText}>Respiration</Text>
              </View>
              <View style={styles.recoChip}>
                <Text style={styles.recoText}>Écriture guidée</Text>
              </View>
              <View style={styles.recoChip}>
                <Text style={styles.recoText}>Marche légère</Text>
              </View>
            </View>
            <Text style={styles.recoHint}>
              Suggestions basées sur vos humeurs récentes.
            </Text>
          </View>
        </View>

        {/* Catégories importantes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Catégories</Text>
          <View style={styles.categoriesGrid}>
            {[
              {
                icon: "leaf-outline",
                label: "Bien-être",
                route: "/(tabs)/patient",
              },
              { icon: "book-outline", label: "Lecture", route: "/(tabs)/help" },
              {
                icon: "heart-outline",
                label: "Respiration",
                route: "/(tabs)/patient",
              },
              {
                icon: "pencil-outline",
                label: "Écriture",
                route: "/(tabs)/patient",
              },
            ].map((c, i) => (
              <TouchableOpacity
                key={i}
                style={styles.categoryCard}
                onPress={() => router.push(c.route as any)}
              >
                <Ionicons name={c.icon as any} size={22} color="#1A2E28" />
                <Text style={styles.categoryLabel}>{c.label}</Text>
              </TouchableOpacity>
            ))}
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
  quickRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  quickBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  quickText: { color: "#1A2E28", fontSize: 14, fontWeight: "600" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  recoRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 8 },
  recoChip: {
    backgroundColor: "#F4F9F6",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D0DDD8",
  },
  recoText: { color: "#1A2E28", fontSize: 13, fontWeight: "600" },
  recoHint: { color: "#5A7D70", fontSize: 12, marginTop: 8 },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryCard: {
    width: (width - 60) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    gap: 8,
  },
  categoryLabel: { color: "#1A2E28", fontSize: 14, fontWeight: "600" },
});
