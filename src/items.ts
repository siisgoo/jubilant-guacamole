import * as puppeteer from 'puppeteer';
import { EventEmitter } from 'events';
import { SmartClick, logMessage, LoggingLevel, randomizeSleep, sleep } from './utils.js';
import { HeroBot } from './bot.js';

import { url } from "./config.json";

var ProgressBar = require('progress');

type page_t = puppeteer.Page;
export type StorageType = 'Unknown'|'Rack'|'Storage'|'Equipment';

// TODO add all
export type Rarity = 'unknown' | 'epic' | 'rare' | 'uncommon' | 'common';
export type ItemAssign = 'Personal' | 'New' | 'Trophy';

let ItemTypeArray = ['Unknown', 'Helmet', 'Braclet', 'Armor', 'Medal', 'Boots', 'Wapon', 'Belt', 'Cape', 'Gloves', 'Pants', 'Ring', 'Scapular'];
export type ItemType = typeof ItemTypeArray[number];

export class Item {
    ownerID:    number;
    level:      number;
    assign:     ItemAssign;
    durability: number; // percents
    storeType:  StorageType;
    rarity:     Rarity;
    type:       ItemType;
    better:     number;
    brakePrice: number;

    private inited: boolean;

    // TODO
    private parseAssign(txt: string): ItemAssign {
        switch (txt) {
            case 'личный':    return 'Personal'
            case 'новый':     return 'New';
            case 'трофейный': return 'Trophy'; //TODO its sutaible name??
            default: return 'New';
        }
    }

    private parseRarity(txt: string): Rarity {
        switch (txt) {
            case 'эпический': return 'epic';
            case 'необычный': return 'uncommon';
            case 'обычный':   return 'common';
            case 'редкий':    return 'rare';
            default: return 'unknown'
        }
    }

    private parseItemType(txt: string): ItemType {
        switch (txt) {
            case 'Оружие':     return 'Wapon';
            case 'Шлем':       return 'Helmet';
            case 'Браслеты':   return 'Braclet';
            case 'Пояс':       return 'Belt';
            case 'Накидка':    return 'Cape';
            case 'Амулет':     return 'Medal';
            case 'Обувь':      return 'Boots';
            case 'Броня':      return 'Armor';
            case 'Перчатки':   return 'Gloves'
            case 'Штаны':      return 'Pants';
            case 'Кольцо':     return 'Ring';
            case 'Наплечники': return 'Scapular';
            default: return 'Unknown';
        }
    }

    private parseStorageType(txt: string): StorageType {
        switch (txt) {
            case 'в рюкзак': return 'Rack';
            case 'надеть':   return 'Equipment';
            case 'в сундук': return 'Storage';
            default: return 'Unknown';
        }
    }

    constructor(public id: number) {
        this.inited = false;
    }

    get url() { return url.hero.item + this.id }

    async move(page: page_t, store: StorageType) {
        if (!this.inited) {
            throw new Error('Attempt to move uninit Item');
        }

    }

    async break(page: page_t) {
        if (!this.inited) {
            throw new Error('Attempt to break uninit Item');
        }

        // if (this.durability )
    }

    async repair(page: page_t) {
        if (!this.inited) {
            throw new Error('Attempt to break uninit Item');
        }

        if (this.durability != 100) {
            logMessage('Repairing item: ' + JSON.stringify(this))
            await page.goto(this.url, {waitUntil: 'domcontentloaded'});
            await page.$('div.main > div > div > div > a').then(e => SmartClick(e));
        }
    }

    // must be 100% durability
    // or bag))) TODO xpath
    async wear(page: page_t) {
        if (!this.inited) {
            throw new Error('Attempt to break uninit Item');
        }
        if (this.storeType != 'Equipment') {
            logMessage('Wearing item: ' + JSON.stringify(this))
            await page.goto(this.url, {waitUntil: 'domcontentloaded'});
            await page.$('div.main > div > div > div > a').then(e => SmartClick(e));
        }
    }

