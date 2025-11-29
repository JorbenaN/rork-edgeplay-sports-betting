import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useBetting } from "@/context/BettingContext";
import { computeTeamStats, selectionSortTeamsByPoints } from "@/utils/algorithms";
import { Award } from "lucide-react-native";
import { useEffect } from "react";

export default function StatsScreen() {
  const { currentUser } = useBetting();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.replace("/");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  const stats = computeTeamStats();
  const sortedTeams = selectionSortTeamsByPoints(stats);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#1E40AF" },
          headerTintColor: "#FFFFFF",
          title: "Team Statistics",
          headerTitleStyle: { fontWeight: "700" as const, fontSize: 20 },
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Award size={32} color="#FBBF24" />
          <Text style={styles.headerTitle}>La Liga Standings</Text>
        </View>

        <View style={styles.tableHeader}>
          <View style={[styles.tableCell, styles.positionCell]}>
            <Text style={styles.tableHeaderText}>#</Text>
          </View>
          <View style={[styles.tableCell, styles.teamCell]}>
            <Text style={styles.tableHeaderText}>Team</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableHeaderText}>P</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableHeaderText}>W</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableHeaderText}>D</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableHeaderText}>L</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableHeaderText}>Pts</Text>
          </View>
        </View>

        {sortedTeams.map(([team, teamStats], index) => {
          const points = teamStats.wins * 3 + teamStats.draws;
          const isTopThree = index < 3;
          const isRelegation = index >= sortedTeams.length - 3;

          return (
            <View
              key={team}
              style={[
                styles.tableRow,
                isTopThree && styles.tableRowTopThree,
                isRelegation && styles.tableRowRelegation,
              ]}
            >
              <View style={[styles.tableCell, styles.positionCell]}>
                <View style={[
                  styles.positionBadge,
                  isTopThree && styles.positionBadgeTop,
                  isRelegation && styles.positionBadgeRelegation,
                ]}>
                  <Text style={[
                    styles.positionText,
                    isTopThree && styles.positionTextTop,
                    isRelegation && styles.positionTextRelegation,
                  ]}>
                    {index + 1}
                  </Text>
                </View>
              </View>
              <View style={[styles.tableCell, styles.teamCell]}>
                <Text style={styles.teamName} numberOfLines={1}>
                  {team}
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.statText}>{teamStats.played}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.statText}>{teamStats.wins}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.statText}>{teamStats.draws}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.statText}>{teamStats.losses}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.pointsText}>{points}</Text>
              </View>
            </View>
          );
        })}

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.legendDotTop]} />
            <Text style={styles.legendText}>Champions League</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.legendDotRelegation]} />
            <Text style={styles.legendText}>Relegation</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F2FE",
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#1E40AF",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1E40AF",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#BFDBFE",
  },
  tableRowTopThree: {
    backgroundColor: "#DBEAFE",
  },
  tableRowRelegation: {
    backgroundColor: "#FEE2E2",
  },
  tableCell: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
  },
  positionCell: {
    width: 50,
  },
  teamCell: {
    flex: 1,
    alignItems: "flex-start",
    paddingLeft: 8,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  positionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#93C5FD",
    alignItems: "center",
    justifyContent: "center",
  },
  positionBadgeTop: {
    backgroundColor: "#10B981",
  },
  positionBadgeRelegation: {
    backgroundColor: "#EF4444",
  },
  positionText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  positionTextTop: {
    color: "#FFFFFF",
  },
  positionTextRelegation: {
    color: "#FFFFFF",
  },
  teamName: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1E293B",
  },
  statText: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: "#64748B",
  },
  pointsText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1E40AF",
  },
  legend: {
    flexDirection: "row",
    gap: 24,
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#BFDBFE",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendDotTop: {
    backgroundColor: "#10B981",
  },
  legendDotRelegation: {
    backgroundColor: "#EF4444",
  },
  legendText: {
    fontSize: 13,
    color: "#64748B",
  },
});
