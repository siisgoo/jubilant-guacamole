import * as puppeteer from 'puppeteer';

import { url } from "./config.json";

const StorageMaxSize: number = 20;

export type StorageType = 'Unknown' |
    'Rack'|'Store'|'Equipment';

// its all???
let ItemTypeArray = ['Unknown', 'Helmet', 'Braclet', 'Armor', 'Medal', 'Boots', 'Sword', 'Underwear'];
export type ItemType = typeof ItemTypeArray[number];

// TODO add all
export type Rarity = "unknown" | "epic" | "rare" | "green" | "cooper";
export type ItemAssign = "Personal" | "New" | "Trophy";

export interface Item {
    level:      number;
    assign:     ItemAssign;
    name:       string;
    durability: number;
    better:     number;
    storType:   StorageType;
    type:       ItemType;
    rarity:     Rarity;
};

// async function baseItemParse(sel: puppeteer.ElementHandle) {
//         let assign: ItemAssign;
//         let better = 0;
//         let name: string;
//         let rarity: string;
//         let level;
//         let durability = -1;

//         name = await sel[0].$('a > span').then(el => el.getProperty('innerText').then(e => e.jsonValue()));

//         rarity = await sel[0].$('img').then(el => el.getProperty('src').then(e => e.jsonValue()));
//         switch (rarity)
//         {
//             case "/images/icons/bonusepic.png": rarity = 'epic';
//                 break;
//             case "/images/icons/bonusrare.png": rarity = 'rare';
//                 break;
//             case "/images/icons/bonusgreen.png": rarity = 'green';
//                 break;
//             case "/images/icons/bonuscopper.png": rarity = 'cooper';
//                 break;
//             default: rarity = 'unknown';
//                 break;
//         }

//         let values = await sel[1].$$eval('span > span', els => els.map(el => el.textContent));
//         level = Number(values[0]);
//         if (values[1] === "личный")
//             assign = "Personal";
//         else
//             assign = "New";

//         if (values.length > 2) {
//             better = Number(values[2].match(/\d*/));
//         }

//         return {
//             level:      level,
//             assign:     assign,
//             name:       name,
//             durability: durability,
//             better:     better,
//             storType:   'Unknown',
//             type:       'Unknown', //TODO
//             rarity:     <Rarity> rarity,
//         }
// }

// interface ItemManager {
//     parse(page: puppeteer.Page): Promise<void>;
// }

// export class Equipment implements ItemManager {
//     private items: Item[];

//     constructor() {
//         this.items = new Array;
//     }

//     async parse(page: puppeteer.Page) {
//         this.items.splice(0, this.items.length);

//     }
// }

// export class Rack implements ItemManager {
//     private items: Item[];

//     private async parseItem(el: puppeteer.ElementHandle): Promise<Item> {
//         let sel = await el.$$('span');

//     }

//     async parse(page: puppeteer.Page) {
//         await page.goto(url.hero.rack, {waitUntil: 'domcontentloaded'});
//         let sel = await page.$$('div > table > tbody > tr > td[style="vertical-align:top"]');
//         for await (let el of sel) {
//             this.items.push(await this.parseItem(el));
//         }
//     }

//     async tryPepair(): Promise<void> {

//     }

//     async breakAll(lvl: number): Promise<void> {

//     }

// }
