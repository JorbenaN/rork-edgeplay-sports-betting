export interface User {
  username: string;
  email: string;
  password: string;
  startingBalance: number;
  balance: number;
  bets: Bet[];
}

export interface Match {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  odds: {
    H: number;
    D: number;
    A: number;
  };
  result: "H" | "D" | "A" | null;
}

export type BetOutcome = "H" | "D" | "A";

export interface Bet {
  matchId: string;
  outcome: BetOutcome;
  stake: number;
  won: boolean | null;
  payout: number;
}

export interface TeamStats {
  played: number;
  wins: number;
  draws: number;
  losses: number;
}
