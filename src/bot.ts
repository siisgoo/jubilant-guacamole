import * as puppeteer from 'puppeteer'
import { Item, ItemManager, Rarity } from './items.js';
import { logMessage, LoggingLevel, randomizeSleep, sleep } from './utils.js';
import { ResourceManager } from './resourcesManager.js';
import * as Farm  from './farm.js';
import { EventEmitter } from 'events';

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
    objective: Farm.AvalibleStrategy_t;
    settings: Farm.FarmSettings;
}

export interface BotSettings {
    stepInterval: number;
    randomize:    number;

    auth:    BotAuthSettings;
    session: BotSessionSettings;
    items:   BotItemsSettings;
    farm:    BotFarmSettings;
};

const DefaulBotSettings: BotSettings = {
    stepInterval:      1000,
    randomize:         500,

    // use it split?
    auth: {
        login: "",
        password: "",
    },

    session: {
        sessionTime:       1000*60*60,
        sessionResumeTime: 1000*60*10,
    },

    items: {
        useBottle: true,
        breakItems: true,
        breakLevel: 5,
        breakRarity: 'cooper',
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

export class HeroBot extends EventEmitter {
    private running:   boolean;
    private inited:    boolean;
    private settings:  BotSettings;
    private abilities: Ability[];

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

    public strategy: Farm.AvalibleStrategy_t;

    private page: puppeteer.Page;

    constructor(private browser: puppeteer.Browser,
        l_settings)
    {
        super();
        this.running = false;
        this.inited = false;
        this.settings = { ...DefaulBotSettings, ...l_settings };
    }

    deconstructor() {
        this.Dispose(); // its asynk, ok?
    }

    get Page() { return this.page; }

    get ConflictSide() { return this.conflictSide; }
    get Level()     { return this.level; }
    get Abilities() { return this.abilities; }
    get Items()     { return this.items; }
    get Resources() { return this.items; }

    private async farmLoop(instance: HeroBot, preferedObjective: Farm.FarmStrategy) {
        await Promise.all([
            preferedObjective.execute(instance.settings.farm.settings,
                                      instance.settings.items)
        ]);

        if (instance.running === true) {
            await setTimeout(instance.farmLoop,
                       randomizeSleep(instance.settings.stepInterval, instance.settings.randomize),
                       instance, preferedObjective);
        } else {
            logMessage("Stoping farming");
            instance.emit('stoped');
        }
    }

    private async doHeroRest(callback: Farm.StrategyCallback, bot: HeroBot, farmObj) {
    }

    // first do daliy quests
    // and go farm specified "dungeon"
    // by default farm towers
    public async Run() {
        if (!this.inited) {
            await this.Initialize();
        } else if (this.running === true) {
            return;
        }

        logMessage("Bot running with step interval: " + this.settings.stepInterval
                   + " randomized by: " + this.settings.randomize);

        this.running = true;
        this.emit('started');

        // Farm daily


        // Farm dungeons

        let obj = Farm.Strategies.get(this.settings.farm.objective)
        await obj.Initialize(this);

        obj.on('NeedRest', (callback: Farm.StrategyCallback, //return to farm callback
                            farmObj: Farm.FarmStrategy) =>
            {
                this.Stop();

                // wait for farm stoped
                this.once('stoped', async () => {
                    // go to menu and fetch stats
                    await this.scrumHeroInfo();
                    console.log(this);

                    // let wait: number = randomizeSleep(this.settings.stepInterval +
                    //                                       Number(Math.max(this.health * this.regeneration/180 * 1000,
                    //                                       this.energy * this.regeneration/60 * 1000).toFixed()),
                    //                                   this.settings.randomize);
                    let wait: number = this.settings.stepInterval +
                                                          Number(Math.max(this.health * 1000 / (this.regeneration/180),
                                                          this.energy * 1000 / (this.regeneration/60)).toFixed())

                    logMessage("Start resting for: " + wait)

                    setTimeout(() => {
                        callback(this).then(() => {
                            this.running = true;
                            this.emit('started');
                            this.farmLoop(this, farmObj); // start
                        })
                    }, wait);

                });
            }
        );

        // obj.on('DailyRunOut', () => 0);

        try {
            this.farmLoop(this, obj);
        } catch (e) {
            logMessage(e, LoggingLevel.Error)
        }
    }

    public async Dispose() {
        this.inited = false;
        await this.Stop();
        await this.page.close();
    }

    public Stop() {
        this.running = false;
    }

    public async scrumCurentHeroStats() {
        return await this.page.$$eval('table > tbody > tr > td > span', (vals) =>
            vals.map((val)=>Number(val.textContent)))
            .then((stats) => {
                return { health: stats[0], energy: stats[1], }
            });
    }

    public async scrumHeroInfo() {
        try {
            await this.page.goto(url.main_menu); //exit from fight handle
            await this.page.goto(url.hero.main, {waitUntil: 'domcontentloaded'});
            await this.page.content();

            // id
            let target = await this.page.$$eval('a', (href) => href[0].toString());
            this.id = Number(new URL(target).pathname.split('/')[3]);

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

                    console.log('"' + res[0].toString() + '"')
                    console.log('"' + res[1].toString() + '"')

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

            // items
            // await this.items.Update();

            // resources
            // await this.resources.Update();

            this.emit('hero_info_scrumed');

        } catch (err) {
            this.emit('hero_info_scrum_failed')
            logMessage(err, LoggingLevel.Fatal);
            throw new Error("Hero info scrum failed. Reason: " + err);
        }
    }

    private async initializePage() {
        try {
            this.page = await this.browser.newPage();

            // TODO
            await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36')

            await this.page.setDefaultNavigationTimeout(500000);
            await this.page.on('dialog', async (dialog: puppeteer.Dialog) => {
                await dialog.accept();
            });
            await this.page.on('error', function(err) {
                const errorMessage = err.toString();
                logMessage('browser error: '+ errorMessage, LoggingLevel.Fatal)
            });
            await this.page.on('pageerror', function(err) {
                const errorMessage = err.toString();
                logMessage('browser page error: ' + errorMessage, LoggingLevel.Fatal)
            });

            this.emit('page_initialized');
        } catch(err) {
            logMessage(err, LoggingLevel.Fatal)
            this.emit('page_initialization_failed');
            throw new Error("Page initialization error. Reason: " + err);
        }
    }

    private async doLogin() {
        try {
            await this.page.goto(url.login, {waitUntil: 'load'});

            await this.page.waitForSelector('input[value="Войти"]')
                .then(() => this.page.focus('input[name="login"]'))
                .then(() => this.page.type('input[name="login"]', this.settings.auth.login))
                .then(() => this.page.focus('input[name="password"]'))
                .then(() => this.page.type('input[name="password"]', this.settings.auth.password))
                .then(() => this.page.click('input[value="Войти"]'))
                .then(() => this.page.waitForTimeout(1000))
                .then(async () =>
                {
                    await this.page.waitForSelector('a[href="user"]', { visible: true, timeout: 3000 })
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

    public Initialize() {
        if (this.inited === true) {
            throw new Error("Attempt to reinitialize HeroBot.");
            return;
        }

        this.once('page_initialized', () => {
            this.doLogin();
        });

        this.once('logined', () => {
            this.scrumHeroInfo();
        })

        this.once('hero_info_scrumed', () => {
            this.inited = true;
            this.emit('ready');
        })

        this.once('login_failed', () => {
            this.Dispose();
        })

        // entry point
        this.initializePage();
    }

};

export default HeroBot;
