import * as puppeteer from 'puppeteer';
import { FarmStrategy, TowersFarmSettings, StrategyCallback, FightButton_t }  from './../farm.js';
import { EventEmitter } from 'events';
import { HeroBot, BotItemsSettings } from './../bot.js';
import { SmartClick, logMessage, LoggingLevel, sleep } from './../utils.js';
import { url } from "./../config.json";

// ░█▀▀░█▀█░█▀▄░█▄█░░░▀█▀░█▀█░█░█░█▀▀░█▀▄░█▀▀
// ░█▀▀░█▀█░█▀▄░█░█░░░░█░░█░█░█▄█░█▀▀░█▀▄░▀▀█
// ░▀░░░▀░▀░▀░▀░▀░▀░░░░▀░░▀▀▀░▀░▀░▀▀▀░▀░▀░▀▀▀

const TowerLocs: Array<string> =
    [ "Карaкорум, стoлицa Юга", "столица г. Мидгард"
    , "Курган"
    , "Лагерь орды"
    , "Устье реки"
    , "Горнoе озеро"
    , "Южная пустошь"
    , "Мароканд"
    , "Мертвый город , Юг"
    , "Земли титанов , Юг"
    , "Долина стражей , Юг" ];

// TODO its need for seek best place for farm
// const TowerObjLocs: Array<string> = [];

type TowerLocs_t = typeof TowerLocs[number];
let isTowerLoc = (locStr: string) => TowerLocs.some(elem => elem === locStr);

/**
 * Signals:
 *  NeedRest - on energy or health is zero
 *  ItemBroken - on some item has been broken
 *  RackFull - on rack is full
 *  RackBetter - collected item is better then weared
 */
export class FarmTowers extends EventEmitter implements FarmStrategy {

    // page context
    private ctx: Set<puppeteer.ElementHandle<Element>>;

    // near locations [name: handler]
    private locations:    Map<TowerLocs_t, puppeteer.ElementHandle>;

    // fight buttons [name: handler]
    private fightButtons: Map<FightButton_t, puppeteer.ElementHandle>;

    // callback to farm
    // private _callback: StrategyCallback = async (bot: HeroBot) => { await bot.Page.goto(url.fight.towers, { waitUntil: 'domcontentloaded' }) };
    private _callback: StrategyCallback = async () => { await this.Initialize(); };

    get callback(): StrategyCallback { return this._callback; }

    // bot - ref to real
    constructor(private bot: HeroBot) {
        super();
        this.locations = new Map;
        this.fightButtons = new Map;
    }

    async Initialize() {
        await this.bot.Page.goto(url.fight.towers, {waitUntil: 'domcontentloaded'});
        await this.bot.Page.waitForSelector('div > a', { timeout: 10000, visible: true });
    }

    // its a first step always false
    private async prepareExecute(): Promise<boolean> {
        this.ctx = new Set(await this.bot.Page.$$('div > a.flhdr'));

        if (this.ctx.size <= 0) {
            throw new Error("No nawigation buttions");
        }

        return false;
    }

    // no matter return
    private async finalizeExecute() {
        this.ctx.clear();
    }

    async execute(): Promise<void> {
        try {
            const steps = [ this.prepareExecute,
                            this.checkBag,
                            this.checkStats,
                            this.leaveCapital,
                            this.fight,
                            this.finalizeExecute ];

            for await (let step of steps) {
                if (await step.call(this)) {
                    this.finalizeExecute();
                    return;
                }
            }

        } catch (err) {
            logMessage(err, LoggingLevel.Fatal);
            throw new Error("Error occured while farming: " + err);
        }
    }

    // its a final step, always return true
    private async fight(): Promise<boolean> {
        await this.scrapFightButtons();

        // redo with better pattern
        if (this.fightButtons.has('Berserk')) {
            logMessage("Activating berserk ability...");
            await SmartClick(this.fightButtons.get('Berserk'));
        } else if (this.fightButtons.has('HitTower')) {
            logMessage("Hitting tower...");
            await SmartClick(this.fightButtons.get('HitTower'));
        } else if (this.fightButtons.has('FinishOff')) {
            logMessage("Hitting enemy...");
            await SmartClick(this.fightButtons.get('FinishOff'));
        } else if (this.fightButtons.has('Hit')) {
            logMessage("Hitting...");
            await SmartClick(this.fightButtons.get('Hit'))
        }
        // this.bot.Page.waitForNetworkIdle({timeout: 10000});

        return true;
    }

