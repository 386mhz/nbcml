import { DataStore } from '../datastore.js';

export const RosterRenderer = {
    async render() {
        const rosterSection = document.getElementById('roster');
        if (!rosterSection) return;

        rosterSection.innerHTML = '';

        if (DataStore.rosters && Object.keys(DataStore.rosters).length > 0) {
            Object.entries(DataStore.rosters).forEach(([teamName, players]) => {
                const teamDiv = document.createElement('div');
                teamDiv.className = 'roster-team';

                const teamHeader = document.createElement('h3');
                teamHeader.textContent = teamName;
                teamDiv.appendChild(teamHeader);

                const playerList = document.createElement('ul');
                players.forEach(player => {
                    const li = document.createElement('li');
                    li.textContent = player;
                    playerList.appendChild(li);
                });
                teamDiv.appendChild(playerList);

                rosterSection.appendChild(teamDiv);
            });
        } else {
            rosterSection.innerHTML = '<p>No roster data available.</p>';
        }
    }
};