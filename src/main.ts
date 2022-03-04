// Header ...
//
//
//
//
//
//

import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import { HeroBot } from './bot.js';
import { logMessage, LoggingLevel } from './utils.js';

import { accounts, config } from "./config.json";

let Bots: Set<HeroBot> = new Set<HeroBot>();

let puppeteereteer_options: puppeteer.BrowserLaunchArgumentOptions = {
    headless: config.puppeteer.headless,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
    ],
};

//better check mime
if (fs.statSync(config.puppeteer.Chromium).isFile()) {
    puppeteereteer_options['executablePath'] = config.puppeteer.Chromium;
}

async function go() {
    try {
        const browser = await puppeteer.launch(puppeteereteer_options);

        accounts.forEach(account => {
            let l_bot: HeroBot = new HeroBot(browser, account);

            l_bot.once('logined', function() {
                logMessage("Account \"" + JSON.stringify(this.settings.auth) + "\" has been logined successfuly", LoggingLevel.Debug);
            });

            l_bot.once('ready', function() {
                this.Run();
            })

            l_bot.once('login_failed', function(err) {
                logMessage("Account: " + this + " cant login. Reason: " + err, LoggingLevel.Error);
            });

            l_bot.Initialize();
            Bots.add(l_bot);
        });
    } catch (e) {
        logMessage(e, LoggingLevel.Fatal);
    }
}

go();
