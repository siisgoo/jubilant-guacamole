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
exports.SmartClick = exports.randomizeSleep = exports.sleep = exports.logMessage = exports.LoggingLevel = void 0;
var date = require("date-and-time");
var fs = require("fs");
var config_json_1 = require("./config.json");
var LoggingLevel;
(function (LoggingLevel) {
    LoggingLevel[LoggingLevel["Trace"] = 0] = "Trace";
    LoggingLevel[LoggingLevel["Debug"] = 1] = "Debug";
    LoggingLevel[LoggingLevel["Warning"] = 2] = "Warning";
    LoggingLevel[LoggingLevel["Error"] = 3] = "Error";
    LoggingLevel[LoggingLevel["Fatal"] = 4] = "Fatal";
})(LoggingLevel = exports.LoggingLevel || (exports.LoggingLevel = {}));
function strToLogLevel(str) {
    switch (str) {
        case "Trace":
            return LoggingLevel.Trace;
        case "Debug":
            return LoggingLevel.Debug;
        case "Warning":
            return LoggingLevel.Warning;
        case "Error":
            return LoggingLevel.Error;
        case "Fatal":
            return LoggingLevel.Fatal;
        default:
            throw new Error("Unknown log level: " + str);
    }
}
var g_logginLevel = strToLogLevel(config_json_1.config.log_level);
var g_logFile = config_json_1.config.log_file;
// do not check write permissions
// TODO rewrite with event arch
function logMessage(msg, level) {
    if (level === void 0) { level = LoggingLevel.Trace; }
    if (level >= g_logginLevel) {
        var ts = new Date;
        var write = "[" + date.format(ts, "HH:mm:ss") + "] - " + msg;
        fs.appendFileSync(g_logFile, write + '\n');
        console.log(write); // make it oprionaly
    }
}
exports.logMessage = logMessage;
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
exports.sleep = sleep;
function randomizeSleep(cur, rand) {
    return (cur + Math.random() * (rand - 100) + 100).toFixed();
}
exports.randomizeSleep = randomizeSleep;
function SmartClick(element, params) {
    if (params === void 0) { params = { retries: 5, idleTime: 1000 }; }
    return __awaiter(this, void 0, void 0, function () {
        var hoverAndClick;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hoverAndClick = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, element.hover()
                                        .then(function () {
                                        return element.click();
                                    })
                                        .catch(function (err) {
                                        if (params.retries <= 0) {
                                            throw err;
                                        }
                                        params.retries -= 1;
                                        sleep(params.idleTime).then(hoverAndClick);
                                    })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); };
                    return [4 /*yield*/, hoverAndClick()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.SmartClick = SmartClick;
