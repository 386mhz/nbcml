// ===== CONFIGURATION & STATE =====
const CONFIG = {
    adminPassword: "nbc2025",
    venue: "Magna Centre Gym",
    gameTimeSlots: ['18:30', '19:40', '20:50'],
    gameLabels: ['Early Game - 6:30', 'Middle Game - 7:40', 'Late Game - 8:50']
};

// Application State
const AppState = {
    isAdminLoggedIn: false,
    currentSection: 'main'
};

// Data Models
class Game {
    constructor(id, date, time, homeTeam, awayTeam, location = CONFIG.venue, status = 'scheduled') {
        this.id = id;
        this.date = date;
        this.time = time;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.location = location;
        this.status = status;
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
        new Game(1, '2025-10-07', '18:30', 'Team 1', 'Team 2'),
        new Game(2, '2025-10-07', '19:40', 'Team 3', 'Team 4'),
        new Game(3, '2025-10-07', '20:50', 'Team 5', 'Team 6')
    ],

    teams: [
        new Team('Team 1', 8, 2, 0, 852, 728, 'W4'),
        new Team('Team 2', 7, 3, 0, 821, 753, 'L1'),
        new Team('Team 3', 6, 4, 0, 789, 762, 'W2'),
        new Team('Team 4', 5, 5, 0, 764, 781, 'L2'),
        new Team('Team 5', 3, 7, 0, 712, 834, 'L3'),
        new Team('Team 6', 1, 9, 0, 688, 879, 'L5')
    ],

    rosters: {
        'Team 1': ['*C* Mike Johnson', 'Chris Williams', 'David Brown', 'Alex Davis', 'Ryan Miller', 'Murphy Banks', 'Stefan White', 'Desmond Martin'],
        'Team 2': ['*C* Kevin Wilson', 'Mark Garcia', 'Tom Rodriguez', 'Sean Martinez', 'Jake Anderson', 'Dennis Bean'],
        'Team 3': ['*C* Paul Taylor', 'Matt Thomas', 'Josh Jackson', 'Nick White', 'Eric Harris'],
        'Team 4': ['*C* Dan Martin', 'Luke Thompson', 'Sam Garcia', 'Tyler Lee', 'Ben Walker'],
        'Team 5': ['*C* Adam Hall', 'Connor Allen', 'Noah Young', 'Logan King', 'Mason Wright'],
        'Team 6': ['*C* Owen Lopez', 'Ethan Hill', 'Lucas Scott', 'Carter Green', 'Hunter Adams']
    },

    teamStats: [
        { team: 'Team 1', avgPts: 85.2, avgAllowed: 72.8, topScorer: 'Mike Johnson' },
        { team: 'Team 2', avgPts: 82.1, avgAllowed: 75.3, topScorer: 'Kevin Wilson' },
        { team: 'Team 3', avgPts: 78.9, avgAllowed: 76.2, topScorer: 'Paul Taylor' },
        { team: 'Team 4', avgPts: 76.4, avgAllowed: 78.1, topScorer: 'Dan Martin' },
        { team: 'Team 5', avgPts: 71.2, avgAllowed: 83.4, topScorer: 'Adam Hall' },
        { team: 'Team 6', avgPts: 68.8, avgAllowed: 87.9, topScorer: 'Owen Lopez' }
    ],

    playerStats: [
        { name: 'Mike Johnson', team: 'Team 1', ppg: 22.4, rpg: 8.2, apg: 5.1 },
        { name: 'Kevin Wilson', team: 'Team 2', ppg: 20.8, rpg: 6.9, apg: 7.3 },
        { name: 'Paul Taylor', team: 'Team 3', ppg: 19.6, rpg: 9.1, apg: 4.2 },
        { name: 'Dan Martin', team: 'Team 4', ppg: 18.9, rpg: 5.8, apg: 6.7 },
        { name: 'Adam Hall', team: 'Team 5', ppg: 17.2, rpg: 7.4, apg: 3.9 },
        { name: 'Owen Lopez', team: 'Team 6', ppg: 16.8, rpg: 6.1, apg: 4.8 }
    ]
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
                    gameCell.innerHTML = `${gameAtTime.homeTeam} vs ${gameAtTime.awayTeam}`;
                } else {
                    gameCell.innerHTML = '<em>No game</em>';
                    gameCell.style.color = '#999';
                }
                
                row.appendChild(gameCell);
            });
            
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
    render() {
        const rostersContainer = document.getElementById('rostersContainer');
        rostersContainer.innerHTML = '';

        Object.entries(DataStore.rosters).forEach(([teamName, players]) => {
            const teamRoster = Utils.createElement('div', 'team-roster', `
                <h3>${teamName}</h3>
                <ul class="player-list">
                    ${players.map(player => {
                        if (player.startsWith('*C*')) {
                            const captainName = player.replace('*C* ', '');
                            return `<li class="captain"><i class="fas fa-crown"></i> ${captainName} <span class="captain-badge">CAPTAIN</span></li>`;
                        } else {
                            return `<li>${player}</li>`;
                        }
                    }).join('')}
                </ul>
            `);
            rostersContainer.appendChild(teamRoster);
        });
    }
};

const StatsRenderer = {
    renderTeamStats() {
        const container = document.getElementById('teamScoringContainer');
        container.innerHTML = '';

        DataStore.teamStats.forEach(team => {
            const teamCard = Utils.createElement('div', 'team-stat-card', `
                <h3>${team.team}</h3>
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

    renderPlayerStats() {
        const container = document.getElementById('individualScoringContainer');
        container.innerHTML = '';

        const sortedPlayers = [...DataStore.playerStats].sort((a, b) => b.ppg - a.ppg);

        sortedPlayers.forEach((player, index) => {
            const playerCard = Utils.createElement('div', 'player-stat-card', `
                <div class="player-rank">#${index + 1}</div>
                <div class="player-info">
                    <div class="player-name">${player.name}</div>
                    <div class="player-team">${player.team}</div>
                </div>
                <div class="player-stats">
                    <div class="stat-item">
                        <span class="stat-value">${player.ppg}</span>
                        <span class="stat-label">PPG</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${player.rpg}</span>
                        <span class="stat-label">RPG</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${player.apg}</span>
                        <span class="stat-label">APG</span>
                    </div>
                </div>
            `);
            container.appendChild(playerCard);
        });
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
                    { homeIndex: 2, awayIndex: 3, time: '18:30' },
                    { homeIndex: 4, awayIndex: 5, time: '19:40' },
                    { homeIndex: 6, awayIndex: 7, time: '20:50' }
                ];
                
                gameSlots.forEach(slot => {
                    if (parts[slot.homeIndex] && parts[slot.awayIndex]) {
                        newGames.push(new Game(
                            gameId++,
                            formattedDate,
                            slot.time,
                            parts[slot.homeIndex],
                            parts[slot.awayIndex]
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
    init() {
        // Render initial content
        ScheduleRenderer.renderUpcoming();
        ScheduleRenderer.renderFull();
        StandingsRenderer.render();
        RosterRenderer.render();
        StatsRenderer.renderTeamStats();
        StatsRenderer.renderPlayerStats();
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

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);