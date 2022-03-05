import * as puppeteer from 'puppeteer';
export declare type StorageType = 'Rack' | 'Store' | 'Equipment';
export declare type ItemType = 'Helmet' | 'Braclet' | 'Armor' | 'Medal' | 'Boots' | 'Sword' | 'Underwear';
export declare type Rarity = "unknown" | "epic" | "rare" | "green" | "cooper";
export declare type ItemAssign = "Personal" | "New";
export interface Item {
    level: number;
    assign: ItemAssign;
    name: string;
    durability: number;
    better: number;
    storType: StorageType;
    type: ItemType;
    rarity: Rarity;
}
export declare let ItemManager: {
    scrum: (page: puppeteer.Page) => Promise<void>;
    getItems: () => Item[];
    clear: () => void;
    repair: () => Promise<void>;
    breakAll: (lvl: number) => Promise<void>;
};
