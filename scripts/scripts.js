// ===== CONFIGURATION & STATE =====
const CONFIG = {
    adminPassword: "nbc2025",
    venue: "Magna Centre Gym",
    gameTimeSlots: ['18:30', '19:40', '20:50'],
    gameLabels: ['Early Game - 6:30', 'Middle Game - 7:40', 'Late Game - 8:50'],
    scrollPosition: 0,
    scrollStep: 300
};

// Application State
const AppState = {
    isAdminLoggedIn: false,
    currentSection: 'main'
};

// Data Models
class Game {
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

class Team {
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

// ===== DATA STORAGE =====
const DataStore = {
    games: [
        new Game(1, '2025-06-03', '18:30', 'Team 1', 'Team 2', CONFIG.venue, 'scheduled', 'Mark', 'Chris'),
        new Game(2, '2025-06-03', '19:40', 'Team 3', 'Team 4', CONFIG.venue, 'scheduled', 'Adam', 'Dan'),
        new Game(3, '2025-06-03', '20:50', 'Team 5', 'Team 6', CONFIG.venue, 'scheduled', 'Mike', 'Kevin'),
        new Game(4, '2025-06-10', '18:30', 'Team 1', 'Team 2', CONFIG.venue, 'scheduled', 'Luke', 'Matt'),
        new Game(5, '2025-06-10', '19:40', 'Team 3', 'Team 4', CONFIG.venue, 'scheduled', 'Peter', 'Geroge'),
        new Game(6, '2025-06-10', '20:50', 'Team 5', 'Team 6', CONFIG.venue, 'scheduled', 'Paul', 'Dan'),
        new Game(7, '2025-06-17', '18:30', 'Team 1', 'Team 2', CONFIG.venue, 'scheduled', 'Ethan', 'Connor'),
        new Game(8, '2025-06-17', '19:40', 'Team 3', 'Team 4', CONFIG.venue, 'scheduled', 'Steve', 'Ian'),
        new Game(9, '2025-06-17', '20:50', 'Team 5', 'Team 6', CONFIG.venue, 'scheduled', 'Adam', 'Owen')
    ],

    gameResults: [
        { id: 1, date: '2025-05-28', homeTeam: 'Team 1', awayTeam: 'Team 2', homeScore: 78, awayScore: 72, status: 'final' },
        { id: 2, date: '2025-05-28', homeTeam: 'Team 3', awayTeam: 'Team 4', homeScore: 75, awayScore: 79, status: 'final' },
        { id: 3, date: '2025-05-28', homeTeam: 'Team 5', awayTeam: 'Team 6', homeScore: 71, awayScore: 68, status: 'final' },
        { id: 4, date: '2025-06-04', homeTeam: 'Team 2', awayTeam: 'Team 5', homeScore: null, awayScore: null, status: 'scheduled', time: '18:30' },
        { id: 5, date: '2025-06-04', homeTeam: 'Team 1', awayTeam: 'Team 3', homeScore: null, awayScore: null, status: 'scheduled', time: '19:40' },
        { id: 6, date: '2025-06-04', homeTeam: 'Team 4', awayTeam: 'Team 6', homeScore: null, awayScore: null, status: 'scheduled', time: '20:50' }
    ],

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
    ],

