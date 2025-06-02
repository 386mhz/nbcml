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
                date: '2025-06-08',
                time: '19:30',
                homeTeam: 'Thunder',
                awayTeam: 'Lightning',
                status: 'scheduled'
            },
            {
                id: 2,
                date: '2025-06-08',
                time: '20:30',
                homeTeam: 'Wolves',
                awayTeam: 'Eagles',
                status: 'scheduled'
            },
            {
                id: 3,
                date: '2025-06-15',
                time: '19:30',
                homeTeam: 'Sharks',
                awayTeam: 'Tigers',
                status: 'scheduled'
            }
        ];

        let teams = [
            { name: 'Thunder', wins: 8, losses: 2 },
            { name: 'Lightning', wins: 7, losses: 3 },
            { name: 'Wolves', wins: 6, losses: 4 },
            { name: 'Eagles', wins: 5, losses: 5 },
            { name: 'Sharks', wins: 3, losses: 7 },
            { name: 'Tigers', wins: 1, losses: 9 }
        ];

        let news = [
            {
                id: 1,
                date: '2025-06-01',
                title: 'New Season Begins!',
                content: 'Welcome to the 2025 season of Newmarket Basketball Club. Games start this weekend!'
            },
            {
                id: 2,
                date: '2025-05-28',
                title: 'Registration Still Open',
                content: 'Late registration is still available for new players. Contact us for more information.'
            }
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

        // Render standings
        function renderStandings() {
            const standingsBody = document.getElementById('standingsBody');
            standingsBody.innerHTML = '';

            // Sort teams by win percentage
            const sortedTeams = [...teams].sort((a, b) => {
                const aWinPct = a.wins / (a.wins + a.losses);
                const bWinPct = b.wins / (b.wins + b.losses);
                return bWinPct - aWinPct;
            });

            sortedTeams.forEach((team, index) => {
                const winPct = (team.wins / (team.wins + team.losses) * 100).toFixed(1);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${team.name}</td>
                    <td>${team.wins}</td>
                    <td>${team.losses}</td>
                    <td>${winPct}%</td>
                `;
                standingsBody.appendChild(row);
            });
        }

        // Render news
        function renderNews() {
            const newsContainer = document.getElementById('newsContainer');
            newsContainer.innerHTML = '';

            news.forEach(item => {
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                newsItem.innerHTML = `
                    <div class="news-date">${formatDate(item.date)}</div>
                    <div class="news-title">${item.title}</div>
                    <div class="news-content">${item.content}</div>
                `;
                newsContainer.appendChild(newsItem);
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

        function addNews() {
            const title = document.getElementById('newsTitle').value;
            const content = document.getElementById('newsContent').value;

            if (title && content) {
                const newNews = {
                    id: news.length + 1,
                    date: new Date().toISOString().split('T')[0],
                    title: title,
                    content: content
                };

                news.unshift(newNews); // Add to beginning of array
                renderNews();

                // Clear form
                document.getElementById('newsTitle').value = '';
                document.getElementById('newsContent').value = '';

                alert('News item added successfully!');
            } else {
                alert('Please fill in all fields');
            }
        }

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            renderSchedule();
            renderStandings();
            renderNews();
        });