import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useBetting } from "@/context/BettingContext";
import { useRouter, Stack } from "expo-router";
import { CheckCircle2, XCircle, Clock } from "lucide-react-native";
import { useEffect } from "react";

export default function HistoryScreen() {
  const { currentUser, getMatch } = useBetting();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.replace("/");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  const bets = currentUser.bets;

  const getOutcomeLabel = (outcome: "H" | "D" | "A", matchId: string): string => {
    const match = getMatch(matchId);
    if (!match) return outcome;

    switch (outcome) {
      case "H":
        return `${match.homeTeam} Win`;
      case "D":
        return "Draw";
      case "A":
        return `${match.awayTeam} Win`;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#1E40AF" },
          headerTintColor: "#FFFFFF",
          title: "Betting History",
          headerTitleStyle: { fontWeight: "700" as const, fontSize: 20 },
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {bets.length === 0 ? (
          <View style={styles.emptyState}>
            <Clock size={64} color="#64748B" />
            <Text style={styles.emptyText}>No betting history yet</Text>
            <Text style={styles.emptySubtext}>Place your first bet to see it here</Text>
          </View>
        ) : (
          bets.map((bet, index) => {
            const match = getMatch(bet.matchId);
            if (!match) return null;

            const netProfit = bet.payout - bet.stake;

            return (
              <View key={`${bet.matchId}-${index}`} style={styles.betCard}>
                <View style={styles.betHeader}>
                  <View style={styles.matchInfo}>
                    <Text style={styles.matchText}>
                      {match.homeTeam} vs {match.awayTeam}
                    </Text>
                    <Text style={styles.betType}>{getOutcomeLabel(bet.outcome, bet.matchId)}</Text>
                  </View>
                  
                  <View style={styles.statusBadge}>
                    {bet.won === true && <CheckCircle2 size={20} color="#10B981" />}
                    {bet.won === false && <XCircle size={20} color="#EF4444" />}
                    {bet.won === null && <Clock size={20} color="#FBBF24" />}
                  </View>
                </View>

                <View style={styles.betDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Stake</Text>
                    <Text style={styles.detailValue}>€{bet.stake.toFixed(2)}</Text>
                  </View>
                  
                  {bet.won !== null && (
                    <>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Payout</Text>
                        <Text style={styles.detailValue}>€{bet.payout.toFixed(2)}</Text>
                      </View>
                      <View style={[styles.detailRow, styles.profitRow]}>
                        <Text style={styles.detailLabel}>Net Profit</Text>
                        <Text style={[
                          styles.profitValue,
                          bet.won ? styles.profitPositive : styles.profitNegative,
                        ]}>
                          {bet.won ? "+" : ""}€{netProfit.toFixed(2)}
                        </Text>
                      </View>
                    </>
                  )}
                </View>

                <View style={[
                  styles.statusBar,
                  bet.won === true && styles.statusBarWon,
                  bet.won === false && styles.statusBarLost,
                  bet.won === null && styles.statusBarPending,
                ]} />
              </View>
            );
          })
        )}
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
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 120,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: "#1E40AF",
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#64748B",
  },
  betCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#BFDBFE",
  },
  betHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  matchInfo: {
    flex: 1,
  },
  matchText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#1E293B",
    marginBottom: 6,
  },
  betType: {
    fontSize: 14,
    color: "#64748B",
  },
  statusBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#93C5FD",
  },
  betDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profitRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#BFDBFE",
  },
  detailLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1E40AF",
  },
  profitValue: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
  profitPositive: {
    color: "#10B981",
  },
  profitNegative: {
    color: "#EF4444",
  },
  statusBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  statusBarWon: {
    backgroundColor: "#10B981",
  },
  statusBarLost: {
    backgroundColor: "#EF4444",
  },
  statusBarPending: {
    backgroundColor: "#FBBF24",
  },
});
