// EventMaster API wrapper for Encore 3
const axios = require('axios');

class EventMaster {
  constructor(host) {
    this.host = host;
    this.id = 0;
  }

  /**
   * Internal: Send a JSON-RPC request to the EventMaster API.
   * @param {string} method - The API method name.
   * @param {object} params - Parameters for the API call.
   * @param {Function} callback - Callback function (err, result).
   */
  postJsonRpc(method, params, callback) {
    const payload = {
      jsonrpc: '2.0',
      id: ++this.id,
      method,
      params,
    };

    const url = `http://${this.host}/json-rpc`;
    axios
      .post(url, payload)
      .then((res) => callback(null, res.data?.result))
      .catch((err) => callback(err));
  }

  /**
   * Internal: Add operator or super user parameters to a request.
   * @param {object} params - Original parameters.
   * @param {string} type - 'operator' or 'super_user'.
   * @param {string|number} value - Operator ID or password.
   * @returns {object} - Parameters with operatorId or password added.
   */
  withOperatorParams(params, type, value) {
    if (type === 'operator') {
      return { ...params, operatorId: value };
    } else if (type === 'super_user') {
      return { ...params, password: value };
    }
    return params;
  }

  /**
   * List all presets.
   * @param {Function} cb - Callback function (err, result).
   */
  listPresets(cb) {
    this.postJsonRpc('listPresets', {}, cb);
  }

  /**
   * Recall a preset by ID and mode, with optional operator/super user.
   * @param {number} id - Preset ID.
   * @param {number} mode - Recall mode.
   * @param {string} type - 'operator' or 'super_user'.
   * @param {string|number} value - Operator ID or password.
   * @param {Function} cb - Callback function (err, result).
   */
  activatePresetById(id, mode, type, value, cb) {
    const params = this.withOperatorParams({ id, mode }, type, value);
    this.postJsonRpc('activatePresetById', params, cb);
  }

  /**
   * Recall the next preset.
   * @param {Function} cb - Callback function (err, result).
   */
  recallNextPreset(cb) {
    this.postJsonRpc('recallNextPreset', {}, cb);
  }

  /**
   * List all user keys.
   * @param {Function} cb - Callback function (err, result).
   */
  listUserKeys(cb) {
    this.postJsonRpc('listUserKeys', {}, cb);
  }

  /**
   * Recall a user key by ID.
   * @param {number} id - User key ID.
   * @param {Function} cb - Callback function (err, result).
   */
  recallUserKey(id, cb) {
    this.postJsonRpc('recallUserKey', { id }, cb);
  }

  /**
   * Store a user key by name.
   * @param {string} name - User key name.
   * @param {Function} cb - Callback function (err, result).
   */
  storeUserKey(name, cb) {
    this.postJsonRpc('storeUserKey', { name }, cb);
  }

  /**
   * Delete a user key by ID.
   * @param {number} id - User key ID.
   * @param {Function} cb - Callback function (err, result).
   */
  deleteUserKey(id, cb) {
    this.postJsonRpc('deleteUserKey', { id }, cb);
  }

  /**
   * List all sources.
   * @param {Function} cb - Callback function (err, result).
   */
  listSources(cb) {
    this.postJsonRpc('listSources', {}, cb);
  }

  /**
   * List all destinations.
   * @param {Function} cb - Callback function (err, result).
   */
  listDestinations(cb) {
    this.postJsonRpc('listDestinations', {}, cb);
  }

  /**
   * List all cues.
   * @param {Function} cb - Callback function (err, result).
   */
  listCues(cb) {
    this.postJsonRpc('listCues', {}, cb);
  }

  /**
   * Recall a cue by ID.
   * @param {number} id - Cue ID.
   * @param {Function} cb - Callback function (err, result).
   */
  recallCue(id, cb) {
    this.postJsonRpc('recallCue', { id }, cb);
  }

