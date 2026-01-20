import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [selectedMoodIndex, setSelectedMoodIndex] = useState<number | null>(
    null,
  );

  return (
    <View style={styles.container}>
      {/* Fixed Header Section (TopBar) */}
      <View style={styles.fixedHeader}>
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
          <View style={styles.topBar}>
            <Text style={styles.logoText}>SERANIA</Text>
            <TouchableOpacity>
              <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
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
                onPress={() => setSelectedMoodIndex(index)}
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
            <Text style={styles.progressValue}>67%</Text>
            <View style={styles.chartContainer}>
              {/* Simulated Chart Placeholder */}
              <View style={styles.chartLine} />
              <Ionicons
                name="radio-button-on"
                size={24}
                color="#6DD5B8"
                style={styles.chartPoint}
              />
              <View style={styles.chartPlaceholder}>
                <Text
                  style={{
                    color: "#555",
                    fontSize: 10,
                    position: "absolute",
                    bottom: 10,
                    left: 10,
                  }}
                >
                  Jan
                </Text>
                <Text
                  style={{
                    color: "#555",
                    fontSize: 10,
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                  }}
                >
                  Dec
                </Text>

                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 50,
                    borderTopWidth: 2,
                    borderColor: "#6DD5B8",
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 20,
                    opacity: 0.5,
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    right: 60,
                    height: 40,
                    borderTopWidth: 2,
                    borderColor: "#FFCC80",
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 40,
                    opacity: 0.5,
                  }}
                />
              </View>
            </View>
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
                    <Text style={styles.tagText}>Aujourd'hui</Text>
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
      </ScrollView>
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
});
