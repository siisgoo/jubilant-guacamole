"use strict";
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
exports.ItemManager = void 0;
var config_json_1 = require("./config.json");
var StorageMaxSize = 20;
;
function parseItem(el) {
    return __awaiter(this, void 0, void 0, function () {
        var item, sel, _a, _b, _c, rarity, values;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, el.$$('span')];
                case 1:
                    sel = _d.sent();
                    _b = (_a = console).log;
                    return [4 /*yield*/, sel[0].$('a > span').then(function (el) { return el.getProperty('innerText').then(function (e) { return e.jsonValue(); }); })];
                case 2:
                    _b.apply(_a, [_d.sent()]);
                    _c = item;
                    return [4 /*yield*/, sel[0].$('a > span').then(function (el) { return el.getProperty('innerText').then(function (e) { return e.jsonValue(); }); })];
                case 3:
                    _c.name = _d.sent();
                    return [4 /*yield*/, sel[0].$('img').then(function (el) { return el.getProperty('src').then(function (e) { return e.jsonValue(); }); })];
                case 4:
                    rarity = _d.sent();
                    switch (rarity) {
                        case "/images/icons/bonusepic.png":
                            item.rarity = 'epic';
                            break;
                        case "/images/icons/bonusrare.png":
                            item.rarity = 'rare';
                            break;
                        case "/images/icons/bonusgreen.png":
                            item.rarity = 'green';
                            break;
                        case "/images/icons/bonuscopper.png":
                            item.rarity = 'cooper';
                            break;
                        default:
                            item.rarity = 'unknown';
                            break;
                    }
                    return [4 /*yield*/, sel[1].$$eval('span > span', function (els) { return els.map(function (el) { return el.textContent; }); })];
                case 5:
                    values = _d.sent();
                    item.level = Number(values[0]);
                    if (values[1] === "личный")
                        item.assign = "Personal";
                    else
                        item.assign = "New";
                    if (values.length > 2) {
                        item.better = Number(values[2].match(/\d*/));
                    }
                    return [2 /*return*/, item];
            }
        });
    });
}
exports.ItemManager = (function () {
    var items = new Array();
    function scrum(page) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var sel, sel_1, sel_1_1, el, _b, _c, e_1_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: 
                    // Scrum from Rack
                    return [4 /*yield*/, page.goto(config_json_1.url.hero.rack, { waitUntil: 'domcontentloaded' })];
                    case 1:
                        // Scrum from Rack
                        _d.sent();
                        return [4 /*yield*/, page.$$('div > table > tbody > tr > td[style="vertical-align:top"]')];
                    case 2:
                        sel = _d.sent();
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 9, 10, 15]);
                        sel_1 = __asyncValues(sel);
                        _d.label = 4;
                    case 4: return [4 /*yield*/, sel_1.next()];
                    case 5:
                        if (!(sel_1_1 = _d.sent(), !sel_1_1.done)) return [3 /*break*/, 8];
                        el = sel_1_1.value;
                        _c = (_b = items).push;
                        return [4 /*yield*/, parseItem(el)];
                    case 6:
                        _c.apply(_b, [_d.sent()]);
                        _d.label = 7;
                    case 7: return [3 /*break*/, 4];
                    case 8: return [3 /*break*/, 15];
                    case 9:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 15];
                    case 10:
                        _d.trys.push([10, , 13, 14]);
                        if (!(sel_1_1 && !sel_1_1.done && (_a = sel_1.return))) return [3 /*break*/, 12];
                        return [4 /*yield*/, _a.call(sel_1)];
                    case 11:
                        _d.sent();
                        _d.label = 12;
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 14: return [7 /*endfinally*/];
                    case 15: return [2 /*return*/];
                }
            });
        });
    }
    function getItems() {
        return items;
    }
    function clear() {
        items.splice(0, items.length);
    }
    function repair() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    }
    function breakAll(lvl) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    }
    return {
        scrum: scrum,
        getItems: getItems,
        clear: clear,
        repair: repair,
        breakAll: breakAll
    };
})();
