"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const Constants_1 = require("./Constants");
/**
 * Important class, runs all the periodic tasks and functions, like updating content lists, feed algorithms, snapshot creation
 */
class PeriodicRunners {
    constructor() {
        // this.init()
    }
    init() {
        let contentListUpdater = true; //Dont update, if its not finished yet
        setInterval(() => {
            if (contentListUpdater) {
                contentListUpdater = false;
                app_1.contentlistLoader.refreshAllContentLists().then(() => contentListUpdater = true);
            }
        }, Constants_1.INTERVAL_CONTENTLIST_REFRESH);
        let snaphotCreationUpdater = true;
        setInterval(() => {
            if (snaphotCreationUpdater) {
                snaphotCreationUpdater = false;
                app_1.pollBase.createSnapShots().then(() => snaphotCreationUpdater = true);
            }
        }, Constants_1.INTERVAL_SNAPSHOT_CREATION);
    }
}
exports.PeriodicRunners = PeriodicRunners;
//# sourceMappingURL=PeriodicRunners.js.map