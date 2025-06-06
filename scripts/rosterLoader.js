class RosterLoader {
    static async loadRostersFromCSV() {
        try {
            console.log('Starting roster load...');
            // Use relative path from web root
            const response = await fetch('./data/rosters.csv');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const csvText = await response.text();
            const rosters = {};

            // Skip header row and process data
            const rows = csvText.split('\n').slice(1);
            rows.forEach(row => {
                if (!row.trim()) return; // Skip empty rows
                
                const [team, firstName, lastName, captain, number, email] = row.split(',').map(item => item.trim());
                
                if (!rosters[team]) {
                    rosters[team] = {
                        players: []
                    };
                }

                // Only add player if we have valid team and name data
                if (team && firstName && lastName) {
                    rosters[team].players.push({
                        name: `${firstName} ${lastName}`,
                        captain: captain.toUpperCase() === 'TRUE',
                        number: number ? parseInt(number) : '',
                        email: email || ''
                    });
                }
            });

            // If no teams were loaded, throw error
            if (Object.keys(rosters).length === 0) {
                throw new Error('No valid roster data found');
            }

            return rosters;

        } catch (error) {
            console.error('RosterLoader error:', error);
            return null;
        }
    }
}