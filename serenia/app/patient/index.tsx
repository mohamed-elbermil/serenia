import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Dimensions, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

type Role = 'ai' | 'pro' | 'patient';

type Message = {
  id: string;
  role: Role;
  text: string;
  ts: number;
};

const initialBotText = "Bonjour, je suis là pour vous accompagner. Dites-moi ce que vous ressentez en ce moment.";

export default function PatientChatScreen() {
  const [messages, setMessages] = useState<Message[]>([{ id: 'm0', role: 'ai', text: initialBotText, ts: Date.now() }]);
  const [input, setInput] = useState('');
  const [severity, setSeverity] = useState<'low' | 'moderate' | 'high' | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>(['Écriture guidée', 'Respiration', 'Marche légère', 'Playlist apaisante', 'Appeler un proche', 'Ancrage', 'Prendre RDV']);
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const message: Message = { id: String(Date.now()), role: 'patient', text, ts: Date.now() };
    setMessages(prev => [...prev, message]);
    setInput('');
    setTimeout(() => {
      const reply: Message = {
        id: String(Date.now() + 1),
        role: 'ai',
        text: "Merci pour votre partage. Souhaitez-vous essayer une action pour vous aider maintenant ?",
        ts: Date.now() + 1,
      };
      setMessages(prev => [...prev, reply]);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }, 300);
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  const pickSuggestion = (label: string) => {
    const m: Message = { id: String(Date.now()), role: 'patient', text: `Choix: ${label}`, ts: Date.now() };
    setMessages(prev => [...prev, m]);
    setTimeout(() => {
      const r: Message = { id: String(Date.now() + 1), role: 'ai', text: "Parfait, commençons ensemble.", ts: Date.now() + 1 };
      setMessages(prev => [...prev, r]);
    }, 250);
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  const setSeverityLevel = (level: 'low' | 'moderate' | 'high') => {
    setSeverity(level);
    const label = level === 'low' ? 'Faible' : level === 'moderate' ? 'Modérée' : 'Élevée';
    const m: Message = { id: String(Date.now()), role: 'patient', text: `Gravité: ${label}`, ts: Date.now() };
    setMessages(prev => [...prev, m]);
  };

  const bubbleStyle = (role: Role) => {
    if (role === 'patient') return styles.patientBubble;
    if (role === 'pro') return styles.proBubble;
    return styles.aiBubble;
  };

  const bubbleTextStyle = (role: Role) => {
    if (role === 'patient') return styles.patientText;
    if (role === 'pro') return styles.proText;
    return styles.aiText;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Espace Patient</Text>
          <Ionicons name="shield-checkmark" size={24} color={Colors.light.tint} />
        </View>
      </SafeAreaView>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.chatContent}>
        {messages.map(m => (
          <View key={m.id} style={[styles.bubble, bubbleStyle(m.role)]}>
            <Text style={bubbleTextStyle(m.role)}>{m.text}</Text>
          </View>
        ))}
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.suggestionsRow}>
            {suggestions.map(s => (
              <TouchableOpacity key={s} style={styles.suggestionCard} onPress={() => pickSuggestion(s)}>
                <Text style={styles.suggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
        <View style={styles.severityRow}>
          <TouchableOpacity
            style={[styles.severityChip, severity === 'low' && styles.severityLow]}
            onPress={() => setSeverityLevel('low')}
          >
            <Text style={[styles.severityText, severity === 'low' && styles.severityTextActive]}>Faible</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.severityChip, severity === 'moderate' && styles.severityModerate]}
            onPress={() => setSeverityLevel('moderate')}
          >
            <Text style={[styles.severityText, severity === 'moderate' && styles.severityTextActive]}>Modérée</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.severityChip, severity === 'high' && styles.severityHigh]}
            onPress={() => setSeverityLevel('high')}
          >
            <Text style={[styles.severityText, severity === 'high' && styles.severityTextActive]}>Élevée</Text>
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
  container: { flex: 1, backgroundColor: '#F4F9F6' },
  header: { backgroundColor: '#C8E6C9' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12 },
  headerTitle: { color: '#1A2E28', fontSize: 18, fontWeight: '700' },
  chatContent: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 100 },
  bubble: { borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14, marginVertical: 6, maxWidth: width * 0.8 },
  aiBubble: { backgroundColor: '#E9D7FF', alignSelf: 'flex-start' },
  proBubble: { backgroundColor: '#D6E9FF', alignSelf: 'flex-start' },
  patientBubble: { backgroundColor: '#D6F5E4', alignSelf: 'flex-end' },
  aiText: { color: '#4B2E83', fontSize: 15 },
  proText: { color: '#0D3B66', fontSize: 15 },
  patientText: { color: '#1A2E28', fontSize: 15 },
  suggestionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  suggestionCard: { backgroundColor: '#FFFFFF', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0' },
  suggestionText: { color: '#1A2E28', fontSize: 14, fontWeight: '500' },
  severityRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  severityChip: { flex: 1, marginHorizontal: 4, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#D0DDD8', alignItems: 'center' },
  severityLow: { backgroundColor: '#D6F5E4', borderColor: '#D6F5E4' },
  severityModerate: { backgroundColor: '#FFE5B3', borderColor: '#FFE5B3' },
  severityHigh: { backgroundColor: '#FFCDD2', borderColor: '#FFCDD2' },
  severityText: { color: '#1A2E28', fontSize: 14, fontWeight: '600' },
  severityTextActive: { color: '#1A2E28' },
  inputBar: { backgroundColor: '#F4F9F6' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 10, paddingTop: 6 },
  input: { flex: 1, height: 44, backgroundColor: '#FFFFFF', borderRadius: 22, paddingHorizontal: 14, color: '#1A2E28', borderWidth: 1, borderColor: '#E0E0E0' },
  sendBtn: { height: 44, width: 44, borderRadius: 22, backgroundColor: '#3D6056', alignItems: 'center', justifyContent: 'center' },
});
