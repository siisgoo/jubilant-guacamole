import * as puppeteer from 'puppeteer';

export class ResourceManager {
    private gold: number;
    private silver: number;
    private coal: number;
    private bottles: number;

    constructor(private page: puppeteer.Page)
    {

    }

    get Gold()   { return this.gold; }
    get Silver() { return this.silver; }
    get Coal()   { return this.coal; }

    public async Initialize() {

    }

    public async Update() {

    }

};
