/// <reference types="node" />
import { FarmStrategy, TowersFarmSettings, StrategyCallback } from './../farm.js';
import { EventEmitter } from 'events';
import { HeroBot, BotItemsSettings } from './../bot.js';
/**
 * Signals:
 *  NeedRest - on energy or health is zero
 *  ItemBroken - on some item has been broken
 *  NewItem - on new item collected
 *  RackFull - on rack is full
 *  RackBetter - collected item is better then weared
 */
export declare class FarmTowers extends EventEmitter implements FarmStrategy {
    private bot;
    private sel;
    private locations;
    private fightButtons;
    private _callback;
    get callback(): StrategyCallback;
    Initialize(bot: HeroBot): Promise<void>;
    execute(settings: TowersFarmSettings, itemSettings: BotItemsSettings): Promise<void>;
    private heroPreferedLocation;
    private scrapContext;
    private scrapNearLocations;
    private goToLocation;
    private scrapFightButtons;
    private useBottle;
}
