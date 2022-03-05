import * as puppeteer from 'puppeteer';

import { url } from "./config.json";

// add buy/sell
export class ResourceManager {
    // private diamod:  number;
    // private gold:    number;
    private silver:  number;

    private mithril: number;
    private iron:    number;
    private bottles: number;

    private arenaPoints:  number;
    private fieldsPoints: number;
    private talentPoints: number;

    // get Diamod()  { return this.diamod; }
    // get Gold()    { return this.gold; }
    get Silver() { return this.silver; }

    get Bottles()  { return this.bottles; }
    get Migthril() { return this.mithril; }
    get Iron()     { return this.iron; }

    get ArenaPoints()  { return this.arenaPoints; }
    get FieldsPoints() { return this.fieldsPoints; }
    get TalentPoints() { return this.talentPoints; }

    public async scrap(page: puppeteer.Page): Promise<void> {
        await page.goto(url.main_menu);// handle exit from battle
        await page.goto(url.hero.resources, { waitUntil: 'domcontentloaded' });

        let sel = await page.$$('div > span');

        // remove stats
        sel.splice(0, 1);

        this.bottles = await sel[0].jsonValue();
        this.iron    = await sel[1].jsonValue();
        this.mithril = await sel[2].jsonValue();

        this.arenaPoints  = await sel[3].jsonValue();
        this.fieldsPoints = await sel[4].jsonValue();
        this.talentPoints = await sel[5].jsonValue();

        await page.goto(url.hero.main, { waitUntil: 'domcontentloaded' });

        this.silver = await page.$eval('span.money > span', el => Number(el.textContent));
    }

};
