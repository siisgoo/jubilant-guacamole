import * as puppeteer from 'puppeteer';

const StorageMaxSize: number = 20;

export type StorageType =
    'Rack'|'Store'|'Equipment';

// its all???
export type ItemType =
    'Helmet'|'Braclet'|'Armor'|'Medal'|'Boots'|'Sword'|'Underwear';

// TODO add all
export type Rarity = "epic" | "rare" | "green" | "cooper";

export class Item {
    private level:      number;
    private name:       string;
    private durability: number;
    private storType:   StorageType;
    private type:       ItemType;
    private rarity:     Rarity;

    private wearBtn:  puppeteer.ElementHandle;
    private moveBtn:  puppeteer.ElementHandle;
    private breakBtn: puppeteer.ElementHandle;

    public async move(storage: StorageType) {
        if (storage === this.storType) {
            return;
        }

        switch (storage) {
            case "Rack":
                break;
            case "Store":
                break;
            case "Equipment":
                break;
        }
    }

    public break() {

    }

    public repair() {

    }
};

export class ItemManager {
    private items: Array<Item>;

    private maxRackSize: number;
    private maxStoreSize: number;

    get Items() { return this.items; }

    public async Initialize() {
        ;
    }

    public async Update() {
        ;
    }

    public async repairAll() {

    }

    // break items if its level <= lvl
    public async breakByLevel(lvl: number) {

    }
};
