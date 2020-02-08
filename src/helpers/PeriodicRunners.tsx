import {contentlistLoader, pollBase} from "../app";
import {ContentlistLoader} from "../content/ContentlistLoader";
import {INTERVAL_CONTENTLIST_REFRESH, INTERVAL_SNAPSHOT_CREATION} from "./Constants";



/**
 * Important class, runs all the periodic tasks and functions, like updating content lists, feed algorithms, snapshot creation
 */
export class PeriodicRunners{


    constructor() {
       // this.init()
    }

    private init() {
        let contentListUpdater=true //Dont update, if its not finished yet
        setInterval(() => {
            if(contentListUpdater) {
                contentListUpdater=false
                contentlistLoader.refreshAllContentLists().then(()=>
                    contentListUpdater=true
                )
            }
        }, INTERVAL_CONTENTLIST_REFRESH);

        let snaphotCreationUpdater=true
        setInterval(() => {
            if(snaphotCreationUpdater) {
                snaphotCreationUpdater=false
                pollBase.createSnapShots().then(()=>
                    snaphotCreationUpdater=true
                )
            }

        }, INTERVAL_SNAPSHOT_CREATION);





    }



}
