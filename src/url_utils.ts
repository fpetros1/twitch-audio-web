
const twitchDomain : string = "twitch.tv/";
// Non-exhuastive list of non-channel routes in twitch.tv
const nonChannels : string[] = ["directory", "videos", "u", "settings"];

const apiDomain : string = "api.twitch.tv/api/channels/";
const accessToken : string = "/access_token";

const usherDomain : string = "usher.ttvnw.net/api/channel/hls/";
const usherExt : string = ".m3u8";


// Extract audio_only stream .m3u8 from the master playlist content.
// Returns the first occurance of a URL after audio_only metadata.
// TODO: This works, but eventually we will need to fully parse the content
// and get audio_only stream url
export function parseAudioOnlyUrl(content: string) : string {
    if(!content) {
        return null;
    }
    const lines = content.split('\n');
    let audioOnlyFound = false;
    for(let line of lines) {
        if (line.includes("audio_only")) audioOnlyFound = true;
        if (audioOnlyFound && line.startsWith("https://")) return line;
    }
    return null;
}


export function getChannelFromWebUrl(weburl?: string) : string {
    // Channel name may not be available from the main page URL
    const url = weburl || location.href;
    const channel = getNameBetweenStrings(url, twitchDomain, "/", true);
    console.log("Channel name " + channel + ", from URL: " + url)

    // Filter out some non-channel pages with similar URL pattern as channel pages
    if (channel in nonChannels) return null;
    return channel;
}


export function getChannelFromTokenUrl(accessTokenUrl: string) : string {
    const channel = getNameBetweenStrings(accessTokenUrl, apiDomain, accessToken);
    console.log("channel name parsed access token: " + channel);
    return channel;
}


export function getChannelFromUsherUrl(usherUrl: string) : string {
    const channel = getNameBetweenStrings(usherUrl, usherDomain, usherExt);
    console.log("channel name parsed usher: " + channel);
    return channel;
}


// Get channel between the first occurance of startStr and the first endStr after startStr.
export function getNameBetweenStrings(
        url: string, startStr: string, endStr: string, endOptional: boolean = false) : string {
    let startIndex = url.indexOf(startStr);
    if(startIndex == -1) {
        return null;
    }
    startIndex += startStr.length;

    let endIndex = url.indexOf(endStr, startIndex + 1);
    if(endIndex == -1) {
        if(endOptional) endIndex = url.length;
        else return null;
    }
    return url.substring(startIndex, endIndex);
}



