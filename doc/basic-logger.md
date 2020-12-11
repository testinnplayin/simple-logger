# Basic Properties

This logger is very simple: it creates one `JSON` file per event logged.

When importing it into a project, you can pass certain options to it such as log levels, its name and such. Once configured for a project, that logger can be used to log one event per file.

# Initializing the Logger

To set up a logger, all that needs to be done is the following:

```javascript
const SimpleLogger = require('simple-logger');

const options = {
    logsDirPath: 'my_project/logs'
};

const logger = SimpleLogger.getLogger('my_logger', options);
```

## The .getLogger Method

This method allows the user to name a logger and pass it customizable options.

In the code example above, the `'my_logger'` is the name. It is a required parameter of this method.

Please see the section just below for more info on the `options` parameter.

## Description of Options

Here is an example of all available options:

```javascript
{
    level: 'DEBUG',
    logsDirPath: 'my_project/logs',
    fileNameTemplate: 'debug-messages'
}
```

* `level` - this is the level at which the logger will start writing to a `JSON` file. Please see the [log levels](#levels) section for more information. It is optional with a default value of `INFO`.

* `logsDirPath` - this is the directory path to where the logs will be written. it is required.

* `fileNameTemplate` - provides a name template for files produced by the logger. It is optional and defaults to `my_file`. Files are `JSON`. Please see section on how the file name is determined.

<a name="levels"></a>
# Logging Levels

There are four logging levels in the SimpleLogger: `DEBUG`, `INFO`, `WARNING` and `ERROR`. This is in order of lowest log level to highest.

A log message that has a lower level than that on the logger instance itself will not be written to a file. It will, however, show up in the console.

For example, if a logger is set to log `INFO` level messages but a message has a level of `DEBUG` on it, it will appear in the console but not in a file.