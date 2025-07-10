import { DataStore } from '../datastore.js';

export const StandingsRenderer = {
    render() {
        const standingsBody = document.getElementById('standingsBody');
        if (!standingsBody) return;

        standingsBody.innerHTML = '';

        if (DataStore.teamStats && DataStore.teamStats.length > 0) {
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
                standingsBody.appendChild(tr);
            });
        } else {
            standingsBody.innerHTML = '<tr><td colspan="10">No standings data available.</td></tr>';
        }
    }
};