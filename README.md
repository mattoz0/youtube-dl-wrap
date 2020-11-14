# youtube-dl-wrap

![](https://github.com/ghjbnm/youtube-dl-wrap/workflows/CI%20tests/badge.svg)
<a href="https://npmjs.org/package/youtube-dl-wrap" title="View this project on NPM"><img src="https://img.shields.io/npm/v/youtube-dl-wrap.svg" alt="NPM version" /></a>

A simple node.js wrapper for [youtube-dl](https://github.com/ytdl-org/youtube-dl).

* 0 dependencies
* EventEmitter, Promise and Stream interface
* Progress events
* Utility functions

## Usage

Youtube-dl will not be automatically downloaded.\
Provide it yourself or use some of the following functions to download the binary.

```javascript
const YoutubeDlWrap = require("youtube-dl-wrap");

//Downloads the latest youtube-dl binary for the given platform to the provided path.
//By default the path will be "./youtube-dl" and platform will be os.platform().
await YoutubeDlWrap.downloadLatestYoutubeDl("path/to/youtube-dl/binary", "win32");

//Init an instance with a given binary path.
//If none is provided "youtube-dl" will be used as command.
const youtubeDlWrap = new YoutubeDlWrap("path/to/youtube-dl/binary");
//The binary path can also be changed later on.
youtubeDlWrap.setBinaryPath("path/to/another/youtube-dl/binary");
```


To interface with youtube-dl the following methods can be used.

```javascript
const YoutubeDlWrap = require("youtube-dl-wrap");
const youtubeDlWrap = new YoutubeDlWrap("path/to/youtube-dl/binary");

//Execute and return an EventEmitter
youtubeDlWrap.exec(["https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "-f", "best", "-o", "output.mp4"])
  .on("progress", (progress) => 
    console.log(progress.percent, progress.totalSize, progress.currentSpeed, progress.eta))
  .on("error", (exitCode, processError, stderr) => 
    console.error("An error occured", exitCode, processError, stderr))
  .on("close", () => console.log("All done"));

//Execute and return a Promise
await youtubeDlWrap.execPromise(["https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "-f", "best", "-o", "output.mp4"]);

//Execute and return a Readable Stream
let readStream = youtubeDlWrap.execStream(["https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "-f", "best"])
  .on("progress", (progress) => 
    console.log(progress.percent, progress.totalSize, progress.currentSpeed, progress.eta));  


//Get the --dump-json metadata as object
let metadata = await youtubeDlWrap.getVideoInfo("https://www.youtube.com/watch?v=aqz-KE-bpKQ");


//Get the version
let version = await youtubeDlWrap.getVersion();

//Get the user agent
let userAgent = await youtubeDlWrap.getUserAgent();

//Get the help output
let help = await youtubeDlWrap.getHelp();

//Get the extractor list
let extractors = await youtubeDlWrap.getExtractors();

//Get the extractor description list
let extractorDescriptions = await youtubeDlWrap.getExtractorDescriptions();
```

## License
MIT
