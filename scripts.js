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
				location: 'Magna Centre Gym',
                status: 'scheduled'
            },
            {
                id: 2,
                date: '2025-10-07',
                time: '19:40',
                homeTeam: 'Team 3',
                awayTeam: 'Team 4',
				location: 'Magna Centre Gym',
                status: 'scheduled'
            },
            {
                id: 3,
                date: '2025-10-07',
                time: '20:50',
                homeTeam: 'Team 5',
                awayTeam: 'Team 6',
				location: 'Magna Centre Gym',
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
			const [year, month, day] = dateString.split('-');
			const date = new Date(Number(year), Number(month) - 1, Number(day));
			date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
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

			// Get current date
			const today = new Date();
			today.setHours(0, 0, 0, 0); // Reset time to midnight for date comparison

			// Filter games that are today or in the future
			const upcomingGames = games.filter(game => {
				const gameDate = new Date(game.date);
				gameDate.setHours(0, 0, 0, 0);
				return gameDate >= today;
			}).sort((a, b) => {
				// Sort by date first, then by time
				if (a.date === b.date) {
					return a.time.localeCompare(b.time);
				}
				return a.date.localeCompare(b.date);
			});

			// Take only the first 3 upcoming games
			const nextThreeGames = upcomingGames.slice(0, 3);

			nextThreeGames.forEach(game => {
				const gameCard = document.createElement('div');
				gameCard.className = 'game-card';
				gameCard.innerHTML = `
					<div class="game-header">
						<div class="game-time">${formatTime(game.time)}</div>
						<div class="game-date">${formatDate(game.date)}</div>
					</div>
					<div class="game-location">${game.location || 'TBD'}</div>
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

			// If no upcoming games, show a message
			if (nextThreeGames.length === 0) {
				const noGamesCard = document.createElement('div');
				noGamesCard.className = 'game-card';
				noGamesCard.innerHTML = `
					<div style="text-align: center; color: #7f8c8d;">
						<h3>No upcoming games scheduled</h3>
					</div>
				`;
				scheduleGrid.appendChild(noGamesCard);
			}
		}

        // Render full schedule for schedule page
        function renderFullSchedule() {
            const fullScheduleBody = document.getElementById('fullScheduleBody');
            fullScheduleBody.innerHTML = '';

            // Group games by date
            const gamesByDate = {};
            games.forEach(game => {
                if (!gamesByDate[game.date]) {
                    gamesByDate[game.date] = [];
                }
                gamesByDate[game.date].push(game);
            });

            // Sort dates
            const sortedDates = Object.keys(gamesByDate).sort();
            
            let weekCounter = 1;
            sortedDates.forEach(date => {
                const gamesOnDate = gamesByDate[date].sort((a, b) => a.time.localeCompare(b.time));
                
                const row = document.createElement('tr');
                
                // Week column
                const weekCell = document.createElement('td');
                weekCell.textContent = `Week ${weekCounter}`;
                row.appendChild(weekCell);
                
                // Date column
                const dateCell = document.createElement('td');
                dateCell.textContent = formatDate(date);
                row.appendChild(dateCell);
                
                // Game time slots
                const timeSlots = ['18:30', '19:40', '20:50']; // Early, Middle, Late
                
                timeSlots.forEach(timeSlot => {
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

            // If no games scheduled
            if (sortedDates.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="5" style="text-align: center; color: #999;">No games scheduled</td>';
                fullScheduleBody.appendChild(row);
            }
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
                    location: 'Magna Centre Gym',
                    status: 'scheduled'
                };

                games.push(newGame);
                renderSchedule();
                renderFullSchedule();

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
				
				function updateScheduleFromCSV() {
					const csvData = document.getElementById('scheduleCSV').value.trim();
					if (!csvData) {
						alert('Please paste CSV data first');
						return;
					}

					// Count current games before update
					const currentGameCount = games.length;

					// Show confirmation dialog with current count
					if (!confirm(`This will replace all ${currentGameCount} existing games with new data from CSV. Are you sure you want to continue?`)) {
						return;
					}

					const lines = csvData.split('\n');
					const newGames = [];
					let gameId = 1;
					let processedLines = 0;
					let validLines = 0;
					
					lines.forEach((line, lineIndex) => {
						if (line.trim()) {
							processedLines++;
							const parts = line.split(',').map(part => part.trim());
							if (parts.length >= 4) {
								validLines++;
								const week = parts[0];
								const date = parts[1];
								
								// Convert date format if needed (assuming MM/DD/YYYY to YYYY-MM-DD)
								let formattedDate = date;
								if (date.includes('/')) {
									const dateParts = date.split('/');
									if (dateParts.length === 3) {
										formattedDate = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
									}
								}
								
								// Early game (6:30 PM)
								if (parts[2] && parts[3]) {
									newGames.push({
										id: gameId++,
										date: formattedDate,
										time: '18:30',
										homeTeam: parts[2],
										awayTeam: parts[3],
										location: 'Magna Centre Gym',
										status: 'scheduled'
									});
								}
								
								// Middle game (7:40 PM)
								if (parts[4] && parts[5]) {
									newGames.push({
										id: gameId++,
										date: formattedDate,
										time: '19:40',
										homeTeam: parts[4],
										awayTeam: parts[5],
										location: 'Magna Centre Gym',
										status: 'scheduled'
									});
								}
								
								// Late game (8:50 PM)
								if (parts[6] && parts[7]) {
									newGames.push({
										id: gameId++,
										date: formattedDate,
										time: '20:50',
										homeTeam: parts[6],
										awayTeam: parts[7],
										location: 'Magna Centre Gym',
										status: 'scheduled'
									});
								}
							}
						}
					});
					
					if (newGames.length > 0) {
						games = newGames; // Replace entire games array
						renderSchedule();
						renderFullSchedule();
						document.getElementById('scheduleCSV').value = '';
						
						// Show detailed success message
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

					// Initialize the page
					document.addEventListener('DOMContentLoaded', function() {
						renderSchedule();
						renderFullSchedule();
						renderStandings();
						renderRosters();
						renderTeamScoring();
						renderIndividualScoring();
					});