// Data models (Game, Team, etc.)
import { CONFIG } from './config.js';

export class Game {
    constructor(id, date, time, homeTeam, awayTeam, location = CONFIG.venue, status = 'scheduled', sk1 = '', sk2 = '') {
        this.id = id;
        this.date = date;
        this.time = time;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.location = location;
        this.status = status;
        this.sk1 = sk1;
        this.sk2 = sk2;
    }
}

export class Team {
    constructor(name, wins = 0, losses = 0, ties = 0, pf = 0, pa = 0, streak = '') {
        this.name = name;
        this.wins = wins;
        this.losses = losses;
        this.ties = ties;
        this.pf = pf;
        this.pa = pa;
        this.streak = streak;
    }
    get totalPoints() {
        return (this.wins * 2) + this.ties;
    }
    get totalGames() {
        return this.wins + this.losses + this.ties;
    }
    get winPercentage() {
        return this.totalGames > 0 ? (this.wins / this.totalGames).toFixed(3) : '0.000';
    }
}