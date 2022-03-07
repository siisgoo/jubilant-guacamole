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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.HeroBot = void 0;
var utils_js_1 = require("./utils.js");
var Farm = require("./farm.js");
var events_1 = require("events");
var config_json_1 = require("./config.json");
;
var DefaulBotSettings = {
    stepInterval: 800,
    randomize: 1500,
    session: {
        sessionTime: 1000 * 60 * 60,
        sessionResumeTime: 1000 * 60 * 10,
    },
    items: {
        useBottle: true,
        breakItems: true,
        breakLevel: 5,
        breakRarity: 'cooper',
    },
    farm: {
        objective: "Towers",
        settings: "Hero",
    },
};
//
// Signals:
//  'logined'
//  'login_failed'
//  'ready'
//  'started'
//  'stoped'
//  'Resting'
var HeroBot = /** @class */ (function (_super) {
    __extends(HeroBot, _super);
    function HeroBot(page, login, password, l_settings) {
        var _this = _super.call(this) || this;
        _this.page = page;
        _this.login = login;
        _this.password = password;
        _this.running = false;
        _this.inited = false;
        _this.settings = __assign(__assign({}, DefaulBotSettings), l_settings);
        _this.sessionTimer = setTimeout(_this.onSessionRunout, _this.settings.session.sessionTime);
        _this.Init();
        return _this;
    }
    Object.defineProperty(HeroBot.prototype, "Page", {
        get: function () { return this.page; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HeroBot.prototype, "ConflictSide", {
        get: function () { return this.conflictSide; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HeroBot.prototype, "Level", {
        get: function () { return this.level; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HeroBot.prototype, "Resources", {
        get: function () { return this.resources; },
        enumerable: false,
        configurable: true
    });
    HeroBot.prototype.deconstructor = function () {
        this.Dispose(); // its asynk, ok?
    };
    HeroBot.prototype.Init = function () {
        var _this = this;
        this.once('logined', function () {
            _this.scrapHeroInfo();
        });
        this.once('hero_info_scraped', function () {
            _this.inited = true;
            _this.emit('ready');
        });
        this.once('login_failed', function () {
            _this.Dispose();
        });
        this.doLogin();
    };
    HeroBot.prototype.onSessionRunout = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.Stop();
                this.Dispose();
                this.sessionResumeTimer = setTimeout(function () {
                    _this.Init();
                    _this.once('ready', _this.Run);
                }, this.settings.session.sessionResumeTime);
                return [2 /*return*/];
            });
        });
    };
    // Main bot loop
    HeroBot.prototype.farmLoop = function (instance, preferedObjective) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            preferedObjective.execute(instance.settings.farm.settings, instance.settings.items)
                        ])];
                    case 1:
                        _b.sent();
                        if (!(instance.running === true)) return [3 /*break*/, 3];
                        _a = instance;
                        return [4 /*yield*/, setTimeout(instance.farmLoop, (0, utils_js_1.randomizeSleep)(instance.settings.stepInterval, instance.settings.randomize), instance, preferedObjective)];
                    case 2:
                        _a.farmTimer = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        (0, utils_js_1.logMessage)("Stoping farming");
                        instance.emit('stoped');
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // first do daliy quests
    // and go farm specified "dungeon"
    // by default farm towers
    HeroBot.prototype.Run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var obj;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.inited) {
                            throw new Error("Cant run bot: Bot uninited!");
                        }
                        else if (this.running === true) {
                            return [2 /*return*/];
                        }
                        (0, utils_js_1.logMessage)("Bot running with step interval: " + this.settings.stepInterval
                            + " randomized by: " + this.settings.randomize);
                        this.running = true;
                        this.emit('started');
                        obj = Farm.Strategies.get(this.settings.farm.objective);
                        return [4 /*yield*/, obj.Initialize(this)];
                    case 1:
                        _a.sent();
                        obj.on('NeedRest', function (farmObj) {
                            _this.Stop();
                            // wait for farm stoped
                            _this.once('stoped', function () { return __awaiter(_this, void 0, void 0, function () {
                                var wait;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: 
                                        // go to menu and fetch stats
                                        return [4 /*yield*/, this.scrapHeroInfo()];
                                        case 1:
                                            // go to menu and fetch stats
                                            _a.sent();
                                            wait = (0, utils_js_1.randomizeSleep)(this.settings.stepInterval +
                                                ((this.health === 0) ? this.health * 1000 / (this.regeneration / 180) :
                                                    this.energy * 1000 / (this.regeneration / 60)), this.settings.randomize);
                                            (0, utils_js_1.logMessage)("Start resting for: " + wait);
                                            this.emit('Resting');
                                            this.resetTimer = setTimeout(function () {
                                                farmObj.callback(_this).then(function () {
                                                    _this.running = true;
                                                    _this.emit('started');
                                                    _this.farmLoop(_this, farmObj); // start
                                                });
                                            }, wait);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        });
                        // obj.on('DailyRunOut', () => 0);
                        try {
                            this.farmLoop(this, obj);
                        }
                        catch (e) {
                            (0, utils_js_1.logMessage)(e, utils_js_1.LoggingLevel.Error);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Close page and set bot object state as uninited
    HeroBot.prototype.Dispose = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.inited = false;
                        this.running = false;
                        return [4 /*yield*/, this.page.close()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Stop main bot loop
    // Imidiatly stops rest timer
    // but dont interapt farm step
    // for get real state of bot, listen 'stoped' signal
    HeroBot.prototype.Stop = function () {
        this.running = false;
        clearInterval(this.resetTimer);
    };
    // Scrap hp and energy
    HeroBot.prototype.scrapCurentHeroStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.$$eval('table > tbody > tr > td > span', function (vals) {
                            return vals.map(function (val) { return Number(val.textContent); });
                        })
                            .then(function (stats) {
                            return { health: stats[0], energy: stats[1], };
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Scrap all hero stats exclude invinitory and resources info
    HeroBot.prototype.scrapHeroInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var target, statSpans, _a, err_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.page.goto(config_json_1.url.main_menu)];
                    case 1:
                        _b.sent(); //exit from fight handle
                        return [4 /*yield*/, this.page.goto(config_json_1.url.hero.main, { waitUntil: 'domcontentloaded' })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.page.content()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.page.$$eval('a', function (href) { return href[0].toString(); })];
                    case 4:
                        target = _b.sent();
                        this.id = Number(new URL(target).pathname.split('/')[3]);
                        return [4 /*yield*/, this.page.$$eval('div > span[class=""]', function (el) {
                                return el.map(function (t) { return Number(t.textContent); });
                            })];
                    case 5:
                        statSpans = _b.sent();
                        this.strength = statSpans[0];
                        this.health = statSpans[1];
                        this.energy = statSpans[2];
                        this.regeneration = statSpans[3];
                        this.armor = statSpans[4];
                        this.summary = statSpans[5];
                        // TODO!!!!!
                        return [4 /*yield*/, this.page.$$eval('div > span', function (spans) { return spans.map(function (e) { return e.textContent; }); })
                                .then(function (res) {
                                // hero class
                                if (res[0].toString() == "воин") {
                                    _this.heroClass = "Fighter";
                                }
                                else {
                                    _this.heroClass = "Healer";
                                }
                                // conflict side
                                if (res[1].toString() == "юг") {
                                    _this.conflictSide = "South";
                                }
                                else {
                                    _this.conflictSide = "North";
                                }
                            })
                            // level
                        ];
                    case 6:
                        // TODO!!!!!
                        _b.sent();
                        // level
                        _a = this;
                        return [4 /*yield*/, this.page.$$eval('div > b > span', function (spans) { return Number(spans[1].textContent); })];
                    case 7:
                        // level
                        _a.level = _b.sent();
                        this.emit('hero_info_scraped');
                        return [3 /*break*/, 9];
                    case 8:
                        err_1 = _b.sent();
                        this.emit('hero_info_scrap_failed');
                        (0, utils_js_1.logMessage)(err_1, utils_js_1.LoggingLevel.Fatal);
                        throw new Error("Hero info scrap failed. Reason: " + err_1);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    // Login
    HeroBot.prototype.doLogin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.page.goto(config_json_1.url.login, { waitUntil: 'load' })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.page.waitForSelector('input[value="Войти"]')
                                .then(function () { return _this.page.focus('input[name="login"]'); })
                                .then(function () { return _this.page.type('input[name="login"]', _this.login); })
                                .then(function () { return _this.page.focus('input[name="password"]'); })
                                .then(function () { return _this.page.type('input[name="password"]', _this.password); })
                                .then(function () { return _this.page.click('input[value="Войти"]'); })
                                // .then(() => this.page.waitForTimeout(1000))
                                .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.page.waitForSelector('a[href="user"]', { visible: true, timeout: 10000 })
                                                .then(function () {
                                                _this.emit('logined');
                                            })
                                                .catch(function (err) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, this.page.close()];
                                                        case 1:
                                                            _a.sent();
                                                            (0, utils_js_1.logMessage)("Login failed. Reason: " + err, utils_js_1.LoggingLevel.Fatal);
                                                            this.emit('login_failed', err);
                                                            throw new Error("Logging failed. Reason: " + err);
                                                    }
                                                });
                                            }); })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        (0, utils_js_1.logMessage)(err_2, utils_js_1.LoggingLevel.Fatal);
                        throw new Error("Logging error. Reason: " + err_2);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return HeroBot;
}(events_1.EventEmitter));
exports.HeroBot = HeroBot;
;
exports.default = HeroBot;
