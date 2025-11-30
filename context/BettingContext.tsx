import createContextHook from "@nkzw/create-context-hook";
import { useState, useCallback } from "react";
import { User, Match, Bet, BetOutcome } from "@/types/models";
import { createDemoUsers, createDemoMatches } from "@/data/demoData";
import { quicksortUsersByProfit, settleBet } from "@/utils/algorithms";

export const [BettingProvider, useBetting] = createContextHook(() => {
  const [users, setUsers] = useState<Record<string, User>>(createDemoUsers());
  const [matches] = useState<Record<string, Match>>(createDemoMatches());
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = useCallback((email: string, password: string) => {
    const user = users[email.toLowerCase()];
    if (user && user.password === password) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [users]);

  const createAccount = useCallback((username: string, email: string, password: string): { success: boolean; message: string } => {
    const lowerEmail = email.toLowerCase();
    
    if (users[lowerEmail]) {
      return { success: false, message: "Account with this email already exists" };
    }

    if (username.trim().length < 2) {
      return { success: false, message: "Username must be at least 2 characters" };
    }

    if (password.length < 3) {
      return { success: false, message: "Password must be at least 3 characters" };
    }

    const newUser: User = {
      username: username.trim(),
      email: lowerEmail,
      password,
      startingBalance: 100,
      balance: 100,
      bets: [],
    };

    const updatedUsers = { ...users, [lowerEmail]: newUser };
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    
    return { success: true, message: "Account created successfully!" };
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const placeBet = useCallback((matchId: string, outcome: BetOutcome, stake: number): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: "Not logged in" };
    }

    const match = matches[matchId];
    if (!match) {
      return { success: false, message: "Match not found" };
    }

    if (stake <= 0) {
      return { success: false, message: "Stake must be positive" };
    }

    if (stake > currentUser.balance) {
      return { success: false, message: "Insufficient balance" };
    }

    const bet: Bet = {
      matchId: match.matchId,
      outcome,
      stake,
      won: null,
      payout: 0,
    };

    settleBet(bet, match);

    const newBalance = currentUser.balance - stake + bet.payout;
    const updatedUser: User = {
      ...currentUser,
      balance: newBalance,
      bets: [...currentUser.bets, bet],
    };

    const updatedUsers = { ...users, [currentUser.email]: updatedUser };
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);

    const netProfit = bet.payout - stake;
    if (bet.won) {
      return { success: true, message: `You WON! Payout: €${bet.payout.toFixed(2)}. Net profit: €${netProfit.toFixed(2)}` };
    } else {
      return { success: true, message: `You LOST. You lost your stake of €${stake.toFixed(2)}` };
    }
  }, [currentUser, matches, users]);

  const getAllUsers = useCallback((): User[] => {
    return Object.values(users);
  }, [users]);

  const getSortedUsers = useCallback((): User[] => {
    return quicksortUsersByProfit(Object.values(users));
  }, [users]);

  const getAllMatches = useCallback((): Match[] => {
    return Object.values(matches);
  }, [matches]);

  const getMatch = useCallback((matchId: string): Match | undefined => {
    return matches[matchId];
  }, [matches]);

  const getUserProfit = useCallback((user: User): number => {
    return user.balance - user.startingBalance;
  }, []);

  return {
    users,
    currentUser,
    matches,
    login,
    logout,
    createAccount,
    placeBet,
    getAllUsers,
    getSortedUsers,
    getAllMatches,
    getMatch,
    getUserProfit,
  };
});
