import * as puppeteer from 'puppeteer';
import * as Tower from './farm/towers.js';
import * as Daily from './farm/daily.js';
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

export interface StrategyCallback { (bot: HeroBot): Promise<void> };

export type FightButton_t = 'Berserk' | 'HitTower' | 'FinishOff' | 'Hit';

export interface FarmStrategy extends EventEmitter {
    execute();
    Initialize(bot: HeroBot);
    get callback(): StrategyCallback;
};

export let Strategies = new Map<AvalibleStrategy_t, FarmStrategy>([
    ["Towers", new Tower.FarmTowers],
    ["Daily", new Daily.FarmDaily]
]);
