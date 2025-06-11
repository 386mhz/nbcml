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

    teams: [
        new Team('Team 1', 8, 2, 0, 852, 728, 'W4'),
        new Team('Team 2', 7, 3, 0, 821, 753, 'L1'),
        new Team('Team 3', 6, 4, 0, 789, 762, 'W2'),
        new Team('Team 4', 5, 5, 0, 764, 781, 'L2'),
        new Team('Team 5', 3, 7, 0, 712, 834, 'L3'),
        new Team('Team 6', 1, 9, 0, 688, 879, 'L5')
    ],

    teamStats: [
        { team: 'Team 1', avgPts: 85.2, avgAllowed: 72.8, topScorer: 'Mike Johnson', wins: 8, losses: 2, ties: 0, totalPoints: 16, gb: '-', streak: 'W4' },
        { team: 'Team 2', avgPts: 82.1, avgAllowed: 75.3, topScorer: 'Kevin Wilson', wins: 7, losses: 3, ties: 0, totalPoints: 14, gb: '1.0', streak: 'L1' },
        { team: 'Team 3', avgPts: 78.9, avgAllowed: 76.2, topScorer: 'Paul Taylor', wins: 6, losses: 4, ties: 0, totalPoints: 12, gb: '2.0', streak: 'W2' },
        { team: 'Team 4', avgPts: 76.4, avgAllowed: 78.1, topScorer: 'Dan Martin', wins: 5, losses: 5, ties: 0, totalPoints: 10, gb: '3.0', streak: 'L2' },
        { team: 'Team 5', avgPts: 71.2, avgAllowed: 83.4, topScorer: 'Adam Hall', wins: 3, losses: 7, ties: 0, totalPoints: 6, gb: '5.0', streak: 'L3' },
        { team: 'Team 6', avgPts: 68.8, avgAllowed: 87.9, topScorer: 'Owen Lopez', wins: 1, losses: 9, ties: 0, totalPoints: 2, gb: '7.0', streak: 'L5' }
    ],

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

    renderFull() {
        const fullScheduleBody = document.getElementById('fullScheduleBody');
        fullScheduleBody.innerHTML = '';

        const gamesByDate = Utils.groupGamesByDate();
        const sortedDates = Object.keys(gamesByDate).sort();
        
        if (sortedDates.length === 0) {
            const row = Utils.createElement('tr', '', '<td colspan="5" style="text-align: center; color: #999;">No games scheduled</td>');
            fullScheduleBody.appendChild(row);
            return;
        }

        let weekCounter = 1;
        sortedDates.forEach(date => {
            const gamesOnDate = gamesByDate[date].sort((a, b) => a.time.localeCompare(b.time));
            
            const row = document.createElement('tr');
            
            // Week column
            row.appendChild(Utils.createElement('td', '', `Week ${weekCounter}`));
            
            // Date column
            row.appendChild(Utils.createElement('td', '', Utils.formatDate(date)));
            
            // Game time slots
            CONFIG.gameTimeSlots.forEach(timeSlot => {
                const gameCell = document.createElement('td');
                const gameAtTime = gamesOnDate.find(game => game.time === timeSlot);
                
                if (gameAtTime) {
                    const scorekeepers = gameAtTime.sk1 && gameAtTime.sk2 ? 
                        `${gameAtTime.sk1} & ${gameAtTime.sk2}` : '--';
                        
                    gameCell.innerHTML = `
                        <div class="game-cell-content">
                            <div class="game-teams">
                                <span class="team-name-large">${gameAtTime.homeTeam}</span>
                                <span class="vs-text">vs</span>
                                <span class="team-name-large">${gameAtTime.awayTeam}</span>
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
            
            // Add scoresheet column
            const scoresheetCell = document.createElement('td');
            scoresheetCell.innerHTML = `<a href="Scoresheets.pdf" target="_blank">
                <i class="fa-solid fa-download" style="color: #000E54;"></i>
            </a>`;
            row.appendChild(scoresheetCell);
            
            fullScheduleBody.appendChild(row);
            weekCounter++;
        });
    }
};

const StandingsRenderer = {
    render() {
        const standingsBody = document.getElementById('standingsBody');
        standingsBody.innerHTML = '';

        const sortedTeams = [...DataStore.teams].sort((a, b) => b.totalPoints - a.totalPoints);
        const topPoints = sortedTeams[0]?.totalPoints || 0;

        sortedTeams.forEach((team, index) => {
            const gb = ((topPoints - team.totalPoints) / 2).toFixed(1);
            
            const row = Utils.createElement('tr', '', `
                <td>${index + 1}</td>
                <td>${team.name}</td>
                <td>${team.wins}</td>
                <td>${team.losses}</td>
                <td>${team.ties}</td>
                <td>${team.pf}</td>
                <td>${team.pa}</td>
                <td>${team.totalPoints}</td>
                <td>${gb === '0.0' ? '-' : gb}</td>
                <td>${team.streak}</td>
            `);
            standingsBody.appendChild(row);
        });
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
    render() {
        const container = document.getElementById('resultsContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Group games by date
        const gamesByDate = {};
        DataStore.gameResults.forEach(game => {
            if (!gamesByDate[game.date]) {
                gamesByDate[game.date] = [];
            }
            gamesByDate[game.date].push(game);
        });
        
        // Sort dates in descending order (most recent first)
        const sortedDates = Object.keys(gamesByDate).sort().reverse();
        
        sortedDates.forEach(date => {
            const games = gamesByDate[date];
            const resultGroup = Utils.createElement('div', 'result-group');
            
            // Create date header with vertical layout
            const dateSection = Utils.createElement('div', 'result-date-section');
            const dateHeader = Utils.createElement('div', 'result-date-vertical', Utils.formatDateShort(date));
            dateSection.appendChild(dateHeader);
            
            // Create games row container
            const gamesRow = Utils.createElement('div', 'games-row');
            
            // Add games horizontally
            games.forEach(game => {
                const gameCard = Utils.createElement('div', 'game-result-card');
                
                if (game.status === 'final') {
                    // Determine winner for highlighting
                    const homeWon = game.homeScore > game.awayScore;
                    const awayWon = game.awayScore > game.homeScore;
                    
                    gameCard.innerHTML = `
                        <div class="game-result-teams">
                            <div class="team-score-line ${homeWon ? 'winner' : ''}">
                                <span class="team-name">${game.homeTeam}</span>
                                <span class="team-score">${game.homeScore}</span>
                                ${homeWon ? '<div class="winner-indicator">▶</div>' : ''}
                            </div>
                            <div class="team-score-line ${awayWon ? 'winner' : ''}">
                                <span class="team-name">${game.awayTeam}</span>
                                <span class="team-score">${game.awayScore}</span>
                                ${awayWon ? '<div class="winner-indicator">▶</div>' : ''}
                            </div>
                        </div>
                        <div class="game-result-status final">FINAL</div>
                    `;
                } else {
                    // Get team records
                    const homeTeamData = DataStore.teams.find(t => t.name === game.homeTeam);
                    const awayTeamData = DataStore.teams.find(t => t.name === game.awayTeam);
                    
                    gameCard.innerHTML = `
                        <div class="game-result-teams">
                            <div class="team-score-line">
                                <span class="team-name">${game.homeTeam}</span>
                                <span class="team-record">(${homeTeamData?.wins || 0}-${homeTeamData?.losses || 0})</span>
                            </div>
                            <div class="team-score-line">
                                <span class="team-name">${game.awayTeam}</span>
                                <span class="team-record">(${awayTeamData?.wins || 0}-${awayTeamData?.losses || 0})</span>
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
        
        // Reset scroll position
        CONFIG.scrollPosition = 0;
        this.updateScrollPosition();
    },

    // ADD THIS MISSING METHOD:
    updateScrollPosition() {
        const container = document.getElementById('resultsContainer');
        if (container) {
            container.style.transform = `translateX(-${CONFIG.scrollPosition}px)`;
        }
    }
};

// ===== ADMIN MODULE =====
const Admin = {
    addGame() {
        const date = document.getElementById('gameDate').value;
        const time = document.getElementById('gameTime').value;
        const homeTeam = document.getElementById('homeTeam').value;
        const awayTeam = document.getElementById('awayTeam').value;

        if (!date || !time || !homeTeam || !awayTeam) {
            alert('Please fill in all fields');
            return;
        }

        const newGame = new Game(
            DataStore.games.length + 1,
            date,
            time,
            homeTeam,
            awayTeam
        );

        DataStore.games.push(newGame);
        
        // Re-render schedules
        ScheduleRenderer.renderUpcoming();
        ScheduleRenderer.renderFull();

        // Clear form
        ['gameDate', 'gameTime', 'homeTeam', 'awayTeam'].forEach(id => {
            document.getElementById(id).value = '';
        });

        alert('Game added successfully!');
    },

    updateScheduleFromCSV() {
        const csvData = document.getElementById('scheduleCSV').value.trim();
        if (!csvData) {
            alert('Please paste CSV data first');
            return;
        }

        const currentGameCount = DataStore.games.length;
        if (!confirm(`This will replace all ${currentGameCount} existing games with new data from CSV. Are you sure you want to continue?`)) {
            return;
        }

        const lines = csvData.split('\n').filter(line => line.trim());
        const newGames = [];
        let gameId = 1;
        let processedLines = 0;
        let validLines = 0;
        
        lines.forEach(line => {
            processedLines++;
            const parts = line.split(',').map(part => part.trim());
            
            if (parts.length >= 4) {
                validLines++;
                const formattedDate = Utils.parseCSVDate(parts[1]);
                
                // Process games for each time slot
                const gameSlots = [
                    { homeIndex: 2, awayIndex: 3, sk1Index: 4, sk2Index: 5, time: '18:30' },
                    { homeIndex: 6, awayIndex: 7, sk1Index: 8, sk2Index: 9, time: '19:40' },
                    { homeIndex: 10, awayIndex: 11, sk1Index: 12, sk2Index: 13, time: '20:50' }
                ];
                
                gameSlots.forEach(slot => {
                    if (parts[slot.homeIndex] && parts[slot.awayIndex]) {
                        newGames.push(new Game(
                            gameId++,
                            formattedDate,
                            slot.time,
                            parts[slot.homeIndex],
                            parts[slot.awayIndex],  // Fixed: was parts[slot.awayTeam]
                            CONFIG.venue,
                            'scheduled',
                            parts[slot.sk1Index],
                            parts[slot.sk2Index]
                        ));
                    }
                });
            }
        });
        
        if (newGames.length > 0) {
            DataStore.games = newGames;
            ScheduleRenderer.renderUpcoming();
            ScheduleRenderer.renderFull();
            document.getElementById('scheduleCSV').value = '';
            
            alert(`Schedule Update Complete!\n\n` +
                  `📊 CSV Processing Summary:\n` +
                  `• Lines processed: ${processedLines}\n` +
                  `• Valid schedule lines: ${validLines}\n` +
                  `• Previous games: ${currentGameCount}\n` +
                  `• New games created: ${newGames.length}\n\n` +
                  `✅ The schedule has been successfully updated!`);
        } else {
            alert(`❌ CSV Processing Failed!\n\n` +
                  `No valid games found in the CSV data.\n\n` +
                  `Please check your CSV format:\n` +
                  `Week,Date,Early Home,Early Away,Middle Home,Middle Away,Late Home,Late Away`);
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

function addGame() {
    Admin.addGame();
}

function updateScheduleFromCSV() {
    Admin.updateScheduleFromCSV();
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