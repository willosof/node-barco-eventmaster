
# Barco EventMaster REST API
Node.js wrapper module for Barco EventMaster REST API.

***IMPORTANT!** NOT ALL CALLS HAVE BEEN PROPERLY TESTED YET. USE AT OWN RISK. Everything should be pretty straight forward and working, though. Jinx.*

## Installation and usage example
**Installation**
```
npm install barco-eventmaster
```
**Example**
```
var EventMaster = require('barco-eventmaster');

// Change this ip to your own E2/S3 IP
var em = new EventMaster('10.0.0.1');

// Get all preset names
em.listPresets(-1, -1, function(err, presets) {
	if (err !== null) {
		console.log("Current presets");
		console.log(presets);
	}
	else {
		console.log(err);
		throw "Something went wrong with the event master request";
	}
});

return self;
```
## Available API calls
Some of the calls have slightly modified variable names going into the function than the ones specified in the documentation to help out the editors with autocompletion/hints. Some of the API calls will also need further looking into documentation on formatting, due to their complexity, it would gain noone to implement this into this module.

All the API calls is also in comments in the module source code over each function declaration.

```
query(method, params, cb)
allTrans(type, params, cb)
cut(type, params, cb)
resetFrameSettings(resetKind, cb)
powerStatus(cb)
listPresets(ScreenDest, AuxDest, cb)
listDestinationsForPreset(presetId)
savePreset(
renamePresetById(presetId, newPresetName, cb)
renamePresetBySno(presetSno, newPresetName, cb)
renamePresetByName(presetName, newPresetName, cb)
activateSourceMainBackup(
activatePresetById(presetId, recallInProgramInt, type, params, cb)
activatePresetBySno(presetSno, recallInProgramInt, type, params, cb)
activatePresetByName(presetName, recallInProgramInt, type, params, cb)
recallNextPreset(cb)
deletePresetById(presetId, type, params, cb)
deletePresetBySno(presetSno, type, params, cb)
deletePresetByName(presetName, type, params, cb)
listDestinations(type, cb)
listSources(type, cb)
activateCueById(id, type, cb)
activateCueByCueName(cueName, type, cb)
activateCueByCueSerialNo(cueSerialNo, type, cb)
listCues(type, cb)
activateDestGroup(id, cb)
control3d(id, type, syncSource, syncInvert, cb)
listContent(id, cb)
listSuperDestContent(id, cb)
listSuperAuxContent(id, cb)
changeContent(screenDestIndex, bgLayer, Layers, cb)
freezeDestSource(type, id, screenGroup, mode, cb)
listStill(cb)
deleteStill(stillIndex, cb)
takeStill(type, id, fileid, cb)
getFrameSettings(cb)
listAuxContent(auxDestIndex, cb)
changeAuxContent(id, pvwLastSrcIndex, pgmLastSrcIndex, cb)
changeAuxContentName(id, name, pvwLastSrcIndex, pgmLastSrcIndex, cb)
subscribe(hostname, port, notificationTypes, cb)
unsubscribe(hostname, port, notificationTypes, cb)
armUnarmDestination(arm, screenDestinations, auxDestinations, cb)
fillHV(screenId, Layers, cb)
clearLayers(screenId, Layers, cb)
recallUserKey(userkeyName, ScreenDestination, Layer, cb)
listUserKeys(cb)
listSourceMainBackup(inputType, cb)
resetSourceMainBackup(source, cb)
listInputs(index, cb)
listOutputs(index, cb)
mvrLayoutChange(frameUnitId, mvrLayoutId, cb)
listOperators(cb)
configureOperator(params, cb)
changeAuxContentTestPattern(id, testPattern, cb)
changeContentTestPattern(id, testPattern, cb)
listDestGroups(cb)
listDestGroupsPerType(type, cb)
```

## Author
William Viker
<william.viker@gmail.com>

## Contributors
Jeffrey Davidsz
<jeffrey.davidsz@vicreo.eu>

## Bugs or wishes
Please file a ticket or pull request in github if you find something that should be better. And, well, if something isn't working properly.