  /**
   * Store a cue by ID.
   * @param {number} id - Cue ID.
   * @param {Function} cb - Callback function (err, result).
   */
  storeCue(id, cb) {
    this.postJsonRpc('storeCue', { id }, cb);
  }

  /**
   * Delete a cue by ID.
   * @param {number} id - Cue ID.
   * @param {Function} cb - Callback function (err, result).
   */
  deleteCue(id, cb) {
    this.postJsonRpc('deleteCue', { id }, cb);
  }

  /**
   * Take a cue.
   * @param {Function} cb - Callback function (err, result).
   */
  takeCue(cb) {
    this.postJsonRpc('takeCue', {}, cb);
  }

  /**
   * Cut to black.
   * @param {Function} cb - Callback function (err, result).
   */
  cutToBlack(cb) {
    this.postJsonRpc('cutToBlack', {}, cb);
  }

  /**
   * Fade to black.
   * @param {number} duration - Fade duration.
   * @param {Function} cb - Callback function (err, result).
   */
  fadeToBlack(duration, cb) {
    this.postJsonRpc('fadeToBlack', { duration }, cb);
  }

  /**
   * Freeze or unfreeze output.
   * @param {boolean} freeze - Freeze state.
   * @param {Function} cb - Callback function (err, result).
   */
  setFreeze(freeze, cb) {
    this.postJsonRpc('setFreeze', { freeze }, cb);
  }

  /**
   * Set logo by ID.
   * @param {number} id - Logo ID.
   * @param {Function} cb - Callback function (err, result).
   */
  setLogo(id, cb) {
    this.postJsonRpc('setLogo', { id }, cb);
  }

  /**
   * Fit layers to destination horizontally and vertically.
   * @param {number} destinationId - Destination ID.
   * @param {object} fill - Fill parameters.
   * @param {Function} cb - Callback function (err, result).
   */
  fillHV(destinationId, fill, cb) {
    this.postJsonRpc('fillHV', { destinationId, fill }, cb);
  }

  /**
   * Cut transition.
   * Requires operatorId or password if multi-operator mode is enabled.
   * @param {Function} cb - Callback function (err, result).
   */
  cut(cb) {
    this.postJsonRpc('cut', {}, cb);
  }

  /**
   * Execute all transitions.
   * Requires operatorId or password if multi-operator mode is enabled.
   * @param {Function} cb - Callback function (err, result).
   */
  allTrans(cb) {
    this.postJsonRpc('allTrans', {}, cb);
  }

  /**
   * Query the power plug status of the Event Master processor.
   * @param {Function} cb
   */
  powerStatus(cb) {
    this.postJsonRpc('powerStatus', {}, cb);
  }

  /**
   * List all input configurations or a specific input by id.
   * @param {number} [inputId] Optional input id, -1 for all.
   * @param {Function} cb
   */
  listInputs(inputId, cb) {
    const params = {};
    if (typeof inputId === 'number') params.inputId = inputId;
    this.postJsonRpc('listInputs', params, cb);
  }

  /**
   * List all output configurations or a specific output by id.
   * @param {number} [outputCfgId] Optional output id, -1 for all.
   * @param {Function} cb
   */
  listOutputs(outputCfgId, cb) {
    const params = {};
    if (typeof outputCfgId === 'number') params.outputCfgId = outputCfgId;
    this.postJsonRpc('listOutputs', params, cb);
  }

  /**
   * Reset Encore3 processor with different options.
   * @param {number} resetType 0: Soft, 1: Factory, 2: Factory+Keep, 3: Power Down
   * @param {number} [saveOptions] Optional save options (0-4)
   * @param {Function} cb
   */
  resetFrameSettings(resetType, saveOptions, cb) {
    const params = { reset: resetType };
    if (typeof saveOptions === 'number') params.saveOptions = saveOptions;
    this.postJsonRpc('resetFrameSettings', params, cb);
  }

