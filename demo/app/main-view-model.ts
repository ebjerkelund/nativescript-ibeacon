import {Observable} from 'data/observable';
import {
    BeaconRegion, Beacon, BeaconCallback,
    BeaconParserType, RangingOptions,
    BeaconLocationOptions, BeaconLocationOptionsIOSAuthType, BeaconLocationOptionsAndroidAuthType
} from "nativescript-ibeacon/nativescript-ibeacon.common";
import {NativescriptIbeacon} from "nativescript-ibeacon";

export class HelloWorldModel extends Observable implements BeaconCallback {

    private nativescriptIbeacon: NativescriptIbeacon;

    public message: string = "Init";

    private region: BeaconRegion = null;

    constructor() {
        super();

        console.log('Hello World Model constructed');

        let options: BeaconLocationOptions = {
            iOSAuthorisationType: BeaconLocationOptionsIOSAuthType.Always,
            androidAuthorisationType: BeaconLocationOptionsAndroidAuthType.Coarse,
            androidAuthorisationDescription: "Location permission needed",
            parserTypes: []
        };

        let rangingOptions: RangingOptions = {
            // example of 1 sec foreground scanning interval, null will use default interval
            // foregroundScanInterval: 1000,
            foregroundScanInterval: null,
            // example of 3 sec background scanning interval, null will use default interval
            // backgroundScanInterval: 3000
            backgroundScanInterval: null
        };

        // example of adding specific parser types. An empty array (default) will look for all parserTypes
        // options.parserTypes.push(BeaconParserType.AltBeacon);
        // options.parserTypes.push(BeaconParserType.EddystoneTLM);
        // options.parserTypes.push(BeaconParserType.EddystoneUID);
        // options.parserTypes.push(BeaconParserType.EddystoneURL);
        // options.parserTypes.push(BeaconParserType.IBeacon);
        this.nativescriptIbeacon = new NativescriptIbeacon(this, options);
        
        // example of ranging for a specific UUID
        // this.region = new BeaconRegion("HelloID", "61687109-905f-4436-91f8-e602f514c96d", null, null, rangingOptions);

        //example of ranging across all UUIDs
        this.region = new BeaconRegion("HelloID", null, null, null, rangingOptions);

    }

    start() {
        this.message = "start";

        if (!this.nativescriptIbeacon.isAuthorised()) {
            console.log("NOT Authorised");
            this.nativescriptIbeacon.requestAuthorization()
                .then(() => {
                    console.log("Authorised by the user");
                    this.nativescriptIbeacon.bind();

                }, (e) => {
                    console.log("Authorisation denied by the user");
                })
        } else {
            console.log("Already authorised");
            this.nativescriptIbeacon.bind();
        }

    }

    stop() {
        this.message = "stop";
        this.nativescriptIbeacon.stopRanging(this.region);
        this.nativescriptIbeacon.stopMonitoring(this.region);
        this.nativescriptIbeacon.unbind();
    }

    onBeaconManagerReady(): void {
        console.log("onBeaconManagerReady");
        this.nativescriptIbeacon.startRanging(this.region);
        this.nativescriptIbeacon.startMonitoring(this.region);
    }

    didRangeBeaconsInRegion(region: BeaconRegion, beacons: Beacon[]): void {
        //console.log("didRangeBeaconsInRegion: " + region.identifier + " - " + beacons.length);
        //this.message = "didRangeBeaconsInRegion: " + (new Date().toDateString());
        for (let beacon of beacons) {
            console.log("B: " + beacon.proximityUUID + " - " + beacon.major + " - " + beacon.minor + " - " + beacon.distance_proximity + " - " + beacon.rssi + " - " + beacon.txPower_accuracy );
        }
    }

    didFailRangingBeaconsInRegion(region: BeaconRegion, errorCode: number, errorDescription: string): void {
        console.log("didFailRangingBeaconsInRegion: " + region.identifier + " - " + errorCode + " - " + errorDescription);
    }

    didEnterRegion(region: BeaconRegion) {
        //console.log(region);
        console.log('Did enter Region ' + region.identifier);
    }

    didExitRegion(region: BeaconRegion) {
        //console.log(region);
        console.log('Did leave Region '  + region.identifier);
    }

}