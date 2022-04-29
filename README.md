
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

`allTrans(cb)`

 – It executes “allTrans” command.

`cut(cb)`

 – It executes “Cut” command.

`resetFrameSettings(resetKind, cb)`

 – Expose ALL reset types on Event Master processor with different options.

`powerStatus(cb)`

 – This queries the power plug status of the Event Master processor. (There can be 1 or 2 power slots in Event

`listPresets(ScreenDest, AuxDest, cb)`

 – This queries the list of presets on a particular destination or on the system.

`listDestinationsForPreset(presetId)`

 – Lists the content of a Preset.

`savePreset(presetName, ScreenDestinationsArray, AuxDestinationsArray, cb)`

 – Creates a Preset on the Event Master processor.

`renamePresetById(presetId, newPresetName, cb)`
`renamePresetBySno(presetSno, newPresetName, cb)`
`renamePresetByName(presetName, newPresetName, cb)`

 – Rename a Preset on the Event Master processor. User can rename Preset with id, Preset serial number, or preset name. – Send any one of the parameters to rename Preset.

`activatePresetById(presetId, recallInProgramInt, cb)`
`activatePresetBySno(presetSno, recallInProgramInt, cb)`
`activatePresetByName(presetName, recallInProgramInt, cb)`

 – Recall a Preset on the Event Master processor. User can recall Preset with id, Preset serial number, or Preset name. – Send any one of the parameters to recall Preset.

`deletePresetById(presetId, cb)`
`deletePresetBySno(presetSno, cb)`
`deletePresetByName(presetName, cb)`

 – Delete a Preset on the Event Master processor. User can delete Preset with id, Preset serial number, or Preset name. – Send any one of the parameters to delete Preset.

`recallNextPreset(cb)`

 – Recall the next Preset on the Event Master processor. – No parameter is required – Make sure that the user has at least recalled one Preset. Web app recalls the next Preset from the last Preset recalled

`listDestinations(type, cb)`

 – This API lists all the destinations with properties such as layers, outputs, id, size, and name.

`listSources(type, cb)`

 – This API lists all the input sources with properties.

`listContent(id, cb)`

 – This API shows the content of a screen destination.

`changeContent(screenDestIndex, bgLayer, Layers, cb)`

 – This API changes the content of a screen destination by putting background and layers in it.

`changeAuxContent(auxDestIndex, pvwLastSrcIndex, pgmLastSrcIndex, cb)`

 – This API changes the source in the Aux destinations.

`changeAuxContentName(auxDestIndex, name, pvwLastSrcIndex, pgmLastSrcIndex, cb)`

 – This API changes the source in the Aux destinations. (and change the name of that aux?)

`freezeDestSource(type, id, screenGroup, mode, cb)`

 – This API Freezes/Unfreezes the sources.

`listStill(cb)`

 – This API lists all the stills with properties such as id, Name, H/V size, LockMode, StillState, PngState, File size.

`deleteStill(stillIndex,cb)`

 – This API deletes a still.

`takeStill(type, id, fileid, cb)`

 – This API creates/overwrites a still.

`getFrameSettings(cb)`

 – This API shows system information, including all the frames information.

`listAuxContent(auxDestIndex, cb)`

 – This API shows Aux destination information.

`subscribe(hostname, port, notificationTypes, cb)`

 – User can use this API to subscribe to change events in the Event Master processor. Once subscribed, the API

`unsubscribe(hostname, port, notificationTypes, cb)`

 – User can use this API to remove the subscription for the given hostname: port and notificationType.

`activateCueById(id, type, cb)`

 – Activate cue in eventmaster cuelist

`activateCueByCueName(cueName, type, cb)`

 – Activate cue in eventmaster cuelist

`activateCueByCueSerialNo(cueSerialNo, type, cb)`

 – Activate cue in eventmaster cuelist

`listCues = function(cb)`

 – List cues in eventmaster cuelist

`control3d(id, type, syncSource, syncInvert, cb)`

 – controls 3d options

## Functions supported from version 6.3.0

`activateDestGroup(id, cb)`

 – recalls a DestGroup

`changeAuxContentTestPattern(id, testPattern, cb)`
`changeContentTestPattern(id, testPattern, cb)`

 – add test pattern control for changeContent for Screen Dest and changeAuxContent for Aux Dest

`armUnarmDestination(arm, screenDestinations, auxDestinations, cb)`

 – Ability to arm / unarm Destination

## Functions supported from version 8.2.0

`fillHV(screenId, Layers, cb)`

–	Fits layers to screen destination horizontally and vertically.

`clearLayers(screenId, Layers, cb)`

–	Clear layers from screen destinations only for custom mode.

`recallUserKey(userkeyName, ScreenDestination, Layer, cb)`

–	Recall a UserKey on the Event Master processor. User can recall UserKey with UserKey name.

`listUserKeys(cb)`

–	This API lists all userkeys in the system.

`listSourceMainBackup(inputType, cb)`

–	This API shows list of inputs and backgrounds which has backup configured.

`resetSourceMainBackup(source, cb)`

–	This API reset the applied source backup to primary.

`listInputs(index, cb)`

–	This queries the list of inputs configured.

`listOutputs(index, cb)`

–	This queries the list of outputs configured.

`mvrLayoutChange(frameUnitId, mvrLayoutId, cb)`

- This API changes layout in the given frame multiviewer.

`listOperators(cb)`

- This queries the list of outputs configured.

`configureOperator(params, cb)`

- This API helps user to configure operator.

`activateSourceMainBackup(params, cb)`

- This API configures the Backup options for a source

## Author
William Viker
<william.viker@gmail.com>

## Contributors
Jeffrey Davidsz
<jeffrey.davidsz@vicreo.eu>

## Bugs or wishes
Please file a ticket or pull request in github if you find something that should be better. And, well, if something isn't working properly.
