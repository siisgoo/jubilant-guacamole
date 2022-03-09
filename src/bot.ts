import * as puppeteer from 'puppeteer'
import { EventEmitter } from 'events';
import { logMessage, LoggingLevel, randomizeSleep, sleep } from './utils.js';

import { Item, Rarity, ItemManager } from './items.js';
import { ResourceManager } from './resources.js';
import { FarmStrategy, FarmStrategyFactory, AvalibleStrategy_t, FarmSettings } from './farm.js';
import { FarmTowers } from './farm/towers.js'
import { FarmDaily } from './farm/daily.js'

import { url } from "./config.json";

// ░█▀▀░█▀█░█▀▄░█▄█░░░█▀▄░█▀█░▀█▀
// ░█▀▀░█▀█░█▀▄░█░█░░░█▀▄░█░█░░█░
// ░▀░░░▀░▀░▀░▀░▀░▀░░░▀▀░░▀▀▀░░▀░


interface BotAuthSettings {
    login:    string;
    password: string;
}

interface BotSessionSettings {
    sessionTime:       number;
    sessionResumeTime: number;
}

export interface BotItemsSettings {
    useBottle: boolean;

    breakItems: boolean;
    breakLevel: number;
    breakRarity: Rarity;
}

interface BotFarmSettings {
    objective: AvalibleStrategy_t;
    settings: FarmSettings;
}

export interface BotSettings {
    stepInterval: number;
    randomize:    number;

    session: BotSessionSettings;
    items:   BotItemsSettings;
    farm:    BotFarmSettings;
};

const DefaulBotSettings: BotSettings = {
    stepInterval:      800, // dont touch plz
    randomize:         1500,

    session: {
        sessionTime:       1000*60*60,
        sessionResumeTime: 1000*60*10,
    },

    items: {
        useBottle: true,
        breakItems: true,
        breakLevel: 5,
        breakRarity: 'common',
    },

    farm: {
        objective: "Towers",
        settings: "Hero",
    },
};


// http://barbars.ru/forum/topic/id/476940/ add from this if need!
export type Ability      = "Berserk" | "Dodge" | "Egergy shild" | "Stone shild" | "Crytomania";
export type ConflictSide = "South" | "North";
export type HeroClass    = "Fighter" | "Healer";

//
// Signals:
//  'logined'
//  'login_failed'
//  'ready'
//  'started'
//  'stoped'
//  'Resting'
export class HeroBot extends EventEmitter {
    private running:   boolean;
    private inited:    boolean;
    private settings:  BotSettings;

    private conflictSide: ConflictSide;
    private heroClass:    HeroClass;

    private resources:    ResourceManager;
    private items:        ItemManager;
    private id:           number;
    private level:        number;
    private strength:     number;
    private health:       number;
    private energy:       number;
    private regeneration: number;
    private armor:        number;
    private summary:      number;

    public strategy: AvalibleStrategy_t;

    private resetTimer: NodeJS.Timeout;
    private farmTimer: NodeJS.Timeout;

    private sessionTimer: NodeJS.Timeout;
    private sessionResumeTimer: NodeJS.Timeout;

    get Settings()     { return this.settings; }
    get Page()         { return this.page; }
    get ConflictSide() { return this.conflictSide; }
    get Level()        { return this.level; }
    get ID()           { return this.id; }
    get Resources()    { return this.resources; }

    constructor(private page: puppeteer.Page,
                private login,
                private password,
                l_settings)
    {
        super();
        this.running = false;
        this.inited = false;
        this.settings = { ...DefaulBotSettings, ...l_settings };

        this.resources = new ResourceManager;
        this.items = new ItemManager;

        // this.sessionTimer = setTimeout(this.onSessionRunout,
        //                                this.settings.session.sessionTime);

        this.Init();
    }



    deconstructor() {
        this.Dispose(); // its asynk, ok?
    }

    public Init() {
        this.once('logined', () => {
            this.scrapHeroInfo();
        })

        this.once('hero_info_scraped', () => {
            this.inited = true;
            this.emit('ready');
        })

        this.once('login_failed', () => {
            this.Dispose();
        })

        this.doLogin();
    }

    // private async onSessionRunout() {
    //     this.emit('SessionRunOut')
    //     this.Stop();
    //     this.Dispose();
    //     this.sessionResumeTimer = setTimeout(() =>
    //         {
    //             this.Init();
    //             this.once('ready', this.Run);
    //             this.emit('SessionResumed')
    //         },
    //         this.settings.session.sessionResumeTime);
    // }

    // Main bot loop
    private async farmLoop(instance: HeroBot, preferedObjective: FarmStrategy) {
        await Promise.all([
            preferedObjective.execute()
        ]);

        if (instance.running === true) {
            instance.farmTimer = await setTimeout(instance.farmLoop,
                       randomizeSleep(instance.settings.stepInterval, instance.settings.randomize),
                       instance, preferedObjective);
        } else {
            logMessage("Stoping farming");
            instance.emit('stoped');
        }
    }

