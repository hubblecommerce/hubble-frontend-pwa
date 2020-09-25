//
//
//

function datetimeUnixNow() {
    return Math.round(new Date().getTime() / 1000);
}

function datetimeUnixNowAddSecs(seconds, ts) {
    if (ts) {
        return Math.round(ts + seconds);
    }

    return Math.round(new Date().getTime() / 1000 + seconds);
}

export { datetimeUnixNow, datetimeUnixNowAddSecs };
