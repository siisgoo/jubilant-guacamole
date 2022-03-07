"use strict";
// Header ...
//
//
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
Object.defineProperty(exports, "__esModule", { value: true });
// ░▀▀█░█░█░█▀▄░▀█▀░█░░░█▀█░█▀█░▀█▀░░░░░█▀▀░█░█░█▀█░█▀▀░█▀█░█▄█░█▀█░█░░░█▀▀
// ░░░█░█░█░█▀▄░░█░░█░░░█▀█░█░█░░█░░▄▄▄░█░█░█░█░█▀█░█░░░█▀█░█░█░█░█░█░░░█▀▀
// ░▀▀░░▀▀▀░▀▀░░▀▀▀░▀▀▀░▀░▀░▀░▀░░▀░░░░░░▀▀▀░▀▀▀░▀░▀░▀▀▀░▀░▀░▀░▀░▀▀▀░▀▀▀░▀▀▀
//                ░█▀▄░█▀█░█▀▄░█▀▄░█▀█░█▀▄░█▀▀░░░█▀▄░█▀█░▀█▀
//                ░█▀▄░█▀█░█▀▄░█▀▄░█▀█░█▀▄░▀▀█░░░█▀▄░█░█░░█░
//                ░▀▀░░▀░▀░▀░▀░▀▀░░▀░▀░▀░▀░▀▀▀░░░▀▀░░▀▀▀░░▀░
var puppeteer = require("puppeteer");
var bot_js_1 = require("./bot.js");
var utils_js_1 = require("./utils.js");
var config_json_1 = require("./config.json");
var g_ProgramName = 'jubilant-guacamole';
var Manager = /** @class */ (function () {
    function Manager(accounts) {
        this.accounts = accounts;
        this.running = false;
    }
    Manager.prototype.setupBot = function (page, account) {
        var bot = new bot_js_1.HeroBot(page, account.login, account.password, account.settings);
        bot.once('logined', function () {
            (0, utils_js_1.logMessage)("Account \"" + JSON.stringify(this.settings.auth) + "\" has been logined successfuly", utils_js_1.LoggingLevel.Debug);
        });
        bot.once('login_failed', function (err) {
            (0, utils_js_1.logMessage)("Account: " + this + " cant login. Reason: " + err, utils_js_1.LoggingLevel.Error);
        });
        return bot;
    };
    Manager.prototype.setupPage = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        // TODO
                        return [4 /*yield*/, page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36')];
                    case 1:
                        // TODO
                        _a.sent();
                        return [4 /*yield*/, page.setDefaultNavigationTimeout(500000)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.on('dialog', function (dialog) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, dialog.accept()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.on('error', function (err) {
                                var errorMessage = err.toString();
                                (0, utils_js_1.logMessage)('browser error: ' + errorMessage, utils_js_1.LoggingLevel.Fatal);
                            })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, page.on('pageerror', function (err) {
                                var errorMessage = err.toString();
                                (0, utils_js_1.logMessage)('browser page error: ' + errorMessage, utils_js_1.LoggingLevel.Fatal);
                            })];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _a.sent();
                        (0, utils_js_1.logMessage)(err_1, utils_js_1.LoggingLevel.Fatal);
                        throw new Error("Page initialization error. Reason: " + err_1);
                    case 7: return [2 /*return*/, page];
                }
            });
        });
    };
    // returns values:
    //  0 - ok, ready for multy-account setup
    //  1 - no accounts avalible
    //  2 - single account mode
    //  3 - already running
    Manager.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ret;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ret = 0;
                        if (this.running) {
                            (0, utils_js_1.logMessage)("Cant start manager: Manager already runnging");
                            return [2 /*return*/, 3];
                        }
                        if (!(this.accounts.length === 0)) return [3 /*break*/, 1];
                        throw new Error("No accounts to handle");
                    case 1:
                        if (!(this.accounts.length === 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, puppeteer.launch(config_json_1.config.puppeteer).then(function (browser) {
                                (0, utils_js_1.logMessage)("Run in single-account mode");
                                browser.newPage()
                                    .then(function (page) { return _this.setupBot(page, _this.accounts[0]); })
                                    .then(function (bot) { return bot.on('ready', function () { return bot.Run(); }); });
                            })];
                    case 2:
                        _a.sent();
                        ret = 2;
                        _a.label = 3;
                    case 3:
                        this.running = true;
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    return Manager;
}());
var MultiBrowser = /** @class */ (function (_super) {
    __extends(MultiBrowser, _super);
    function MultiBrowser(accounts, parallel) {
        return _super.call(this, accounts) || this;
    }
    MultiBrowser.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, 0];
            });
        });
    };
    MultiBrowser.prototype.stop = function () {
    };
    return MultiBrowser;
}(Manager));
// Run bots sequental in single page
// and in the same browser
var Sequential = /** @class */ (function (_super) {
    __extends(Sequential, _super);
    function Sequential(accounts) {
        return _super.call(this, accounts) || this;
    }
    Sequential.prototype.deconstructor = function () {
        this.running = false;
    };
    Sequential.prototype.handleLoop = function (n) {
        var _this = this;
        if (this.running) {
            this.browser.newPage().then(function (page) { return _super.prototype.setupPage.call(_this, page)
                .then(function (page) { return _super.prototype.setupBot.call(_this, page, _this.accounts[n]); })
                .then(function (bot) {
                bot.on('ready', function () { return bot.Run(); });
                bot.on('Resting', function () {
                    var next = ((n + 1) == _this.accounts.length) ? 0 : (n + 1);
                    bot.Stop();
                    bot.Dispose();
                    _this.handleLoop(next);
                });
            }); });
        }
    };
    // setup multi account handler
    // and run all setuped accounts
    //
    // dummy return
    Sequential.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        _super.prototype.run.call(_this).then(function (ret) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(ret === 0)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, puppeteer.launch(config_json_1.config.puppeteer)
                                                .then(function (browser) {
                                                _this.browser = browser;
                                                (0, utils_js_1.logMessage)("Run in multi-account mode");
                                                _this.handleLoop(0);
                                            })];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        resolve(ret);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    })];
            });
        });
    };
    Sequential.prototype.stop = function () {
        this.running = false;
    };
    return Sequential;
}(Manager));
// Entry point
var manager;
// Manager setup
switch (config_json_1.config.multyAccount.parallelismPolicy) {
    case "Sequential":
        (0, utils_js_1.logMessage)("Start " + g_ProgramName + " in sequental multi-account policy");
        manager = new Sequential(config_json_1.accounts);
        break;
    case "MultiBrowser":
        (0, utils_js_1.logMessage)("Multi browser policy not implemented yet");
        break;
    default:
        (0, utils_js_1.logMessage)("Unknown multi account policy set: " + config_json_1.config.multyAccount.parallelismPolicy, utils_js_1.LoggingLevel.Fatal);
        break;
}
if (manager) {
    manager.run();
}
else {
    (0, utils_js_1.logMessage)("Terminating...");
}
