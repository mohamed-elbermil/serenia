import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import * as ImagePicker from "expo-image-picker";
import { loadProfile, saveProfile, isValidEmail, type Profile } from "@/utils/profile";
import BurgerMenu from "@/components/burger-menu";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const p = await loadProfile();
      if (p) {
        setName(p.name ?? "");
        setEmail(p.email ?? "");
        setAvatarUri(p.avatarUri ?? null);
      }
      setLoading(false);
    })();
  }, []);

  const validate = () => {
    const next: { name?: string; email?: string } = {};
    if (!name.trim()) next.name = "Le nom est requis.";
    if (!email.trim()) next.email = "L’email est requis.";
    else if (!isValidEmail(email)) next.email = "Email invalide.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "Veuillez autoriser l’accès à la médiathèque.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const onSave = async () => {
    if (!validate()) return;
    const profile: Profile = { name, email, avatarUri };
    await saveProfile(profile);
    Alert.alert("Enregistré", "Votre profil a été sauvegardé.");
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <Ionicons
            name="person-circle-outline"
            size={24}
            color={Colors.light.tint}
          />
        </View>
      </SafeAreaView>
      <BurgerMenu />

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <TouchableOpacity
              style={styles.avatarPlaceholder}
              onPress={pickAvatar}
            >
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  style={{ width: 64, height: 64, borderRadius: 32 }}
                />
              ) : (
                <Ionicons name="person" size={40} color="#78908A" />
              )}
            </TouchableOpacity>
            <View style={styles.infoCol}>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                value={name}
                onChangeText={(t) => setName(t)}
                placeholder="Votre nom"
                placeholderTextColor="#78908A"
                style={styles.input}
              />
              {!!errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
              <Text style={[styles.label, { marginTop: 10 }]}>Email</Text>
              <TextInput
                value={email}
                onChangeText={(t) => setEmail(t)}
                placeholder="vous@exemple.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#78908A"
                style={styles.input}
              />
              {!!errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Édition</Text>
          <Text style={styles.sectionText}>
            Vous pouvez modifier vos informations ci-dessus.
          </Text>
          <TouchableOpacity
            onPress={onSave}
            style={styles.editBtn}
            disabled={loading}
          >
            <Text style={styles.editBtnText}>Enregistrer</Text>
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
  input: {
    color: "#1A2E28",
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 4,
  },
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
  errorText: { color: "#D32F2F", fontSize: 12, marginTop: 4 },
});
