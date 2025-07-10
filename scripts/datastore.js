// DataStore object
import { CONFIG } from './config.js';
import { Game } from './models.js';

export const DataStore = {
    teamStats: [
        { team: 'Team 1', avgPts: 85.2, avgAllowed: 72.8, topScorer: 'Mike Johnson', wins: 8, losses: 2, ties: 0, totalPoints: 16, gb: '-', streak: 'W4' },
        { team: 'Team 2', avgPts: 82.1, avgAllowed: 75.3, topScorer: 'Kevin Wilson', wins: 7, losses: 3, ties: 0, totalPoints: 14, gb: '1.0', streak: 'L1' },
        { team: 'Team 3', avgPts: 78.9, avgAllowed: 76.2, topScorer: 'Paul Taylor', wins: 6, losses: 4, ties: 0, totalPoints: 12, gb: '2.0', streak: 'W2' },
        { team: 'Team 4', avgPts: 76.4, avgAllowed: 78.1, topScorer: 'Dan Martin', wins: 5, losses: 5, ties: 0, totalPoints: 10, gb: '3.0', streak: 'L2' },
        { team: 'Team 5', avgPts: 71.2, avgAllowed: 83.4, topScorer: 'Adam Hall', wins: 3, losses: 7, ties: 0, totalPoints: 6, gb: '5.0', streak: 'L3' },
        { team: 'Team 6', avgPts: 68.8, avgAllowed: 87.9, topScorer: 'Owen Lopez', wins: 1, losses: 9, ties: 0, totalPoints: 2, gb: '7.0', streak: 'L5' }
    ],

    playoffs: [
        new Game(1, '2025-06-03', '18:30', 'Seed 1', 'Seed 2', CONFIG.venue, 'scheduled', 'Mark', 'Chris'),
        new Game(2, '2025-06-03', '19:40', 'Seed 4', 'Seed 5', CONFIG.venue, 'scheduled', 'Adam', 'Dan'),
        new Game(3, '2025-06-03', '20:50', 'Seed 3', 'Seed 6', CONFIG.venue, 'scheduled', 'Mike', 'Kevin'),
        new Game(4, '2025-06-10', '19:00', 'Seed 1', 'Lowest 4 5 6', CONFIG.venue, 'scheduled', 'Luke', 'Matt'),
        new Game(5, '2025-06-10', '20:15', 'Seed 2', 'Lowest 3 4 5', CONFIG.venue, 'scheduled', 'Peter', 'Geroge'),
        new Game(6, '2025-06-17', '19:30', 'Game 1 Winner', 'Game 2 Winner', CONFIG.venue, 'scheduled', 'Adam', 'Owen')
    ]
};