# youtube-dl-wrap

![](https://github.com/ghjbnm/youtube-dl-wrap/workflows/Node.js%20CI/badge.svg)
<a href="https://npmjs.org/package/youtube-dl-wrap" title="View this project on NPM"><img src="https://img.shields.io/npm/v/youtube-dl-wrap.svg" alt="NPM version" /></a>

A simple node.js wrapper for [youtube-dl](https://github.com/ytdl-org/youtube-dl).

* 0 dependencies
* EventEmitter, Promise and Stream interface
* Progress events
* Utility functions

## Usage
```javascript
const YoutubeDlWrap = require("youtube-dl-wrap");
const youtubeDlWrap = new YoutubeDlWrap("path/to/youtube-dl/binary");

//Execute using an EventEmitter
youtubeDlWrap.exec(["https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "-f", "best", "-o", "output.mp4"])
  .on("progress", (progressObject) => console.log(progressObject.percent, progressObject.eta) )
  .on("error", (exitCode, processError, stderr) => console.error("An error occured", exitCode, processError, stderr) )
  .on("close", () => console.log("All done") );

//Execute using a Promise
await youtubeDlWrap.execPromise(["https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "-f", "best", "-o", "output.mp4"]);

//Execute returning a Readable Stream
let readStream = youtubeDlWrap.execStream(["https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "-f", "best"]);  


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
