export declare type StorageType = 'Unknown' | 'Rack' | 'Store' | 'Equipment';
declare let ItemTypeArray: string[];
export declare type ItemType = typeof ItemTypeArray[number];
export declare type Rarity = "unknown" | "epic" | "rare" | "green" | "cooper";
export declare type ItemAssign = "Personal" | "New" | "Trophy";
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
export {};
