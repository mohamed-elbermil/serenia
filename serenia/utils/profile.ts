import AsyncStorage from "@react-native-async-storage/async-storage";

export type Profile = {
  name: string;
  email: string;
  avatarUri?: string | null;
};

const PROFILE_KEY = "serenia:profile";

export async function loadProfile(): Promise<Profile | null> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      avatarUri:
        typeof parsed.avatarUri === "string" || parsed.avatarUri == null
          ? parsed.avatarUri
          : null,
    };
  } catch {
    return null;
  }
}

export async function saveProfile(p: Profile): Promise<void> {
  const sanitized: Profile = {
    name: p.name.trim(),
    email: p.email.trim(),
    avatarUri: p.avatarUri ?? null,
  };
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(sanitized));
}

export function isValidEmail(email: string): boolean {
  const re =
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return re.test(email.trim());
}
