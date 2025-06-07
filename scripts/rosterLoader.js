class RosterLoader {
    static calculatePlayerStats(totalPoints, gamesPlayed, totalFouls, technicals) {
        return {
            ppg: gamesPlayed > 0 ? (totalPoints / gamesPlayed).toFixed(1) : '0.0',
            fpg: gamesPlayed > 0 ? (totalFouls / gamesPlayed).toFixed(1) : '0.0',
            tpg: gamesPlayed > 0 ? (technicals / gamesPlayed).toFixed(2) : '0.00'
        };
    }

    static async loadRostersFromCSV() {
        try {
            console.log('Starting roster load...');
            const response = await fetch('./data/rosters.csv');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const csvText = await response.text();
            const rosters = {};
            const playerStats = [];

            // Parse CSV rows
            const rows = csvText.split('\n')
                .map(row => row.trim())
                .filter(row => row); // Remove empty rows

            // Skip header
            const dataRows = rows.slice(1);
            
            dataRows.forEach(row => {
                const [team, firstName, lastName, captain, number, email, 
                       gamesPlayed, totalPoints, totalFouls, totalTechs] = row.split(',').map(item => item.trim());
                
                if (!rosters[team]) {
                    rosters[team] = { players: [] };
                }

                // Calculate stats
                const stats = this.calculatePlayerStats(
                    parseInt(totalPoints) || 0,
                    parseInt(gamesPlayed) || 0,
                    parseInt(totalFouls) || 0,
                    parseInt(totalTechs) || 0
                );

                playerStats.push({
                    firstName: firstName,
                    lastName: lastName,
                    team: team,
                    ppg: parseFloat(stats.ppg),
                    fpg: parseFloat(stats.fpg),
                    tpg: parseFloat(stats.tpg)
                });

                // Add to rosters
                rosters[team].players.push({
                    name: `${firstName} ${lastName}`,
                    captain: captain.toUpperCase() === 'TRUE',
                    number: number || '',
                    email: email || ''
                });
            });

            console.log('Processed rosters:', rosters);
            return { rosters, playerStats };

        } catch (error) {
            console.error('RosterLoader error:', error);
            return null;
        }
    }
}

// Initialize roster loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const rostersContainer = document.getElementById('rostersContainer');
    
    if (rostersContainer) {
        RosterLoader.loadRostersFromCSV()
            .then(({ rosters, playerStats }) => {
                if (rosters) {
                    console.log('Rendering rosters...');
                    rostersContainer.innerHTML = Object.entries(rosters)
                        .map(([teamName, team]) => `
                            <div class="team-roster">
                                <h3>${teamName}</h3>
                                <ul class="player-list">
                                    ${team.players
                                        .sort((a, b) => b.captain - a.captain || a.name.localeCompare(b.name))
                                        .map(player => `
                                            <li class="${player.captain ? 'captain' : ''}">
                                                ${player.captain ? '<i class="fas fa-crown"></i> ' : ''}
                                                ${player.name}
                                                ${player.captain ? '<span class="captain-badge">CAPTAIN</span>' : ''}
                                            </li>
                                        `).join('')}
                                </ul>
                            </div>
                        `).join('');
                } else {
                    rostersContainer.innerHTML = '<div class="error">Failed to load roster data</div>';
                }
            });
    } else {
        console.error('Rosters container not found!');
    }
});