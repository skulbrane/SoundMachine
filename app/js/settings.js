'use-strict';

var ipc = require('ipc');
var config = require("config");

var modCboxes = document.querySelectorAll('.global-shortcut');

var bindModCBox = function(e) {
    bindModifierCheckboxes(e);
}

for (var i=0; i<modCboxes.length; i++) {
    var shortcutKeys = config.readSettings('shortcutKeys');

    var modifierKey = modCboxes[i].attributes['data-modifier-key'].value;
    modCboxes[i].checked = shortcutKeys.indexOf(modifierKey) !== -1;

    // Click binds...
    modCboxes[i].addEventListener('click', bindModCBox);
}

function bindModifierCheckboxes(e) {
    var shortcutKeys = config.readSettings('shortcutKeys');
    var modifierKey = e.target.attributes['data-modifier-key'].value;

    if (shortcutKeys.indexOf(modifierKey) !== -1) {
        var shortcutKeyIndex = shortcutKeys.indexOf(modifierKey);
        shortcutKeys.splice(shortcutKeyIndex, 1);
    } else {
        shortcutKeys.push(modifierKey);
    }

    config.saveSettings('shortcutKeys', shortcutKeys);
    ipc.send('set-global-shortcuts');
}

var closeEl = document.querySelector('.close');
closeEl.addEventListener('click', function(e) {
    ipc.send('close-settings-window');
});
