import { DataStore } from '../datastore.js';
import { Utils } from '../utils.js'; // Add if you use Utils functions
import { CONFIG } from '../config.js';

export const ResultsRenderer = {
    render() {
        const resultsContainer = document.getElementById('resultsContainer');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = '';

        if (DataStore.results && DataStore.results.length > 0) {
            DataStore.results.forEach(group => {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'result-group';

                const dateDiv = document.createElement('div');
                dateDiv.className = 'result-date';
                dateDiv.textContent = group.date;
                groupDiv.appendChild(dateDiv);

                group.games.forEach(game => {
                    const gameDiv = document.createElement('div');
                    gameDiv.className = 'result-game';

                    gameDiv.innerHTML = `
                        <div class="game-info">
                            <span class="game-teams">${game.homeTeam} vs ${game.awayTeam}</span>
                            <span class="team-score">${game.homeScore} - ${game.awayScore}</span>
                            <span class="game-status ${game.status}">${game.status}</span>
                        </div>
                    `;
                    groupDiv.appendChild(gameDiv);
                });

                resultsContainer.appendChild(groupDiv);
            });
        } else {
            resultsContainer.innerHTML = '<p>No results available.</p>';
        }
    },
    updateScrollPosition() {
        const container = document.getElementById('resultsContainer');
        if (!container) return;
        container.scrollLeft = CONFIG.scrollPosition;
    }
};