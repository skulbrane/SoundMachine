'use strict';

var log = require('npmlog');
var ipc = require('ipc');
var config = require('config');
var app = require('app');
var BrowserWindow = require('browser-window');
var globalShortcut = require('global-shortcut');

var mainWindow = null;
var settingsWindow = null;

function registerAccellerators() {
    globalShortcut.unregisterAll();

    var shortcutKeySetting = config.readSettings('shortcutKeys');
    var shortcutPrefix = shortcutKeySetting.length === 0 ? '' : shortcutKeySetting.join('+') + '+';


    globalShortcut.register(shortcutPrefix + '1', function() {
        mainWindow.webContents.send('global-shortcut', 0);
    });

    globalShortcut.register(shortcutPrefix + '2', function() {
        mainWindow.webContents.send('global-shortcut', 1);
    });
}

function registerIpcEvents() {
    log.info('[*]=>Registering ipc events...');

    /*ipc.on('open-main-window', function() {
        if(mainWindow) {
            return;
        }

        createMainWindow();
    });*/

    ipc.on('close-main-window', function() {
        log.info('[*]:(registerIpcEvents())=>Recieved \'close-main-window\' event');
        app.quit();
    });

    ipc.on('open-settings-window', function() {
        log.info('[*]:(registerIpcEvents())=>Recieved \'open-settings-window\' event');
        if (settingsWindow) {
            return;
        }

        createSettingsWindow();
    });

    ipc.on('close-settings-window', function() {
        log.info('[*]:(registerIpcEvents())=>Recieved \'close-settings-window\' event');
        if (settingsWindow) {
            settingsWindow.close();
        }
    });

    ipc.on('set-global-shortcuts', function() {
        registerAccellerators();
    });

    registerAccellerators();
}

function loadConfig() {
    if (!config.readSettings('shortcutKeys')) {
        config.saveSettings('shortcutKeys', ['ctrl', 'shift']);
    }
}

function createMainWindow() {
    app.on('ready', function() {
        log.info('[*]:(createMainWindow())=>Recieved \'ready\' event');
        mainWindow = new BrowserWindow({
            frame: false,
            height: 700,
            resizeable: false,
            width:368
        });

        loadConfig();

        registerIpcEvents();

        mainWindow.loadUrl('file://' + __dirname + '/app/index.html');
    });

}

function createSettingsWindow() {
    settingsWindow = new BrowserWindow({
        frame: false,
        height: 200,
        resizeable: false,
        width: 200
    });
    log.info('[*]:[main.js:createSettingsWindow()]=>Creating settings window...');
    settingsWindow.loadUrl('file://' + __dirname + '/app/settings.html');

    settingsWindow.on('closed', function() {
        settingsWindow = null;
    });
}

createMainWindow();
