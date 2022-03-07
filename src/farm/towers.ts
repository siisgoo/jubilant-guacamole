import * as puppeteer from 'puppeteer';
import { FarmStrategy, TowersFarmSettings, StrategyCallback }  from './../farm.js';
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
 *  NewItem - on new item collected
 *  RackFull - on rack is full
 *  RackBetter - collected item is better then weared
 */
export class FarmTowers extends EventEmitter implements FarmStrategy {

    // ref
    private bot: HeroBot;

    private ctx: Set<puppeteer.ElementHandle<Element>>;

    private locations:    Map<TowerLocs_t, puppeteer.ElementHandle>;
    private fightButtons: Map<string, puppeteer.ElementHandle>;
    private _callback: StrategyCallback = async (bot: HeroBot) => { await bot.Page.goto(url.fight.towers, { waitUntil: 'domcontentloaded' }) };

    get callback(): StrategyCallback { return this._callback; }

    async Initialize(bot: HeroBot) {
        this.bot = bot;
        await bot.Page.goto(url.fight.towers, {waitUntil: 'domcontentloaded'});
        await this.bot.Page.waitForSelector('div > a', { timeout: 10000, visible: true });
        this.locations = new Map;
        this.fightButtons = new Map;
    }

    async execute(settings: TowersFarmSettings, itemSettings: BotItemsSettings )
    {

        try {

            logMessage("Start fight step")

            let stats = await this.bot.scrapCurentHeroStats();
            logMessage(JSON.stringify(stats));

            await this.scrapContext();

            if (this.ctx.size <= 0) {
                throw new Error("No nawigation buttions");
            }

            // let indicators = await this.bot.Page.$$('a > img');
            // for await (let ind of indicators) {
            //     let src = await ind.getProperty('src').then(e => e.jsonValue());

            //     if (src == "/images/icons/bag_better.gif") {
            //         this.emit('RackBetter');
            //     }
            // }

            if (stats.energy === 0 || stats.health === 0) {
                logMessage("Low health or energy", LoggingLevel.Trace);

                // use bottle
                if (itemSettings.useBottle === true && (await this.useBottle())) {
                    logMessage("Exiging farm for healing");
                    return; //exit for new iteration
                } else { // go rest
                    logMessage("Health is low, resting...");

                    this.emit('NeedRest',
                              this);

                    return; // reload
                }

            }

            let currentLocation: TowerLocs_t =
                await this.bot.Page.$eval('div > h1 > span', (el) => <TowerLocs_t> el.textContent);

            // if in started location
            if (currentLocation === "Карaкорум, стoлицa Юга"
                || currentLocation === "столица г. Мидгард")
            {
                await this.scrapNearLocations();

                logMessage("Going from capital...\n");
                await this.goToLocation(this.heroPreferedLocation());
                return;
            }

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
            this.bot.Page.waitForNetworkIdle({timeout: 10000});

            this.ctx.clear();
            logMessage("End fight step" + '\n')

        } catch (err) {
            logMessage(err, LoggingLevel.Fatal);
            throw new Error("Error occured while fighting: " + err);
        }
    }

    private heroPreferedLocation(): TowerLocs_t {
        let ret: TowerLocs_t;
        const level = this.bot.Level;
        console.log(level);

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

    private async scrapContext(): Promise<void> {
        logMessage("Scrumming context");
        this.ctx = new Set(await this.bot.Page.$$('div > a.flhdr'));
    }

    private async scrapNearLocations(): Promise<void> {
        this.locations.clear();

        logMessage("Scrumming nearby locations")
        for await (let el of this.ctx) {
            let text: string = await el.getProperty('innerText').then(prop => prop.jsonValue());
            if (isTowerLoc(text)) {
                this.locations.set(text, el);
            }
        }
    }

    private async goToLocation(loc: TowerLocs_t): Promise<void> {
        if (this.locations.has(loc) === false) {
            // programming error
            throw new Error("Cannot go to location");
        }

        let page = this.bot.Page;

        logMessage("Going to other location")
        await SmartClick(this.locations.get(loc));
    }

    // scrap beat buttons and ability buttons
    private async scrapFightButtons(): Promise<void> {
        this.fightButtons.clear();

        logMessage("Scrum fight buttons")
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