  /**
   * List all configured operators.
   * @param {Function} cb
   */
  listOperators(cb) {
    this.postJsonRpc('listOperators', {}, cb);
  }

  /**
   * Configure an operator.
   * @param {object} params Operator configuration parameters.
   * @param {Function} cb
   */
  configureOperator(params, cb) {
    this.postJsonRpc('configureOperator', params, cb);
  }

  /**
   * List all stills.
   * @param {Function} cb
   */
  listStill(cb) {
    this.postJsonRpc('listStill', {}, cb);
  }

  /**
   * Capture/overwrite a still.
   * @param {object} params {type, id, file}
   * @param {Function} cb
   */
  takeStill(params, cb) {
    this.postJsonRpc('takeStill', params, cb);
  }

  /**
   * Delete a still by id.
   * @param {number} id
   * @param {Function} cb
   */
  deleteStill(id, cb) {
    this.postJsonRpc('deleteStill', { id }, cb);
  }

  /**
   * List inputs with at least one backup configured.
   * @param {number} [inputType] -1: all, 0: inputs, 1: background
   * @param {Function} cb
   */
  listSourceMainBackup(inputType, cb) {
    const params = {};
    if (typeof inputType === 'number') params.inputType = inputType;
    this.postJsonRpc('listSourceMainBackup', params, cb);
  }

  /**
   * Configure backups on inputs/backgrounds.
   * @param {object} params
   * @param {Function} cb
   */
  activateSourceMainBackup(params, cb) {
    this.postJsonRpc('activateSourceMainBackup', params, cb);
  }

  /**
   * Reset input backup to primary source.
   * @param {number} id
   * @param {Function} cb
   */
  resetSourceMainBackup(id, cb) {
    this.postJsonRpc('resetSourceMainBackup', { id }, cb);
  }

  /**
   * List destinations with optional type.
   * @param {number} [type] 0: all, 1: screen, 2: aux
   * @param {Function} cb
   */
  listDestinations(type, cb) {
    const params = {};
    if (typeof type === 'number') params.type = type;
    this.postJsonRpc('listDestinations', params, cb);
  }

  /**
   * Show Aux destination information.
   * @param {number} id
   * @param {Function} cb
   */
  listAuxContent(id, cb) {
    this.postJsonRpc('listAuxContent', { id }, cb);
  }

  /**
   * Change source in Aux destination.
   * @param {object} params
   * @param {Function} cb
   */
  changeAuxContent(params, cb) {
    this.postJsonRpc('changeAuxContent', params, cb);
  }

  /**
   * Show content of a screen destination.
   * @param {number} id
   * @param {Function} cb
   */
  listContent(id, cb) {
    this.postJsonRpc('listContent', { id }, cb);
  }

  /**
   * Change content of a screen destination.
   * @param {object} params
   * @param {Function} cb
   */
  changeContent(params, cb) {
    this.postJsonRpc('changeContent', params, cb);
  }

  /**
   * List all user keys.
   * @param {Function} cb
   */
  listUserKeys(cb) {
    this.postJsonRpc('listUserKeys', {}, cb);
  }

  /**
   * Recall a user key by id or name.
   * @param {object} params
   * @param {Function} cb
   */
  recallUserKey(params, cb) {
    this.postJsonRpc('recallUserKey', params, cb);
  }

  /**
   * Store a user key by name.
   * @param {string} name
   * @param {Function} cb
   */
  storeUserKey(name, cb) {
    this.postJsonRpc('storeUserKey', { name }, cb);
  }

  /**
   * Delete a user key by id.
   * @param {number} id
   * @param {Function} cb
   */
  deleteUserKey(id, cb) {
    this.postJsonRpc('deleteUserKey', { id }, cb);
  }

  /**
   * Fit layers to screen destination horizontally and vertically.
   * @param {number} screenId
   * @param {Array} Layers
   * @param {Function} cb
   */
  fillHV(screenId, Layers, cb) {
    this.postJsonRpc('fillHV', { screenId, Layers }, cb);
  }

