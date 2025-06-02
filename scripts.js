        // Admin authentication
        let isAdminLoggedIn = false;
        const adminPassword = "nbc2025"; // Change this to your desired password

        function showAdminLogin() {
            document.getElementById('adminLogin').classList.add('show');
        }

        function closeAdminLogin() {
            document.getElementById('adminLogin').classList.remove('show');
            document.getElementById('adminPassword').value = '';
        }

        function handleEnterKey(event) {
            if (event.key === 'Enter') {
                checkAdminPassword();
            }
        }

        function checkAdminPassword() {
            const enteredPassword = document.getElementById('adminPassword').value;
            
            if (enteredPassword === adminPassword) {
                isAdminLoggedIn = true;
                document.getElementById('adminTab').style.display = 'block';
                closeAdminLogin();
                showSection('admin');
                // Update active tab
                const tabs = document.querySelectorAll('.nav-tab');
                tabs.forEach(tab => tab.classList.remove('active'));
                document.getElementById('adminTab').classList.add('active');
                alert('Welcome, Administrator!');
            } else {
                alert('Incorrect password. Access denied.');
                document.getElementById('adminPassword').value = '';
            }
        }

        // Sample data storage (in a real implementation, this would connect to a database)
        let games = [
            {
                id: 1,
                date: '2025-10-07',
                time: '18:30',
                homeTeam: 'Team 1',
                awayTeam: 'Team 2',
                status: 'scheduled'
            },
            {
                id: 2,
                date: '2025-10-07',
                time: '19:40',
                homeTeam: 'Team 3',
                awayTeam: 'Team 4',
                status: 'scheduled'
            },
            {
                id: 3,
                date: '2025-10-07',
                time: '20:50',
                homeTeam: 'Team 5',
                awayTeam: 'Team 6',
                status: 'scheduled'
            }
        ];

        let teams = [
				{ name: 'Team 1', wins: 8, losses: 2, ties: 0, pf: 852, pa: 728, streak: 'W4' },
				{ name: 'Team 2', wins: 7, losses: 3, ties: 0, pf: 821, pa: 753, streak: 'L1' },
				{ name: 'Team 3', wins: 6, losses: 4, ties: 0, pf: 789, pa: 762, streak: 'W2' },
				{ name: 'Team 4', wins: 5, losses: 5, ties: 0, pf: 764, pa: 781, streak: 'L2' },
				{ name: 'Team 5', wins: 3, losses: 7, ties: 0, pf: 712, pa: 834, streak: 'L3' },
				{ name: 'Team 6', wins: 1, losses: 9, ties: 0, pf: 688, pa: 879, streak: 'L5' }
			];

        // Navigation functionality
        function showSection(sectionId) {
            // Check if trying to access admin without being logged in
            if (sectionId === 'admin' && !isAdminLoggedIn) {
                showAdminLogin();
                return;
            }

            // Hide all sections
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Show selected section
            document.getElementById(sectionId).classList.add('active');
            
            // Update active tab
            const tabs = document.querySelectorAll('.nav-tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
        }

        // Format date for display
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }

        // Format time for display
        function formatTime(timeString) {
            const [hours, minutes] = timeString.split(':');
            const date = new Date();
            date.setHours(hours, minutes);
            return date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        }

        // Render schedule
        function renderSchedule() {
            const scheduleGrid = document.getElementById('scheduleGrid');
            scheduleGrid.innerHTML = '';

            games.forEach(game => {
                const gameCard = document.createElement('div');
                gameCard.className = 'game-card';
                gameCard.innerHTML = `
                    <div class="game-header">
                        <div class="game-time">${formatTime(game.time)}</div>
                        <div class="game-date">${formatDate(game.date)}</div>
                    </div>
                    <div class="game-matchup">
                        <div class="team">
                            <div class="team-name">${game.homeTeam}</div>
                        </div>
                        <div class="vs">VS</div>
                        <div class="team">
                            <div class="team-name">${game.awayTeam}</div>
                        </div>
                    </div>
                `;
                scheduleGrid.appendChild(gameCard);
            });
        }
		
		function renderFullSchedule() {
			const fullScheduleBody = document.getElementById('fullScheduleBody');
			fullScheduleBody.innerHTML = '';

			// Group games by date
			const groupedByDate = games.reduce((acc, game) => {
				if (!acc[game.date]) acc[game.date] = [];
				acc[game.date].push(game);
				return acc;
			}, {});

			const sortedDates = Object.keys(groupedByDate).sort();

			sortedDates.forEach((date, index) => {
				const week = index + 1;
				const [early, middle, late] = groupedByDate[date];

				const row = document.createElement('tr');
				row.innerHTML = `
					<td>${week}</td>
					<td>${formatDate(date)}</td>
					<td>${early ? `${early.homeTeam} vs ${early.awayTeam}` : '-'}</td>
					<td>${middle ? `${middle.homeTeam} vs ${middle.awayTeam}` : '-'}</td>
					<td>${late ? `${late.homeTeam} vs ${late.awayTeam}` : '-'}</td>
				`;
				fullScheduleBody.appendChild(row);
			});
		}

        // Render standings
		function renderStandings() {
			const standingsBody = document.getElementById('standingsBody');
			standingsBody.innerHTML = '';

			// Sort teams by total points: 2 points per win, 1 per tie
			const sortedTeams = [...teams].sort((a, b) => {
				const aPts = (a.wins * 2) + a.ties;
				const bPts = (b.wins * 2) + b.ties;
				return bPts - aPts;
			});

			const topPoints = (sortedTeams[0].wins * 2) + sortedTeams[0].ties;

			sortedTeams.forEach((team, index) => {
				const totalGames = team.wins + team.losses + team.ties;
				const winPct = (team.wins / totalGames).toFixed(3);
				const points = (team.wins * 2) + team.ties;
				const gb = ((topPoints - points) / 2).toFixed(1);

				const row = document.createElement('tr');
				row.innerHTML = `
					<td>${index + 1}</td>
					<td>${team.name}</td>
					<td>${team.wins}</td>
					<td>${team.losses}</td>
					<td>${team.ties}</td>
					<td>${team.pf}</td>
					<td>${team.pa}</td>
					<td>${points}</td>
					<td>${gb === '0.0' ? '-' : gb}</td>
					<td>${team.streak}</td>
				`;
				standingsBody.appendChild(row);
			});
		}

        // Admin functions
        function addGame() {
            const date = document.getElementById('gameDate').value;
            const time = document.getElementById('gameTime').value;
            const homeTeam = document.getElementById('homeTeam').value;
            const awayTeam = document.getElementById('awayTeam').value;

            if (date && time && homeTeam && awayTeam) {
                const newGame = {
                    id: games.length + 1,
                    date: date,
                    time: time,
                    homeTeam: homeTeam,
                    awayTeam: awayTeam,
                    status: 'scheduled'
                };

                games.push(newGame);
                renderSchedule();

                // Clear form
                document.getElementById('gameDate').value = '';
                document.getElementById('gameTime').value = '';
                document.getElementById('homeTeam').value = '';
                document.getElementById('awayTeam').value = '';

                alert('Game added successfully!');
            } else {
                alert('Please fill in all fields');
            }
        }

				// Rules data
				let rules = [
					{
						title: "Game Duration",
						content: "4 quarters of 10 minutes each with a 15-minute halftime break."
					},
					{
						title: "Shot Clock",
						content: "24-second shot clock reset to 14 seconds on offensive rebounds."
					},
					{
						title: "Fouls",
						content: "Players foul out after 5 personal fouls. Team fouls reset each quarter."
					},
					{
						title: "Three-Point Line",
						content: "FIBA three-point line distance (6.75m from basket center)."
					}
				];

				// Roster data
				let rosters = {
					'Team 1': ['*C* Mike Johnson', 'Chris Williams', 'David Brown', 'Alex Davis', 'Ryan Miller', 'Murphy Banks', 'Stefan White', 'Desmond Martin'],
					'Team 2': ['*C* Kevin Wilson', 'Mark Garcia', 'Tom Rodriguez', 'Sean Martinez', 'Jake Anderson', 'Dennis Bean'],
					'Team 3': ['*C* Paul Taylor', 'Matt Thomas', 'Josh Jackson', 'Nick White', 'Eric Harris'],
					'Team 4': ['*C* Dan Martin', 'Luke Thompson', 'Sam Garcia', 'Tyler Lee', 'Ben Walker'],
					'Team 5': ['*C* Adam Hall', 'Connor Allen', 'Noah Young', 'Logan King', 'Mason Wright'],
					'Team 6': ['*C* Owen Lopez', 'Ethan Hill', 'Lucas Scott', 'Carter Green', 'Hunter Adams']
				};

				// Team scoring data
				let teamStats = [
					{ team: 'Team 1', avgPts: 85.2, avgAllowed: 72.8, topScorer: 'Mike Johnson' },
					{ team: 'Team 2', avgPts: 82.1, avgAllowed: 75.3, topScorer: 'Kevin Wilson' },
					{ team: 'Team 3', avgPts: 78.9, avgAllowed: 76.2, topScorer: 'Paul Taylor' },
					{ team: 'Team 4', avgPts: 76.4, avgAllowed: 78.1, topScorer: 'Dan Martin' },
					{ team: 'Team 5', avgPts: 71.2, avgAllowed: 83.4, topScorer: 'Adam Hall' },
					{ team: 'Team 6', avgPts: 68.8, avgAllowed: 87.9, topScorer: 'Owen Lopez' }
				];

				// Individual scoring data
				let playerStats = [
					{ name: 'Mike Johnson', team: 'Team 1', ppg: 22.4, rpg: 8.2, apg: 5.1 },
					{ name: 'Kevin Wilson', team: 'Team 2', ppg: 20.8, rpg: 6.9, apg: 7.3 },
					{ name: 'Paul Taylor', team: 'Team 3', ppg: 19.6, rpg: 9.1, apg: 4.2 },
					{ name: 'Dan Martin', team: 'Team 4', ppg: 18.9, rpg: 5.8, apg: 6.7 },
					{ name: 'Adam Hall', team: 'Team 5', ppg: 17.2, rpg: 7.4, apg: 3.9 },
					{ name: 'Owen Lopez', team: 'Team 6', ppg: 16.8, rpg: 6.1, apg: 4.8 }
				];

				// Render functions
				function renderRules() {
					const rulesContainer = document.getElementById('rulesContainer');
					rulesContainer.innerHTML = '';

					rules.forEach(rule => {
						const ruleItem = document.createElement('div');
						ruleItem.className = 'rule-item';
						ruleItem.innerHTML = `
							<div class="rule-title">${rule.title}</div>
							<div class="rule-content">${rule.content}</div>
						`;
						rulesContainer.appendChild(ruleItem);
					});
				}

				function renderRosters() {
					const rostersContainer = document.getElementById('rostersContainer');
					rostersContainer.innerHTML = '';

					Object.keys(rosters).forEach(teamName => {
						const teamRoster = document.createElement('div');
						teamRoster.className = 'team-roster';
						teamRoster.innerHTML = `
							<h3>${teamName}</h3>
							<ul class="player-list">
								${rosters[teamName].map(player => {
									if (player.startsWith('*C*')) {
										const captainName = player.replace('*C* ', '');
										return `<li class="captain"><i class="fas fa-crown"></i> ${captainName} <span class="captain-badge">CAPTAIN</span></li>`;
									} else {
										return `<li>${player}</li>`;
									}
								}).join('')}
							</ul>
						`;
						rostersContainer.appendChild(teamRoster);
					});
				}

				function renderTeamScoring() {
					const container = document.getElementById('teamScoringContainer');
					container.innerHTML = '';

					teamStats.forEach(team => {
						const teamCard = document.createElement('div');
						teamCard.className = 'team-stat-card';
						teamCard.innerHTML = `
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
						`;
						container.appendChild(teamCard);
					});
				}

				function renderIndividualScoring() {
					const container = document.getElementById('individualScoringContainer');
					container.innerHTML = '';

					// Sort players by points per game
					const sortedPlayers = [...playerStats].sort((a, b) => b.ppg - a.ppg);

					sortedPlayers.forEach((player, index) => {
						const playerCard = document.createElement('div');
						playerCard.className = 'player-stat-card';
						playerCard.innerHTML = `
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
						`;
						container.appendChild(playerCard);
					});
				}

					// Initialize the page
					document.addEventListener('DOMContentLoaded', function() {
						renderSchedule();
						renderFullSchedule();
						renderStandings();
						renderNews();
						renderRosters();
						renderTeamScoring();
						renderIndividualScoring();
					});