import { DataStore } from '../datastore.js';

export const StatsRenderer = {
    renderTeamStats() {
        const teamStatsSection = document.getElementById('teamStats');
        if (!teamStatsSection) return;

        teamStatsSection.innerHTML = '';

        if (DataStore.teamStats && DataStore.teamStats.length > 0) {
            const table = document.createElement('table');
            table.className = 'standings-table';
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>Team</th>
                    <th>Avg Pts</th>
                    <th>Avg Allowed</th>
                    <th>Top Scorer</th>
                    <th>Wins</th>
                    <th>Losses</th>
                    <th>Ties</th>
                    <th>Total Points</th>
                    <th>GB</th>
                    <th>Streak</th>
                </tr>
            `;
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            DataStore.teamStats.forEach(stat => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${stat.team}</td>
                    <td>${stat.avgPts}</td>
                    <td>${stat.avgAllowed}</td>
                    <td>${stat.topScorer}</td>
                    <td>${stat.wins}</td>
                    <td>${stat.losses}</td>
                    <td>${stat.ties}</td>
                    <td>${stat.totalPoints}</td>
                    <td>${stat.gb}</td>
                    <td>${stat.streak}</td>
                `;
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            teamStatsSection.appendChild(table);
        } else {
            teamStatsSection.innerHTML = '<p>No team stats available.</p>';
        }
    },
    renderPlayerStats() {
        const playerStatsSection = document.getElementById('playerStats');
        if (!playerStatsSection) return;

        playerStatsSection.innerHTML = '';

        if (DataStore.playerStats && DataStore.playerStats.length > 0) {
            const table = document.createElement('table');
            table.className = 'standings-table';
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>Player</th>
                    <th>Team</th>
                    <th>GP</th>
                    <th>PTS</th>
                    <th>REB</th>
                    <th>AST</th>
                    <th>STL</th>
                    <th>BLK</th>
                    <th>FG%</th>
                    <th>3PT%</th>
                </tr>
            `;
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            DataStore.playerStats.forEach(stat => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${stat.player}</td>
                    <td>${stat.team}</td>
                    <td>${stat.gp}</td>
                    <td>${stat.pts}</td>
                    <td>${stat.reb}</td>
                    <td>${stat.ast}</td>
                    <td>${stat.stl}</td>
                    <td>${stat.blk}</td>
                    <td>${stat.fgPct}</td>
                    <td>${stat.threePtPct}</td>
                `;
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            playerStatsSection.appendChild(table);
        } else {
            playerStatsSection.innerHTML = '<p>No player stats available.</p>';
        }
    }
};