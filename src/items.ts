import * as puppeteer from 'puppeteer';
import { logMessage, LoggingLevel, randomizeSleep, sleep } from './utils.js';

import { url } from "./config.json";

type page_t = puppeteer.Page;
export type StorageType = 'Rack'|'Storage'|'Equipment';

// TODO add all
export type Rarity = 'unknown' | 'epic' | 'rare' | 'uncommon' | 'common';
export type ItemAssign = 'Personal' | 'New' | 'Trophy';

let ItemTypeArray = ['Unknown', 'Helmet', 'Braclet', 'Armor', 'Medal', 'Boots', 'Wapon', 'Belt', 'Cape', 'Gloves', 'Pants', 'Ring', 'Scapular'];
export type ItemType = typeof ItemTypeArray[number];

export class Item {
    id:         number;
    level:      number;
    assign:     ItemAssign;
    durability: number; // percents
    storType:   StorageType;
    rarity:     Rarity;
    type:       ItemType;
    better:     number;
    brakePrice: number;
};

// TODO
function parseAssign(txt: string): ItemAssign {
    switch (txt) {
        case 'личный': return 'Personal'
        case 'новый': return 'New';
        default: return 'New';
    }
}

function parseRarity(txt: string): Rarity {
    switch (txt) {
        case 'эпический': return 'epic';
        case 'необычный': return 'uncommon';
        case 'обычный': return 'common';
        case 'редкий': return 'rare';
        default: return 'unknown'
    }
}

function parseItemType(txt: string): ItemType {
    switch (txt) {
        case 'Оружие': return 'Wapon';
        case 'Шлем': return 'Helmet';
        case 'Браслеты': return 'Braclet';
        case 'Пояс': return 'Belt';
        case 'Накидка': return 'Cape';
        case 'Амулет': return 'Medal';
        case 'Обувь': return 'Boots';
        case 'Броня': return 'Armor';
        case 'Перчатки': return 'Gloves'
        case 'Штаны': return 'Pants';
        case 'Кольцо': return 'Ring';
        case 'Наплечники': return 'Scapular';
        default: return 'Unknown';
    }
}

async function scrapItemDetails(page: page_t, id: number): Promise<Item> {
    let item: Item = new Item;
    await page.goto(url.hero.item + id, {waitUntil: 'domcontentloaded'});

    let itemInfoCtx = (await page.$$('div > table > tbody > tr')).slice(1);

    await itemInfoCtx[0].$$('td > div')
    .then(async s => {
    })

    await itemInfoCtx[0].$$('td > div')
    .then(async ctx => {
        await ctx[1].$$('span').then(async s => {
            item.rarity = parseRarity(await s[0].getProperty('innerText').then(e => e.jsonValue()));
            item.assign = parseAssign(await s[1].getProperty('innerText').then(e => e.jsonValue()));
        })

        await ctx[2].$('strong').then(async s => {
            item.level = Number(await s.getProperty('innerText').then(e => e.jsonValue()));
        })

        await ctx[2].$('span').then(async s => {
            item.type = parseItemType(await s.getProperty('innerText').then(e => e.jsonValue()));
        })
    })

    try {
        let btre = await page.$('div > strong.info');
        if (btre) {
            let txt: string = await btre.getProperty('innerText').then(e => e.jsonValue());
            item.better = Number(txt.match(/\d+/));
        }
    } catch {
        item.better = 0;
    }

    return item;
}

interface double {
    url: string;
    name: StorageType;
}
export async function findItems(page: page_t, sleepSettings, userId): Promise<Item[]> {
    let items: Item[] = new Array<Item>();

    let arr: Array<double> = new Array<double>();
    arr.push({url: url.hero.rack, name: 'Rack'})
    arr.push({url: url.hero.store, name: 'Storage'})

    for await (let [url, name] of arr) {

    }
        await page.goto(url.hero.rack, {waitUntil: 'domcontentloaded'});

        let ids: Array<number> = new Array();
        let idsT = await page.$$eval('div > table > tbody > tr > td > span > a',
                                    el => el.map((e) => Number(e.getAttribute('href').slice(11))));

        idsT.forEach(element => {
            if (element !== null) {
                ids.push(element);
            }
        });

        for await (let id of ids) {
            logMessage('Parsing item id ' + id)
            try {
                let item = await scrapItemDetails(page, id);
                item.storType = 'Rack';
                items.push(item);
            } catch {
                logMessage('Cannot parse item: item ID: ' + id, LoggingLevel.Error);
            }
            await page.goto(url.hero.rack, {waitUntil: 'domcontentloaded'});
            // await sleep(randomizeSleep(sleepSettings.stepInterval, sleepSettings.randomize));
        }


    let findEquipment = await (async () => {

    })();

    console.log(items);

    return items;
}
