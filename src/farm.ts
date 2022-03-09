import * as puppeteer from 'puppeteer';
import { FarmTowers } from './farm/towers.js';
import { FarmDaily }  from './farm/daily.js';
import { EventEmitter } from 'events';
import { HeroBot, BotItemsSettings } from './bot.js';
import { logMessage, LoggingLevel, sleep } from './utils.js';

// ░█▀▀░█▀█░█▀▄░█▄█░░░█▀▀░▀█▀░█▀▄░█▀█░▀█▀░█▀▀░█▀▀░█░█
// ░█▀▀░█▀█░█▀▄░█░█░░░▀▀█░░█░░█▀▄░█▀█░░█░░█▀▀░█░█░░█░
// ░▀░░░▀░▀░▀░▀░▀░▀░░░▀▀▀░░▀░░▀░▀░▀░▀░░▀░░▀▀▀░▀▀▀░░▀░

export type AvalibleStrategy_t = 'Towers' | 'Daily';
export let isStrategy = (str: string) => ['Towers', 'Daily'].some(elem => elem === str);

export type TowersFarmSettings = "Hero" | "Tower";
export type DailyFarmSettings  = "NotImplemented";
export type FarmSettings       = TowersFarmSettings | DailyFarmSettings;

export interface StrategyCallback { (): Promise<void> };

export type FightButton_t = 'Berserk' | 'HitTower' | 'FinishOff' | 'Hit';

export interface FarmStrategy extends EventEmitter {
    execute();
    Initialize();
    get callback(): StrategyCallback;
};

export function FarmStrategyFactory(strat: AvalibleStrategy_t, bot: HeroBot) {
    switch (strat) {
        case 'Towers': return new FarmTowers(bot);
        case 'Daily': return new FarmDaily(bot);
        default: throw new Error('Cannot define passed stratigy: ' + strat);
    }
}
