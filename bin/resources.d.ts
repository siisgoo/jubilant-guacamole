import * as puppeteer from 'puppeteer';
export declare class ResourceManager {
    private silver;
    private mithril;
    private iron;
    private bottles;
    private arenaPoints;
    private fieldsPoints;
    private talentPoints;
    get Silver(): number;
    get Bottles(): number;
    get Migthril(): number;
    get Iron(): number;
    get ArenaPoints(): number;
    get FieldsPoints(): number;
    get TalentPoints(): number;
    scrum(page: puppeteer.Page): Promise<void>;
}
