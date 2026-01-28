import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <Ionicons name="person-circle-outline" size={24} color={Colors.light.tint} />
        </View>
      </SafeAreaView>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#78908A" />
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.label}>Nom</Text>
              <Text style={styles.value}>Indisponible</Text>
              <Text style={[styles.label, { marginTop: 10 }]}>Email</Text>
              <Text style={styles.value}>Indisponible</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Édition</Text>
          <Text style={styles.sectionText}>
            La modification des informations n’est pas encore implémentée.
          </Text>
          <TouchableOpacity disabled style={styles.editBtn}>
            <Text style={styles.editBtnText}>Modifier (à venir)</Text>
          </TouchableOpacity>
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
  avatarRow: { flexDirection: "row", alignItems: "center" },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E8F1ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoCol: { flex: 1 },
  label: { color: "#5A7D70", fontSize: 12 },
  value: { color: "#1A2E28", fontSize: 16, fontWeight: "600" },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 16,
  },
  sectionTitle: { color: "#1A2E28", fontSize: 16, fontWeight: "700" },
  sectionText: { color: "#5A7D70", fontSize: 14, marginTop: 6 },
  editBtn: {
    marginTop: 12,
    backgroundColor: "#D6F5E4",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  editBtnText: { color: "#1A2E28", fontSize: 14, fontWeight: "600" },
});
