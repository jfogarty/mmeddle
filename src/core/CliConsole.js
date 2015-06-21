'use strict';
/**
 * @fileOverview Console line input and output for mMeddle CLI
 * @module core/CliConsole
 */ 
module.exports = function registerCliConsole(mm) {
  var check      = mm.check;
  var _          = check(mm._);
  var qq         = check(mm.Q);
  var EggTimer   = check(mm.obj.EggTimer);

  var BS    = String.fromCharCode(0x08);                   // jshint ignore:line 
  var CR    = String.fromCharCode(0x0D);                   // jshint ignore:line 
  var LF    = String.fromCharCode(0x0A);                   // jshint ignore:line 
  var NL    = String.fromCharCode(0x0A);                   // jshint ignore:line 
  var CRLF  = String.fromCharCode(0x0D, 0x0A);             // jshint ignore:line 
  var HOME  = String.fromCharCode(0x1b, 0x5b, 0x31, 0x7e); // jshint ignore:line 
  var UP    = String.fromCharCode(0x1b, 0x5b, 0x41);       // jshint ignore:line 
  var DOWN  = String.fromCharCode(0x1b, 0x5b, 0x42);       // jshint ignore:line 
  
  var KeyCodes = {
    null  : [0x00],
    ctrlA : [0x01], // A
    ctrlB : [0x02], // B
    ctrlC : [0x03], // C
    ctrlD : [0x03], // D
    ctrlE : [0x03], // E
    ctrlF : [0x03], // F
    bell  : [0x07], // G
    bs    : [0x08], // H
    tab   : [0x09], // I
    lf    : [0x0A], // J
    ff    : [0x0B], // K
    ctrlL : [0x0C], // L
    cr    : [0x0D], // M
    ctrlN : [0x0E], // N
    ctrlO : [0x0F], // O
    ctrlP : [0x10], // P
    ctrlQ : [0x11], // Q
    ctrlR : [0x12], // R
    ctrlS : [0x13], // S
    ctrlT : [0x14], // T
    ctrlU : [0x15], // U 
    ctrlV : [0x16], // V
    ctrlW : [0x17], // W
    ctrlX : [0x18], // X
    ctrlY : [0x19], // Y
    ctrlZ : [0x1A], // Z
    esc   : [0x1B],
    up    : [0x1b, 0x5b, 0x41],
    down  : [0x1b, 0x5b, 0x42],
    right : [0x1b, 0x5b, 0x43],
    left  : [0x1b, 0x5b, 0x44],
    ins   : [0x1b, 0x5b, 0x32, 0x7e],
    del   : [0x1b, 0x5b, 0x33, 0x7e],
    home  : [0x1b, 0x5b, 0x31, 0x7e],
    end   : [0x1b, 0x5b, 0x34, 0x7e],
    pgup  : [0x1b, 0x5b, 0x35, 0x7e],
    pgdn  : [0x1b, 0x5b, 0x36, 0x7e],
    F1    : [0x1b, 0x5b, 0x5b, 0x41],
    F2    : [0x1b, 0x5b, 0x5b, 0x42],
    F3    : [0x1b, 0x5b, 0x5b, 0x43],
    F4    : [0x1b, 0x5b, 0x5b, 0x44],
    F5    : [0x1b, 0x5b, 0x5b, 0x45],
    F6    : [0x1b, 0x5b, 0x31, 0x37, 0x7e],
    F7    : [0x1b, 0x5b, 0x31, 0x38, 0x7e],
    F8    : [0x1b, 0x5b, 0x31, 0x39, 0x7e],
    F9    : [0x1b, 0x5b, 0x32, 0x30, 0x7e],
    F10   : [0x1b, 0x5b, 0x32, 0x31, 0x7e],
    F11   : [0x1b, 0x5b, 0x32, 0x33, 0x7e],
    F12   : [0x1b, 0x5b, 0x32, 0x34, 0x7e],
  };
  
  /**
   * @summary **console input and output for mMeddle CLI**
   * @description
   * Handles  console input and output so interruptions from asynchronous
   * events don't muck up the command as its being entered. Also provides
   * the usual command stack, line edit and tab completion operations.
   *
   * On Node.js the CliConsole uses process.stdin and out. On a browser,
   * the constructor takes the ids for the text input and the div that
   * will be expanded as output.
   *
   * On Node as soon as the CliConsole is created process.stdin is 
   * switched to raw character mode.  All output to the console must use
   * CliConsole or it will be confused about what is on the display.
   *
   * @constructor
   * @param {string} cliInText the id of the text input 
   * @param {string} cliPrompt the id of the text input label
   * @param {string} outDiv the id of the text ouput div
   * @returns {CliConsole} the cli client.
   */  
  var CliConsole = 
  function cliConsoleCtor(cliInText, cliPrompt, outDiv) {
    var self = this;
    var inNode = mm.config.inNode;
    var inBrowser = inNode ? false : true;
    var activity = false;

    // Defined on Node clients.
    var outStream;
    var inStream;
    var cursor;

    // Defined on Browser clients.
    var consoleOutput;
    var consolePrompt;
    var consoleInput;

    self.idleTimer = null; // User supplied idle timer.
    self.eventHandlers = [];
    /* istanbul ignore else */ 
    if (inNode) {
      // On node clients initialize stdin and out.
      outStream = process.stdout;
      cursor = require('ansi')(outStream);
      inStream = process.stdin;
      
      // Make sure the console is in raw character mode.
      inStream.setEncoding('utf8');
      // Raw mode reads from the console without echoing characters and
      // doesn't buffer up the keys.  
      inStream.setRawMode(true);

      self.displayRows = outStream.rows;
      self.displayCols = outStream.columns;

      var h = [];
      h.push({ obj: outStream, name:'resize',   func: resizeHandler  });
      h.push({ obj: inStream,  name:'end',      func: inCloseHandler });
      h.push({ obj: inStream,  name:'close',    func: inCloseHandler });
      h.push({ obj: inStream,  name:'readable', func: inReadableHandler });
      h.push({ obj: inStream,  name:'error',    func: inErrorHandler });
      self.eventHandlers = h;
    }
    else {
      // On browser clients obtain the relevent DOM elements.
      consoleOutput = mm.document.getElementById(outDiv);
      consolePrompt = mm.document.getElementById(cliPrompt);
      consoleInput  = mm.document.getElementById(cliInText);
      
      // TODO - Define browser event handlers.
    }

    self.mute = mm.config.mochaConsoleMute; // Hacky way to mute console.
    self.lastLine = '';
    self.error = null;
    self.saveOnlyUnique = false;
    self.closeHandler = null;
    self.maxPasswordLength = 15;
    self.savedInputLines = [];

    function makeLine (text) {
      return {
        textLine: text,
        multiLine: false
      };
    }

    var handlers = []; // The stack of input handlers;
    self.handler = {
      func: null,     // caller must supply one.
      prompt: (inNode ? '-->' : 'Cmd:'),
      pwdMode: false  // show * during input.
    };
    /* istanbul ignore if */ 
    if (inBrowser) {
      consolePrompt.innerHTML = self.handler.prompt;
    }
    
    var pendingInputs = [];
    var keyQueue = [];   // unhandled keystrokes/keycodes.
    
    var currentInput = makeLine('');
    var inputOffset = 0; //offset from beginning of currentInput.
    var insertMode = true;
    var promptVisible = false;
    var partialOutputLine = true; // Require a NL before prompt.

    var currentSavedInputIndex = 0;
    var savedInitialLine = '';
    var scrollingPrevious = true;

    //console.log('- screen size is: ', 
    //    self.displayRows + 'x' + self.displayCols);
    
    // This eggTimer is used to trigger handling of all user input.
    // When there other outputs from other routines going on, the
    // input is bufferred in the keyQueue until and the timer is 
    // reset until there is a chance to deal with the inputs.
    var timer = new EggTimer(100).start();

    // Start running.
    var running = true;
    installEventHandlers();
/*    
self.annoyTimer = new EggTimer(10000).start();
var nn = 0;
self.annoyTimer.onDing(function () {
  mm.log.status('Are you annoyed yet?', nn++);
  self.annoyTimer.reset();
});
*/
    // Examines a keysequence to see of it is a control char,
    // alt code, or control code.
    function getKeyCode(unicodes) {
      var c = [];
      var keyEvent = null;
      //var ch1 = unicodes[0];
      var n = unicodes.length;
      var ch2 = n > 1 ? unicodes[1] : '';
      var c1 = unicodes.charCodeAt(0);
      for (var i = 0; i < n; i++) {
        c.push(unicodes.charCodeAt(i));
      }
      
      function keyMatch() {
        for (var key in KeyCodes) {
          if (_.isEqual(KeyCodes[key], c)) {
            keyEvent = key;
            return true;
          }
        }
        return false;
      }
      
      if (keyMatch()) return keyEvent;
      if (c1 === 0x1b && c.length > 1) {
        c.shift();
        if (keyMatch()) {
          return 'alt' + keyEvent;
        }
        else {
          return 'alt' + ch2;
        }
      }
      return null;
    }
    
    function isPrintableAscii(cc) {
      if (cc.length === 1) {
        var c = cc.charCodeAt(0);
        return c >= 32 && c < 128;
      }
      return false;
    }

    function hexString(unicode) {
      var h = '';
      var sep = '';
      for (var i = 0; i < unicode.length; i++) {
        var cc = unicode.charCodeAt(i);
        h += sep + hexOfUnicode(cc);
        sep = '|';
      }
      return h;
    }
    
    function hexOfUnicode(cc) {
      var d = cc.toString(16);
      while (d.length < 4) d = '0' + d;
      return d;
    }

    function hexOfAscii(cc) { // jshint ignore:line 
      var d = cc.toString(16);
      return (d.length < 2) ? '0' + d : d;
    }

    // Replaces or inserts a character at a specific position in the string.
    function setChar(str, offset, ch, insert) {
      var n = str.length;
      // Pad the string with spaces.
      while (n < offset) { str += ' '; n++; }
      // Append the character.
      if (offset === n) {
        return str += ch;
      }
      var left = str.substring(0, offset);
      var right = str.substring(offset + (insert ? 0 : 1));
      return left + ch + right;
    }

    // Remove a character at a specific position in the string.
    function delChar(str, offset) {
      var n = str.length;
      // Pad the string with spaces.
      while (n < offset) { str += ' '; n++; }
      if (offset === n) {
        return str.substring(0, offset - 1);
      }
      var left = str.substring(0, offset);
      var right = str.substring(offset + 1);
      return left + right;
    }

    // Handle saving of the text line stack.
    function saveInput(currentInput) {
      // Passwords are never saved.
      if (self.handler.pwdMode) {
        return false;
      }
      currentSavedInputIndex = 0;
      var textLine = currentInput.textLine;
      // Only single lines are saved in the stack.
      if (currentInput.multiLine) {
        return false;
      }
      // Lines must be at least 2 characters long to be worth saving.
      if (textLine.length === 0) {
       return false;
      }
      // Only unique lines are saved in the stack.
      if (self.saveOnlyUnique) {
        if (_.includes(self.savedInputLines, textLine)) {
         return false;
        }
      }
      // Do not save two duplicate lines in a row.
      if (self.savedInputLines.length > 0 &&
        self.savedInputLines[0] === textLine) 
      {
        return false;
      }
      self.savedInputLines.unshift(textLine); // stick it in the stack.
      return true;
    }
    
    function fetchPendingInput() {
      self.lastInput = pendingInputs.shift();
      self.lastLine = self.lastInput.textLine;
      saveInput(self.lastInput);
    }

    function out(chars) {
      if (self.idleTimer) self.idleTimer.reset();
      if (self.pauseTimer) self.pauseTimer.reset();
      
      /* istanbul ignore next */ 
      if (self.mute) return self;
      /* istanbul ignore if */ 
      if (inBrowser) {
        consoleOutput.appendChild(mm.document.createTextNode(chars));
      }
      else {
        cursor.write(chars);
      }
      return self;
    }

    // Zero based horizontal line cursor positioning.
    function setLineOffset(n) {
      /* istanbul ignore next */ 
      if (self.mute) return;
      /* istanbul ignore else */ 
      if (inNode) {
        cursor.horizontalAbsolute(n + 1);
      }
    }

    // Displays the prompt, current input, and positions  the cursor.
    function showPrompt(reprompt) {
      /* istanbul ignore else */ 
      if (inNode) {
        if (!promptVisible || reprompt) {
          promptVisible = true;
          if (partialOutputLine) {
            out(NL); // Always goes to the next line.
            partialOutputLine = false;
          }
          setLineOffset(0);
          if (!self.mute) {
            cursor.eraseLine();
            //cursor.red();
            out(self.handler.prompt);
            cursor.show();
          }
        }
      }
      return self;
    }
    
    // Displays the prompt, current input, and positions  the cursor.
    function showCurrentLine(reprompt) {
      showPrompt(reprompt);
      /* istanbul ignore else */ 
      if (inNode) {
        setLineOffset(self.handler.prompt.length);
        //cursor.green();
        var text = currentInput.textLine;
        if (self.handler.pwdMode) {
          text = _.repeat('*', text.length);
        }
        out(text);
        if (!self.mute) cursor.eraseLine();
        var lineOffset = self.handler.prompt.length + inputOffset;
        setLineOffset(lineOffset);
        
        // TODO - allow the entry to be longer than the visible line.
        // use:  self.displayCols and when the text is wider than available
        // switch to :
        //     'prompt>...line of text is too long.'
        //  or 'prompt>This line of text is too ...'
      }
      return self;
    }
  
    // Displays the prompt, current input, and positions  the cursor.
    function updateCurrentLine() {      
      /* istanbul ignore else */
      if (inNode) {
        if (!promptVisible) showCurrentLine();
      }
    }

    function rightArrow() {
      if (inputOffset < currentInput.textLine.length) {
        inputOffset++;
      }
      return showCurrentLine();
    }
    
    function leftArrow() {
      if (inputOffset > 0) {
        inputOffset--;
      }
      return showCurrentLine();
    }
    
    function backSpace() {
      if (inputOffset > 0) {
        inputOffset--;
        currentInput.textLine = delChar(currentInput.textLine, inputOffset);
      }
      return showCurrentLine();
    }

    function deleteChar() {
      if (inputOffset < currentInput.textLine.length) {
        inputOffset++;
        return backSpace();
      }
      return showCurrentLine();
    }
    
    function endOfLine() {
      inputOffset = currentInput.textLine.length;
      return showCurrentLine();
    }

    function startOfLine() {
      inputOffset = 0;
      return showCurrentLine();
    }

    function toggleInsertMode() {
      insertMode = !insertMode;
      return self;
    }

    function clearLine() {
      inputOffset = 0;
      currentInput.textLine = '';
      return showCurrentLine();
    }

    function previousSavedLine() {
      if (currentInput.multiLine) {
        // Not Implemented.
      }
      else {
        promptVisible = false;
        if (currentSavedInputIndex === 0) {
          savedInitialLine = currentInput.textLine;
        }
        if (self.savedInputLines.length > currentSavedInputIndex) {
          if (!scrollingPrevious &&
            self.savedInputLines.length > currentSavedInputIndex + 1) {
            currentSavedInputIndex++;
          }
          currentInput = makeLine(self.savedInputLines[currentSavedInputIndex]);
          currentSavedInputIndex++;
          scrollingPrevious = true;
        }
        else {
          currentInput = makeLine(savedInitialLine);
        }
        return endOfLine();
      }  
    }

    function nextSavedLine() {
      if (currentInput.multiLine) {
        // Not Implemented.
      }
      else {
        promptVisible = false;
        if (currentSavedInputIndex > 0) {
          currentSavedInputIndex--;
          if (scrollingPrevious && currentSavedInputIndex > 0) {
            currentSavedInputIndex--;
          }
          scrollingPrevious = false;
          currentInput = makeLine(self.savedInputLines[currentSavedInputIndex]);
        }
        else {
          currentInput = makeLine(savedInitialLine);
        }
        return endOfLine();
      }
    }
    
    // Handles auto completion.
    function autoComplete() {
      if (self.completer) {
        currentInput.textLine += '-TAB FIXME-';
        return endOfLine();
      }
    }

    // Provide the input to a client.
    function handlePendingInput() {
      if (pendingInputs.length > 0) {
        // If there's a consumer for the input, handle it.
        if (self.handler.func) {
          fetchPendingInput();
        }
        while (self.handler.func) {
          var response = self.handler.func(self.lastLine);
          // This handler no longer wants to do the job.
          if (response === false) {
            self.handler = handlers.pop();
            if (inBrowser) {
              consolePrompt.innerHTML = self.handler.prompt;
              consoleInput.type = self.handler.pwdMode ? 'password' : 'text';
            }
            return self; // All done.
          }
          else if (response === true) {
            return self; // All is well, all done.
          }
          else if (_.isString(response)) {
            // Allow the handler to act as a translator for the input.
            self.handler = handlers.pop();
            self.lastLine = response;
          }
          else {
            throw new Error('Invalid line handler response');
          }
        }
      }
      return self;
    }
    
    // Handles Enter for single line entries.
    function enter() {
      activity = true;
      if (inNode) {
        if (self.handler.pwdMode) {
          showPrompt(true);
          out(_.repeat('*', self.maxPasswordLength));
        }
        else {
          showCurrentLine();
        }
        out(NL);
      }
      else {
        // Enters the current line even if it has not changed.
        currentInput = makeLine(consoleInput.value);
        consoleInput.value = '';
        var textLine = currentInput.textLine;
        if (self.handler.pwdMode) {
          textLine = _.repeat('*', self.maxPasswordLength);
        }
        out('--> ' + self.handler.prompt + textLine + '\n');
      }
      pendingInputs.push(currentInput);
      currentInput = makeLine('');
      inputOffset = 0;
      promptVisible = false;
      return handlePendingInput();
    }

    function handleKeyEvent(kc) {
      switch (kc) {
        case 'cr': return enter();
        case 'tab': return autoComplete();
        case 'bs': return backSpace();
        case 'del': return deleteChar();
        case 'esc': return clearLine();
        case 'ins': return toggleInsertMode();
        case 'right': return rightArrow();
        case 'left': return leftArrow();
        case 'home': return startOfLine();
        case 'end': return endOfLine();
        case 'up': return previousSavedLine();
        case 'down': return nextSavedLine();
      }
      return self;
    }

    function handleVisibleInputChar(ch) {
      currentInput.textLine = 
          setChar(currentInput.textLine, inputOffset, ch, insertMode);
      inputOffset++;
      return showCurrentLine();
    }

    //------------------------------------------------------------------------
    //                            Public Methods
    //------------------------------------------------------------------------

    /**
     * @summary **Define a close handler**
     */    
    CliConsole.prototype.onClose = function onClose(func) {
      self.closeHandler = func;
    }
    
    /**
     * @summary **Close the input stream**
     */    
    CliConsole.prototype.close = function close() {
      if (running) {
        running = false;
        removeEventHandlers();
        timer.stop();
        if (self.closeHandler) self.closeHandler();
      }
    }
    
    /**
     * @summary **Clear the screen**
     */    
    CliConsole.prototype.clearScreen = inNode ? 
      function clearScreen() {
        if (self.mute) return;
        activity = true;
        var windowSize = process.stdout.getWindowSize();
        var linesPerScreen = windowSize[1];
        var lineFeeds = _.repeat('\n', linesPerScreen);
        cursor.write(lineFeeds);
        cursor.eraseData(2);
        cursor.goto(1, 1);
      }
    : /* istanbul ignore next */
      function clearScreen() {
        if (self.mute) return;
        activity = true;
        consoleOutput.innerHTML = '';
      };

    /**
     * @summary **Output some text info to the consolee**
     * @description
     * Outputs normal text to the console. On node clients the pending
     * input line is erased and restored later when input continues.
     * On a browser this just adds text to the output.
     * @param {string} the line to output to the console.
     */    
    CliConsole.prototype.write = inNode ? 
      function write(text) {
        if (promptVisible) {
          setLineOffset(0);
          /* istanbul ignore else */ 
          if (!self.mute) {
            cursor.eraseLine();
            cursor.hide();
          }
        }
        out(text);
        partialOutputLine = false;
        if (text.length > 0) {
          var ch = text[text.length - 1];
          partialOutputLine = (ch !== '\r' && ch !== '\n');
        }
        promptVisible = false;
        return self;
      }
    : /* istanbul ignore next */
      function write(text) {
        out(text);
      };
    
    /**
     * @summary **Output a text line to the consolee**
     * @description
     * Outputs a normal text line to the console.
     * @param {string} the line to output to the console.
     */    
    CliConsole.prototype.writeLine = inNode ? 
      function writeLine(textLine) {
        activity = true;
        self.write(textLine);
        out(NL);
        partialOutputLine = false;
        return self
      }
    : /* istanbul ignore next */
      function writeLine(textLine) {
        activity = true;
        self.write(textLine + '\n');
        return self
      };

    /**
     * @summary **Establish the line handler**
     * @description
     * There is only one line handler at a time. Each new handler
     * pushes the previous one on a stack. If a handler returns true,
     * then it will continue to accept new messages. A handler returns
     * false to indicate that it the previous handler should accept the
     * next input. Return the input string (or a different one) to pop
     * to the prior handler and provide it with the string.
     * @param {function} handler the function(text)
     * @param {string} prompt a new prompt to use (optional).
     * @param {bool} password true for password entry mode (optional)
     */    
    CliConsole.prototype.setLineHandler =
    function setLineHandler(handler, prompt, passwordMode) {
      activity = true;
      // Use the previous prompt if one is not supplied.
      if (!prompt) prompt = self.handler.prompt;
      handlers.push(self.handler);
      self.handler = {
        func: handler,
        prompt: prompt,
        pwdMode: passwordMode
      };
      /* istanbul ignore else */
      if (inNode) {
        showCurrentLine(true);
      }
      else {
        consolePrompt.innerHTML = self.handler.prompt;
        consoleInput.type = self.handler.pwdMode ? 'password' : 'text';
      }
    }
    
    /**
     * @summary **Establish a line completer**
     * @description
     * When present the line completer provide info for tab completion.
     * @param {function} completer the tab completion function
     */    
    CliConsole.prototype.setCompleter = function setCompleter(completer) {
      self.completer = completer;
    }
    
    /**
     * @summary Ask a question from the console
     * @description
     * Asks for a response from the user. If an object is supplied this
     * returns a promise to the object being modified, otherwise it returns
     * a promise to the answer string.
     * Blank lines return an error.
     * If the passed in object contains an initialized field of
     * then no question is asked and the promise is satisfied immediately.
     * @param {string} query the text question to ask.
     * @param {Object} obj the optional object to be modified
     * @param {string} field the field name in the obj to be set
     * @param {bool} isPwd true if password blanking is to be used.
     * @returns {Q} returns Promise(Object|string), the `obj` or the answer string
     */
    CliConsole.prototype.ask = function ask (query, obj, field, isPwd) {
      if (obj && obj.field) {
        return qq(obj);
      }
      var qD = qq.defer();
      self.setLineHandler(function(answer) {
        if (answer) {
          if (obj) {
            obj[field] = answer;
            qD.resolve(obj);
          }
          else {
            qD.resolve(answer);
          }
        }
        else {
          qD.reject(new Error('Blank line not allowed. Entry abandoned'));
        }
        return false; // Only ask once.
      }, query, isPwd === true ? true : false);
      return qD.promise;
    }

    /**
     * @summary **Spoof a line into input**
     * @description
     * The line of text is pushed to the console just as if it was entered
     * by a human being. This is usually used by test routines but can
     * be used by apps for sneaky purposes.
     * @param {string} text the line to spoof.
     */    
    CliConsole.prototype.spoofInput = function spoofInput(text) {
      var line = makeLine(text);
      pendingInputs.push(line);
      out('--- Spoofed>' + text + NL);
    }

    /**
     * @summary **Spoof text chars into input**
     * @description
     * If a string is supplied, it is treated as a line and is spoofed as
     * the chars in the string followed by ENTER. A number is treated as
     * a single Unicode character value, and an array must be an array
     * of keycode values that represents a single action (such as a VT100
     * escape sequence).
     * @param {string|array|number} text the text to spoof.
     */    
    CliConsole.prototype.spoofInputChars = function spoofInputChars(text) {
      var chars = [];
      if (_.isString(text)) {
        var inputLine = text + CR;
        for (var i = 0; i < inputLine.length; i++) {
          var cc = inputLine.charCodeAt(i);
          pushRawKey(String.fromCharCode(cc));
        }
        return;
      }
      else if (_.isArray(text)) {
        chars = text;
      }
      else {
        chars.push(text);
      }
      var rc = '';
      chars.forEach(function (cc) { rc += String.fromCharCode(cc); });
      pushRawKey(rc);
    }
    
    /**
     * @summary **Call a function when a pause has occurred**
     * @description
     * Test routines that need to answer questions like password entry
     * must wait for the question to be asked.  This lets the test
     * pause until the output is idle for a few ms.
     * @param {number} ms optional pause time in ms (default 100).
     * @param {function} handler the handler to call after the pause.
     */    
    CliConsole.prototype.onPause = function onPause(ms, func) {
      var t = 100;
      var f = func;
      if (_.isNumber(ms)) {
        t = ms;
        f = func;
      }
      else {
        f = ms;
      }
      self.pauseTimer = new EggTimer(t).onDing(function() {
        self.pauseTimer = null;
        f();
      });
    }

    /**
     * @summary **Set up an output idle timer**
     * @description
     * Test routines can supply an EggTimer that will be reset on every
     * keystroke or output, but will ding when nothing happens for a
     * while.
     * @param {EggTimer} idleTimer the timer
     */    
    CliConsole.prototype.setIdleTimer = function setIdleTimer(idleTimer) {
      self.idleTimer = idleTimer;
    }

    //------------------------------------------------------------------------
    //                            Event Handlers
    //------------------------------------------------------------------------

    // This eggTimer is the core handler for interaction with the user.
    // Whenever output stops for a while, this timer handles any keys
    // that the user has managed to type in the meantime.
    timer.onDing(function processPendingInputs() {
try {
      // In a browser client, the inputs are pushed directly into the
      // pendingInputs list so no keys ever end up in the keyQueue.
      var n = keyQueue.length;
      var keys = keyQueue;
      keyQueue = [];
      if (n > 0) {
        keys.forEach(function handleKey(key) {
          if (key.keyCode) {
            handleKeyEvent(key.keyCode);
          }
          else if (key.visibleChar) {
            handleVisibleInputChar(key.visibleChar);
          }
          /* istanbul ignore next */
          else if (key.ctrlCode) {
console.log('********** Unhandled key code', key);                        
            var e = 'Unhandled key code:' + hexString(key.ctrlCode);
            self.error = new Error(e);
            keyQueue = [];
          }
          /* istanbul ignore next */
          else {
console.log('********** Unrecognized key event', key);            
            var ee = 'Unrecognized key event' + JSON.stringify(key);
            self.error = new Error(ee);
            keyQueue = [];
          }
        });
      }
      else {
        // Prompt the user for more input.
        handlePendingInput();
        updateCurrentLine();
      }

      // The keyboard is more peppy when there are pending keystrokes.
      timer.reset();
      /* istanbul ignore if */
      if (inBrowser & activity) {
        var alignToTop = false;
        consoleInput.scrollIntoView(alignToTop);
        activity = false;
      }
}
catch (e) {
  /* istanbul ignore next */
  console.log('********** timer.onDing', e.stack);
}      
    });

    // Character input just saves the characters for later.
    // Control C is the only exception - by default, it will kill the
    // process graveyard dead.
    function pushRawKey(cch) {
      if (cch !== null) {
        var k = getKeyCode(cch);
        if (k) {
          if (k === 'ctrlC') {
            if (self.closeHandler) {
              self.closeHandler();
            }
            self.writeLine('[' + k + '] - Exit');
            process.exit();
          }
          keyQueue.push({ keyCode: k });
        }
        else {
          if (cch.length > 1) {
            keyQueue.push({ ctrlCode: cch });
          }
          else {
            if (isPrintableAscii(cch)){
              keyQueue.push({ visibleChar: cch });
            }
            else {
              keyQueue.push({ ctrlCode: cch });
            }
          }
        }
      }

      timer.forceDing();
    }

    function inReadableHandler() {
      var cch = inStream.read();
      pushRawKey(cch);
    }
    
    function inCloseHandler() {
      self.close();
      console.log('---- END ----');
      self.error = new Error('The console is now endeed');
    }  

    function inErrorHandler(e) {
      self.close();
      console.log('---- ERROR:', e.stack);
      self.error = e;
    }

    //------------------------------------------------------------------------
    // Note that on Windows, resizing the window by dragging the size
    // handle around never changes the column count (since it can scroll)
    // but strangely does change the row count to match the number of
    // visible rows.
    /* istanbul ignore next */
    function resizeHandler () {
      console.log('- screen size has changed to ',
         outStream.columns + ' columns by ' + outStream.rows + ' rows.');
      self.displayRows = outStream.rows;
      self.displayCols = outStream.columns;
    }

    //------------------------------------------------------------------------
    // Install or remove the list of event handlers.
    function installEventHandlers(remove) {
      self.eventHandlers.forEach(function (handler) {
        if (remove) {
          handler.obj.removeListener(handler.name, handler.func);
        }
        else {
          handler.obj.on(handler.name, handler.func);
        }
      });
    }
    
    function removeEventHandlers() {
      installEventHandlers(true);
      self.eventHandlers = [];
    }
    
    //------------------- Browser client event handlers -------------------
    // TODO: Add a removeEventListener to get rid of these on close.
    
    /* istanbul ignore if */
    if (inBrowser) {
      // TODO: Switch to using addEventListener.
      consoleInput.onchange = function () {
        enter();
        timer.forceDing();
      };

      // TODO: Switch this to use event.key instead of 'which'.
      // TODO: Switch to using addEventListener.
      consoleInput.onkeydown = function (event) {
        var handled = false;
        var keynum = event.which;
        if (keynum === 13) { // Enter
          enter();
          timer.forceDing();
          handled = true;
        }
        else if (keynum === 27) { // Escape
          consoleInput.value = '';
          handled = true;
        }
        else if (keynum === 38) { // Arrow Up
          previousSavedLine();
          consoleInput.value = currentInput.textLine;
          handled = true;
        }
        else if (keynum === 40) { // Arrow Down
          nextSavedLine();
          consoleInput.value = currentInput.textLine;
          handled = true;
        }

        if (handled) {
          event.preventDefault();
          event.stopPropagation();
        }
      };

    } // end Browser specific event handlers.      
  }

  CliConsole.KeyCodes = KeyCodes;
  return CliConsole;
}
