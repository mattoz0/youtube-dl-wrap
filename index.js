const EventEmitter = require('events').EventEmitter
const execFile = require('child_process').execFile;
const spawn = require('child_process').spawn;

class YoutubeDlWrap
{
    constructor(binaryPath)
    {
        this.progressRegex = /\[download\] *(.*) of (.*) at (.*) ETA (.*)/;
        this.setBinaryPath( binaryPath ? binaryPath : "youtube-dl");
    }

    getBinaryPath()
    {
        return this.binaryPath;
    }
    setBinaryPath(binaryPath)
    {
        this.binaryPath = binaryPath;
    }


    async getExtractors()
    {
        let youtubeDlStdout = await this.execPromise(["--list-extractors"]);
        return youtubeDlStdout.split("\n");         
    }
    async getExtractorDescriptions()
    {
        let youtubeDlStdout = await this.execPromise(["--extractor-descriptions"]);
        return youtubeDlStdout.split("\n");         
    }

    async getHelp()
    {
        let youtubeDlStdout = await this.execPromise(["--help"]);
        return youtubeDlStdout;         
    }
    async getUserAgent()
    {
        let youtubeDlStdout = await this.execPromise(["--dump-user-agent"]);
        return youtubeDlStdout;         
    }
    async getVersion()
    {
        let youtubeDlStdout = await this.execPromise(["--version"]);
        return youtubeDlStdout;         
    }

    async getVideoInfo(youtubeDlArguments)
    {
        if(typeof youtubeDlArguments == "string")
            youtubeDlArguments = [youtubeDlArguments];
        if(!youtubeDlArguments.includes("-f") && !youtubeDlArguments.includes("--format"))
            youtubeDlArguments = youtubeDlArguments.concat(["-f", "best"]);

        let youtubeDlStdout = await this.execPromise(youtubeDlArguments.concat(["--dump-json"]));
        try{
            return JSON.parse(youtubeDlStdout); 
        }
        catch(e){
            return JSON.parse("[" + youtubeDlStdout.replace(/\n/g, ",").slice(0, -1)  + "]"); 
        }
    }

    setDefaultOptions(options)
    {
	    if(!options.maxBuffer)
            options.maxBuffer = 1024 * 1024 * 1024;
        return options;
    }
    exec(youtubeDlArguments = [], options = {})
    {
        options = this.setDefaultOptions(options);
        const execEventEmitter = new EventEmitter();
        const youtubeDlProcess = spawn(this.binaryPath, youtubeDlArguments, options);

        youtubeDlProcess.stdout.on('data', (data) =>
        {
            let stringData = data.toString();
            let parsedProgress = this.parseProgress(stringData);
            
            if(parsedProgress)
                execEventEmitter.emit("progress", parsedProgress);

            execEventEmitter.emit("stdout", stringData);
        });
        youtubeDlProcess.stderr.on('data', (data) => 
        {
            let stringData = data.toString();
            execEventEmitter.emit("stderr", stringData);
        });

        let errorMessage = "";
        youtubeDlProcess.on('error', (errorMsg) => {
            errorMessage = errorMsg;
        });
        youtubeDlProcess.on('close', (code) => {
            if(code === 0)
                execEventEmitter.emit("close", code);
            else
                execEventEmitter.emit("error", code + " - " + errorMessage);
        });

        return execEventEmitter;
    }

    execPromise(youtubeDlArguments = [], options = {})
    {
        return new Promise( (resolve, reject) => 
        {
            options = this.setDefaultOptions(options);
            execFile(this.binaryPath, youtubeDlArguments, options, (error, stdout, stderr) =>
            {
                if(error)
                    reject(error);
                resolve(stdout);
            });
        });
    }

    parseProgress(progressLine)
    {
        let progressMatch = progressLine.match(this.progressRegex);
        if(progressMatch == null)
            return null;
        
        let progressObject = {};
        progressObject.percent = parseFloat(progressMatch[1].replace("%", ""));
        progressObject.totalSize = progressMatch[2].replace("~", "");
        progressObject.currentSpeed = progressMatch[3];
        progressObject.eta = progressMatch[4];
        return progressObject;
    }

}

module.exports = YoutubeDlWrap;