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

        await page.$$eval('div > span', e => e.map(el => Number(el.textContent)))
        .then(sel => {
            this.bottles = sel[0];
            this.iron    = sel[1];
            this.mithril = sel[2];

            this.arenaPoints  = sel[3];
            this.fieldsPoints = sel[5];
            this.talentPoints = sel[6];
        });


        await page.goto(url.hero.main, { waitUntil: 'domcontentloaded' });

        this.silver = await page.$eval('span.money > span', el => Number(el.textContent));
    }

};
