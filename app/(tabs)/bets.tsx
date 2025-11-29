import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import { useBetting } from "@/context/BettingContext";
import { useRouter, Stack } from "expo-router";
import { useState, useEffect } from "react";
import { BetOutcome } from "@/types/models";

export default function BetsScreen() {
  const { currentUser, getAllMatches, placeBet } = useBetting();
  const router = useRouter();
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<BetOutcome | null>(null);
  const [stakeInput, setStakeInput] = useState<string>("");

  useEffect(() => {
    if (!currentUser) {
      router.replace("/");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  const matches = getAllMatches();

  const handlePlaceBet = () => {
    if (!selectedMatch || !selectedOutcome || !stakeInput) {
      Alert.alert("Error", "Please select a match, outcome, and enter stake amount");
      return;
    }

    const stake = parseFloat(stakeInput);
    if (isNaN(stake)) {
      Alert.alert("Error", "Please enter a valid stake amount");
      return;
    }

    const result = placeBet(selectedMatch, selectedOutcome, stake);
    
    if (result.success) {
      Alert.alert("Bet Placed!", result.message);
      setSelectedMatch(null);
      setSelectedOutcome(null);
      setStakeInput("");
    } else {
      Alert.alert("Error", result.message);
    }
  };

  const getResultLabel = (result: "H" | "D" | "A" | null): string => {
    if (result === null) return "Pending";
    switch (result) {
      case "H": return "Home Win";
      case "D": return "Draw";
      case "A": return "Away Win";
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#1E40AF" },
          headerTintColor: "#FFFFFF",
          title: "Place Bet",
          headerTitleStyle: { fontWeight: "700" as const, fontSize: 20 },
        }}
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceValue}>€{currentUser.balance.toFixed(2)}</Text>
          </View>

          <Text style={styles.sectionTitle}>Select Match</Text>
          {matches.map((match) => {
            const isSelected = selectedMatch === match.matchId;
            const hasResult = match.result !== null;

            return (
              <TouchableOpacity
                key={match.matchId}
                style={[styles.matchCard, isSelected && styles.matchCardSelected]}
                onPress={() => setSelectedMatch(match.matchId)}
                activeOpacity={0.7}
              >
                <View style={styles.matchHeader}>
                  <View style={styles.matchTeams}>
                    <Text style={styles.teamName}>{match.homeTeam}</Text>
                    <Text style={styles.vs}>vs</Text>
                    <Text style={styles.teamName}>{match.awayTeam}</Text>
                  </View>
                  {hasResult && (
                    <View style={styles.resultBadge}>
                      <Text style={styles.resultText}>{getResultLabel(match.result)}</Text>
                    </View>
                  )}
                </View>

                {isSelected && (
                  <>
                    <View style={styles.oddsContainer}>
                      <TouchableOpacity
                        style={[styles.oddButton, selectedOutcome === "H" && styles.oddButtonSelected]}
                        onPress={() => setSelectedOutcome("H")}
                      >
                        <Text style={[styles.oddLabel, selectedOutcome === "H" && styles.oddLabelSelected]}>
                          Home
                        </Text>
                        <Text style={[styles.oddValue, selectedOutcome === "H" && styles.oddValueSelected]}>
                          {match.odds.H.toFixed(2)}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.oddButton, selectedOutcome === "D" && styles.oddButtonSelected]}
                        onPress={() => setSelectedOutcome("D")}
                      >
                        <Text style={[styles.oddLabel, selectedOutcome === "D" && styles.oddLabelSelected]}>
                          Draw
                        </Text>
                        <Text style={[styles.oddValue, selectedOutcome === "D" && styles.oddValueSelected]}>
                          {match.odds.D.toFixed(2)}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.oddButton, selectedOutcome === "A" && styles.oddButtonSelected]}
                        onPress={() => setSelectedOutcome("A")}
                      >
                        <Text style={[styles.oddLabel, selectedOutcome === "A" && styles.oddLabelSelected]}>
                          Away
                        </Text>
                        <Text style={[styles.oddValue, selectedOutcome === "A" && styles.oddValueSelected]}>
                          {match.odds.A.toFixed(2)}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {selectedOutcome && (
                      <View style={styles.stakeContainer}>
                        <Text style={styles.stakeLabel}>Stake Amount (€)</Text>
                        <TextInput
                          style={styles.stakeInput}
                          value={stakeInput}
                          onChangeText={setStakeInput}
                          keyboardType="decimal-pad"
                          placeholder="0.00"
                          placeholderTextColor="#64748B"
                        />
                        {stakeInput && !isNaN(parseFloat(stakeInput)) && (
                          <View style={styles.payoutInfo}>
                            <Text style={styles.payoutLabel}>Potential Payout:</Text>
                            <Text style={styles.payoutValue}>
                              €{(parseFloat(stakeInput) * match.odds[selectedOutcome]).toFixed(2)}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {selectedMatch && selectedOutcome && stakeInput && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.placeBetButton} onPress={handlePlaceBet}>
              <Text style={styles.placeBetText}>Place Bet</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F2FE",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  balanceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  balanceLabel: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: "#1E40AF",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#1E40AF",
    marginBottom: 16,
  },
  matchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#BFDBFE",
  },
  matchCardSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  matchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  matchTeams: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#1E293B",
    marginBottom: 4,
  },
  vs: {
    fontSize: 12,
    color: "#64748B",
    marginVertical: 4,
  },
  resultBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#93C5FD",
  },
  resultText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#1E40AF",
  },
  oddsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  oddButton: {
    flex: 1,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#BFDBFE",
  },
  oddButtonSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  oddLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
    fontWeight: "500" as const,
  },
  oddLabelSelected: {
    color: "#FFFFFF",
  },
  oddValue: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#1E40AF",
  },
  oddValueSelected: {
    color: "#FFFFFF",
  },
  stakeContainer: {
    marginTop: 16,
    backgroundColor: "#DBEAFE",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#93C5FD",
  },
  stakeLabel: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 8,
    fontWeight: "500" as const,
  },
  stakeInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    color: "#1E40AF",
    fontWeight: "600" as const,
    borderWidth: 1,
    borderColor: "#93C5FD",
  },
  payoutInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#93C5FD",
  },
  payoutLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  payoutValue: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#10B981",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#E0F2FE",
    borderTopWidth: 2,
    borderTopColor: "#BFDBFE",
  },
  placeBetButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  placeBetText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
});
