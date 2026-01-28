import React, { useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import BurgerMenu from "@/components/burger-menu";

export default function SettingsScreen() {
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Paramètres</Text>
          <Ionicons
            name="settings-outline"
            size={24}
            color={Colors.light.tint}
          />
        </View>
      </SafeAreaView>
      <BurgerMenu />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Préférences</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Notifications</Text>
            <Switch value={notifEnabled} onValueChange={setNotifEnabled} />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Thème sombre</Text>
            <Switch value={darkTheme} onValueChange={setDarkTheme} />
          </View>
          <Text style={styles.hint}>
            Ces paramètres sont des placeholders et ne sont pas encore
            persistés.
          </Text>
        </View>

        <View style={[styles.card, { marginTop: 12 }]}>
          <Text style={styles.sectionTitle}>Expérience</Text>
          <Text style={styles.sectionText}>
            Aucune option spécifique n’est encore disponible. Structure prête
            pour évolutions.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F9F6" },
  header: { backgroundColor: "#C8E6C9" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  headerTitle: { color: "#1A2E28", fontSize: 18, fontWeight: "700" },
  content: { padding: 16 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sectionTitle: {
    color: "#1A2E28",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  rowLabel: { color: "#1A2E28", fontSize: 14 },
  hint: { color: "#5A7D70", fontSize: 12, marginTop: 8 },
  sectionText: { color: "#5A7D70", fontSize: 14 },
});
