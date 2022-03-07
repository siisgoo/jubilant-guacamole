/// <reference types="node" />
import * as puppeteer from 'puppeteer';
import { Rarity } from './items.js';
import { ResourceManager } from './resources.js';
import * as Farm from './farm.js';
import { EventEmitter } from 'events';
interface BotSessionSettings {
    sessionTime: number;
    sessionResumeTime: number;
}
export interface BotItemsSettings {
    useBottle: boolean;
    breakItems: boolean;
    breakLevel: number;
    breakRarity: Rarity;
}
interface BotFarmSettings {
    objective: Farm.AvalibleStrategy_t;
    settings: Farm.FarmSettings;
}
export interface BotSettings {
    stepInterval: number;
    randomize: number;
    session: BotSessionSettings;
    items: BotItemsSettings;
    farm: BotFarmSettings;
}
export declare type Ability = "Berserk" | "Dodge" | "Egergy shild" | "Stone shild" | "Crytomania";
export declare type ConflictSide = "South" | "North";
export declare type HeroClass = "Fighter" | "Healer";
export declare class HeroBot extends EventEmitter {
    private page;
    private login;
    private password;
    private running;
    private inited;
    private settings;
    private conflictSide;
    private heroClass;
    private resources;
    private id;
    private level;
    private strength;
    private health;
    private energy;
    private regeneration;
    private armor;
    private summary;
    strategy: Farm.AvalibleStrategy_t;
    private resetTimer;
    private farmTimer;
    private sessionTimer;
    private sessionResumeTimer;
    get Page(): puppeteer.Page;
    get ConflictSide(): ConflictSide;
    get Level(): number;
    get Resources(): ResourceManager;
    constructor(page: puppeteer.Page, login: any, password: any, l_settings: any);
    deconstructor(): void;
    Init(): void;
    private onSessionRunout;
    private farmLoop;
    Run(): Promise<void>;
    Dispose(): Promise<void>;
    Stop(): void;
    scrapCurentHeroStats(): Promise<{
        health: number;
        energy: number;
    }>;
    scrapHeroInfo(): Promise<void>;
    private doLogin;
}
export default HeroBot;
