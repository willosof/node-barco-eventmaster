# Barco EventMaster REST API
Node.js wrapper module for Barco EventMaster REST API.

***IMPORTANT!** NOT ALL CALLS HAVE BEEN PROPERLY TESTED YET. USE AT OWN RISK. Everything should be pretty straight forward and working, though. Jinx.*

## Installation and usage example

**Installation**
```
npm install barco-eventmaster
```

**Example**
```js
const EventMaster = require('barco-eventmaster');

// Change this IP to your own E2/S3 IP
const em = new EventMaster('10.0.0.1');

// Get all preset names
em.listPresets((err, presets) => {
  if (err) {
    console.error("Something went wrong with the event master request", err);
    return;
  }
  console.log("Current presets:", presets);
});
```

## Available API calls

All API calls are documented with JSDoc comments in the module source code. Most methods follow the pattern:  
`em.methodName(params..., callback)`  
where `params` are the required parameters for the API call, and `callback` is a function `(err, result)`.

### Presets
- `listPresets(cb)`  
- `savePreset(params, cb)`  
- `renamePreset(params, cb)`  
- `deletePreset(params, cb)`  
- `activatePreset(params, cb)`  
- `recallNextPreset(cb)`  
- `listDestinationsForPreset(id, cb)`

### Sources, Destinations, and Layers
- `listSources(cb)`  
- `listDestinations(cb)`  
- `listInputs(inputId, cb)`  
- `listOutputs(outputCfgId, cb)`  
- `fillHV(screenId, Layers, cb)`  
- `clearLayers(screenId, Layers, cb)`  
- `freezeDestSource(params, cb)`  

### Cues
- `listCues(cb)`  
- `recallCue(id, cb)`  
- `storeCue(id, cb)`  
- `deleteCue(id, cb)`  
- `takeCue(cb)`  
- `activateCue(params, cb)`

### User Keys
- `listUserKeys(cb)`  
- `recallUserKey(params, cb)`  
- `storeUserKey(name, cb)`  
- `deleteUserKey(id, cb)`

### Operators
- `listOperators(cb)`  
- `configureOperator(params, cb)`

### Stills
- `listStill(cb)`  
- `takeStill(params, cb)`  
- `deleteStill(id, cb)`

### Backups
- `listSourceMainBackup(inputType, cb)`  
- `activateSourceMainBackup(params, cb)`  
- `resetSourceMainBackup(id, cb)`

### Aux and Content
- `listAuxContent(id, cb)`  
- `changeAuxContent(params, cb)`  
- `listContent(id, cb)`  
- `changeContent(params, cb)`

### Power and Frame
- `powerStatus(cb)`  
- `resetFrameSettings(resetType, saveOptions, cb)`

### Groups and Transitions
- `activateDestGroup(params, cb)`  
- `armUnarmDestination(params, cb)`  
- `allTrans(cb)`  
- `cut(cb)`

### MVR (MultiViewer)
- `listMvrPreset(id, cb)`  
- `activateMvrPreset(id, cb)`  
- `mvrLayoutChange(params, cb)`

---

**Note:**  
- All methods use a callback as the last argument: `(err, result)`.
- For complex parameter objects, see the JSDoc comments in the source code for details and examples.

## Author
William Viker  
<william.viker@gmail.com>

## Contributors
Jeffrey Davidsz  
<jeffrey.davidsz@vicreo.eu>

## Bugs or wishes
Please file a ticket or pull request in GitHub if you find something that should be better or isn't working properly.