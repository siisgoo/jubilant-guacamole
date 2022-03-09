import * as puppeteer from 'puppeteer';
import { FarmStrategy, DailyFarmSettings, StrategyCallback }  from './../farm.js';
import { EventEmitter } from 'events';
import { HeroBot, BotItemsSettings } from './../bot.js';
import { logMessage, LoggingLevel, sleep } from './../utils.js';
import { url } from "./../config.json";

// ░█▀▀░█▀█░█▀▄░█▄█░░░█▀▄░█▀█░▀█▀░█░░░█░█
// ░█▀▀░█▀█░█▀▄░█░█░░░█░█░█▀█░░█░░█░░░░█░
// ░▀░░░▀░▀░▀░▀░▀░▀░░░▀▀░░▀░▀░▀▀▀░▀▀▀░░▀░

export class FarmDaily extends EventEmitter implements FarmStrategy {

    private _callback: StrategyCallback;

    async execute() {

    }

    async Initialize(bot: HeroBot) {

    }

    get callback(): StrategyCallback {
        return this._callback;
    }
}
