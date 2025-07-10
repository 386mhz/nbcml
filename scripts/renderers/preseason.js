import { DataStore } from '../datastore.js';

export const PreSeasonRenderer = {
    render() {
        const preseasonSection = document.getElementById('preseason');
        if (!preseasonSection) return;

        // Clear previous content
        preseasonSection.innerHTML = '';

        // Example: Render preseason games from DataStore.preseasonGames (if exists)
        if (DataStore.preseasonGames && DataStore.preseasonGames.length > 0) {
            const table = document.createElement('table');
            table.className = 'standings-table';
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
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
            DataStore.preseasonGames.forEach(game => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
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
            preseasonSection.appendChild(table);
        } else {
            preseasonSection.innerHTML = '<p>No preseason games scheduled.</p>';
        }
    }
};