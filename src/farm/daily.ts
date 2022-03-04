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
    async execute(farmSettings: DailyFarmSettings, itemSettings: BotItemsSettings) {

    }

    async Initialize(bot: HeroBot) {

    }
}