    async Scrap(bot: HeroBot) {
        let page = bot.Page;
        this.ownerID = bot.ID;

        await page.goto(this.url, {waitUntil: 'domcontentloaded'});

        this.storeType = await page.$eval('div.main > div > div > div > span > em', el => el.textContent)
                               .then(txt => this.parseStorageType(txt));

        const itemInfoCtx = (await page.$$('div > table > tbody > tr')).slice(1)[0];

        await itemInfoCtx.$$('td > div')
        .then(async ctx => {
            await ctx[1].$$('span').then(async s => {
                this.rarity = this.parseRarity(await s[0].getProperty('innerText').then(e => e.jsonValue()));
                this.assign = this.parseAssign(await s[1].getProperty('innerText').then(e => e.jsonValue()));
            })

            await ctx[2].$('strong').then(async s => {
                this.level = Number(await s.getProperty('innerText').then(e => e.jsonValue()));
            })

            await ctx[2].$('span').then(async s => {
                this.type = this.parseItemType(await s.getProperty('innerText').then(e => e.jsonValue()));
            })
        })

        this.better = 0;
        try {
            const btre = await page.$('div > strong.info');
            if (btre) {
                const txt: string = await btre.getProperty('innerText').then(e => e.jsonValue());
                this.better = Number(txt.match(/\d+/));
            }
        } catch {
        }

        await page.$$eval('div > div > div > strong', e => e.map(el => Number(el.textContent))).then(sel => {
            let pos = (() => {
                    switch (this.type) {
                        case 'Helmet':return 3;
                        case 'Armor':return 3;
                        case 'Medal':return 3;
                        case 'Wapon':return 3;
                        case 'Boots':return 3;
                            return 3;

                        case 'Scapular':return 4;
                        case 'Braclet':return 4;
                        case 'Gloves':return 4;
                        case 'Pants':return 4;
                            return 4;

                        case 'Ring':
                        case 'Belt':
                        case 'Cape':
                            return 5;

                        default: throw new Error("Cannot get item durability if item type unknown!");
                    }
                })()
            pos = pos + (this.better === 0 ? 0 : 1);

            this.durability = (sel[pos]*100)/sel[pos+1];
        })

        this.inited = true;
    }
};

export class ItemManager extends EventEmitter {
    private items: Item[];

    constructor() {
        super();
        this.items = new Array<Item>();
    }

    clear() {
        this.items.splice(this.items.length);
    }

    async break(bot: HeroBot) {
        if (this.items.length === 0) {
            return;
        }

        for await (let itm of this.items) {
            if (itm.level <= bot.Level + bot.Settings.items.breakLevel && itm.storeType != 'Equipment') {
                await itm.break(bot.Page);
            }
        }
    }

    // scap man bag and storage size
    // move if can all to storage
    // break all unneeded items
    async clearSpace(bot: HeroBot) {
        await bot.scrapHeroInfo();

        await this.break(bot);

        await bot.Page.goto(url.hero.rack, {waitUntil: 'domcontentloaded'});
        const rack: string = await bot.Page.$eval('div.main > div.cntr > h1', e => e.textContent);

        const rackUsage: number = Number(rack.match(/\d+/));
        const rackCap: number = Number(rack.match(/\/\d+/)[0].slice(1));

        await bot.Page.goto(url.hero.store, {waitUntil: 'domcontentloaded'});
        const store: string = await bot.Page.$eval('div.main > div.cntr > h1', e => e.textContent);

        const storeUsage: number = Number(store.match(/\d+/));
        const storeCap: number = Number(store.match(/\/\d+/)[0].slice(1));

        if (storeUsage != storeCap) {
            //move
        }

    }

    async repair(bot: HeroBot) {
        if (this.items.length === 0) {
            return;
        }

        for await (let itm of this.items) {
            if (itm.durability != 100) {
                await itm.repair(bot.Page);
            }
        }
    }

    async wearBetter(bot: HeroBot) {
        if (this.items.length === 0) {
            return;
        }

        await this.repair(bot);

        for await (let itm of this.items) {
            if (itm.storeType != 'Equipment' &&
                    itm.level <= bot.Level &&
                    itm.better > 0) {
                await itm.wear(bot.Page);
            }
        }
    }

    async scrap(bot: HeroBot) {
        this.clear();

        await bot.scrapHeroInfo();

        let ids = new Array<number>();

        logMessage('Start founding items')

        for await (let l_url of [ url.hero.store, url.hero.rack, url.hero.equipment+bot.ID ]) {
            await bot.Page.goto(l_url, {waitUntil: 'domcontentloaded'});
            let idsT = await bot.Page.$$eval('div > table > tbody > tr > td > span > a',
                                        el => el.map((e) => Number(e.getAttribute('href').slice(11))));

            // why .filter dont work??
            idsT.forEach(element => {
                if (element !== null) {
                    ids.push(element);
                }
            });
        }

        let pbar = new ProgressBar('Parsing items [:bar] :current/:total', {
            total: ids.length,
            width: 30,
            head: '>',
            complete: '-',
            incomplete: '#',
            stream: process.stdout,
        });

        for await (let id of ids) {
            try {
                let item = new Item(id);
                await item.Scrap(bot);
                this.items.push(item);
            } catch (e) {
                logMessage('Cannot parse item: item ID: ' + id +' Reason: ' + e, LoggingLevel.Error);
            }
            process.stdout.write('\r')
            pbar.tick(1);
        }
    }
}
