(function () {

    /**
     * Displays logging information on the screen and in the console.
     * @param {string} msg - Message to log.
     */
    function log(msg) {
        var logsEl = document.getElementById('logs');

        if (msg) {
            // Update logs
            console.log('[RegisterKeys]: ', msg);
            logsEl.innerHTML += msg + '<br />';
        } else {
            // Clear logs
            logsEl.innerHTML = '';
        }

        logsEl.scrollTop = logsEl.scrollHeight;
    }

    /**
     * Register keys used in this application
     */
    function registerKeys() {
        var usedKeys = ['1', '2', '3', '4', 'ColorF0Red'];

        usedKeys.forEach(
            function (keyName) {
                tizen.tvinputdevice.registerKey(keyName);
            }
        );
    }


    /**
     * Handle input from remote
     */
    function registerKeyHandler() {
        document.addEventListener('keydown', function (e) {
            switch (e.keyCode) {
                case 38: //UP arrow
                    keys.blur();
                    if (keys.key === keys.parent.firstElementChild) {
                        keys.key = keys.parent.lastElementChild;
                    } else {
                        keys.key = keys.key.previousElementSibling;
                    }
                    keys.focus();
                    break;
                case 40: //DOWN arrow
                    keys.blur();
                    if (keys.key === keys.parent.lastElementChild) {
                        keys.key = keys.parent.firstElementChild;
                    } else {
                        keys.key = keys.key.nextElementSibling;
                    }
                    keys.focus();
                    break;
                case 13: //OK button
                    var keyName = keys.key.id + keys.key.innerHTML,
                        index;
                    if ((
                            index = keys.registeredKeys.indexOf(keyName)
                        ) !== -1) {
                        log("OK - unregister key: " + keyName);
                        keys.registeredKeys.splice(index, 1);
                        tizen.tvinputdevice.unregisterKey(keyName);
                    } else {
                        log("OK - register key: " + keyName);
                        keys.registeredKeys.push(keyName);
                        tizen.tvinputdevice.registerKey(keyName);
                    }
                    break;
                case 10009: //RETURN button
                    tizen.application.getCurrentApplication().hide();
                    break;
                default:
                    log("Key code : " + e.keyCode);
                    break;
            }
        });
    }

    /**
     * Display application version
     */
    function displayVersion() {
        var el = document.createElement('div');
        el.id = 'version';
        el.innerHTML = 'ver: ' + tizen.application.getAppInfo().version;
        document.body.appendChild(el);
    }

    /**
     *
     */
    var keys = {
        parent: null,
        key: null,
        registeredKeys: [],
        focus: function () {
            this.key.classList.add('focused');
        },
        blur: function () {
            this.key.classList.remove('focused');
        }
    };

    /**
     * Start the application once loading is finished
     */
    window.onload = function () {
        if (window.tizen === undefined) {
            log('This application needs to be run on Tizen device');
            return;
        }

        displayVersion();
        registerKeys();
        registerKeyHandler();


        keys.parent = document.getElementById('keys');
        keys.key = keys.parent.firstElementChild;
        keys.focus();
    }

})();