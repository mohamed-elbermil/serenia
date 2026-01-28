import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { Collapsible } from "@/components/ui/collapsible";
import BurgerMenu from "@/components/burger-menu";

export default function HelpScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Aide</Text>
          <Ionicons name="help-circle-outline" size={24} color={Colors.light.tint} />
        </View>
      </SafeAreaView>
      <BurgerMenu />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionText}>
            Voici une aide simple et rassurante. Les contenus sont minimalistes, prêts à être
            enrichis ultérieurement.
          </Text>

          <View style={{ marginTop: 12 }}>
            <Collapsible title="Comment commencer ?">
              <Text style={styles.faqText}>
                Utilisez la page d’accueil pour saisir votre ressenti, et explorez les actions
                guidées proposées.
              </Text>
            </Collapsible>
            <Collapsible title="Que faire en cas de difficulté ?">
              <Text style={styles.faqText}>
                Si vous vous sentez en difficulté, privilégiez des actions douces et contactez un
                professionnel si nécessaire.
              </Text>
            </Collapsible>
            <Collapsible title="Support / Contact">
              <Text style={styles.faqText}>
                Lien de contact non configuré pour l’instant. Cette section est un placeholder.
              </Text>
            </Collapsible>
          </View>
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
  sectionText: { color: "#1A2E28", fontSize: 14 },
  faqText: { color: "#5A7D70", fontSize: 14, lineHeight: 20 },
});
