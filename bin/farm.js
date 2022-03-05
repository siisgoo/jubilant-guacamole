"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategies = exports.isStrategy = void 0;
var Tower = require("./farm/towers.js");
var Daily = require("./farm/daily.js");
var isStrategy = function (str) { return ['Towers', 'Daily'].some(function (elem) { return elem === str; }); };
exports.isStrategy = isStrategy;
;
;
exports.Strategies = new Map([
    ["Towers", new Tower.FarmTowers],
    ["Daily", new Daily.FarmDaily]
]);