    // first do daliy quests
    // and go farm specified "dungeon"
    // by default farm towers
    public async Run() {
        if (!this.inited) {
            throw new Error("Cant run bot: Bot uninited!");
        } else if (this.running === true) {
            return;
        }

        logMessage("Bot running with step interval: " + this.settings.stepInterval
                   + " randomized by: " + this.settings.randomize);

        this.running = true;
        this.emit('started');

        let obj = FarmStrategyFactory(this.settings.farm.objective, this);
        await obj.Initialize();

        // obj.on('DailyRunOut', () => 0);

        obj.on('NeedRest', (farmObj: FarmStrategy) =>
            {
                this.Stop();

                // wait for farm stoped
                this.once('stoped', async () => {
                    // go to menu and fetch stats
                    await this.scrapHeroInfo();

                    let wait: number = randomizeSleep(this.settings.stepInterval +
                                                      ((this.health === 0) ? this.health * 1000 / (this.regeneration/180) :
                                                      this.energy * 1000 / (this.regeneration/60)),
                                                      this.settings.randomize);

                    logMessage("Start resting for: " + wait)

                    this.emit('Resting');
                    this.resetTimer = setTimeout(() => {
                        farmObj.callback().then(() => {
                            this.running = true;
                            this.emit('started');
                            this.farmLoop(this, farmObj); // start
                        })
                    }, wait);

                });
            }
        );

        obj.on('ItemBroken', (farmObj: FarmStrategy) => {
            this.Stop();
            this.once('stoped', async () => {
                await this.items.clear();
                await this.items.scrap(this);
                await this.items.repair(this);
                farmObj.callback().then(() => {
                    this.running = true;
                    this.emit('started');
                    this.farmLoop(this, farmObj); // start
                })
            })
        });

        obj.on('RackFull', (farmObj: FarmStrategy) => {
            this.Stop();
            this.once('stoped', async () => {
                this.items.clear();
                await this.items.scrap(this);
                await this.items.clearSpace(this);
                farmObj.callback().then(() => {
                    this.running = true;
                    this.emit('started');
                    this.farmLoop(this, farmObj); // start
                })
            })
        });

        obj.on('RackBetter', (farmObj: FarmStrategy) => {
            this.Stop();
            this.once('stoped', async () => {
                this.items.clear();
                await this.items.scrap(this);
                await this.items.wearBetter(this);
                farmObj.callback().then(() => {
                    this.running = true;
                    this.emit('started');
                    this.farmLoop(this, farmObj); // start
                })
            })
        });

        try {
            this.farmLoop(this, obj);
        } catch (e) {
            logMessage(e, LoggingLevel.Error)
        }
    }

    // Close page and set bot object state as uninited
    public async Dispose() {
        this.inited = false;
        this.running = false;
        await this.page.close();
    }

    // Stop main bot loop
    // Imidiatly stops rest timer
    // but dont interapt farm step
    // for get real state of bot, listen 'stoped' signal
    public Stop() {
        this.running = false;
        clearInterval(this.resetTimer);
    }

    // Scrap hp and energy
    public async scrapCurentHeroStats(): Promise<{health: number, energy: number}> {
        return await this.page.$$eval('table > tbody > tr > td > span', (vals) =>
            vals.map((val)=>Number(val.textContent)))
            .then((stats) => {
                return { health: stats[0], energy: stats[1], }
            });
    }

    // Scrap all hero stats exclude invinitory and resources info
    public async scrapHeroInfo(): Promise<void> {
        try {
            await this.page.goto(url.main_menu); //exit from fight handle
            await this.page.goto(url.hero.main, {waitUntil: 'domcontentloaded'});
            await this.page.content();

            // id
            let target = await this.page.$$eval('a', (href) => href.map(e => e.getAttribute('href')));
            target.forEach(e => {
                if (e.match('user/achivements/0/')) {
                    this.id = Number(e.match(/\d+$/));
                }
            })

            // hero stats
            let statSpans: number[] = await this.page.$$eval('div > span[class=""]', (el) =>
                                                     el.map((t)=>Number(t.textContent)));
            this.strength     = statSpans[0];
            this.health       = statSpans[1];
            this.energy       = statSpans[2];
            this.regeneration = statSpans[3];
            this.armor        = statSpans[4];
            this.summary      = statSpans[5];

            // TODO!!!!!
            await this.page.$$eval('div > span', (spans) => spans.map(e => e.textContent))
                .then((res) => {
                    // hero class
                    if (res[0].toString() == "воин") {
                        this.heroClass = "Fighter";
                    } else {
                        this.heroClass = "Healer";
                    }

                    // conflict side
                    if (res[1].toString() == "юг") {
                        this.conflictSide = "South";
                    } else {
                        this.conflictSide = "North";
                    }
                }
            )

            // level
            this.level = await this.page.$$eval('div > b > span', (spans) => Number(spans[1].textContent));

            this.emit('hero_info_scraped');

        } catch (err) {
            this.emit('hero_info_scrap_failed')
            logMessage(err, LoggingLevel.Fatal);
            throw new Error("Hero info scrap failed. Reason: " + err);
        }
    }

    // Login
    private async doLogin() {
        try {
            await this.page.goto(url.login, {waitUntil: 'load'});

            await this.page.waitForSelector('input[value="Войти"]')
                .then(() => this.page.focus('input[name="login"]'))
                .then(() => this.page.type('input[name="login"]', this.login))
                .then(() => this.page.focus('input[name="password"]'))
                .then(() => this.page.type('input[name="password"]', this.password))
                .then(() => this.page.click('input[value="Войти"]'))
                // .then(() => this.page.waitForTimeout(1000))
                .then(async () =>
                {
                    await this.page.waitForSelector('a[href="user"]', { visible: true, timeout: 10000 })
                        .then(() => {
                            this.emit('logined');
                        })
                        .catch(async (err) => {
                            await this.page.close();
                            logMessage("Login failed. Reason: " + err, LoggingLevel.Fatal);
                            this.emit('login_failed', err);
                            throw new Error("Logging failed. Reason: " + err);
                        })
                })
        } catch(err) {
            logMessage(err, LoggingLevel.Fatal)
            throw new Error("Logging error. Reason: " + err);
        }
    }
};

export default HeroBot;
