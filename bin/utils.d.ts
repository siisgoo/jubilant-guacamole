import * as puppeteer from 'puppeteer';
export declare enum LoggingLevel {
    Trace = 0,
    Debug = 1,
    Warning = 2,
    Error = 3,
    Fatal = 4
}
export declare function logMessage(msg: string, level?: LoggingLevel): void;
export declare function sleep(ms: number): Promise<unknown>;
export declare function randomizeSleep(cur: any, rand: any): number;
export declare function SmartClick(element: puppeteer.ElementHandle, params?: {
    retries: number;
    idleTime: number;
}): Promise<void>;