    private async checkBag(): Promise<boolean> {
        let indicators = await this.bot.Page.$$('a > img');

        for await (let ind of indicators) {
            let src = await ind.getProperty('src').then(e => e.jsonValue());

            switch (src) {
                case 'http://barbars.ru/images/icons/bag_better.gif':
                    logMessage('Founed better item');
                    await this.emit('RackBetter', this);
                    return true;
                    break;
                case 'http://barbars.ru/images/icons/clothes_broken.gif':
                    logMessage('One item was broken');
                    await this.emit('ItemBroken', this);
                    return true;
                    break;
                case 'http://barbars.ru/images/icons/bag_full.gif':
                    logMessage('Rack is full');
                    await this.emit('RackFull', this);
                    return true;
                    break;
            }
        }
        return false;
    }

    // return true on need refresh
    private async checkStats(): Promise<boolean> {
        let stats = await this.bot.scrapCurentHeroStats();
        if (stats.energy === 0 || stats.health === 0) {
            logMessage("Low health or energy", LoggingLevel.Trace);

            if (this.bot.Settings.items.useBottle && (await this.useBottle())) {
                logMessage("Exiting farm for healing");
                return true;
            } else {
                logMessage("Health is low, resting...");
                this.emit('NeedRest', this);
                return true;
            }

        } else {
            return false;
        }
    }

    private async isOnCapaital(): Promise<boolean> {
        let loc: TowerLocs_t =
            await this.bot.Page.$eval('div > h1 > span', (el) => <TowerLocs_t> el.textContent);

        if (loc === "Карaкорум, стoлицa Юга" || loc === "столица г. Мидгард") {
            return true;
        }
        return false;
    }

    // return true if need refresh
    private async leaveCapital(): Promise<boolean> {
        if (await this.isOnCapaital()) {
            await this.scrapNearLocations();
            await this.goToLocation(this.heroPreferedLocation());
            return true;
        } else {
            return false;
        }
    }

    private heroPreferedLocation(): TowerLocs_t {
        let ret: TowerLocs_t;
        const level = this.bot.Level;

        if (level > 44) { ret = TowerLocs[9];
        } else if (level > 39) { ret = TowerLocs[8];
        } else if (level > 30) { ret = TowerLocs[7];
        } else if (level > 19) { ret = TowerLocs[6];
        } else if (level > 13) { ret = TowerLocs[5];
        } else if (level > 8) { ret = TowerLocs[4];
        } else if (level > 2) { ret = TowerLocs[3];
        } else if (level > 0) { ret = TowerLocs[2];
        } else {
            throw new Error("Passed level: " + level + " not in avalible range");
        }

        return ret;
    }

    private async scrapNearLocations(): Promise<void> {
        this.locations.clear();

        for await (let el of this.ctx) {
            let text: string = await el.getProperty('innerText').then(prop => prop.jsonValue());
            if (isTowerLoc(text)) {
                this.locations.set(text, el);
            }
        }
    }

    private async goToLocation(loc: TowerLocs_t): Promise<void> {
        if (this.locations.has(loc) === false) {
            throw new Error("Cannot go to location");
        }

        logMessage("Going to other location")
        await SmartClick(this.locations.get(loc));
    }

    // scrap beat buttons and ability buttons
    private async scrapFightButtons(): Promise<void> {
        this.fightButtons.clear();

        for await (let el of this.ctx) {
            let text: string = await el.getProperty('innerText').then((el) => el.jsonValue());
            if ("Бить врагов" === text) {
                this.fightButtons.set('Hit', el);
            }
            else if (/Добивать /.test(text)) {
                this.fightButtons.set('FinishOff', el);
            }
            else if ("Бить " === text) {
                let inner = await el.$eval('span', e => e.textContent);
                if (inner == "башню") {
                    this.fightButtons.set('HitTower', el);
                }
            }
            else if ("Бepcepк (гoтoво)" === text) {
                this.fightButtons.set('Berserk', el)
            }
        }
    }

    private async useBottle(): Promise<boolean>  {
        let button;

        logMessage("Trying use bottle")
        for await (let el of this.ctx) {
            let text: string = await el.getProperty('innerText') .then((el) => el.jsonValue());
            if (/Пить бутылочку */.test(text)) {
                let inner = await el.$eval('span', e => e.textContent);
                if (/\(*шт\.\)/.test(inner)) {
                    button = el;
                    break;
                }
            }
        }

        if (button) {
            logMessage("Using bottle...");
            await SmartClick(button);
            return true;
        }

        logMessage("No bottle charges, go rest", LoggingLevel.Trace);
        return false;
    }
}

