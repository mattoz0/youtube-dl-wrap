# youtube-dl-wrap

![](https://github.com/ghjbnm/youtube-dl-wrap/workflows/Node.js%20CI/badge.svg)

A simple node.js wrapper for youtube-dl.

* 0 dependencies
* EventEmitter and Promise interface
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
  .on("error", (errorMessage) => console.error("An error occured", errorMessage) )
  .on("close", () => console.log("All done") );

//Execute using a Promise
await youtubeDlWrap.execPromise(["https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "-f", "best", "-o", "output.mp4"]);
    

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
