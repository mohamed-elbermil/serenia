import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { getActionPlan } from "@/constants/guided-actions";
import BurgerMenu from "@/components/burger-menu";

const { width, height } = Dimensions.get("window");

type Role = "ai" | "pro" | "patient";

type Message = {
  id: string;
  role: Role;
  text: string;
  ts: number;
};

const initialBotText =
  "Bonjour, je suis là pour vous accompagner. Dites-moi ce que vous ressentez en ce moment.";

export default function PatientChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "m0", role: "ai", text: initialBotText, ts: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [severity, setSeverity] = useState<"low" | "moderate" | "high" | null>(
    null,
  );
  const [suggestions, setSuggestions] = useState<string[]>([
    "Écriture guidée",
    "Respiration",
    "Marche légère",
    "Playlist apaisante",
    "Appeler un proche",
    "Ancrage",
    "Prendre RDV",
  ]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isExercising, setIsExercising] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<ReturnType<
    typeof getActionPlan
  > | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openers = [
    "Merci pour votre partage.",
    "Je vous entends.",
    "C’est précieux ce que vous dites.",
    "Merci de me confier cela.",
  ];

  const clarifiers = [
    "Qu’est-ce qui pèse le plus en ce moment ?",
    "Qu’aimeriez-vous voir évoluer dès aujourd’hui ?",
    "Qu’est-ce qui vous aiderait à vous sentir un peu mieux ?",
    "Quelle serait une petite étape accessible maintenant ?",
  ];

  const actionPrompts = [
    "Souhaitez-vous essayer une action douce pour vous aider ?",
    "On peut tester un petit exercice si vous voulez.",
    "Partons sur une proposition concrète, d’accord ?",
    "On avance pas à pas, je vous propose une option utile.",
  ];

  const detectIntent = (text: string) => {
    const t = text.toLowerCase();
    const negative =
      /(angoisse|anxious|stress|triste|déprime|peur|colère|fatigue|épuisé|mal)/.test(
        t,
      );
    const overwhelmed = /(envahi|trop|submergé|écrasé|crise)/.test(t);
    const physical = /(respire|respiration|coeur|tête|douleur)/.test(t);
    const social = /(proche|ami|famille|seul|isolement)/.test(t);
    return { negative, overwhelmed, physical, social };
  };

  const buildSuggestions = (
    intent: ReturnType<typeof detectIntent>,
    sev: typeof severity,
  ) => {
    const base: string[] = [
      "Écriture guidée",
      "Respiration",
      "Marche légère",
      "Playlist apaisante",
      "Ancrage",
      "Appeler un proche",
    ];
    const result = [...base];
    if (sev === "high" || intent.overwhelmed) result.push("Urgence");
    result.push("Prendre RDV");
    return result;
  };

  const generateBotReply = (history: Message[], userText: string) => {
    const lastPatient = [...history]
      .reverse()
      .find((m) => m.role === "patient");
    const intent = detectIntent(userText);
    const opener = openers[Math.floor(Math.random() * openers.length)];
    const clarifier = clarifiers[Math.floor(Math.random() * clarifiers.length)];
    const action =
      actionPrompts[Math.floor(Math.random() * actionPrompts.length)];
    const refPart = lastPatient
      ? `Vous évoquiez: “${lastPatient.text.slice(0, 80)}${lastPatient.text.length > 80 ? "…" : ""}”. `
      : "";
    const moodPart =
      severity === "high"
        ? "Je prends au sérieux ce que vous vivez. "
        : severity === "moderate"
          ? "On va avancer tranquillement, ensemble. "
          : severity === "low"
            ? "Merci de ce point, commençons par une petite action accessible. "
            : "";

    const body = intent.overwhelmed
      ? "On va fractionner et simplifier. "
      : intent.negative
        ? "On accueille ces ressentis sans jugement. "
        : intent.physical
          ? "On peut commencer par réguler le corps. "
          : intent.social
            ? "Se relier à quelqu’un peut aider. "
            : "Merci, je suis avec vous. ";

    const text = `${opener} ${refPart}${moodPart}${body}${clarifier} ${action}`;

    const nextSuggestions = buildSuggestions(intent, severity);
    return { text, suggestions: nextSuggestions };
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const message: Message = {
      id: String(Date.now()),
      role: "patient",
      text,
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, message]);
    setInput("");
    setIsTyping(true);
    setShowSuggestions(false);
    setTimeout(() => {
      const { text: botText, suggestions: sug } = generateBotReply(
        [...messages, message],
        text,
      );
      const reply: Message = {
        id: String(Date.now() + 1),
        role: "ai",
        text: botText,
        ts: Date.now() + 1,
      };
      setMessages((prev) => [...prev, reply]);
      setSuggestions(sug);
      setIsTyping(false);
      setShowSuggestions(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      requestAnimationFrame(() =>
        scrollRef.current?.scrollToEnd({ animated: true }),
      );
    }, 400);
    requestAnimationFrame(() =>
      scrollRef.current?.scrollToEnd({ animated: true }),
    );
  };

  const pickSuggestion = (label: string) => {
    const m: Message = {
      id: String(Date.now()),
      role: "patient",
      text: `Choix: ${label}`,
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, m]);
    const plan = getActionPlan(label as any);
    setCurrentPlan(plan);
    setIsExercising(true);
    setShowSuggestions(false);
    setStepIndex(0);
    setTimeout(() => {
      const pre: Message = {
        id: String(Date.now() + 1),
        role: "ai",
        text: plan.preface,
        ts: Date.now() + 1,
      };
      setMessages((prev) => [...prev, pre]);
      requestAnimationFrame(() =>
        scrollRef.current?.scrollToEnd({ animated: true }),
      );
    }, 250);
  };

  const continueExercise = () => {
    if (!currentPlan) return;
    const idx = stepIndex;
    if (idx >= currentPlan.steps.length) {
      const c: Message = {
        id: String(Date.now()),
        role: "ai",
        text: currentPlan.completion,
        ts: Date.now(),
      };
      const f: Message = {
        id: String(Date.now() + 1),
        role: "ai",
        text: currentPlan.followUp,
        ts: Date.now() + 1,
      };
      setMessages((prev) => [...prev, c, f]);
      setIsExercising(false);
      setCurrentPlan(null);
      setShowSuggestions(true);
      setStepIndex(0);
      requestAnimationFrame(() =>
        scrollRef.current?.scrollToEnd({ animated: true }),
      );
      return;
    }
    const step = currentPlan.steps[idx];
    const s: Message = {
      id: String(Date.now()),
      role: "ai",
      text: step.text,
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, s]);
    setStepIndex(idx + 1);
    requestAnimationFrame(() =>
      scrollRef.current?.scrollToEnd({ animated: true }),
    );
  };

  const stopExercise = () => {
    if (!currentPlan) return;
    const c: Message = {
      id: String(Date.now()),
      role: "ai",
      text: currentPlan.completion,
      ts: Date.now(),
    };
    const f: Message = {
      id: String(Date.now() + 1),
      role: "ai",
      text: currentPlan.followUp,
      ts: Date.now() + 1,
    };
    setMessages((prev) => [...prev, c, f]);
    setIsExercising(false);
    setCurrentPlan(null);
    setShowSuggestions(true);
    setStepIndex(0);
    requestAnimationFrame(() =>
      scrollRef.current?.scrollToEnd({ animated: true }),
    );
  };

  const setSeverityLevel = (level: "low" | "moderate" | "high") => {
    setSeverity(level);
    const label =
      level === "low" ? "Faible" : level === "moderate" ? "Modérée" : "Élevée";
    const m: Message = {
      id: String(Date.now()),
      role: "patient",
      text: `Gravité: ${label}`,
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, m]);
  };

  const bubbleStyle = (role: Role) => {
    if (role === "patient") return styles.patientBubble;
    if (role === "pro") return styles.proBubble;
    return styles.aiBubble;
  };

  const bubbleTextStyle = (role: Role) => {
    if (role === "patient") return styles.patientText;
    if (role === "pro") return styles.proText;
    return styles.aiText;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Espace Patient</Text>
          <Ionicons
            name="shield-checkmark"
            size={24}
            color={Colors.light.tint}
          />
        </View>
      </SafeAreaView>
      <BurgerMenu />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.chatContent}>
        {messages.map((m) => (
          <View key={m.id} style={[styles.bubble, bubbleStyle(m.role)]}>
            <Text style={bubbleTextStyle(m.role)}>{m.text}</Text>
          </View>
        ))}
        {isTyping && (
          <View style={styles.typingRow}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#4B2E83" />
            <Text style={styles.typingText}>Le bot écrit…</Text>
          </View>
        )}
        {isExercising && (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={continueExercise}
            >
              <Text style={styles.controlText}>Continuer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: "#FFE5B3" }]}
              onPress={stopExercise}
            >
              <Text style={[styles.controlText, { color: "#1A2E28" }]}>
                Arrêter
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {showSuggestions && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.suggestionsRow}>
              {suggestions.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.suggestionCard}
                  onPress={() => pickSuggestion(s)}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}
        <View style={styles.severityRow}>
          <TouchableOpacity
            style={[
              styles.severityChip,
              severity === "low" && styles.severityLow,
            ]}
            onPress={() => setSeverityLevel("low")}
          >
            <Text
              style={[
                styles.severityText,
                severity === "low" && styles.severityTextActive,
              ]}
            >
              Faible
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.severityChip,
              severity === "moderate" && styles.severityModerate,
            ]}
            onPress={() => setSeverityLevel("moderate")}
          >
            <Text
              style={[
                styles.severityText,
                severity === "moderate" && styles.severityTextActive,
              ]}
            >
              Modérée
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.severityChip,
              severity === "high" && styles.severityHigh,
            ]}
            onPress={() => setSeverityLevel("high")}
          >
            <Text
              style={[
                styles.severityText,
                severity === "high" && styles.severityTextActive,
              ]}
            >
              Élevée
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <SafeAreaView style={styles.inputBar}>
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Écrivez votre message..."
            style={styles.input}
            placeholderTextColor="#78908A"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
  chatContent: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 100 },
  bubble: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 6,
    maxWidth: width * 0.8,
  },
  aiBubble: { backgroundColor: "#E9D7FF", alignSelf: "flex-start" },
  proBubble: { backgroundColor: "#D6E9FF", alignSelf: "flex-start" },
  patientBubble: { backgroundColor: "#D6F5E4", alignSelf: "flex-end" },
  aiText: { color: "#4B2E83", fontSize: 15 },
  proText: { color: "#0D3B66", fontSize: 15 },
  patientText: { color: "#1A2E28", fontSize: 15 },
  suggestionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  controlBtn: {
    backgroundColor: "#D6F5E4",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  controlText: { color: "#1A2E28", fontSize: 14, fontWeight: "600" },
  suggestionCard: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  suggestionText: { color: "#1A2E28", fontSize: 14, fontWeight: "500" },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  typingText: { color: "#4B2E83", fontSize: 14 },
  severityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  severityChip: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D0DDD8",
    alignItems: "center",
  },
  severityLow: { backgroundColor: "#D6F5E4", borderColor: "#D6F5E4" },
  severityModerate: { backgroundColor: "#FFE5B3", borderColor: "#FFE5B3" },
  severityHigh: { backgroundColor: "#FFCDD2", borderColor: "#FFCDD2" },
  severityText: { color: "#1A2E28", fontSize: 14, fontWeight: "600" },
  severityTextActive: { color: "#1A2E28" },
  inputBar: { backgroundColor: "#F4F9F6" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 6,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 14,
    color: "#1A2E28",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sendBtn: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: "#3D6056",
    alignItems: "center",
    justifyContent: "center",
  },
});
