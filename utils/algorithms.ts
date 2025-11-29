import { User, Bet, Match, TeamStats } from "@/types/models";

export const quicksortUsersByProfit = (users: User[]): User[] => {
  if (users.length <= 1) {
    return users;
  }

  const pivot = users[0];
  const pivotProfit = pivot.balance - pivot.startingBalance;

  const left: User[] = [];
  const right: User[] = [];

  for (let i = 1; i < users.length; i++) {
    const userProfit = users[i].balance - users[i].startingBalance;
    if (userProfit >= pivotProfit) {
      left.push(users[i]);
    } else {
      right.push(users[i]);
    }
  }

  const sortedLeft = quicksortUsersByProfit(left);
  const sortedRight = quicksortUsersByProfit(right);

  return [...sortedLeft, pivot, ...sortedRight];
};

export const settleBet = (bet: Bet, match: Match): number => {
  if (match.result === null) {
    return 0.0;
  }

  if (bet.outcome === match.result) {
    const odd = match.odds[bet.outcome];
    bet.won = true;
    bet.payout = bet.stake * odd;
  } else {
    bet.won = false;
    bet.payout = 0.0;
  }

  const netProfit = bet.payout - bet.stake;
  return netProfit;
};

export const computeTeamStats = (): Record<string, TeamStats> => {
  return {
    "Real Madrid": { played: 10, wins: 8, draws: 1, losses: 1 },
    Barcelona: { played: 10, wins: 7, draws: 2, losses: 1 },
    Atletico: { played: 10, wins: 6, draws: 2, losses: 2 },
    Villarreal: { played: 10, wins: 6, draws: 1, losses: 3 },
    "Real Sociedad": { played: 10, wins: 5, draws: 3, losses: 2 },
    Sevilla: { played: 10, wins: 5, draws: 2, losses: 3 },
    "Athletic Bilbao": { played: 10, wins: 4, draws: 4, losses: 2 },
    "Real Betis": { played: 10, wins: 4, draws: 3, losses: 3 },
    Valencia: { played: 10, wins: 4, draws: 2, losses: 4 },
    "Celta Vigo": { played: 10, wins: 3, draws: 4, losses: 3 },
    Osasuna: { played: 10, wins: 3, draws: 3, losses: 4 },
    Granada: { played: 10, wins: 3, draws: 2, losses: 5 },
    "Las Palmas": { played: 10, wins: 3, draws: 1, losses: 6 },
    Girona: { played: 10, wins: 2, draws: 3, losses: 5 },
    Cádiz: { played: 10, wins: 2, draws: 2, losses: 6 },
    Getafe: { played: 10, wins: 2, draws: 2, losses: 6 },
    Mallorca: { played: 10, wins: 2, draws: 2, losses: 6 },
    "Rayo Vallecano": { played: 10, wins: 2, draws: 1, losses: 7 },
    Almería: { played: 10, wins: 1, draws: 3, losses: 6 },
    Levante: { played: 10, wins: 1, draws: 2, losses: 7 },
  };
};

export const selectionSortTeamsByPoints = (
  teamStats: Record<string, TeamStats>
): [string, TeamStats][] => {
  const items = Object.entries(teamStats);

  const calculatePoints = (stats: TeamStats): number => {
    return stats.wins * 3 + stats.draws;
  };

  const n = items.length;
  for (let i = 0; i < n; i++) {
    let bestIndex = i;

    for (let j = i + 1; j < n; j++) {
      const [teamJ, statsJ] = items[j];
      const [teamBest, statsBest] = items[bestIndex];

      const ptsJ = calculatePoints(statsJ);
      const ptsBest = calculatePoints(statsBest);

      if (ptsJ > ptsBest || (ptsJ === ptsBest && teamJ < teamBest)) {
        bestIndex = j;
      }
    }

    [items[i], items[bestIndex]] = [items[bestIndex], items[i]];
  }

  return items;
};
