import { DataStore } from '../datastore.js';

export const PlayoffsRenderer = {
    render() {
        const playoffsSection = document.getElementById('playoffs');
        if (!playoffsSection) return;

        playoffsSection.innerHTML = '';

        if (DataStore.playoffs && DataStore.playoffs.length > 0) {
            const table = document.createElement('table');
            table.className = 'standings-table';
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>Game</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Home</th>
                    <th>Away</th>
                    <th>Location</th>
                    <th>Status</th>
                </tr>
            `;
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            DataStore.playoffs.forEach((game, idx) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${idx + 1}</td>
                    <td>${game.date}</td>
                    <td>${game.time}</td>
                    <td>${game.homeTeam}</td>
                    <td>${game.awayTeam}</td>
                    <td>${game.location}</td>
                    <td>${game.status}</td>
                `;
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            playoffsSection.appendChild(table);
        } else {
            playoffsSection.innerHTML = '<p>No playoff games scheduled.</p>';
        }
    }
};