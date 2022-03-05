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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceManager = void 0;
var config_json_1 = require("./config.json");
// add buy/sell
var ResourceManager = /** @class */ (function () {
    function ResourceManager() {
    }
    Object.defineProperty(ResourceManager.prototype, "Silver", {
        // get Diamod()  { return this.diamod; }
        // get Gold()    { return this.gold; }
        get: function () { return this.silver; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResourceManager.prototype, "Bottles", {
        get: function () { return this.bottles; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResourceManager.prototype, "Migthril", {
        get: function () { return this.mithril; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResourceManager.prototype, "Iron", {
        get: function () { return this.iron; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResourceManager.prototype, "ArenaPoints", {
        get: function () { return this.arenaPoints; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResourceManager.prototype, "FieldsPoints", {
        get: function () { return this.fieldsPoints; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResourceManager.prototype, "TalentPoints", {
        get: function () { return this.talentPoints; },
        enumerable: false,
        configurable: true
    });
    ResourceManager.prototype.scrum = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var sel, _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, page.goto(config_json_1.url.main_menu)];
                    case 1:
                        _h.sent(); // handle exit from battle
                        return [4 /*yield*/, page.goto(config_json_1.url.hero.resources, { waitUntil: 'domcontentloaded' })];
                    case 2:
                        _h.sent();
                        return [4 /*yield*/, page.$$('div > span')];
                    case 3:
                        sel = _h.sent();
                        // remove stats
                        sel.splice(0, 1);
                        _a = this;
                        return [4 /*yield*/, sel[0].jsonValue()];
                    case 4:
                        _a.bottles = _h.sent();
                        _b = this;
                        return [4 /*yield*/, sel[1].jsonValue()];
                    case 5:
                        _b.iron = _h.sent();
                        _c = this;
                        return [4 /*yield*/, sel[2].jsonValue()];
                    case 6:
                        _c.mithril = _h.sent();
                        _d = this;
                        return [4 /*yield*/, sel[3].jsonValue()];
                    case 7:
                        _d.arenaPoints = _h.sent();
                        _e = this;
                        return [4 /*yield*/, sel[4].jsonValue()];
                    case 8:
                        _e.fieldsPoints = _h.sent();
                        _f = this;
                        return [4 /*yield*/, sel[5].jsonValue()];
                    case 9:
                        _f.talentPoints = _h.sent();
                        return [4 /*yield*/, page.goto(config_json_1.url.hero.main, { waitUntil: 'domcontentloaded' })];
                    case 10:
                        _h.sent();
                        _g = this;
                        return [4 /*yield*/, page.$eval('span.money > span', function (el) { return Number(el.textContent); })];
                    case 11:
                        _g.silver = _h.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ResourceManager;
}());
exports.ResourceManager = ResourceManager;
;
