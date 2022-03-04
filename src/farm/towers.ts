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

export class FarmTowers extends EventEmitter implements FarmStrategy {

    // ref
    private bot: HeroBot;

    private sel: Set<puppeteer.ElementHandle<Element>>;

    private locations:    Map<TowerLocs_t, puppeteer.ElementHandle>;
    private fightButtons: Map<string, puppeteer.ElementHandle>;

    private heroPreferedLocation(): TowerLocs_t {
        let ret: TowerLocs_t;
        const level = this.bot.Level;

        if (level < 8) { ret = TowerLocs[3];
        } else if (level < 14) { ret = TowerLocs[4];
        } else if (level < 19) { ret = TowerLocs[5];
        } else if (level < 25) { ret = TowerLocs[6];
        } else if (level < 33) { ret = TowerLocs[7];
        } else if (level < 41) { ret = TowerLocs[8];
        } else if (level < 51) { ret = TowerLocs[9];
        } else if (level < 66) { ret = TowerLocs[10];
        } else if (level < 86) { ret = TowerLocs[11];
        } else {
            throw new Error("Passed level: " + level + " not in avalible range");
        }

        return ret;
    }

    private async scrumContext(): Promise<void> {
        logMessage("Scrumming context");
        this.sel = new Set(await this.bot.Page.$$('div > a.flhdr'));

        // handle duplicates error
        // for await (let el of this.sel) {
        //     if (el.getProperty('innerText') === )
        // }
    }

    private async scrumNearLocations(): Promise<void> {
        this.locations.clear();

        logMessage("Scrumming nearby locations")
        for await (let el of this.sel) {
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

    // scrum beat buttons and ability buttons
    private async scrumFightButtons(): Promise<void> {
        this.fightButtons.clear();

        logMessage("Scrum fight buttons")
        for await (let el of this.sel) {
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
        for await (let el of this.sel) {
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
            logMessage("Using bottle...", LoggingLevel.Trace);
            await SmartClick(button);
            return true;
        }

        logMessage("No bottle charges, go rest", LoggingLevel.Trace);
        return false;
    }

    async execute(settings: TowersFarmSettings, itemSettings: BotItemsSettings )
    {

        try {

            logMessage("Start fight step")

            let stats = await this.bot.scrumCurentHeroStats();
            logMessage(JSON.stringify(stats));

            await this.scrumContext();

            if (this.sel.size <= 0) {
                throw new Error("No nawigation buttions");
            }

            if (stats.energy === 0 || stats.health === 0) {
                logMessage("Low health or energy", LoggingLevel.Trace);

                // use bottle
                if (itemSettings.useBottle === true && (await this.useBottle())) {
                    logMessage("Exiging farm for healing");
                    return; //exit for new iteration
                } else { // go rest
                    logMessage("Health is low, resting...");

                    let callback: StrategyCallback =
                        async (bot: HeroBot) => { await bot.Page.goto(url.fight.towers, { waitUntil: 'domcontentloaded' }) };

                    this.emit('NeedRest',
                              callback, //return to tower fight
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
                await this.scrumNearLocations();

                logMessage("Going from capital...");
                await this.goToLocation(this.heroPreferedLocation());
                return;
            }

            await this.scrumFightButtons();

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
            this.bot.Page.waitForNetworkIdle({timeout: 5000});

            this.sel.clear();
            logMessage("End fight step" + '\n')

        } catch (err) {
            logMessage(err, LoggingLevel.Fatal);
            throw new Error("Error occured while fighting: " + err);
        }
    }

    async Initialize(bot: HeroBot) {
        this.bot = bot;
        await bot.Page.goto(url.fight.towers, {waitUntil: 'domcontentloaded'});
        await this.bot.Page.waitForSelector('div > a', { timeout: 30000, visible: true });
        this.locations = new Map;
        this.fightButtons = new Map;
    }
}

