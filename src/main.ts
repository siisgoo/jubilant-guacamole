// Header ...
//
//

// ░▀▀█░█░█░█▀▄░▀█▀░█░░░█▀█░█▀█░▀█▀░░░░░█▀▀░█░█░█▀█░█▀▀░█▀█░█▄█░█▀█░█░░░█▀▀
// ░░░█░█░█░█▀▄░░█░░█░░░█▀█░█░█░░█░░▄▄▄░█░█░█░█░█▀█░█░░░█▀█░█░█░█░█░█░░░█▀▀
// ░▀▀░░▀▀▀░▀▀░░▀▀▀░▀▀▀░▀░▀░▀░▀░░▀░░░░░░▀▀▀░▀▀▀░▀░▀░▀▀▀░▀░▀░▀░▀░▀▀▀░▀▀▀░▀▀▀
//                ░█▀▄░█▀█░█▀▄░█▀▄░█▀█░█▀▄░█▀▀░░░█▀▄░█▀█░▀█▀
//                ░█▀▄░█▀█░█▀▄░█▀▄░█▀█░█▀▄░▀▀█░░░█▀▄░█░█░░█░
//                ░▀▀░░▀░▀░▀░▀░▀▀░░▀░▀░▀░▀░▀▀▀░░░▀▀░░▀▀▀░░▀░

import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import { HeroBot } from './bot.js';
import { logMessage, LoggingLevel } from './utils.js';

import { accounts, config } from "./config.json";

const g_ProgramName = 'jubilant-guacamole';

interface Account {
    login: string,
    password: string,

    settings: null | Object;
}

class Manager {
    protected running: boolean;
    constructor(protected accounts: Account[]) {
        this.running = false;
    }

    protected setupBot(page: puppeteer.Page, account): HeroBot {
        let bot = new HeroBot(page, account.login, account.password, account.settings);

        bot.once('logined', function() {
            logMessage("Account \"" + JSON.stringify(this.settings.auth) + "\" has been logined successfuly", LoggingLevel.Debug);
        });

        bot.once('login_failed', function(err) {
            logMessage("Account: " + this + " cant login. Reason: " + err, LoggingLevel.Error);
        });

        return bot;
    }

    protected async setupPage(page: puppeteer.Page): Promise<puppeteer.Page> {
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

    // returns values:
    //  0 - ok, ready for multy-account setup
    //  1 - no accounts avalible
    //  2 - single account mode
    //  3 - already running
    async run(): Promise<number> {
        let ret = 0;

        if (this.running) {
            logMessage("Cant start manager: Manager already runnging");
            return 3;
        }

        if (this.accounts.length === 0) {
            throw new Error("No accounts to handle");
            ret = 1;
        } else if (this.accounts.length === 1) {
            await puppeteer.launch(config.puppeteer).then((browser) => {
                logMessage("Run in single-account mode");
                browser.newPage()
                    .then(page => this.setupBot(page, this.accounts[0]))
                    .then(bot => bot.on('ready', () => bot.Run()));
            });
            ret = 2
        }

        this.running = true;

        return ret;
    }
}

class MultiBrowser extends Manager {
    constructor(accounts: Account[], parallel: number) {
        super(accounts);
    }

    async run(): Promise<number> {
        return 0;
    }

    stop() {

    }
}

// Run bots sequental in single page
// and in the same browser
class Sequential extends Manager {
    private browser: puppeteer.Browser;

    constructor(accounts: Account[]) {
        super(accounts);
    }

    deconstructor() {
        this.running = false;
    }

    private handleLoop(n: number) {
        if (this.running) {
            this.browser.newPage().then(page => super.setupPage(page)
                .then(page => super.setupBot(page, this.accounts[n]))
                .then(bot => {
                    bot.on('ready', () => bot.Run());
                    bot.on('Resting', () => { // run next
                        let next = ((n+1) == this.accounts.length) ? 0 : (n+1);
                        bot.Stop()
                        bot.Dispose();
                        this.handleLoop(next);
                    })
                })
            )
        }
    }

    // setup multi account handler
    // and run all setuped accounts
    //
    // dummy return
    async run(): Promise<number> {
        return new Promise(resolve => {
            super.run().then(async ret => {
                if (ret === 0) {
                    await puppeteer.launch(config.puppeteer)
                        .then((browser) => {
                            this.browser = browser;
                            logMessage("Run in multi-account mode");
                            this.handleLoop(0);
                        })
                }
                resolve(ret);
            })
        });
    }

    stop() {
        this.running = false;
    }
}

// Entry point

let manager: Manager;

// Manager setup

switch (config.multyAccount.parallelismPolicy) {
    case "Sequential":
        logMessage("Start " + g_ProgramName + " in sequental multi-account policy");
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
