import * as puppeteer from 'puppeteer';
import * as date from 'date-and-time';
import * as fs   from 'fs';

import { config } from "./config.json";

export enum LoggingLevel {
    Trace = 0,
    Debug,
    Warning,
    Error,
    Fatal,
}

function strToLogLevel(str: string): LoggingLevel {
    switch (str) {
        case "Trace":
            return LoggingLevel.Trace;
        case "Debug":
            return LoggingLevel.Debug;
        case "Warning":
            return LoggingLevel.Warning;
        case "Error":
            return LoggingLevel.Error;
        case "Fatal":
            return LoggingLevel.Fatal;
        default:
            throw new Error("Unknown log level: " + str);
    }
}

const g_logginLevel: LoggingLevel = strToLogLevel(config.log_level);
const g_logFile: string = config.log_file;

// do not check write permissions
// TODO rewrite with event arch
export function logMessage(msg: string, level: LoggingLevel = LoggingLevel.Trace) {
    if (level >= g_logginLevel) {
        const ts = new Date;
        const write = "[" + date.format(ts, "HH:mm:ss") + "] - " + msg;
        fs.appendFileSync(g_logFile, write + '\n');
        console.log(write); // make it oprionaly
    }
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function randomizeSleep(cur, rand): number {
    return (cur + Math.random() * (rand)).toFixed();
}

export async function SmartClick(element: puppeteer.ElementHandle,
                                 params: { retries: number, idleTime: number } = { retries: 5, idleTime: 1000 }) {
        const hoverAndClick = async () => {
            return await element!.hover()
                .then(() => {
                    return element!.click();
                })
            .catch(err => {
                if (params.retries <= 0) {
                    throw err;
                }
                params.retries -= 1;
                sleep(params.idleTime).then(hoverAndClick);
            });
    };

    return await hoverAndClick();
}

