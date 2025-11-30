import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useBetting } from "@/context/BettingContext";
import { useRouter, Stack } from "expo-router";
import { TrendingUp, TrendingDown, Trophy, LogOut } from "lucide-react-native";
import { useEffect, useCallback } from "react";

export default function HomeScreen() {
  const { currentUser, getUserProfit, getSortedUsers, logout } = useBetting();
  const router = useRouter();

  const profit = currentUser ? getUserProfit(currentUser) : 0;
  const sortedUsers = getSortedUsers();
  const userRank = currentUser ? sortedUsers.findIndex((u) => u.username === currentUser.username) + 1 : 0;

  const handleLogout = useCallback(() => {
    logout();
    router.replace("/");
  }, [logout, router]);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#1E40AF" },
          headerTintColor: "#FFFFFF",
          title: "EdgeplayIE",
          headerTitleStyle: { fontWeight: "700" as const, fontSize: 20 },
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <LogOut size={22} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.userCard}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.username}>{currentUser.username}</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Balance</Text>
              <Text style={styles.statValue}>€{currentUser.balance.toFixed(2)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Profit</Text>
              <View style={styles.profitContainer}>
                {profit >= 0 ? (
                  <TrendingUp size={20} color="#10B981" />
                ) : (
                  <TrendingDown size={20} color="#EF4444" />
                )}
                <Text style={[styles.statValue, profit >= 0 ? styles.profitPositive : styles.profitNegative]}>
                  €{profit.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.rankBadge}>
            <Trophy size={18} color="#FBBF24" />
            <Text style={styles.rankText}>Rank #{userRank} of {sortedUsers.length}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Trophy size={24} color="#FBBF24" />
            <Text style={styles.sectionTitle}>Leaderboard</Text>
          </View>
          
          <View style={styles.leaderboard}>
            {sortedUsers.slice(0, 10).map((user, index) => {
              const userProfit = getUserProfit(user);
              const isCurrentUser = user.username === currentUser.username;
              
              return (
                <View
                  key={user.username}
                  style={[
                    styles.leaderboardItem,
                    isCurrentUser && styles.leaderboardItemCurrent,
                  ]}
                >
                  <View style={styles.leaderboardRank}>
                    <Text style={[
                      styles.rankNumber,
                      index === 0 && styles.rankNumberFirst,
                      index === 1 && styles.rankNumberSecond,
                      index === 2 && styles.rankNumberThird,
                    ]}>
                      {index + 1}
                    </Text>
                  </View>
                  <View style={styles.leaderboardInfo}>
                    <Text style={[styles.leaderboardName, isCurrentUser && styles.leaderboardNameCurrent]}>
                      {user.username}
                    </Text>
                    <Text style={styles.leaderboardBalance}>€{user.balance.toFixed(2)}</Text>
                  </View>
                  <Text style={[
                    styles.leaderboardProfit,
                    userProfit >= 0 ? styles.profitPositive : styles.profitNegative,
                  ]}>
                    {userProfit >= 0 ? "+" : "-"}€{Math.abs(userProfit).toFixed(2)}
                  </Text>
                </View>
              );
            })}
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
  logoutButton: {
    marginRight: 12,
    padding: 8,
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#3B82F6",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 4,
  },
  username: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: "#1E40AF",
    textTransform: "capitalize",
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  statLabel: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 8,
    fontWeight: "500" as const,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#1E40AF",
  },
  profitContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profitPositive: {
    color: "#10B981",
  },
  profitNegative: {
    color: "#EF4444",
  },
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#DBEAFE",
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#93C5FD",
  },
  rankText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#1E40AF",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#1E40AF",
  },
  leaderboard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#BFDBFE",
  },
  leaderboardItemCurrent: {
    backgroundColor: "#DBEAFE",
  },
  leaderboardRank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  rankNumberFirst: {
    color: "#FBBF24",
  },
  rankNumberSecond: {
    color: "#94A3B8",
  },
  rankNumberThird: {
    color: "#CD7F32",
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#1E293B",
    textTransform: "capitalize",
    marginBottom: 2,
  },
  leaderboardNameCurrent: {
    color: "#1E40AF",
  },
  leaderboardBalance: {
    fontSize: 13,
    color: "#64748B",
  },
  leaderboardProfit: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
});
