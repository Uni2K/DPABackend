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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  Simple Helperclass to parse String content into objects
 *  String could be either jsons or custom schemas like  string='content1 //// content2', where //// is an delimiter
 * Json is clearly prefered
 */
function parseAnswers(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let arr = [];
        for (let answer of input) {
            const a = JSON.parse(answer);
            arr.push(a);
        }
        return arr;
    });
}
exports.parseAnswers = parseAnswers;
//# sourceMappingURL=ParsingBase.js.map