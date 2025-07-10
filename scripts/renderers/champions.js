export const ChampionsRenderer = {
    async render() {
        const championsBody = document.getElementById('championsBody');
        if (!championsBody) return;

        try {
            const response = await fetch('data/champs.csv');
            const csvText = await response.text();
            const lines = csvText.trim().split('\n').filter(line => line && !line.startsWith('//'));
            if (lines.length < 2) {
                championsBody.innerHTML = '<tr><td colspan="4" style="color:#e74c3c;">No champions data found</td></tr>';
                return;
            }
            // Remove header
            const rows = lines.slice(1);

            championsBody.innerHTML = '';

            // Find the most recent champion (highest year)
            let mostRecentYear = Math.max(...rows.map(row => {
                const cols = row.replace(/,+$/, '').split(',');
                return parseInt(cols[0], 10) || 0;
            }));

            rows.forEach(row => {
                // Remove possible trailing commas and split
                const cols = row.replace(/,+$/, '').split(',');
                const year = cols[0];
                const team = cols[1];
                const venue = cols[2];
                const players = cols.slice(3).filter(name => name && name !== 'TBD');
                const roster = players.length > 0 ? players.join(' ~ ') : 'TBD';

                if (year && team) {
                    const tr = document.createElement('tr');
                    if (parseInt(year, 10) === mostRecentYear) {
                        tr.className = 'recent-champion-row';
                    }
                    tr.innerHTML = `
                        <td>${year}</td>
                        <td>${team}</td>
                        <td>${venue}</td>
                        <td style="text-align:left;">${roster}</td>
                    `;
                    championsBody.appendChild(tr);
                }
            });
        } catch (err) {
            console.error('Error loading champions:', err);
            championsBody.innerHTML = '<tr><td colspan="4" style="color:#e74c3c;">Unable to load champions data</td></tr>';
        }
    }
};