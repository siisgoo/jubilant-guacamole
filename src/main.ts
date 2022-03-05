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

  // ░▀▀█░█░█░█▀▄░▀█▀░█░░░█▀█░█▀█░▀█▀░░░░░█▀▀░█░█░█▀█░█▀▀░█▀█░█▄█░█▀█░█░░░█▀▀
  // ░░░█░█░█░█▀▄░░█░░█░░░█▀█░█░█░░█░░▄▄▄░█░█░█░█░█▀█░█░░░█▀█░█░█░█░█░█░░░█▀▀
  // ░▀▀░░▀▀▀░▀▀░░▀▀▀░▀▀▀░▀░▀░▀░▀░░▀░░░░░░▀▀▀░▀▀▀░▀░▀░▀▀▀░▀░▀░▀░▀░▀▀▀░▀▀▀░▀▀▀
  //                ░█▀▄░█▀█░█▀▄░█▀▄░█▀█░█▀▄░█▀▀░░░█▀▄░█▀█░▀█▀
  //                ░█▀▄░█▀█░█▀▄░█▀▄░█▀█░█▀▄░▀▀█░░░█▀▄░█░█░░█░
  //                ░▀▀░░▀░▀░▀░▀░▀▀░░▀░▀░▀░▀░▀▀▀░░░▀▀░░▀▀▀░░▀░

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

async function setupPage(page: puppeteer.Page): Promise<puppeteer.Page> {
    try {
        // TODO
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36')

        await page.setDefaultNavigationTimeout(500000);
        await page.on('dialog', async (dialog: puppeteer.Dialog) => {
            await dialog.accept();
        });
        await page.on('error', function(err) {
            const errorMessage = err.toString();
            logMessage('browser error: '+ errorMessage, LoggingLevel.Fatal)
        });
        await page.on('pageerror', function(err) {
            const errorMessage = err.toString();
            logMessage('browser page error: ' + errorMessage, LoggingLevel.Fatal)
        });
    } catch(err) {
        logMessage(err, LoggingLevel.Fatal)
        throw new Error("Page initialization error. Reason: " + err);
    }

    return page;
}

function setupBot(page: puppeteer.Page, settings): HeroBot {
    let bot = new HeroBot(page, settings);
    bot.once('logined', function() {
        logMessage("Account \"" + JSON.stringify(this.settings.auth) + "\" has been logined successfuly", LoggingLevel.Debug);
    });

    bot.once('login_failed', function(err) {
        logMessage("Account: " + this + " cant login. Reason: " + err, LoggingLevel.Error);
    });

    return bot;
}

interface Executor {
    run();
}

interface Manager {
    accounts: any[];
    run();
    stop();
}

class MultiBrowser implements Manager {
    private running: boolean;

    accounts: any[];

    constructor(accounts: any[], parallel: number) {

    }

    run() {

    }

    stop() {

    }
}

class Sequential implements Manager {
    private browser: puppeteer.Browser;
    private running: boolean;

    accounts: any[];

    constructor(accounts: any[]) {
        this.running = false;
        this.accounts = accounts;

    }

    private handleLoop(n: number) {
        this.browser.newPage().then(page => {
            setupPage(page)
            .then(page => setupBot(page, this.accounts[n]))
            .then(bot => {
                bot.on('loggined', () => bot.Run());
                bot.on('Resting', () => {
                    bot.Stop()
                    bot.Dispose();
                    this.handleLoop((n === this.accounts.length) ? n+1 : 0);
                })
            });
        })
    }

    run() {
        if (this.running) {
            logMessage("Cant start manager: Manager already runnging");
            return;
        }

        if (this.accounts.length === 1) {
            // this.bots[0].Run();
            return;
        }

        this.running = true;

        this.handleLoop(0);
    }

    stop() {
        this.running = false;
    }
}

let manager: Manager;

switch (config.multyAccount.parallelismPolicy) {
    case "Sequental":
        manager = new Sequential(accounts);
        break;
    case "MultiBrowser":
        logMessage("Multi browser policy not implemented yet");
        break;
    default:
        logMessage("Unknown multi account policy set: " + config.multyAccount.parallelismPolicy,
                   LoggingLevel.Fatal);
        break;
}

if (manager) {
    manager.run();
} else {
    logMessage("Terminating...");
}