    preSeasonPlayers: {
        game1: [ // 6:30 PM
            'James Wilson', 'Michael Smith', 'David Brown',
            'Robert Johnson', 'William Davis', 'Thomas Anderson',
            'Christopher Lee', 'Daniel White', 'Joseph Taylor',
            'Matthew Martin', 'Andrew Thompson', 'Ryan Garcia',
            'Kevin Rodriguez', 'Steven Martinez', 'Brian Robinson',
            'Jason Wright'
        ],
        game2: [ // 7:30 PM
            'John Murphy', 'Paul Collins', 'Mark Edwards',
            'Eric Phillips', 'George Howard', 'Kenneth Butler',
            'Ronald Turner', 'Timothy Ross', 'Gary Coleman',
            'Stephen Hill', 'Edward Baker', 'Patrick Kelly',
            'Frank Young', 'Scott King', 'Jeffrey Lopez',
            'Larry Mitchell'
        ],
        game3: [ // 8:30 PM
            'Donald Gray', 'Gregory Adams', 'Charles Hall',
            'Dennis Nelson', 'Jerry Torres', 'Peter Morgan',
            'Carl Carter', 'Henry Ward', 'Roger Watson',
            'Albert Brooks', 'Wayne Price', 'Bruce Bennett',
            'Fred Hughes', 'Vincent Cox', 'Ralph Bailey',
            'Todd Richardson'
        ]
    }
};

// ===== UTILITY FUNCTIONS =====
const Utils = {
    formatDate(dateString) {
        // FIXED: Improved date parsing to handle timezone issues
        const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
        const date = new Date(year, month - 1, day);
        
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'America/Toronto' // Using Toronto timezone since user is in Toronto
        });
    },

    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    },

	formatDateShort(dateString) {
		const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
		const date = new Date(year, month - 1, day);
		
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short', 
			day: 'numeric',
			timeZone: 'America/Toronto'
		}).toUpperCase();
	},

    getUpcomingGames(limit = 3) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return DataStore.games
            .filter(game => {
                const [year, month, day] = game.date.split('-').map(num => parseInt(num, 10));
                const gameDate = new Date(year, month - 1, day);
                gameDate.setHours(0, 0, 0, 0);
                return gameDate >= today;
            })
            .sort((a, b) => {
                if (a.date === b.date) {
                    return a.time.localeCompare(b.time);
                }
                return a.date.localeCompare(b.date);
            })
            .slice(0, limit);
    },

    groupGamesByDate() {
        const gamesByDate = {};
        DataStore.games.forEach(game => {
            if (!gamesByDate[game.date]) {
                gamesByDate[game.date] = [];
            }
            gamesByDate[game.date].push(game);
        });
        return gamesByDate;
    },

    parseCSVDate(dateStr) {
        // ENHANCED: Better CSV date parsing with validation
        if (dateStr.includes('/')) {
            const dateParts = dateStr.split('/');
            if (dateParts.length === 3) {
                const month = dateParts[0].padStart(2, '0');
                const day = dateParts[1].padStart(2, '0');
                let year = dateParts[2];
                
                // Handle 2-digit years
                if (year.length === 2) {
                    year = '20' + year;
                }
                
                return `${year}-${month}-${day}`;
            }
        }
        
        // If already in YYYY-MM-DD format, validate and return
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateStr;
        }
        
        console.warn('Unrecognized date format:', dateStr);
        return dateStr;
    },

    createElement(tag, className, innerHTML) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }
};

// ===== AUTHENTICATION MODULE =====
const Auth = {
    showAdminLogin() {
        document.getElementById('adminLogin').classList.add('show');
    },

    closeAdminLogin() {
        document.getElementById('adminLogin').classList.remove('show');
        document.getElementById('adminPassword').value = '';
    },

    handleEnterKey(event) {
        if (event.key === 'Enter') {
            Auth.checkAdminPassword();
        }
    },

    checkAdminPassword() {
        const enteredPassword = document.getElementById('adminPassword').value;
        
        if (enteredPassword === CONFIG.adminPassword) {
            AppState.isAdminLoggedIn = true;
            document.getElementById('adminTab').style.display = 'block';
            Auth.closeAdminLogin();
            Navigation.showSection('admin');
            alert('Welcome, Administrator!');
        } else {
            alert('Incorrect password. Access denied.');
            document.getElementById('adminPassword').value = '';
        }
    }
};

