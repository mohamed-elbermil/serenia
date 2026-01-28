export type MoodValue = 1 | 2 | 3 | 4 | 5;

export function emojiToValue(e: string): MoodValue {
  if (e === '😊') return 5;
  if (e === '😐') return 3;
  if (e === '😔') return 2;
  if (e === '😭') return 1;
  if (e === '😡') return 1;
  return 3;
}

export function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export type MoodAggregate = { sum: number; count: number };

export function upsertMood(map: Record<string, MoodAggregate>, d: Date, v: MoodValue) {
  const k = dateKey(d);
  const prev = map[k] ?? { sum: 0, count: 0 };
  map[k] = { sum: prev.sum + v, count: prev.count + 1 };
  return map;
}

export function average(map: Record<string, MoodAggregate>, d: Date): number | null {
  const ag = map[dateKey(d)];
  if (!ag || ag.count === 0) return null;
  return ag.sum / ag.count;
}

export function timeSeries(map: Record<string, MoodAggregate>, days: number): { date: Date; value: number | null }[] {
  const result: { date: Date; value: number | null }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    result.push({ date: d, value: average(map, d) });
  }
  return result;
}
