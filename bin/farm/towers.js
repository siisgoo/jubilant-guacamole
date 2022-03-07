"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmTowers = void 0;
var events_1 = require("events");
var utils_js_1 = require("./../utils.js");
var config_json_1 = require("./../config.json");
// ░█▀▀░█▀█░█▀▄░█▄█░░░▀█▀░█▀█░█░█░█▀▀░█▀▄░█▀▀
// ░█▀▀░█▀█░█▀▄░█░█░░░░█░░█░█░█▄█░█▀▀░█▀▄░▀▀█
// ░▀░░░▀░▀░▀░▀░▀░▀░░░░▀░░▀▀▀░▀░▀░▀▀▀░▀░▀░▀▀▀
var TowerLocs = ["Карaкорум, стoлицa Юга", "столица г. Мидгард",
    "Курган",
    "Лагерь орды",
    "Устье реки",
    "Горнoе озеро",
    "Южная пустошь",
    "Мароканд",
    "Мертвый город , Юг",
    "Земли титанов , Юг",
    "Долина стражей , Юг"];
var isTowerLoc = function (locStr) { return TowerLocs.some(function (elem) { return elem === locStr; }); };
/**
 * Signals:
 *  NeedRest - on energy or health is zero
 *  ItemBroken - on some item has been broken
 *  NewItem - on new item collected
 *  RackFull - on rack is full
 *  RackBetter - collected item is better then weared
 */