// ===== NAVIGATION MODULE =====
const Navigation = {
    showSection(sectionId) {
        // Check if trying to access admin without being logged in
        if (sectionId === 'admin' && !AppState.isAdminLoggedIn) {
            Auth.showAdminLogin();
            return;
        }

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(sectionId).classList.add('active');
        
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Find and activate the clicked tab
        const activeTab = document.querySelector(`[onclick="showSection('${sectionId}')"]`) || 
                         document.getElementById(`${sectionId}Tab`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        AppState.currentSection = sectionId;
    }
};

// ===== RENDERING MODULES =====
const ScheduleRenderer = {
    renderUpcoming() {
        const scheduleGrid = document.getElementById('scheduleGrid');
        scheduleGrid.innerHTML = '';

        const upcomingGames = Utils.getUpcomingGames(3);

        if (upcomingGames.length === 0) {
            const noGamesCard = Utils.createElement('div', 'game-card', `
                <div style="text-align: center; color: #7f8c8d;">
                    <h3>No upcoming games scheduled</h3>
                </div>
            `);
            scheduleGrid.appendChild(noGamesCard);
            return;
        }

        upcomingGames.forEach(game => {
            const gameCard = Utils.createElement('div', 'game-card', `
                <div class="game-header">
                    <div class="game-time">${Utils.formatTime(game.time)}</div>
                    <div class="game-date">${Utils.formatDate(game.date)}</div>
                </div>
                <div class="game-location">${game.location}</div>
                <div class="game-matchup">
                    <div class="team">
                        <div class="team-name">${game.homeTeam}</div>
                    </div>
                    <div class="vs">VS</div>
                    <div class="team">
                        <div class="team-name">${game.awayTeam}</div>
                    </div>
                </div>
            `);
            scheduleGrid.appendChild(gameCard);
        });
    },

    async renderFull() {
        const fullScheduleBody = document.getElementById('fullScheduleBody');
        fullScheduleBody.innerHTML = '';

        try {
            const response = await fetch('data/games.csv');
            const csvText = await response.text();
            const games = this.parseGamesCSV(csvText);
            
            if (games.length === 0) {
                const row = Utils.createElement('tr', '', '<td colspan="6" style="text-align: center; color: #999;">No games scheduled</td>');
                fullScheduleBody.appendChild(row);
                return;
            }

            let weekCounter = 1;
            games.forEach(gameWeek => {
                const row = document.createElement('tr');
                
                // Week number
                row.appendChild(Utils.createElement('td', '', `Week ${gameWeek.week}`));
                
                // Date
                row.appendChild(Utils.createElement('td', '', Utils.formatDate(gameWeek.date)));
                
                if (gameWeek.type === 'H') {
                    // Holiday - No Games
                    const noGamesCell = Utils.createElement('td', '', 'No Games Scheduled');
                    noGamesCell.colSpan = 5; // Update colspan to include scoresheet column
                    noGamesCell.style.textAlign = 'center';
                    noGamesCell.style.color = '#999';
                    row.appendChild(noGamesCell);
                } else {
                    // Regular game slots
                    CONFIG.gameTimeSlots.forEach((timeSlot, index) => {
                        const gameCell = document.createElement('td');
                        const game = gameWeek.games[index];
                        
                        if (game && game.homeTeam && game.awayTeam) {
                            const scorekeepers = game.sk1 && game.sk2 ? 
                                `${game.sk1} & ${game.sk2}` : '--';
                                
                            gameCell.innerHTML = `
                                <div class="game-cell-content">
                                    <div class="game-teams">
                                        <span class="team-name-large">${game.homeTeam}</span>
                                        <span class="vs-text">vs</span>
                                        <span class="team-name-large">${game.awayTeam}</span>
                                    </div>
                                    <div class="scorekeepers">${scorekeepers}</div>
                                </div>
                            `;
                        } else {
                            gameCell.innerHTML = `
                                <div class="game-cell-content">
                                    <div class="game-teams"><em>No game</em></div>
                                    <div class="scorekeepers"><em>--</em></div>
                                </div>
                            `;
                            gameCell.style.color = '#999';
                        }
                        row.appendChild(gameCell);
                    });
                    
                    // Add scoresheet column only for regular games
                    const scoresheetCell = document.createElement('td');
                    scoresheetCell.innerHTML = `<a href="Scoresheets.pdf" target="_blank">
                        <i class="fa-solid fa-download" style="color: #000E54;"></i>
                    </a>`;
                    row.appendChild(scoresheetCell);
                }
                
                fullScheduleBody.appendChild(row);
                weekCounter++;
            });

        } catch (error) {
            console.error('Error loading schedule:', error);
            fullScheduleBody.innerHTML = '<tr><td colspan="6" class="error">Error loading schedule</td></tr>';
        }
    },

    parseGamesCSV(csvText) {
        const lines = csvText.split('\n').slice(1); // Skip header row
        const games = [];
        
        lines.forEach(line => {
            const columns = line.split(',');
            const type = columns[1];
            
            // Only process Regular season (R) and Holiday (H) games
            if (type === 'R' || type === 'H') {
                games.push({
                    week: columns[0],
                    type: type,
                    date: this.formatDateFromCSV(columns[2]),
                    games: type === 'R' ? [
                        {
                            homeTeam: columns[3].trim(),
                            awayTeam: columns[5].trim(),
                            sk1: columns[7].trim(),
                            sk2: columns[8].trim()
                        },
                        {
                            homeTeam: columns[9].trim(),
                            awayTeam: columns[11].trim(),
                            sk1: columns[13].trim(),
                            sk2: columns[14].trim()
                        },
                        {
                            homeTeam: columns[15].trim(),
                            awayTeam: columns[17].trim(),
                            sk1: columns[19].trim(),
                            sk2: columns[20].trim()
                        }
                    ] : []
                });
            }
        });
        
        return games;
    },

    formatDateFromCSV(dateStr) {
        const [month, day, year] = dateStr.split('-');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
};

const StandingsRenderer = {
    render() {
        const standingsBody = document.getElementById('standingsBody');
        standingsBody.innerHTML = '';

        // Calculate team records from games.csv
        const teamStats = this.calculateTeamStats();
        const sortedTeams = this.sortTeams(teamStats);
        const topPoints = sortedTeams[0]?.points || 0;

        sortedTeams.forEach((team, index) => {
            const gb = ((topPoints - team.points) / 2).toFixed(1);
            const homeRecord = `${team.homeWins}-${team.homeLosses}${team.homeTies ? `-${team.homeTies}` : ''}`;
            const awayRecord = `${team.awayWins}-${team.awayLosses}${team.awayTies ? `-${team.awayTies}` : ''}`;
            
            const row = Utils.createElement('tr', '', `
                <td>${index + 1}</td>
                <td>${team.name}</td>
                <td>${team.wins}</td>
                <td>${team.losses}</td>
                <td>${team.ties}</td>
                <td>${team.pf}</td>
                <td>${team.pa}</td>
                <td>${team.points}</td>
                <td>${gb === '0.0' ? '-' : gb}</td>
                <td>${homeRecord}</td>
                <td>${awayRecord}</td>
                <td>${team.streak}</td>
            `);
            standingsBody.appendChild(row);
        });
    },

    calculateTeamStats() {
        const teams = {};
        const csvText = this.loadGamesCSV();
        const lines = csvText.split('\n').slice(1);

        lines.forEach(line => {
            const columns = line.split(',');
            if (columns[1] === 'R') {
                // Process each game slot and track home/away records
                [
                    { home: 3, homeScore: 4, away: 5, awayScore: 6 },
                    { home: 9, homeScore: 10, away: 11, awayScore: 12 },
                    { home: 15, homeScore: 16, away: 17, awayScore: 18 }
                ].forEach(slot => {
                    this.processGameSlot(teams, 
                        columns[slot.home].trim(), 
                        columns[slot.homeScore], 
                        columns[slot.away].trim(), 
                        columns[slot.awayScore],
                        true  // Include home/away tracking
                    );
                });
            }
        });
        return teams;
    },

    processGameSlot(teams, homeTeam, homeScore, awayTeam, awayScore, trackHomeAway = false) {
        if (!homeTeam || !awayTeam) return;

        // Initialize teams if they don't exist
        [homeTeam, awayTeam].forEach(team => {
            if (!teams[team]) {
                teams[team] = {
                    name: team,
                    wins: 0,
                    losses: 0,
                    ties: 0,
                    pf: 0,
                    pa: 0,
                    points: 0,
                    homeWins: 0,
                    homeLosses: 0,
                    homeTies: 0,
                    awayWins: 0,
                    awayLosses: 0,
                    awayTies: 0,
                    lastResults: [],
                    streak: ''
                };
            }
        });

        // Process completed games
        if (homeScore && awayScore) {
            const home = teams[homeTeam];
            const away = teams[awayTeam];
            const homeScoreNum = parseInt(homeScore);
            const awayScoreNum = parseInt(awayScore);

            home.pf += homeScoreNum;
            home.pa += awayScoreNum;
            away.pf += awayScoreNum;
            away.pa += homeScoreNum;

            if (homeScoreNum > awayScoreNum) {
                home.wins++;
                away.losses++;
                if (trackHomeAway) {
                    home.homeWins++;
                    away.awayLosses++;
                }
                home.lastResults.push('W');
                away.lastResults.push('L');
            } else if (awayScoreNum > homeScoreNum) {
                away.wins++;
                home.losses++;
                if (trackHomeAway) {
                    away.awayWins++;
                    home.homeLosses++;
                }
                home.lastResults.push('L');
                away.lastResults.push('W');
            } else {
                home.ties++;
                away.ties++;
                if (trackHomeAway) {
                    home.homeTies++;
                    away.awayTies++;
                }
                home.lastResults.push('T');
                away.lastResults.push('T');
            }

            // Update points and streak
            home.points = (home.wins * 2) + home.ties;
            away.points = (away.wins * 2) + away.ties;

            [home, away].forEach(team => {
                let count = 0;
                const lastResult = team.lastResults[team.lastResults.length - 1];
                for (let i = team.lastResults.length - 1; i >= 0; i--) {
                    if (team.lastResults[i] === lastResult) count++;
                    else break;
                }
                team.streak = `${lastResult}${count}`;
            });
        }
    },

    sortTeams(teams) {
        return Object.values(teams).sort((a, b) => {
            // Sort by points
            if (b.points !== a.points) return b.points - a.points;
            // Then by point differential
            const aDiff = a.pf - a.pa;
            const bDiff = b.pf - b.pa;
            if (bDiff !== aDiff) return bDiff - aDiff;
            // Then by points scored
            return b.pf - a.pf;
        });
    },

    loadGamesCSV() {
        // Synchronously load the CSV file content
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/games.csv', false);  // false makes the request synchronous
        xhr.send();
        return xhr.responseText;
    }
};

const RosterRenderer = {
    async render() {
        const rostersContainer = document.getElementById('rostersContainer');
        if (!rostersContainer) return;
        
        rostersContainer.innerHTML = '<div class="loading">Loading rosters...</div>';

        try {
            const data = await RosterLoader.loadRostersFromCSV();
            if (!data || !data.rosters) {
                rostersContainer.innerHTML = '<div class="error">Error loading rosters</div>';
                return;
            }

            rostersContainer.innerHTML = '';
            Object.entries(data.rosters).forEach(([teamName, teamData]) => {
                const sortedPlayers = teamData.players.sort((a, b) => {
                    if (a.captain !== b.captain) return b.captain - a.captain;
                    return a.name.localeCompare(b.name);
                });

                const teamRoster = Utils.createElement('div', 'team-roster', `
                    <h3>${teamName}</h3>
                    <ul class="player-list">
                        ${sortedPlayers.map(player => {
                            const numberDisplay = player.number ? `#${player.number}` : '';
                            if (player.captain) {
                                return `<li class="captain">
                                    <i class="fas fa-crown"></i> 
                                    ${player.name} ${numberDisplay}
                                    <span class="captain-badge">CAPTAIN</span>
                                </li>`;
                            } else {
                                return `<li>${player.name} ${numberDisplay}</li>`;
                            }
                        }).join('')}
                    </ul>
                `);
                rostersContainer.appendChild(teamRoster);
            });
        } catch (error) {
            console.error('Error in RosterRenderer:', error);
            rostersContainer.innerHTML = '<div class="error">Error displaying rosters</div>';
        }
    }
};

const StatsRenderer = {
    currentSort: 'ppg',

    renderTeamStats() {
        const container = document.getElementById('teamScoringContainer');
        container.innerHTML = '';

        DataStore.teamStats.forEach(team => {
            const teamCard = Utils.createElement('div', 'team-stat-card', `
                <h3>${team.team}</h3>
                <div class="stat-row">
                    <span>Record:</span>
                    <span>${team.wins}-${team.losses}-${team.ties}</span>
                </div>
                <div class="stat-row">
                    <span>Total Points:</span>
                    <span>${team.totalPoints} TP</span>
                </div>
                <div class="stat-row">
                    <span>Games Back:</span>
                    <span>${team.gb}</span>
                </div>
                <div class="stat-row">
                    <span>Current Streak:</span>
                    <span>${team.streak}</span>
                </div>
                <div class="stat-row">
                    <span>Avg Points Scored:</span>
                    <span>${team.avgPts}</span>
                </div>
                <div class="stat-row">
                    <span>Avg Points Allowed:</span>
                    <span>${team.avgAllowed}</span>
                </div>
                <div class="stat-row">
                    <span>Top Scorer:</span>
                    <span>${team.topScorer}</span>
                </div>
            `);
            container.appendChild(teamCard);
        });
    },

    async renderPlayerStats() {
        const container = document.getElementById('individualScoringContainer');
        container.innerHTML = '<div class="loading">Loading player stats...</div>';

        try {
            const data = await RosterLoader.loadRostersFromCSV();
            if (!data || !data.playerStats) {
                container.innerHTML = '<div class="error">Error loading player stats</div>';
                return;
            }

            this.playerStats = data.playerStats;
            
            // Add event listeners to sort buttons
            document.querySelectorAll('.sort-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const sortBy = e.target.dataset.sort;
                    document.querySelectorAll('.sort-btn').forEach(btn => 
                        btn.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentSort = sortBy;
                    this.renderStats();
                });
            });

            this.renderStats();
        } catch (error) {
            console.error('Error rendering player stats:', error);
            container.innerHTML = '<div class="error">Error displaying player stats</div>';
        }
    },

    renderStats() {
        const container = document.getElementById('individualScoringContainer');
        container.innerHTML = '';

        // Create columns with headers
        const topColumn = Utils.createElement('div', 'player-stats-column', `
            <div class="column-header">Top Third</div>
        `);
        const middleColumn = Utils.createElement('div', 'player-stats-column', `
            <div class="column-header">Middle Third</div>
        `);
        const bottomColumn = Utils.createElement('div', 'player-stats-column', `
            <div class="column-header">Bottom Third</div>
        `);

        // Sort players based on current sort criteria
        const sortedPlayers = [...this.playerStats].sort((a, b) => b[this.currentSort] - a[this.currentSort]);
        const total = sortedPlayers.length;
        const oneThird = Math.ceil(total / 3);

        const getRankColor = (idx) => {
            if (idx < oneThird) return '#F76900';
            if (idx < oneThird * 2) return '#000E54';
            return '#8D817B';
        };

        sortedPlayers.forEach((player, idx) => {
            const playerCard = Utils.createElement('div', 'player-stat-card', `
                <div class="player-rank" style="color: ${getRankColor(idx)}">#${idx + 1}</div>
                <div class="player-info">
                    <div class="player-name">
                        <div class="first-name">${player.firstName}</div>
                        <div class="last-name">${player.lastName}</div>
                    </div>
                    <div class="player-team">${player.team}</div>
                </div>
                <div class="player-stats">
                    <div class="stat-item ${this.currentSort === 'ppg' ? 'highlighted' : ''}">
                        <span class="stat-value">${player.ppg}</span>
                        <span class="stat-label">PPG</span>
                    </div>
                    <div class="stat-item ${this.currentSort === 'fpg' ? 'highlighted' : ''}">
                        <span class="stat-value">${player.fpg}</span>
                        <span class="stat-label">FPG</span>
                    </div>
                    <div class="stat-item ${this.currentSort === 'tpg' ? 'highlighted' : ''}">
                        <span class="stat-value">${player.tpg}</span>
                        <span class="stat-label">TPG</span>
                    </div>
                </div>
            `);

            if (idx < oneThird) {
                topColumn.appendChild(playerCard);
            } else if (idx < oneThird * 2) {
                middleColumn.appendChild(playerCard);
            } else {
                bottomColumn.appendChild(playerCard);
            }
        });

        container.appendChild(topColumn);
        container.appendChild(middleColumn);
        container.appendChild(bottomColumn);
    }
};

const ResultsRenderer = {
    async render() {
        const container = document.getElementById('resultsContainer');
        if (!container) return;
        
        container.innerHTML = '<div class="loading">Loading results...</div>';

        try {
            const response = await fetch('data/games.csv');
            const csvText = await response.text();
            const games = this.parseGamesCSV(csvText);
            
            container.innerHTML = '';
            
            // Group games by date
            const gamesByDate = {};
            games.forEach(game => {
                if (!gamesByDate[game.date]) {
                    gamesByDate[game.date] = [];
                }
                gamesByDate[game.date].push(game);
            });
            
            // Sort dates in ascending order (oldest first)
            const sortedDates = Object.keys(gamesByDate).sort();
            
            sortedDates.forEach(date => {
                const games = gamesByDate[date];
                const resultGroup = Utils.createElement('div', 'result-group');
                resultGroup.setAttribute('data-date', date);
                
                // Create date header
                const dateSection = Utils.createElement('div', 'result-date-section');
                const dateHeader = Utils.createElement('div', 'result-date-vertical', Utils.formatDateShort(date));
                dateSection.appendChild(dateHeader);
                
                // Create games row container
                const gamesRow = Utils.createElement('div', 'games-row');
                
                // Add games horizontally
                games.forEach(game => {
                    const gameCard = Utils.createElement('div', 'game-result-card');
                    
                    if (game.homeScore !== null && game.awayScore !== null) {
                        // Game has scores (completed game)
                        const homeWon = parseInt(game.homeScore) > parseInt(game.awayScore);
                        const awayWon = parseInt(game.awayScore) > parseInt(game.homeScore);
                        
                        gameCard.innerHTML = `
                            <div class="game-result-teams">
                                <div class="team-score-line ${homeWon ? 'winner' : ''}">
                                    <span class="team-name">${game.homeTeam}</span>
                                    <span class="team-score ${game.homeScore >= 100 ? 'score-3-digit' : ''}">${game.homeScore}</span>
                                    ${homeWon ? '<div class="winner-indicator">▶</div>' : ''}
                                </div>
                                <div class="team-score-line ${awayWon ? 'winner' : ''}">
                                    <span class="team-name">${game.awayTeam}</span>
                                    <span class="team-score ${game.awayScore >= 100 ? 'score-3-digit' : ''}">${game.awayScore}</span>
                                    ${awayWon ? '<div class="winner-indicator">▶</div>' : ''}
                                </div>
                            </div>
                            <div class="game-result-status final">FINAL</div>
                        `;
                    } else {
                        // Scheduled game
                        gameCard.innerHTML = `
                            <div class="game-result-teams">
                                <div class="team-score-line">
                                    <span class="team-name">${game.homeTeam}</span>
                                    <span class="team-record">(${game.homeRecord.wins}-${game.homeRecord.losses}-${game.homeRecord.ties})</span>
                                </div>
                                <div class="team-score-line">
                                    <span class="team-name">${game.awayTeam}</span>
                                    <span class="team-record">(${game.awayRecord.wins}-${game.awayRecord.losses}-${game.awayRecord.ties})</span>
                                </div>
                            </div>
                            <div class="game-result-status scheduled">${Utils.formatTime(game.time)}</div>
                        `;
                    }
                    
                    gamesRow.appendChild(gameCard);
                });
                
                dateSection.appendChild(gamesRow);
                resultGroup.appendChild(dateSection);
                container.appendChild(resultGroup);
            });
            
        } catch (error) {
            console.error('Error loading games:', error);
            container.innerHTML = '<div class="error">Error loading game results</div>';
        }
        
        // Reset scroll position to show oldest games first
        CONFIG.scrollPosition = 0;
        this.updateScrollPosition();
        // Scroll to most recent final game group
        const resultGroups = document.querySelectorAll('.result-group');
        let mostRecentGroup = null;
        let mostRecentDate = null;

        resultGroups.forEach(group => {
            const finals = group.querySelectorAll('.game-result-status.final');
            if (finals.length > 0) {
                const date = group.getAttribute('data-date');
                if (!mostRecentDate || new Date(date) > new Date(mostRecentDate)) {
                    mostRecentDate = date;
                    mostRecentGroup = group;
                }
            }
        });

        if (mostRecentGroup) {
            const container = document.getElementById('resultsContainer');
            const offset = mostRecentGroup.offsetLeft;
            CONFIG.scrollPosition = offset;
            container.style.transform = `translateX(-${offset}px)`;
        }

    },

    parseGamesCSV(csvText) {
        const lines = csvText.split('\n').slice(1); // Skip header row
        const games = [];
        const teamRecords = {};
        
        // Initialize team records
        const initTeamRecord = () => ({ wins: 0, losses: 0, ties: 0 });
        
        lines.forEach(line => {
            const columns = line.split(',');
            if (columns[1] === 'R') { // Only process regular games
                const gameSlots = [
                    {
                        homeTeam: columns[3],
                        homeScore: columns[4],
                        awayTeam: columns[5],
                        awayScore: columns[6]
                    },
                    {
                        homeTeam: columns[9],
                        homeScore: columns[10],
                        awayTeam: columns[11],
                        awayScore: columns[12]
                    },
                    {
                        homeTeam: columns[15],
                        homeScore: columns[16],
                        awayTeam: columns[17],
                        awayScore: columns[18]
                    }
                ];

                const date = this.formatDateFromCSV(columns[2]);
                
                gameSlots.forEach((slot, index) => {
                    if (slot.homeTeam && slot.awayTeam) {
                        // Initialize team records if not exists
                        if (!teamRecords[slot.homeTeam.trim()]) {
                            teamRecords[slot.homeTeam.trim()] = initTeamRecord();
                        }
                        if (!teamRecords[slot.awayTeam.trim()]) {
                            teamRecords[slot.awayTeam.trim()] = initTeamRecord();
                        }

                        // Calculate records for completed games
                        if (slot.homeScore && slot.awayScore) {
                            const homeScore = parseInt(slot.homeScore);
                            const awayScore = parseInt(slot.awayScore);
                            
                            if (homeScore > awayScore) {
                                teamRecords[slot.homeTeam.trim()].wins++;
                                teamRecords[slot.awayTeam.trim()].losses++;
                            } else if (awayScore > homeScore) {
                                teamRecords[slot.homeTeam.trim()].losses++;
                                teamRecords[slot.awayTeam.trim()].wins++;
                            } else {
                                teamRecords[slot.homeTeam.trim()].ties++;
                                teamRecords[slot.awayTeam.trim()].ties++;
                            }
                        }

                        games.push({
                            date: date,
                            homeTeam: slot.homeTeam.trim(),
                            awayTeam: slot.awayTeam.trim(),
                            homeScore: slot.homeScore ? parseInt(slot.homeScore) : null,
                            awayScore: slot.awayScore ? parseInt(slot.awayScore) : null,
                            time: CONFIG.gameTimeSlots[index],
                            homeRecord: teamRecords[slot.homeTeam.trim()],
                            awayRecord: teamRecords[slot.awayTeam.trim()]
                        });
                    }
                });
            }
        });
        
        return games;
    },

    formatDateFromCSV(dateStr) {
        const [month, day, year] = dateStr.split('-');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    },

    updateScrollPosition() {
        const container = document.getElementById('resultsContainer');
        if (container) {
            container.style.transform = `translateX(-${CONFIG.scrollPosition}px)`;
        }
    }
};

// ===== INITIALIZATION =====
const App = {
    async init() {
        // Render initial content
        ScheduleRenderer.renderFull();
        StandingsRenderer.render();
        await RosterRenderer.render(); // Changed to await
        StatsRenderer.renderTeamStats();
        StatsRenderer.renderPlayerStats();
        ResultsRenderer.render();
        PlayoffsRenderer.render();
        PreSeasonRenderer.render();
    }
};

// ===== GLOBAL FUNCTIONS (for HTML onclick handlers) =====
function showSection(sectionId) {
    Navigation.showSection(sectionId);
}

function showAdminLogin() {
    Auth.showAdminLogin();
}

function closeAdminLogin() {
    Auth.closeAdminLogin();
}

function handleEnterKey(event) {
    Auth.handleEnterKey(event);
}

function checkAdminPassword() {
    Auth.checkAdminPassword();
}

function scrollResults(direction) {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    const maxScroll = Math.max(0, container.scrollWidth - container.parentElement.clientWidth);
    
    if (direction === 'left') {
        CONFIG.scrollPosition = Math.max(0, CONFIG.scrollPosition - CONFIG.scrollStep);
    } else {
        CONFIG.scrollPosition = Math.min(maxScroll, CONFIG.scrollPosition + CONFIG.scrollStep);
    }
    
    ResultsRenderer.updateScrollPosition();
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());

document.addEventListener('DOMContentLoaded', function() {
    // Playoffs toggle logic
    const playoffsToggle = document.getElementById('playoffsToggle');
    const playoffsTab = document.getElementById('playoffsTab');
    const playoffsSection = document.getElementById('playoffs');

    // Initialize toggle state from localStorage
    const playoffsEnabled = localStorage.getItem('playoffsEnabled') === 'true';
    if (playoffsToggle) playoffsToggle.checked = playoffsEnabled;
    if (playoffsTab) playoffsTab.style.display = playoffsEnabled ? '' : 'none';
    if (playoffsSection) playoffsSection.style.display = playoffsEnabled ? '' : 'none';

    if (playoffsToggle) {
        playoffsToggle.addEventListener('change', function() {
            const enabled = playoffsToggle.checked;
            localStorage.setItem('playoffsEnabled', enabled);
            if (playoffsTab) playoffsTab.style.display = enabled ? '' : 'none';
            if (playoffsSection) playoffsSection.style.display = enabled ? '' : 'none';
            // If hiding while on playoffs page, switch to main
            if (!enabled && document.querySelector('.content-section.active')?.id === 'playoffs') {
                showSection('main');
            }
        });
    }

    // Pre-Season toggle initialization and handling
    const preSeasonToggle = document.getElementById('preSeasonToggle');
    const preSeasonTab = document.getElementById('preSeasonTab');
    
    // Initialize toggle state from localStorage
    const preSeasonEnabled = localStorage.getItem('preSeasonEnabled') === 'true';
    preSeasonToggle.checked = preSeasonEnabled;
    preSeasonTab.style.display = preSeasonEnabled ? '' : 'none';

    // Add event listener for pre-season toggle
    preSeasonToggle.addEventListener('change', function() {
        const isEnabled = preSeasonToggle.checked;
        preSeasonTab.style.display = isEnabled ? '' : 'none';
        localStorage.setItem('preSeasonEnabled', isEnabled);
        
        // If pre-season section is currently visible and being disabled, switch to main
        if (!isEnabled && document.querySelector('#preSeason.active')) {
            showSection('main');
        }
    });
});

const PlayoffsRenderer = {
    render() {
        const playoffsBody = document.querySelector('#playoffs .schedule-grid');
        if (!playoffsBody) return;

        playoffsBody.innerHTML = '';

        const gamesByDate = {};
        DataStore.playoffs.forEach(game => {
            if (!gamesByDate[game.date]) {
                gamesByDate[game.date] = [];
            }
            gamesByDate[game.date].push(game);
        });

        const sortedDates = Object.keys(gamesByDate).sort();
        
        if (sortedDates.length === 0) {
            playoffsBody.innerHTML = '<div class="no-games">No playoff games scheduled</div>';
            return;
        }

        let roundCounter = 1;
        sortedDates.forEach(date => {
            const gamesOnDate = gamesByDate[date].sort((a, b) => a.time.localeCompare(b.time));
            
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            
            const content = `
                <div class="game-header">
                    <div class="round-label">Round ${roundCounter}</div>
                    <div class="game-date">${Utils.formatDate(date)}</div>
                </div>
                ${gamesOnDate.map(game => `
                    <div class="playoff-matchup">
                        <div class="game-time">${Utils.formatTime(game.time)}</div>
                        <div class="game-teams">
                            <div class="team-name-large">${game.homeTeam}</div>
                            <div class="vs-text">vs</div>
                            <div class="team-name-large">${game.awayTeam}</div>
                        </div>
                        <div class="scorekeepers">Scorekeepers: ${game.sk1} & ${game.sk2}</div>
                    </div>
                `).join('')}
            `;
            
            gameCard.innerHTML = content;
            playoffsBody.appendChild(gameCard);
            roundCounter++;
        });
    }
};

const PreSeasonRenderer = {
    render() {
        const preSeasonBody = document.querySelector('#preSeason .preseason-grid');
        if (!preSeasonBody) return;

        // Clear existing content
        preSeasonBody.innerHTML = '';

        // Create columns for each game time
        const gameSlots = [
            { time: '6:30 PM', players: DataStore.preSeasonPlayers.game1 },
            { time: '7:30 PM', players: DataStore.preSeasonPlayers.game2 },
            { time: '8:30 PM', players: DataStore.preSeasonPlayers.game3 }
        ];

        gameSlots.forEach(slot => {
            const column = document.createElement('div');
            column.className = 'preseason-column';
            
            column.innerHTML = `
                <h3 class="game-time-header">${slot.time}</h3>
                <div class="player-list">
                    ${slot.players.map(player => `
                        <div class="player-item">${player}</div>
                    `).join('')}
                </div>
            `;
            
            preSeasonBody.appendChild(column);
        });
    }
};