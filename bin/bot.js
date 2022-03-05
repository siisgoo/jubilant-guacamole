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
var items_js_1 = require("./items.js");
var utils_js_1 = require("./utils.js");
var Farm = require("./farm.js");
var events_1 = require("events");
var config_json_1 = require("./config.json");
;
var DefaulBotSettings = {
    stepInterval: 500,
    randomize: 1500,
    // use it split?
    auth: {
        login: "",
        password: "",
    },
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
var HeroBot = /** @class */ (function (_super) {
    __extends(HeroBot, _super);
    function HeroBot(browser, l_settings) {
        var _this = _super.call(this) || this;
        _this.browser = browser;
        _this.running = false;
        _this.inited = false;
        _this.settings = __assign(__assign({}, DefaulBotSettings), l_settings);
        return _this;
    }
    HeroBot.prototype.deconstructor = function () {
        this.Dispose(); // its asynk, ok?
    };
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
    HeroBot.prototype.farmLoop = function (instance, preferedObjective) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            preferedObjective.execute(instance.settings.farm.settings, instance.settings.items)
                        ])];
                    case 1:
                        _a.sent();
                        if (!(instance.running === true)) return [3 /*break*/, 3];
                        return [4 /*yield*/, setTimeout(instance.farmLoop, (0, utils_js_1.randomizeSleep)(instance.settings.stepInterval, instance.settings.randomize), instance, preferedObjective)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        (0, utils_js_1.logMessage)("Stoping farming");
                        instance.emit('stoped');
                        _a.label = 4;
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
                        if (!!this.inited) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.Initialize()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        if (this.running === true) {
                            return [2 /*return*/];
                        }
                        _a.label = 3;
                    case 3:
                        (0, utils_js_1.logMessage)("Bot running with step interval: " + this.settings.stepInterval
                            + " randomized by: " + this.settings.randomize);
                        this.running = true;
                        this.emit('started');
                        obj = Farm.Strategies.get(this.settings.farm.objective);
                        return [4 /*yield*/, obj.Initialize(this)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, items_js_1.ItemManager.scrum(this.page)];
                    case 5:
                        _a.sent();
                        console.log(items_js_1.ItemManager.getItems());
                        return [4 /*yield*/, (0, utils_js_1.sleep)(100000)];
                    case 6:
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
                                        return [4 /*yield*/, this.scrumHeroInfo()];
                                        case 1:
                                            // go to menu and fetch stats
                                            _a.sent();
                                            wait = (0, utils_js_1.randomizeSleep)(this.settings.stepInterval +
                                                ((this.health === 0) ? this.health * 1000 / (this.regeneration / 180) :
                                                    this.energy * 1000 / (this.regeneration / 60)), this.settings.randomize);
                                            (0, utils_js_1.logMessage)("Start resting for: " + wait);
                                            setTimeout(function () {
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
    HeroBot.prototype.Dispose = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.inited = false;
                        return [4 /*yield*/, this.Stop()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.page.close()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeroBot.prototype.Stop = function () {
        this.running = false;
    };
    HeroBot.prototype.scrumCurentHeroStats = function () {
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
    HeroBot.prototype.scrumHeroInfo = function () {
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
                        // items
                        // await this.items.Update();
                        this.emit('hero_info_scrumed');
                        return [3 /*break*/, 9];
                    case 8:
                        err_1 = _b.sent();
                        this.emit('hero_info_scrum_failed');
                        (0, utils_js_1.logMessage)(err_1, utils_js_1.LoggingLevel.Fatal);
                        throw new Error("Hero info scrum failed. Reason: " + err_1);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    HeroBot.prototype.initializePage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        _a = this;
                        return [4 /*yield*/, this.browser.newPage()];
                    case 1:
                        _a.page = _b.sent();
                        // TODO
                        return [4 /*yield*/, this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36')];
                    case 2:
                        // TODO
                        _b.sent();
                        return [4 /*yield*/, this.page.setDefaultNavigationTimeout(500000)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.page.on('dialog', function (dialog) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, dialog.accept()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, this.page.on('error', function (err) {
                                var errorMessage = err.toString();
                                (0, utils_js_1.logMessage)('browser error: ' + errorMessage, utils_js_1.LoggingLevel.Fatal);
                            })];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, this.page.on('pageerror', function (err) {
                                var errorMessage = err.toString();
                                (0, utils_js_1.logMessage)('browser page error: ' + errorMessage, utils_js_1.LoggingLevel.Fatal);
                            })];
                    case 6:
                        _b.sent();
                        this.emit('page_initialized');
                        return [3 /*break*/, 8];
                    case 7:
                        err_2 = _b.sent();
                        (0, utils_js_1.logMessage)(err_2, utils_js_1.LoggingLevel.Fatal);
                        this.emit('page_initialization_failed');
                        throw new Error("Page initialization error. Reason: " + err_2);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    HeroBot.prototype.doLogin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
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
                                .then(function () { return _this.page.type('input[name="login"]', _this.settings.auth.login); })
                                .then(function () { return _this.page.focus('input[name="password"]'); })
                                .then(function () { return _this.page.type('input[name="password"]', _this.settings.auth.password); })
                                .then(function () { return _this.page.click('input[value="Войти"]'); })
                                .then(function () { return _this.page.waitForTimeout(1000); })
                                .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.page.waitForSelector('a[href="user"]', { visible: true, timeout: 3000 })
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
                        err_3 = _a.sent();
                        (0, utils_js_1.logMessage)(err_3, utils_js_1.LoggingLevel.Fatal);
                        throw new Error("Logging error. Reason: " + err_3);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    HeroBot.prototype.Initialize = function () {
        var _this = this;
        if (this.inited === true) {
            throw new Error("Attempt to reinitialize HeroBot.");
            return;
        }
        this.once('page_initialized', function () {
            _this.doLogin();
        });
        this.once('logined', function () {
            _this.scrumHeroInfo();
        });
        this.once('hero_info_scrumed', function () {
            _this.inited = true;
            _this.emit('ready');
        });
        this.once('login_failed', function () {
            _this.Dispose();
        });
        // entry point
        this.initializePage();
    };
    return HeroBot;
}(events_1.EventEmitter));
exports.HeroBot = HeroBot;
;
exports.default = HeroBot;
