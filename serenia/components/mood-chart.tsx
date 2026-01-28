import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

type Point = { date: Date; value: number | null };

type Props = {
  points: Point[];
  range: 7 | 30;
  onChangeRange: (r: 7 | 30) => void;
};

export default function MoodChart({ points, range, onChangeRange }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const width = Dimensions.get("window").width - 40;
  const height = 140;
  const padding = 16;
  const R = 6;

  const { path, circles } = useMemo(() => {
    const xStep = (width - (padding + R) * 2) / Math.max(points.length - 1, 1);
    const toY = (v: number) => {
      const min = 1;
      const max = 5;
      const clamped = Math.max(min, Math.min(max, v));
      const top = padding + R;
      const bottom = height - padding - R;
      const scale = (clamped - min) / (max - min);
      return bottom - scale * (bottom - top);
    };
    const toX = (i: number) => padding + R + i * xStep;
    let d = "";
    let started = false;
    const cs: { cx: number; cy: number; i: number }[] = [];
    points.forEach((p, i) => {
      if (p.value != null) {
        const x = toX(i);
        const y = toY(p.value);
        cs.push({ cx: x, cy: y, i });
        if (!started) {
          d += `M ${x} ${y}`;
          started = true;
        } else {
          d += ` L ${x} ${y}`;
        }
      }
    });
    return { path: d, circles: cs };
  }, [points, width, height, padding]);

  const dateLabel = (d: Date) =>
    d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });

  const valueEmoji = (v: number) => {
    if (v >= 4.5) return "😊";
    if (v >= 3.5) return "🙂";
    if (v >= 2.5) return "😐";
    if (v >= 1.5) return "😔";
    return "😭";
  };

  const sel = selectedIndex != null ? points[selectedIndex] : null;
  const selCircle =
    selectedIndex != null
      ? circles.find((c) => c.i === selectedIndex)
      : undefined;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Évolution de l’humeur</Text>
        <View style={styles.rangeRow}>
          <TouchableOpacity
            style={[styles.rangeBtn, range === 7 && styles.rangeActive]}
            onPress={() => onChangeRange(7)}
          >
            <Text
              style={[styles.rangeText, range === 7 && styles.rangeTextActive]}
            >
              7j
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rangeBtn, range === 30 && styles.rangeActive]}
            onPress={() => onChangeRange(30)}
          >
            <Text
              style={[styles.rangeText, range === 30 && styles.rangeTextActive]}
            >
              30j
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ width, height }}>
        <Svg width={width} height={height}>
          <Path d={path} stroke="#3D6056" strokeWidth={2} fill="none" />
          {circles.map(({ cx, cy, i }) => (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={R}
              fill="#C8E6C9"
              stroke="#3D6056"
              strokeWidth={2}
              onPress={() => setSelectedIndex(i)}
            />
          ))}
        </Svg>
        {sel && sel.value != null && selCircle && (
          <View
            style={[
              styles.tooltip,
              {
                left: Math.max(8, Math.min(width - 120, selCircle.cx - 60)),
                top: Math.max(8, Math.min(height - 72, selCircle.cy - 48)),
              },
            ]}
          >
            <Text style={styles.tooltipDate}>{dateLabel(sel.date)}</Text>
            <Text style={styles.tooltipValue}>
              {valueEmoji(sel.value)} Moyenne: {sel.value.toFixed(2)}/5
            </Text>
          </View>
        )}
      </View>
      <View style={styles.legendRow}>
        <Text style={styles.legendText}>😊 bien</Text>
        <Text style={styles.legendText}>😐 neutre</Text>
        <Text style={styles.legendText}>😔 bas</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 12 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: { color: "#1A2E28", fontSize: 16, fontWeight: "700" },
  rangeRow: { flexDirection: "row", gap: 8 },
  rangeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "#F4F9F6",
  },
  rangeActive: { backgroundColor: "#D6F5E4" },
  rangeText: { color: "#1A2E28", fontSize: 13, fontWeight: "600" },
  rangeTextActive: { color: "#1A2E28" },
  tooltip: {
    position: "absolute",
    width: 120,
    backgroundColor: "#FFFFFF",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  tooltipDate: { color: "#1A2E28", fontSize: 12, fontWeight: "600" },
  tooltipValue: { color: "#1A2E28", fontSize: 12 },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  legendText: { color: "#5A7D70", fontSize: 12 },
});
