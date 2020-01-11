import {contentlistLoader} from "../app";
import {ContentlistLoader} from "../content/ContentlistLoader";
import {INTERVAL_CONTENTLIST_REFRESH, INTERVAL_SNAPSHOT_CREATION} from "./Constants";

export class PeriodicRunners{


    constructor() {
        this.init()
    }

    private init() {
        let contentListUpdater=true
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
                contentlistLoader.refreshAllContentLists().then(()=>
                    snaphotCreationUpdater=true
                )
            }
        }, INTERVAL_SNAPSHOT_CREATION);





    }



}