  /**
   * Clear layers from screen destinations.
   * @param {number} screenId
   * @param {Array} Layers
   * @param {Function} cb
   */
  clearLayers(screenId, Layers, cb) {
    this.postJsonRpc('clearLayers', { screenId, Layers }, cb);
  }

  /**
   * List presets, optionally for a specific destination.
   * @param {object} params
   * @param {Function} cb
   */
  listPresets(params, cb) {
    this.postJsonRpc('listPresets', params || {}, cb);
  }

  /**
   * Save a preset.
   * Requires operatorId or password if multi-operator mode is enabled.
   * @param {object} params
   * @param {Function} cb
   */
  savePreset(params, cb) {
    this.postJsonRpc('savePreset', params, cb);
  }

  /**
   * Rename a preset by id, serial number, or name.
   * @param {object} params
   * @param {Function} cb
   */
  renamePreset(params, cb) {
    this.postJsonRpc('renamePreset', params, cb);
  }

  /**
   * Delete a preset by id, serial number, or name.
   * Requires operatorId or password if multi-operator mode is enabled.
   * @param {object} params
   * @param {Function} cb
   */
  deletePreset(params, cb) {
    this.postJsonRpc('deletePreset', params, cb);
  }

  /**
   * Recall a preset by id, serial number, or name.
   * Requires operatorId or password if multi-operator mode is enabled.
   * @param {object} params
   * @param {Function} cb
   */
  activatePreset(params, cb) {
    this.postJsonRpc('activatePreset', params, cb);
  }

  /**
   * Recall the next preset.
   * @param {Function} cb
   */
  recallNextPreset(cb) {
    this.postJsonRpc('recallNextPreset', {}, cb);
  }

  /**
   * List destinations for a preset.
   * @param {number} id
   * @param {Function} cb
   */
  listDestinationsForPreset(id, cb) {
    this.postJsonRpc('listDestinationsForPreset', { id }, cb);
  }

  /**
   * Freeze or unfreeze sources.
   * @param {object} params
   * @param {Function} cb
   */
  freezeDestSource(params, cb) {
    this.postJsonRpc('freezeDestSource', params, cb);
  }

  /**
   * Arm or unarm destinations for transitions and saving presets.
   * @param {object} params
   * @param {Function} cb
   */
  armUnarmDestination(params, cb) {
    this.postJsonRpc('armUnarmDestination', params, cb);
  }

  /**
   * Recall a destination group by id or name.
   * Requires operatorId or password if multi-operator mode is enabled.
   * @param {object} params
   * @param {Function} cb
   */
  activateDestGroup(params, cb) {
    this.postJsonRpc('activateDestGroup', params, cb);
  }

  /**
   * List all cues or a specific cue.
   * @param {object} [params]
   * @param {Function} cb
   */
  listCues(params, cb) {
    this.postJsonRpc('listCues', params || {}, cb);
  }

  /**
   * Play, pause, or stop a cue.
   * @param {object} params
   * @param {Function} cb
   */
  activateCue(params, cb) {
    this.postJsonRpc('activateCue', params, cb);
  }

  /**
   * List all saved MVR presets.
   * @param {number} id
   * @param {Function} cb
   */
  listMvrPreset(id, cb) {
    this.postJsonRpc('listMvrPreset', { id }, cb);
  }

  /**
   * Recall a saved MVR preset.
   * @param {number} id
   * @param {Function} cb
   */
  activateMvrPreset(id, cb) {
    this.postJsonRpc('activateMvrPreset', { id }, cb);
  }

  /**
   * Change layout in the given frame multiviewer.
   * @param {object} params
   * @param {Function} cb
   */
  mvrLayoutChange(params, cb) {
    this.postJsonRpc('mvrLayoutChange', params, cb);
  }

}

module.exports = EventMaster;