var FarmTowers = /** @class */ (function (_super) {
    __extends(FarmTowers, _super);
    function FarmTowers() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._callback = function (bot) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bot.Page.goto(config_json_1.url.fight.towers, { waitUntil: 'domcontentloaded' })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        }); }); };
        return _this;
    }
    Object.defineProperty(FarmTowers.prototype, "callback", {
        get: function () { return this._callback; },
        enumerable: false,
        configurable: true
    });
    FarmTowers.prototype.Initialize = function (bot) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.bot = bot;
                        return [4 /*yield*/, bot.Page.goto(config_json_1.url.fight.towers, { waitUntil: 'domcontentloaded' })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.bot.Page.waitForSelector('div > a', { timeout: 10000, visible: true })];
                    case 2:
                        _a.sent();
                        this.locations = new Map;
                        this.fightButtons = new Map;
                        return [2 /*return*/];
                }
            });
        });
    };
    FarmTowers.prototype.execute = function (settings, itemSettings) {
        return __awaiter(this, void 0, void 0, function () {
            var stats, _a, currentLocation, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 19, , 20]);
                        (0, utils_js_1.logMessage)("Start fight step");
                        return [4 /*yield*/, this.bot.scrapCurentHeroStats()];
                    case 1:
                        stats = _b.sent();
                        (0, utils_js_1.logMessage)(JSON.stringify(stats));
                        return [4 /*yield*/, this.scrapContext()];
                    case 2:
                        _b.sent();
                        if (this.sel.size <= 0) {
                            throw new Error("No nawigation buttions");
                        }
                        if (!(stats.energy === 0 || stats.health === 0)) return [3 /*break*/, 5];
                        (0, utils_js_1.logMessage)("Low health or energy", utils_js_1.LoggingLevel.Trace);
                        _a = itemSettings.useBottle === true;
                        if (!_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.useBottle()];
                    case 3:
                        _a = (_b.sent());
                        _b.label = 4;
                    case 4:
                        // use bottle
                        if (_a) {
                            (0, utils_js_1.logMessage)("Exiging farm for healing");
                            return [2 /*return*/]; //exit for new iteration
                        }
                        else { // go rest
                            (0, utils_js_1.logMessage)("Health is low, resting...");
                            this.emit('NeedRest', this);
                            return [2 /*return*/]; // reload
                        }
                        _b.label = 5;
                    case 5: return [4 /*yield*/, this.bot.Page.$eval('div > h1 > span', function (el) { return el.textContent; })];
                    case 6:
                        currentLocation = _b.sent();
                        if (!(currentLocation === "Карaкорум, стoлицa Юга"
                            || currentLocation === "столица г. Мидгард")) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.scrapNearLocations()];
                    case 7:
                        _b.sent();
                        (0, utils_js_1.logMessage)("Going from capital...");
                        return [4 /*yield*/, this.goToLocation(this.heroPreferedLocation())];
                    case 8:
                        _b.sent();
                        return [2 /*return*/];
                    case 9: return [4 /*yield*/, this.scrapFightButtons()];
                    case 10:
                        _b.sent();
                        if (!this.fightButtons.has('Berserk')) return [3 /*break*/, 12];
                        (0, utils_js_1.logMessage)("Activating berserk ability...");
                        return [4 /*yield*/, (0, utils_js_1.SmartClick)(this.fightButtons.get('Berserk'))];
                    case 11:
                        _b.sent();
                        return [3 /*break*/, 18];
                    case 12:
                        if (!this.fightButtons.has('HitTower')) return [3 /*break*/, 14];
                        (0, utils_js_1.logMessage)("Hitting tower...");
                        return [4 /*yield*/, (0, utils_js_1.SmartClick)(this.fightButtons.get('HitTower'))];
                    case 13:
                        _b.sent();
                        return [3 /*break*/, 18];
                    case 14:
                        if (!this.fightButtons.has('FinishOff')) return [3 /*break*/, 16];
                        (0, utils_js_1.logMessage)("Hitting enemy...");
                        return [4 /*yield*/, (0, utils_js_1.SmartClick)(this.fightButtons.get('FinishOff'))];
                    case 15:
                        _b.sent();
                        return [3 /*break*/, 18];
                    case 16:
                        if (!this.fightButtons.has('Hit')) return [3 /*break*/, 18];
                        (0, utils_js_1.logMessage)("Hitting...");
                        return [4 /*yield*/, (0, utils_js_1.SmartClick)(this.fightButtons.get('Hit'))];
                    case 17:
                        _b.sent();
                        _b.label = 18;
                    case 18:
                        this.bot.Page.waitForNetworkIdle({ timeout: 10000 });
                        this.sel.clear();
                        (0, utils_js_1.logMessage)("End fight step" + '\n');
                        return [3 /*break*/, 20];
                    case 19:
                        err_1 = _b.sent();
                        (0, utils_js_1.logMessage)(err_1, utils_js_1.LoggingLevel.Fatal);
                        throw new Error("Error occured while fighting: " + err_1);
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    FarmTowers.prototype.heroPreferedLocation = function () {
        var ret;
        var level = this.bot.Level;
        console.log(level);
        if (level > 44) {
            ret = TowerLocs[9];
        }
        else if (level > 39) {
            ret = TowerLocs[8];
        }
        else if (level > 30) {
            ret = TowerLocs[7];
        }
        else if (level > 19) {
            ret = TowerLocs[6];
        }
        else if (level > 13) {
            ret = TowerLocs[5];
        }
        else if (level > 8) {
            ret = TowerLocs[4];
        }
        else if (level > 2) {
            ret = TowerLocs[3];
        }
        else if (level > 0) {
            ret = TowerLocs[2];
        }
        else {
            throw new Error("Passed level: " + level + " not in avalible range");
        }
        return ret;
    };
    FarmTowers.prototype.scrapContext = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, utils_js_1.logMessage)("Scrumming context");
                        _a = this;
                        _b = Set.bind;
                        return [4 /*yield*/, this.bot.Page.$$('div > a.flhdr')];
                    case 1:
                        _a.sel = new (_b.apply(Set, [void 0, _c.sent()]))();
                        return [2 /*return*/];
                }
            });
        });
    };
    FarmTowers.prototype.scrapNearLocations = function () {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c, el, text, e_1_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.locations.clear();
                        (0, utils_js_1.logMessage)("Scrumming nearby locations");
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 7, 8, 13]);
                        _b = __asyncValues(this.sel);
                        _d.label = 2;
                    case 2: return [4 /*yield*/, _b.next()];
                    case 3:
                        if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 6];
                        el = _c.value;
                        return [4 /*yield*/, el.getProperty('innerText').then(function (prop) { return prop.jsonValue(); })];
                    case 4:
                        text = _d.sent();
                        if (isTowerLoc(text)) {
                            this.locations.set(text, el);
                        }
                        _d.label = 5;
                    case 5: return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _d.trys.push([8, , 11, 12]);
                        if (!(_c && !_c.done && (_a = _b.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _a.call(_b)];
                    case 9:
                        _d.sent();
                        _d.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    FarmTowers.prototype.goToLocation = function (loc) {
        return __awaiter(this, void 0, void 0, function () {
            var page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.locations.has(loc) === false) {
                            // programming error
                            throw new Error("Cannot go to location");
                        }
                        page = this.bot.Page;
                        (0, utils_js_1.logMessage)("Going to other location");
                        return [4 /*yield*/, (0, utils_js_1.SmartClick)(this.locations.get(loc))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // scrap beat buttons and ability buttons
    FarmTowers.prototype.scrapFightButtons = function () {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c, el, text, inner, e_2_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.fightButtons.clear();
                        (0, utils_js_1.logMessage)("Scrum fight buttons");
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 11, 12, 17]);
                        _b = __asyncValues(this.sel);
                        _d.label = 2;
                    case 2: return [4 /*yield*/, _b.next()];
                    case 3:
                        if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 10];
                        el = _c.value;
                        return [4 /*yield*/, el.getProperty('innerText').then(function (el) { return el.jsonValue(); })];
                    case 4:
                        text = _d.sent();
                        if (!("Бить врагов" === text)) return [3 /*break*/, 5];
                        this.fightButtons.set('Hit', el);
                        return [3 /*break*/, 9];
                    case 5:
                        if (!/Добивать /.test(text)) return [3 /*break*/, 6];
                        this.fightButtons.set('FinishOff', el);
                        return [3 /*break*/, 9];
                    case 6:
                        if (!("Бить " === text)) return [3 /*break*/, 8];
                        return [4 /*yield*/, el.$eval('span', function (e) { return e.textContent; })];
                    case 7:
                        inner = _d.sent();
                        if (inner == "башню") {
                            this.fightButtons.set('HitTower', el);
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        if ("Бepcepк (гoтoво)" === text) {
                            this.fightButtons.set('Berserk', el);
                        }
                        _d.label = 9;
                    case 9: return [3 /*break*/, 2];
                    case 10: return [3 /*break*/, 17];
                    case 11:
                        e_2_1 = _d.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 17];
                    case 12:
                        _d.trys.push([12, , 15, 16]);
                        if (!(_c && !_c.done && (_a = _b.return))) return [3 /*break*/, 14];
                        return [4 /*yield*/, _a.call(_b)];
                    case 13:
                        _d.sent();
                        _d.label = 14;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        if (e_2) throw e_2.error;
                        return [7 /*endfinally*/];
                    case 16: return [7 /*endfinally*/];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    FarmTowers.prototype.useBottle = function () {
        var e_3, _a;
        return __awaiter(this, void 0, void 0, function () {
            var button, _b, _c, el, text, inner, e_3_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        (0, utils_js_1.logMessage)("Trying use bottle");
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 8, 9, 14]);
                        _b = __asyncValues(this.sel);
                        _d.label = 2;
                    case 2: return [4 /*yield*/, _b.next()];
                    case 3:
                        if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 7];
                        el = _c.value;
                        return [4 /*yield*/, el.getProperty('innerText').then(function (el) { return el.jsonValue(); })];
                    case 4:
                        text = _d.sent();
                        if (!/Пить бутылочку */.test(text)) return [3 /*break*/, 6];
                        return [4 /*yield*/, el.$eval('span', function (e) { return e.textContent; })];
                    case 5:
                        inner = _d.sent();
                        if (/\(*шт\.\)/.test(inner)) {
                            button = el;
                            return [3 /*break*/, 7];
                        }
                        _d.label = 6;
                    case 6: return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 14];
                    case 8:
                        e_3_1 = _d.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 14];
                    case 9:
                        _d.trys.push([9, , 12, 13]);
                        if (!(_c && !_c.done && (_a = _b.return))) return [3 /*break*/, 11];
                        return [4 /*yield*/, _a.call(_b)];
                    case 10:
                        _d.sent();
                        _d.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        if (e_3) throw e_3.error;
                        return [7 /*endfinally*/];
                    case 13: return [7 /*endfinally*/];
                    case 14:
                        if (!button) return [3 /*break*/, 16];
                        (0, utils_js_1.logMessage)("Using bottle...");
                        return [4 /*yield*/, (0, utils_js_1.SmartClick)(button)];
                    case 15:
                        _d.sent();
                        return [2 /*return*/, true];
                    case 16:
                        (0, utils_js_1.logMessage)("No bottle charges, go rest", utils_js_1.LoggingLevel.Trace);
                        return [2 /*return*/, false];
                }
            });
        });
    };
    return FarmTowers;
}(events_1.EventEmitter));
exports.FarmTowers = FarmTowers;
