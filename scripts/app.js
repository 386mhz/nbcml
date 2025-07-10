// App initialization and global functions
import { ScheduleRenderer } from './renderers/schedule.js';
import { StandingsRenderer } from './renderers/standings.js';
import { RosterRenderer } from './renderers/roster.js';
import { StatsRenderer } from './renderers/stats.js';
import { ResultsRenderer } from './renderers/results.js';
import { PlayoffsRenderer } from './renderers/playoffs.js';
import { PreSeasonRenderer } from './renderers/preseason.js';
import { ChampionsRenderer } from './renderers/champions.js';

export const App = {
    async init() {
        ScheduleRenderer.renderFull();
        StandingsRenderer.render();
        await RosterRenderer.render();
        StatsRenderer.renderTeamStats();
        StatsRenderer.renderPlayerStats();
        ResultsRenderer.render();
        PlayoffsRenderer.render();
        PreSeasonRenderer.render();
        await ChampionsRenderer.render();
    }
};