/// <reference types="node" />
import { EventEmitter } from 'events';
import { HeroBot, BotItemsSettings } from './bot.js';
export declare type AvalibleStrategy_t = 'Towers' | 'Daily';
export declare let isStrategy: (str: string) => boolean;
export declare type TowersFarmSettings = "Hero" | "Tower";
export declare type DailyFarmSettings = "NotImplemented";
export declare type FarmSettings = TowersFarmSettings | DailyFarmSettings;
export interface StrategyCallback {
    (bot: HeroBot): Promise<void>;
}
export interface FarmStrategy extends EventEmitter {
    execute(farmSettings: FarmSettings, itemSettings: BotItemsSettings): any;
    Initialize(bot: HeroBot): any;
    get callback(): StrategyCallback;
}
export declare let Strategies: Map<AvalibleStrategy_t, FarmStrategy>;
