/// <reference types="node" />
import { FarmStrategy, DailyFarmSettings, StrategyCallback } from './../farm.js';
import { EventEmitter } from 'events';
import { HeroBot, BotItemsSettings } from './../bot.js';
export declare class FarmDaily extends EventEmitter implements FarmStrategy {
    private _callback;
    execute(farmSettings: DailyFarmSettings, itemSettings: BotItemsSettings): Promise<void>;
    Initialize(bot: HeroBot): Promise<void>;
    get callback(): StrategyCallback;
}
