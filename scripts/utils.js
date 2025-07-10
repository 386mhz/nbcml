// Utility functions
import { DataStore } from './datastore.js';

export const Utils = {
    formatDate(dateString) {
        const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'America/Toronto'
        });
    },
    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    },
    formatDateShort(dateString) {
        const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            timeZone: 'America/Toronto'
        }).toUpperCase();
    },
    getUpcomingGames(limit = 3) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return DataStore.games
            .filter(game => {
                const [year, month, day] = game.date.split('-').map(num => parseInt(num, 10));
                const gameDate = new Date(year, month - 1, day);
                gameDate.setHours(0, 0, 0, 0);
                return gameDate >= today;
            })
            .sort((a, b) => {
                if (a.date === b.date) {
                    return a.time.localeCompare(b.time);
                }
                return a.date.localeCompare(b.date);
            })
            .slice(0, limit);
    },
    groupGamesByDate() {
        const gamesByDate = {};
        DataStore.games.forEach(game => {
            if (!gamesByDate[game.date]) {
                gamesByDate[game.date] = [];
            }
            gamesByDate[game.date].push(game);
        });
        return gamesByDate;
    },
    parseCSVDate(dateStr) {
        if (dateStr.includes('/')) {
            const dateParts = dateStr.split('/');
            if (dateParts.length === 3) {
                const month = dateParts[0].padStart(2, '0');
                const day = dateParts[1].padStart(2, '0');
                let year = dateParts[2];
                if (year.length === 2) {
                    year = '20' + year;
                }
                return `${year}-${month}-${day}`;
            }
        }
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateStr;
        }
        console.warn('Unrecognized date format:', dateStr);
        return dateStr;
    },
    createElement(tag, className, innerHTML) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }
};