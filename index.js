var util = require('util');
var rest = require('node-rest-client').Client;

function eventmaster(ip) {
	var self = this;
	self.ip = ip;
	self.rest = new rest();
	if (ip == undefined) {
		console.error("NO IP SPECIFIED FOR EVENTMASTER")
		 return;
	}
	return self;
}
/**
 * Query the E2 directly
 * @param  {} method
 * @param  {} params
 * @param  {} cb
 */
eventmaster.prototype.query = function(method,params,cb) {
	var self = this;
	var args = {
		data: {
			method: method,
			params: params,
			jsonrpc: "2.0",
			id: "0"
		},
		headers: {
			"Content-Type": "application/json"
		}
	};

	return self.rest.post("http://"+self.ip+":9999/jsonrpc", args, function (data, response) {
		if (cb !== undefined && typeof cb === "function") {
			if (data.result !== undefined && data.result.success == 0) {
				cb(null, data.result.response);
			}
			else {
				cb(true, data);
			}
		}
	});

};

/**
allTrans 
•	Definition
–	It executes the “allTrans” command.
–	If multi-operator mode is enabled, all-trans will affect only on those destinations which are selected for operator.
•	Request:
–	param: {"transTime": 40} -    integer value, will be applied to all armed destinations. (optional)

•	Multi-Operator Mode:
–	New parameters are introduced to cater multi-operator mode along with above parameters.
–	These parameters are used only when one or more operators are enabled.
–	params: {"operatorId": y}  (for normal operator)
o	“operatorId”— operator index (For current release only 0,1,2 are indexes). 
o	If user still want to use “super-operator” mode, password is required which is passed as a parameter.

–	params: {"password": "xyz"}  (for super operator)
o	password— Super user password saved. When this is passed, actions will be performed as no operator is enabled.

•	Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example
–	{"params":{}, "method":"allTrans", "id":"1234", "jsonrpc":"2.0"}
–	{"params": {"transTime": 40}, "method":"allTrans", "id":"1234", "jsonrpc":"2.0"}
–	{"params": {"operatorId" : 1}, "method":"allTrans", "id":"1234", "jsonrpc":"2.0"}
–	{"params": {"password" : "123"}, "method":"allTrans", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} cb
 */
eventmaster.prototype.allTrans = function(cb) {
	var self = this;
	return self.query("allTrans", {}, cb);
}

/**
cut
•	Definition
–	It executes the “Cut” command.
–	If multi-operator mode is enabled, cut will affect only on those destinations which are selected for operator.
•	Request:
–	params: {} - It doesn’t require any parameter.

•	Multi-Operator Mode:
–	New parameters are introduced to cater multi-operator mode along with above parameters.
–	These parameters are used only when one or more operators are enabled.
–	params: {"operatorId": y}  (for normal operator)
o	“operatorId”— operator index (For current release only 0,1,2 are indexes). 
o	If user still want to use “super-operator” mode, password is required which is passed as a parameter.

–	params: {"password": "xyz"}  (for super operator)
o	password— Super user password saved. When this is passed, actions will be performed as no operator is enabled.
•	Multi-Operator Mode:
–	New parameters are introduced to cater multi-operator mode along with above parameters.
–	These parameters are used only when one or more operators are enabled.
–	params: {"operatorId": y}  (for normal operator)
o	“operatorId”— operator index (For current release only 0,1,2 are indexes). 
o	If user still want to use “super-operator” mode, password is required which is passed as a parameter.

–	params: {"password": "xyz"}  (for super operator)
o	password— Super user password saved. When this is passed, actions will be performed as no operator is enabled.

•	Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example
–	{"params":{}, "method":"cut", "id":"1234", "jsonrpc":"2.0"}
–	{"params": {"operatorId" : 1}, "method":"cut", "id":"1234", "jsonrpc":"2.0"}
–	{"params": {"password" : "123"}, "method":"cut", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} cb
 */
eventmaster.prototype.cut = function(cb) {
	var self = this;
	return self.query("cut", {}, cb);
}

/**
resetFrameSettings 
•	Definition
–	Expose ALL reset types on Event Master processor with different options.
•	Request:
–	params: {"reset":x}, 
“x” can be 0 – 5
o	0: Soft reset.
o	1: Factory reset. 
o	2: Factory reset (save IP).
o	3: Factory reset (save IP/EDID). 
o	4: Factory reset (save VPID).
o	5: Power Down.
•	Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example
–	{"params":{"reset": 0}, "method":"resetFrameSettings", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} resetKind
 * @param  {} cb
 */
eventmaster.prototype.resetFrameSettings = function(resetKind, cb) {
	var self = this;
	return self.query("resetFrameSettings", { reset: resetKind }, cb);
}

/**
powerStatus
•	• Definition:
–	This queries the power plug status of the Event Master processor. (There can be 1 or 2 power slots in Event Master processor).
•	• Request:
–	params: {} - It doesn’t require any parameter.
•	• Response:
–	response: {FrameId1 :{ PwrStatus1, PwrStatus2},{FrameId2 :{ PwrStatus1, PwrStatus2}
o	PwrStatus1 gives the power status of the 1st slot in Event Master processor with frame id FrameId1, FrameId2.
o	PwrStatus2 gives the power status of the 2nd slot in Event Master processor with frame id FrameId1, FrameId2.
o	0: Power supply module is not present.
o	1: Power supply module is present, but there is no power cable.
o	2: Power supply module is present, and the cable is plugged in, but there is no DC current.
o	3: Power supply module is present, and everything is OK.
–	success: (0=success, anything else is an error)
•	• Example:
–	{"params":{}, "method":"powerStatus", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} cb
 */
eventmaster.prototype.powerStatus = function(cb) {
	var self = this;
	return self.query("powerStatus", {}, cb);
}

/**
listPresets
•	Definition:
–	This queries the list of Presets on a particular destination or on the system.
•	Request:
–	params: {"ScreenDest":x , "AuxDest":x},
“x” can be:
o	–2: Do not include any destinations of this type. (Has priority over particular id, if passed as a parameter.)
o	–1: Do not care (All presets). (Has priority over particular id, if passed as a parameter.)
o	0–999: want to see the presets with the destination this particular id in it or array of ids. Eg. "ScreenDestination":[{"id": 2}, {"id": 3}]
•	Response:
–	response: Array of: [{"id": 0, "Name": "Preset3.00", "LockMode": 0, "presetSno": 3.00}, {"id": 1, "Name": "Preset4.00", "LockMode": 0, "presetSno": 4.00}]
o	Response contains the array of presets. Above response contains id, name, lock mode preset serial number of the all the presets.
–	success: (0=success, anything else is an error)
•	Example:
–	{"params":{"ScreenDest": 0}, "method":"listPresets", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} ScreenDest
 * @param  {} AuxDest
 * @param  {} cb
 */
eventmaster.prototype.listPresets = function(ScreenDest, AuxDest, cb) {
	var self = this;
	if (ScreenDest == null) ScreenDest = -1;
	if (AuxDest == null) AuxDest = -1;
	return self.query("listPresets", { ScreenDest: ScreenDest, AuxDest: AuxDest }, cb);
}

/**
listDestinationsForPreset
•	Definition:
–	Lists the content of a Preset.
•	Request:
–	params: {“id”:x },
“x” can be:
o	–1: List all Presets.
o	0–999: list only that specific Preset.
•	Response:
–	response: Array of: [{"id": 0, "Name": "Preset3.00", "LockMode": 0, "presetSno": 3.00, "ScreenDest":[{"id": 0}, {"id": 3}],"AuxDest":[{"id": 0}, {"id": 1}]}]
o	Response contains the array of Presets.
–	success: (0=success, anything else is an error)
•	Example:
–	{ "params":{"id": 0}, "method":"listDestinationsForPreset", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} presetId
 */
eventmaster.prototype.listDestinationsForPreset = function(presetId) {
	var self = this;
	if (presetId == null) presetId = -1;
	return self.query("listDestinationsForPreset", { id: presetId }, cb);
}

/**
savePreset
•	Definition:
–	Creates a Preset on the Event Master processor.
•	Request:
–	params: {"presetName": "NewPreset", "ScreenDestination":[{"id": 2}, {"id": 3}], "AuxDestination":[{"id": 1}, {"id": 2}]}
–	params: {"presetName": "NewPreset", "serialNo": 1.01, "saveFromProgram":1, "ScreenDestination":[{"id": 2}, {"id": 3}], "AuxDestination":[{"id": 1}, {"id": 2}]}
o	“presetName”—Name of the Preset to save.
o	ScreenDestinations—ScreenDest id for the Preset to be created.
o	AuxDestinations—AuxDest id for the Preset to be created.
o	ScreenDestination, AuxDestinations are optional parameters. If user didn’t provide it, Preset will be saved for selected destinations.
o	serialNo- serial number for the preset to be saved. If preset exist, it will be overwritten. (Optional). Only 2-Digit decimal points are recommended, If user provides more than 2 decimal point then the number may be round off to 2-digit decimal point.
saveFromProgram - This flag is set to 1 if preset to be saved from program, else default will be saved from preview. (Optional)

•	Multi-Operator Mode:
–	New parameters are introduced to cater multi-operator mode along with above parameters.
–	These parameters are used only when one or more operators are enabled.
–	params: {"presetName": "NewPreset", "operatorId": y}  (for normal operator)
o	“operatorId”— operator index (For current release only 0,1,2 are indexes). 
o	If user still want to use “super-operator” mode, password is required which is passed as a parameter.

–	params: {"presetName": "NewPreset", "password": "xyz"}  (for super operator)
o	password— Super user password saved. When this is passed, actions will be performed as no operator is enabled.

•	Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"presetName": "NewPreset"}, "method":"savePreset", "id":"1234", "jsonrpc":"2.0"}
–	{"params": {"presetName": "NewPreset", "ScreenDestination": {"id": 0},"AuxDestination":{"id": 0}}, "method":"savePreset", "id":"1234", "jsonrpc":"2.0"}
–	{"params": {"presetName": "NewPreset", "serialNo": 1.01, "saveFromProgram":1}, "method":"savePreset", "id":"1234", "jsonrpc":"2.0"}
–	For normal operator 
{"params": {"presetName": "NewPreset", "serialNo": 5.00, "operatorId": 2}, "method":"savePreset", "id":"1234", "jsonrpc":"2.0"}
–	For super operator 
{"params": {"presetName": "NewPreset", "operatorId": 2}, "method":"savePreset", "id":"1234", "jsonrpc":"2.0"}

Key points regarding Preset, which are same for rename, activate, and delete:
–	“id”—id of the preset.
–	“presetSno”—preset serial number. User can provide floating point number if required. Eg. "presetSno": 1.01, "presetSno": 1.00, "presetSno": 1, "presetSno": 1.1, "presetSno": 1.10.
Kindly note that 1.1 and 1.10 or 1.00 and 1 are same.

 * @param  {} presetName
 * @param  {} ScreenDestinationsArray
 * @param  {} AuxDestinationsArray
 * @param  {} cb
 */
eventmaster.prototype.savePreset = function(presetName, ScreenDestinationsArray, AuxDestinationsArray, cb) {
	var self = this;
	return self.query("savePreset", {
		presetName: presetName,
		ScreenDestination: ScreenDestinationsArray,
		AuxDestination: AuxDestinationsArray
	}, cb);
};

/**
renamePreset
•	Definition:
–	Rename a Preset on the Event Master processor. User can rename Preset with id, Preset serial number, or Preset name.
–	Send any one of the parameters to rename Preset.
•	Request params:
–	params: {"id": x, "newPresetName": "NewPresetName"}
–	params: {"presetSno": x.y, "newPresetName": "NewPresetName"}
–	params: {"presetName": "OldPresetName", "newPresetName": "NewPresetName"}
o	“newPresetName”—New Preset name to set.
•	Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"id": 0, "newPresetName": " newPresetName "}, "method":"renamePreset", "id":"1234", "jsonrpc":"2.0"}
–	{"params": {"presetName": "NewPreset", "newPresetName": "NewPresetName"}, "method":"renamePreset", "id":"1234", "jsonrpc":"2.0"}
–	{"params": {"presetSno": 1.00, "newPresetName": " newPresetName "}, "method":"renamePreset", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} presetId
 * @param  {} newPresetName
 * @param  {} cb
 */
eventmaster.prototype.renamePresetById = function(presetId, newPresetName, cb) {
	var self = this;
	return self.query("renamePreset", { id: presetId, newPresetName: newPresetName }, cb);
}
/**
 * @param  {} presetSno
 * @param  {} newPresetName
 * @param  {} cb
 */
eventmaster.prototype.renamePresetBySno = function(presetSno, newPresetName, cb) {
	var self = this;
	return self.query("renamePreset", { presetSno: presetSno, newPresetName: newPresetName }, cb);
}
/**
 * @param  {} presetName
 * @param  {} newPresetName
 * @param  {} cb
 */
eventmaster.prototype.renamePresetByName = function(presetName, newPresetName, cb) {
	var self = this;
	return self.query("renamePreset", { presetName: presetName, newPresetName: newPresetName }, cb);
}

/**
activatePreset
•	Definition:
–	Recall a Preset on the Event Master processor. User can recall Preset with id, Preset serial number, or Preset name.
–	Send any one of the parameters to recall Preset.
•	Request params:
–	params: {"id": x, "type": x}
–	params: {"presetSno": x.y, "type": x}
–	params: {"presetName": "PresetName"}
o	“type”—0 to recall in preview (default), 1 to recall in program. This is not a mandatory parameter but should be given when the user wants to recall a Preset in program.

•	Multi-Operator Mode:
–	New parameters are introduced to cater multi-operator mode along with above parameters.
–	These parameters are used only when one or more operators are enabled.
–	params: {"id": x, "operatorId": y}  (for normal operator)
o	“operatorId”— operator index (For current release only 0,1,2 are indexes). 
o	If user still want to use “super-operator” mode, password is required which is passed as a parameter.

–	params: {"id": x, "password": "xyz" }  (for super operator)
o	password— Super user password saved. When this is passed, actions will be performed as no operator is enabled.

•	Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"id": 0, "type": 0}, "method":"activatePreset", "id":"1234", "jsonrpc":"2.0"} //Recall in preview with id 0.
–	{"params": {"presetName": "abc" }, "method":"activatePreset", "id":"1234", "jsonrpc":"2.0"} //Recall in preview with preset name “abc”.
–	{"params": {"presetSno": 1.00, "type": 1}, "method":"activatePreset", "id":"1234", "jsonrpc":"2.0"} //Recall in program with presetSno 1.
–	For super operator
{"params": {"id": 6, "password": "123"}, "method":"activatePreset", "id":"1234", "jsonrpc":"2.0"}
–	For normal operator
{"params": {"id": 5, "operatorId": 2}, "method":"activatePreset", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} presetId
 * @param  {} recallInProgramInt
 * @param  {} cb
 */
eventmaster.prototype.activatePresetById = function(presetId, recallInProgramInt, cb) {
	var self = this;
	return self.query("activatePreset", { id: presetId, type: recallInProgramInt }, cb);
}
/**
 * @param  {} presetSno
 * @param  {} recallInProgramInt
 * @param  {} cb
 */
eventmaster.prototype.activatePresetBySno = function(presetSno, recallInProgramInt, cb) {
	var self = this;
	return self.query("activatePreset", { presetSno: presetSno, type: recallInProgramInt }, cb);
}
/**
 * @param  {} presetName
 * @param  {} recallInProgramInt
 * @param  {} cb
 */
eventmaster.prototype.activatePresetByName = function(presetName, recallInProgramInt, cb) {
	var self = this;
	return self.query("activatePreset", { presetName: presetName, type: recallInProgramInt }, cb);
}
/**
 * @param  {} presetId
 * @param  {} recallInProgramInt
 * @param  {} password
 * @param  {} cb
 */
eventmaster.prototype.activatePresetByIdSuper = function(presetId, recallInProgramInt, password, cb) {
	var self = this;
	return self.query("activatePreset", { id: presetId, type: recallInProgramInt, password: password }, cb);
}
/**
 * @param  {} presetSno
 * @param  {} recallInProgramInt
 * @param  {} password
 * @param  {} cb
 */
eventmaster.prototype.activatePresetBySnoSuper = function(presetSno, recallInProgramInt, password, cb) {
	var self = this;
	return self.query("activatePreset", { presetSno: presetSno, type: recallInProgramInt, password: password }, cb);
}
/**
 * @param  {} presetName
 * @param  {} recallInProgramInt
 * @param  {} password
 * @param  {} cb
 */
eventmaster.prototype.activatePresetByNameSuper = function(presetName, recallInProgramInt, password, cb) {
	var self = this;
	return self.query("activatePreset", { presetName: presetName, type: recallInProgramInt, password:password }, cb);
}
/**
 * @param  {} presetId
 * @param  {} recallInProgramInt
 * @param  {} operatorId
 * @param  {} cb
 */
eventmaster.prototype.activatePresetByIdOperator = function(presetId, recallInProgramInt, operatorId, cb) {
	var self = this;
	return self.query("activatePreset", { id: presetId, type: recallInProgramInt, operatorId: operatorId }, cb);
}
/**
 * @param  {} presetSno
 * @param  {} recallInProgramInt
 * @param  {} operatorId
 * @param  {} cb
 */
eventmaster.prototype.activatePresetBySnoOperator = function(presetSno, recallInProgramInt, operatorId, cb) {
	var self = this;
	return self.query("activatePreset", { presetSno: presetSno, type: recallInProgramInt, operatorId: operatorId }, cb);
}
/**
 * @param  {} presetName
 * @param  {} recallInProgramInt
 * @param  {} operatorId
 * @param  {} cb
 */
eventmaster.prototype.activatePresetByNameOperator = function(presetName, recallInProgramInt, operatorId, cb) {
	var self = this;
	return self.query("activatePreset", { presetName: presetName, type: recallInProgramInt, operatorId:operatorId }, cb);
}

/**
recallNextPreset
•	Definition:
–	Recall the next Preset on the Event Master processor.
No parameter is required.
–	Make sure that the user has at least recalled one Preset. Web app recalls the next Preset from the last Preset recalled.
•	Request:
–	params: {}
•	Response:
–	response: null
–	success: (0=success, anything else is an error)
–	An error is shown if there was no last recalled Preset or if there is no next Preset in the list.
•	Example:
–	{"params": {}, "method":"recallNextPreset", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} cb
 */
eventmaster.prototype.recallNextPreset = function(cb) {
	var self = this;
	return self.query("recallNextPreset", {}, cb);
}

/**
deletePreset
•	Definition:
–	Delete a Preset on the Event Master processor.
User can delete Preset with id, Preset serial number, or Preset name.
–	Send any one of the parameters to delete Preset.
•	Request:
–	params: {"id": x}
–	params: {"presetSno": x.y}
–	params: {"presetName": "PresetName"}

•	Multi-Operator Mode:
–	New parameters are introduced to cater multi-operator mode along with above parameters.
–	These parameters are used only when one or more operators are enabled.
–	params: {"id": x, "operatorId": y}  (for normal operator)
o	“operatorId”— operator index (For current release only 0,1,2 are indexes). 
o	If user still want to use “super-operator” mode, password is required which is passed as a parameter.

–	params: {"id": x, "password": "xyz"}  (for super operator)
o	password— Super user password saved. When this is passed, actions will be performed as no operator is enabled.

•	Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"id": 1}, "method":"deletePreset", "id":"1234", "jsonrpc":"2.0"}
–	{"params": {"presetSno": 1.00}, "method":"deletePreset", "id":"1234", "jsonrpc":"2.0"}
–	{"params": {"presetName": "Preset 5.00"}, "method":"deletePreset", "id":"1234", "jsonrpc":"2.0"}
–	For super operator
{"params": {"id": 6, "password": "123"}, "method":"deletePreset", "id":"1234", "jsonrpc":"2.0"}
–	For normal operator
{"params": {"id": 5, "operatorId": 2}, "method":"deletePreset", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} presetId
 * @param  {} cb
 */
eventmaster.prototype.deletePresetById = function(presetId, cb) {
	var self = this;
	return self.query("deletePreset", { id: presetId }, cb);
}
/**
 * @param  {} presetSno
 * @param  {} cb
 */
eventmaster.prototype.deletePresetBySno = function(presetSno, cb) {
	var self = this;
	return self.query("deletePreset", { presetSno: presetSno }, cb);
}
/**
 * @param  {} presetName
 * @param  {} cb
 */
eventmaster.prototype.deletePresetByName = function(presetName, cb) {
	var self = this;
	return self.query("deletePreset", { presetName: presetName }, cb);
}

/**
listDestinations
•	Definition:
–	This API lists all the destinations with properties such as layers, outputs, id, size, and name.
•	Request:
–	params: {"type": x}
o	0—Show all the destinations.
0 is the default value for the type parameter.
o	1—Only screen destinations.
o	2—Only aux destinations.
•	Response:
–	response: Array of : {"ScreenDestination":[{"id": 0, "Name": "Dest1", "HSize": 3840, "VSize": 1080, "Layers": 1,"DestOutMapColl":[{"id": 0"DestOutMap":[{"id": 0, "Name": "Out1", "HPos": 0, "VPos": 0, "HSize": 1920, "VSize":1080, "Freeze": 0},{"id": 1, "Name": "Out2", "HPos": 1920, "VPos": 0, "HSize": 1920, "VSize":1080, "Freeze": 1}]}]}],"AuxDestination":[{"id": 0, "AuxStreamMode": 4}, {"id": 1, "AuxStreamMode": 4}]}”
–	success: (0=success, anything else is an error)
•	• Example:
–	{"params": {"type": 0}, "method":"listDestinations", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} type
 * @param  {} cb
 */
eventmaster.prototype.listDestinations = function(type, cb) {
	var self = this;
	return self.query("listDestinations", { type: type  }, cb);
}

/**
listSources
•	Definition:
–	This API lists all the input sources with properties.
•	Request:
–	params: {"type": x}
o	0—Show all the input sources.
0 is the default value for the type parameter.
o	1—Only background sources.
•	Response:
–	- response: Array of : {"id": 0, "Name": "InSource1", "HSize": 3840, "VSize": 1080, "SrcType": 0, "InputCfgIndex": -1, "StillIndex": 0, "DestIndex": -1, "UserKeyIndex": -1, "Mode3D": 0, "Freeze": 1, "Capacity": 2, "InputCfgVideoStatus": 4}
success: (0=success, anything else is an error)

–	Parameter to look for is “InputCfgVideoStatus”. Possible values:
0 = Invalid; there is sync, but cannot acquire / lock mismatch
1 = Valid; Video is OK
2 = MismatchFormat; Format mismatch between input cfg and connector(s)
3 = OutOfRange; connector capacity is too low to acquire format
4 = NoSync; no video
–	
•	Example:
–	{"params": {"type": 0}, "method":"listSources", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} type
 * @param  {} cb
 */
eventmaster.prototype.listSources = function(type, cb) {
	var self = this;
	return self.query("listSources", { type: type }, cb);
}

/**
activateCue
•	Definition:
–	This API  to .
•	Requestparams:
•	Response:
–	: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"id": 1}, "method":"activateCue", "id":"1234", "jsonrpc":"2.0"} //Play – no parame or type 0
–	{"params": {"type": 1}, "method":"activateCue", "id":"1234", "jsonrpc":"2.0"} //Pause – type 1
–	{"params": {"type": 2}, "method":"activateCue", "id":"1234", "jsonrpc":"2.0"} //Stop – type 2

 * @param  {} id
 * @param  {} type
 * @param  {} cb
 */
eventmaster.prototype.activateCueById = function(id, type, cb) {
	var self = this;
	return self.query("activateCue", { id: id, type: type }, cb);
}
/**
 * @param  {} cueName
 * @param  {} type
 * @param  {} cb
 */
eventmaster.prototype.activateCueByCueName = function(cueName, type, cb) {
	var self = this;
	return self.query("activateCue", { cueName: cueName, type: type }, cb);
}
/**
 * @param  {} cueSerialNo
 * @param  {} type
 * @param  {} cb
 */
eventmaster.prototype.activateCueByCueSerialNo = function(cueSerialNo, type, cb) {
	var self = this;
	return self.query("activateCue", { cueSerialNo: cueSerialNo, type: type }, cb);
}

/**
listCues
•	Definition:
–	This API  to .
•	Requestparams:
•	Response:
–	: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"id": 1}, "method":"listCues", "id":"1234", "jsonrpc":"2.0"} //Play – no parame or type 0
–	{"params": {"type": 1}, "method":"listCues", "id":"1234", "jsonrpc":"2.0"} //Pause – type 1
–	{"params": {"type": 2}, "method":"listCues", "id":"1234", "jsonrpc":"2.0"} //Stop – type 2

 * @param  {} type
 * @param  {} cb
 */
eventmaster.prototype.listCues = function(type, cb) {
	var self = this;
	return self.query("listCues", { type: type }, cb);
}

/**
activateDestGroup

• Definition
-	Recall a DestGroup on the Event Master processor. User can recall DestGroup with id, DestGroup serial number, or DestGroup name.
-	
– Send any one of the parameters to recall DestGroup.
• Request params:
– params: {"id": x}
– params: {"destGrpSno": x.y}
– params: {"destGrName": "GroupName"}
o	id – Index of the Destination group.
o	destGrpSno – Destination group serial number
o	destGrName – Destnation group name. 
•	Response:
–	Response: null
–	success: (0=success, anything else is an error)

•	Example:
–	{"params": {"id": 0}, "method":"activateDestGroup", "id":"1234", "jsonrpc":"2.0"}
–	{"params": {"destGrpName": "abc" }, "method":"activateDestGroup", "id":"1234", "jsonrpc":"2.0"}
–	{"params": {"destGrpSno": 1.00}, "method":"activateDestGroup", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} id
 * @param  {} cb
 */
eventmaster.prototype.activateDestGroup = function(id, cb) {
	var self = this;
	return self.query("activateDestGroup", { id: id }, cb);
}

/**
3dControl
•	Definition:
–	This API provides the option to modify 3d Controls.
•	Request:
–	params: {“id” : id, "type": x, "syncSource": y, "syncInvert": z}
o	id – Index of the input config.
o	type – "x" can be: 0 – Type Off. 0 is the default value for the type parameter. 1 – Type Sequentia.
o	syncSource – "y" can be: 1 – mini-Din 1, 2 – mini-Din 2, 3 – mini-Din 3, 4 – mini-Din 4. Default value is 1.
o	syncInvert – "z" can be: 0 – Type Off. 0 is the default value for the syncInvert. 1 – Type Invert.
o	To reset, do not provide any parameter except "id".
•	Response:
–	response: {"id": 0, "Name": "InSource1", "HSize": 3840, "VSize": 1080, "Src-Type": 0, "InputCfgIndex": -1, "StillIndex": 0, "DestIndex": -1, "UserKeyIndex": -1, "Mode3D": 0, "Freeze": 1, "Capacity": 2, "InputCfgVideoStatus": 4}
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"id": 1, "type": 0, "syncSource": 1, "syncInvert": 0}, "method":"3dControl", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} id
 * @param  {} type
 * @param  {} syncSource
 * @param  {} syncInvert
 * @param  {} cb
 */
eventmaster.prototype.control3d = function(id, type, syncSource, syncInvert, cb) {
	var self = this;
	return self.query("3dControl", { id: id, type: type, syncSource: syncSource, syncInvert: syncInvert }, cb);
}

/**
listContent
•	Definition:
–	This API shows the content of a screen destination.
•	Request:
–	params: {"id": x}
o	“id”—Screen destination index.
•	Response:
 {"jsonrpc":"2.0","result":{"success":0,"response":{"id":0,"Name":"ScreenDest1","IsActive":1,"BGLyr":[{"id":0,"LastBGSourceIndex":-1,"BGShowMatte":1,"BGColor":{"id":0,"Red":0,"Green":0,"Blue":0}},{"id":1,"LastBGSourceIndex":-1,"BGShowMatte":1,"BGColor":{"id":0,"Red":0,"Green":0,"Blue":0}}],"Layers":[{"id":0,"Name":"Layer1-A","LastSrcIdx":-1,"PvwMode":0,"PgmMode":0,"LinkLayerId":0,"LinkDestId":0,"Capacity":1,"PvwZOrder":0,"PgmZOrder":0,"Freeze":0,"ScalingMode":2,"Window":[{"HPos":0,"VPos":0,"HSize":1920,"VSize":1080},{"HPos":0,"VPos":0,"HSize":1920,"VSize":1080}],"Source":[{"HPos":0,"VPos":0,"HSize":1920,"VSize":1080},{"HPos":0,"VPos":0,"HSize":1920,"VSize":1080}],"Mask":[{"id":0,"Top":0,"Left":0,"Right":0,"Bottom":0},{"id":0,"Top":0,"Left":0,"Right":0,"Bottom":0}]},{"id":1,"Name":"Layer1-B","LastSrcIdx":-1,"PvwMode":0,"PgmMode":0,"LinkLayerId":1,"LinkDestId":0,"Capacity":1,"PvwZOrder":0,"PgmZOrder":0,"Freeze":0,"ScalingMode":2,"Window":[{"HPos":0,"VPos":0,"HSize":1920,"VSize":1080},{"HPos":0,"VPos":0,"HSize":1920,"VSize":1080}],"Source":[{"HPos":0,"VPos":0,"HSize":1920,"VSize":1080},{"HPos":0,"VPos":0,"HSize":1920,"VSize":1080}],"Mask":[{"id":0,"Top":0,"Left":0,"Right":0,"Bottom":0},{"id":0,"Top":0,"Left":0,"Right":0,"Bottom":0}]}],"Transition":[{"id":0,"TransTime":30,"TransPos":0,"ArmMode":1},{"id":1,"TransTime":30,"TransPos":0,"ArmMode":0}],"OutputCfg":[{"id":0,"Name":"HDMIOutput1","OutputAOI":[{"id":0,"TestPattern":[{"id":0,"TestPatternMode":0}]}]}]}},"id":"1234"}

o	id—index of screen destination.
o	Name—Name of Screen Destination.
o	BGLyr—Background layer index, Last source index of background.
“id”:0 affects the Background in Program. “id”:1 affects the Background in Preview.
o	LastBGSoureIndex—This is –1 if no background is dropped, else this is index of last background dropped on screen destination.
o	BGShowMatte—This is if BG to be matte or not.
o	BGColor—This is background color.
o	Layers—Lists layers on screen destination with its properties.
o	Transition—This property of screen destination contains the transition time (from time to move from preview to program).
o	LinkLayerId: Link/Global Layer Index
o	LinkDestId:  Link Destination Index

–	success: (0=success, anything else is an error)

•	Example:
–	{"params": {"id": 0}, "method":"listContent", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} id
 * @param  {} cb
 */
eventmaster.prototype.listContent = function(id, cb) {
	var self = this;
	return self.query("listContent", { id: id }, cb);
}

/**
listSuperDestContent
•	Definition:
–	This API shows the content of a super screen destination.
•	Request:
–	params: {"id": x}
o	“id”—Super/Link Screen destination index.
•	Response:
 {"jsonrpc":"2.0","result":{"success":0,"response":{"id":0,"Name":"SuperDest1","HDimention":1,"VDimention":1,"HSize":1920,"VSize":1080,"GlobalLayers":2,"DestCollection":[{"id":0,"DestType":1,"DestXmlId":0,"Name":"ScreenDest1"}],"GlobalLayerCollection":{"GlobalLayer":[{"id":0,"Name":"SuperLayer1-A","SuperLayerLinkedState":1,"LinkLayer":[{"LinkLayerXmlId":0,"DestXmlId":0}]},{"id":1,"Name":"SuperLayer1-B","SuperLayerLinkedState":1,"LinkLayer":[{"LinkLayerXmlId":1,"DestXmlId":0}]}]}}},"id":"1234"}

o	id—index of super screen destination.
o	Name—Name of super Screen Destination.
o	HDimention — Horizontal dimension of super screen destination
o	VDimention — Vertical dimension of super screen destination
o	HSize: Horizontal size of super screen destination
o	VSize: Vertical size of super screen destination
o	GlobalLayers —Count of global Layer.
o	DestCollection —Array of screen destination with index and name of screen destination and destination type.
o	GlobalLayerCollection — Array of global layer with information of index, name of link layer.
o	SuperLayerLinkedState — State of super/Link Layer.
o	LinkLayerXmlId: Link Layer Index
o	DestXmlId:  Link layer part of screen Destination Index.

–	success: (0=success, anything else is an error)

•	Example:
–	{"params": {"id": 0}, "method":"listSuperDestContent", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} id
 * @param  {} cb
 */
eventmaster.prototype.listSuperDestContent = function(id, cb) {
	var self = this;
	return self.query("listSuperDestContent", { id: id }, cb);
}

/**
listSuperAuxContent
•	Definition:
–	This API shows the content of a super aux destination.
•	Request:
–	params: {"id": x}
o	“id”—Super Aux destination index.
•	Response:
 {"jsonrpc":"2.0","result":{"success":0,"response":{"id":0,"Name":"SuperAux1","HDimention":2,"VDimention":1,"HSize":3840,"VSize":1080,"AuxDestCollection":[{"id":0,"DestType":0,"DestXmlId":0,"Name":"AuxDest1"},{"id":1,"DestType":0,"DestXmlId":1,"Name":"AuxDest2"}]}},"id":"1234"}

o	id—index of super aux destination.
o	Name—Name of super aux Destination.
o	HDimention — Horizontal dimension of super aux destination
o	VDimention — Vertical dimension of super aux destination
o	HSize: Horizontal size of super aux destination
o	VSize: Vertical size of super aux destination
o	AuxDestCollection —Array of aux destination with index and name of aux destination and destination type.
 
–	success: (0=success, anything else is an error)

•	Example:
–	{"params": {"id": 0}, "method":"listSuperAuxContent", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} id
 * @param  {} cb
 */
eventmaster.prototype.listSuperAuxContent = function(id, cb) {
	var self = this;
	return self.query("listSuperAuxContent", { id: id }, cb);
}

/**
changeContent
•	Definition:
–	This API changes the content of a screen destination by putting background and layers in it.
•	Request:
–	params: {"id":0, "TestPattern" :5, "BGLyr":[{"id":0,"LastBGSourceIndex":0,"BGShowMatte":0, "BGColor":[{"id":0,"Red":0,"Green":0,"Blue":0}]},{"id":1,"LastBGSourceIndex":0, "BGShowMatte":0,"BGColor":[{"id":0,"Red":0,"Green":0,"Blue":0}]}],"Layers": [{"id":0,"LastSrcIdx":0,"Window":{"HPos":0,"VPos":0,"HSize":400,"VSize":300}, "Source":{"HPos":0,"VPos":0,"HSize":1920,"VSize":1080}, "Mask":{ "Left":0.01, "Right":10.1, "Top":0.0,"Bottom":0.0},"PvwMode":1,"PgmMode":0,"Freeze":0, "PgmZOrder":0,"PvwZOrder":0}]}
o	id—Screen destination index.
o	BGLyr—Background layer index, Last source index of background.
“id”:0 affects the Background in Program. “id”:1 affects the Background in Preview.
o	Layers—Layer information.
o	Window—Layer window size.
o	Source—Source info and size.
o	Mask—Crop the visible part of the layer.
o	PvwMode—Set 1 if you want the content in preview. (Default)
o	PgmMode—Set 1 if you want the content in program.
o	TestPattern – Provide test pattern id 
•	Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"jsonrpc":"2.0","result":{"success":0,"response":{"id":0,"Name":"ScreenDest1","BGLyr":[{"id":0,"LastBGSourceIndex":-1,"BGShowMatte":1,"BGColor":{"id":0,"Red":0,"Green":0,"Blue":0}},{"id":1,"LastBGSourceIndex":-1,"BGShowMatte":1,"BGColor":{"id":0,"Red":0,"Green":0,"Blue":0}}],"Layers":[{"id":0,"Name":"Layer1-A","LastSrcIdx":1,"PvwMode":1,"PgmMode":0,"Capacity":1,"PvwZOrder":0,"PgmZOrder":0,"Freeze":0,"Window":[{"HPos":514,"VPos":289,"HSize":892,"VSize":502},{"HPos":0,"VPos":0,"HSize":1920,"VSize":1080}],"Source":[{"HPos":0,"VPos":0,"HSize":1920,"VSize":1080},{"HPos":0,"VPos":0,"HSize":1920,"VSize":1080}],"Mask":[{"id":0,"Top":0,"Left":0,"Right":0,"Bottom":0},{"id":0,"Top":0,"Left":0,"Right":0,"Bottom":0}]},{"id":1,"Name":"Layer1-B","LastSrcIdx":-1,"PvwMode":0,"PgmMode":0,"Capacity":1,"PvwZOrder":0,"PgmZOrder":0,"Freeze":0,"Window":[{"HPos":0,"VPos":0,"HSize":1920,"VSize":1080},{"HPos":0,"VPos":0,"HSize":1920,"VSize":1080}],"Source":[{"HPos":0,"VPos":0,"HSize":1920,"VSize":1080},{"HPos":0,"VPos":0,"HSize":1920,"VSize":1080}],"Mask":[{"id":0,"Top":0,"Left":0,"Right":0,"Bottom":0},{"id":0,"Top":0,"Left":0,"Right":0,"Bottom":0}]}],"Transition":[{"id":0,"TransTime":30,"TransPos":0},{"id":1,"TransTime":30,"TransPos":0}],"OutputCfg":[{"id":0,"Name":"Output1","OutputAOI":[{"id":0,"TestPattern":[{"id":0,"TestPatternMode":0}]}]}]}},"id":"1234"}

–	{"params":{"id":0, "TestPattern" :5 }, "method":"changeContent", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} screenDestIndex
 * @param  {} bgLayer
 * @param  {} Layers
 * @param  {} cb
 */
eventmaster.prototype.changeContent = function(screenDestIndex, bgLayer, Layers, cb) {
	var self = this;
	return self.query("changeContent", { id: screenDestIndex, BGLyr: bgLayer, Layers: Layers }, cb);
}

/*
changeSuperDestContent
•	Definition:
–	This API changes layer parameters for each super layer in all screen destination that are part of a super destination.
•	Request:
–	Params: {"id":0,"GlobalLayers”: [{"id":0,"Window":{"HPos":0,"VPos":0,"HSize":700,"VSize":300}}]}
o	id—Super Screen destination index.
o	GlobalLayers — Array of Global Layers with index, H/V position and H/V size.
•	Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params":{"id":0,"GlobalLayers":[{"id":0,"Window":{"HPos":0,"VPos":0,"HSize":700,"VSize":300}}]},
"method":"changeSuperDestContent", "id":"1234", "jsonrpc":"2.0"}
*/

/*
changeSuperAuxContent
•	Definition:
–	This API changes sources for any aux destination which is part of super aux.
•	Request:
–	Params: {"id":0,"Destinations”: [{"id":0, "Name": "AuxDest1”, "PvwLastSrcIndex": 0 , "PgmLastSrcIndex":0}]}
o	id—Super Aux destination index.
o	Destinations — Array of Aux destination with index, Name of aux destination to be renamed, Preview source and Program source to be modified in aux destination.
•	Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params":{"id":0,"Destinations":[{"id":0, "Name": "AuxDest1" , "PvwLastSrcIndex": 0 , "PgmLastSrcIndex":0}]}, "method":"changeSuperAuxContent", "id":"1234", "jsonrpc":"2.0"}
*/

/**
freezeDestSources
•	Definition:
–	This API Freezes/Unfreezes the sources.
•	Request:
–	params: {"type": x, "id": y, "screengroup": z ,"mode": 0/1}
o	type—type of source.
o	0—Input source.
o	1—Background source.
o	2—ScreenDestination.
o	3—AuxDestination.
–	id—Index of the source.
–	Screengroup—For future use. Always set to 0.
–	Mode—0 : UnFreeze, 1 : Freeze.
•	Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"type": 0, "id": 0, "screengroup": 0 ,"mode": 1}, "method":"freezeDestSource", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} type
 * @param  {} id
 * @param  {} screenGroup
 * @param  {} mode
 * @param  {} cb
 */
eventmaster.prototype.freezeDestSource = function(type, id, screenGroup, mode, cb) {
	var self = this;
	return self.query("freezeDestSource", { type: type, id: id, screengroup: screenGroup, mode: mode }, cb);
}

/**
listStill
•	Definition:
–	This API lists all the stills with properties such as id, Name, H/V size, LockMode, StillState, PngState, File size.
•	Request:
–	params: {}
•	Response:
–	response: Array of : [{"id":0,"Name":"StillStore1","LockMode":0,"HSize":{"Min":0,"Max":99999,"$t":1920},"VSize":{"Min":0, "Max":99999,"$t":1080},"StillState":{"Min":0,"Max":4,"$t":3},"PngState":{"Min":0,"Max":2,"$t":0},"FileSize":{"Min":0,"Max":100000,"$t":9331.2}}]
o	id—Index of still store.
o	Name—Name of still store.
o	LockMode—For future use. Always set to 0.
o	H/V size—Horizontal and vertical size, Min, max and current value. It shows the current value.
o	StillState—This tells user if the still is currently being captured or not, or if it is getting deleted.
o	PngState—The “PNG” for stills are for the thumbnails we capture for the stills.
o	FileSize—Size of the file created in KBs.
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {}, "method":"listStill", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} cb
 */
eventmaster.prototype.listStill = function(cb) {
	var self = this;
	return self.query("listStill", {}, cb);
}

/**
deleteStill
•	Definition:
–	This API deletes a still.
•	Request:
–	params: {“id”: x}
o	id—Index of still.
•	Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params":{"id": 0}, "method":"deleteStill", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} stillIndex
 * @param  {} cb
 */
eventmaster.prototype.deleteStill = function(stillIndex,cb) {
	var self = this;
	return self.query("deleteStill", { id:stillIndex }, cb);
}

/**
takeStill
•	Definition:
–	This API creates/overwrites a still.
•	Request:
–	params: { "type": x, "id": y, "file": z}
o	type—0 for input source, 1 for BG source.
o	Id—Index of the source. If the source id of the destination is provided, no still is created and an error is shown.
o	File—still file id. If you pass “file” : 5, this creates StillStore6.
•	Response:
–	- response: null
–	- success: (0=success, anything else is an error)
•	Example:
–	{"params":{"type":0 , "id": 1, "file": 5}, "method":"takeStill", "id":"1234", "jsonrpc":"2.0"}
o	This creates a still from input source id 1 as StillStore6.

 * @param  {} type
 * @param  {} id
 * @param  {} fileid
 * @param  {} cb
 */
eventmaster.prototype.takeStill = function(type, id, fileid, cb) {
	var self = this;
	return self.query("takeStill", { type: type, id: id, file: fileid }, cb);
}

/**
getFrameSettings
•	Definition:
–	This API shows system information, including all the frames information.
•	Request:
–	params: {}
•	Response:
–	{"System":{"id":0,"Name":"System1","FrameCollection":{"id":0,"Frame":{"id":"00:0c:29:0e:86:d4","Name":"E2","Contact":"","Version":"4.2.30738","OSVersion":"NA","FrameType":0,"FrameTypeName":"E2","Enet":{"DhcpMode":0, "DhcpModeName":"Static","IP":"10.98.0.165","StaticIP":"192.168.000.175","MacAddress":"00:0c:29:0e:86:d4","StaticMask":"255.255.255.000","StaticGateway":"192.168.000.001"},"SysCard":{"SlotState":2, "CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":80, "CardTypeLabel":"System","CardID":0},"Slot":[{"Card":{"CardStatusID":2, "CardStatusLabel":"Ready","CardTypeID":70,"CardTypeLabel":"Expansion","CardID":"thisissometextforid0"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":70,"CardTypeLabel":"Expansion","CardID":"thisissometextforid1"}},{"Card":{"CardStatusID":0,"CardStatusLabel":"Not Installed","CardTypeID":255,"CardTypeLabel":"Unknown","CardID":"Undefined"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":1,"CardTypeLabel":"SDI Input","CardID":"thisissometextforid211"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":3,"CardID":"thisissometextforid2"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":0,"CardTypeLabel":"DVI Input","CardID":"thisissometextforid4"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":2, "CardTypeLabel":"HDMI/DP Input","CardID":"thisissometextforid5"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":2, "CardTypeLabel":"HDMI/DP Input","CardID":"thisissometextforid7"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":2, "CardTypeLabel":"HDMI/DP Input","CardID":"thisissometextforid8"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":2, "CardTypeLabel":"HDMI/DP Input","CardID":"thisissometextforid9"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":22, "CardTypeLabel":"HDMI Output","CardID":"CardID3"}},{"Card":{"CardStatusID":2, "CardStatusLabel":"Ready","CardTypeID":22,"CardTypeLabel":"HDMI Output","CardID":"CardID4"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":21,"CardTypeLabel":"SDI Output","CardID":"CardID415"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":40, "CardTypeLabel":"MVR","CardID":"CardID15"}},{"Card":{"CardStatusID":2, "CardStatusLabel":"Ready","CardTypeID":50,"CardTypeLabel":"VPU Scaler","CardID":"thisissometextforid501"}},{"Card":{"CardStatusID":2, "CardStatusLabel":"Ready","CardTypeID":50,"CardTypeLabel":"VPU Scaler","CardID":"thisissometextforid502"}},{"Card":{"CardStatusID":2, "CardStatusLabel":"Ready","CardTypeID":50,"CardTypeLabel":"VPU Scaler","CardID":"thisissometextforid503"}},{"Card":{"CardStatusID":2, "CardStatusLabel":"Ready","CardTypeID":50,"CardTypeLabel":"VPU Scaler","CardID":"thisissometextforid504"}},{"Card":{"CardStatusID":0, "CardStatusLabel":"Not Installed","CardTypeID":255,"CardTypeLabel":"Unknown","CardID":"Undefined"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":50,"CardTypeLabel":"VPU Scaler","CardID":"thisissometextforid505"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":50,"CardTypeLabel":"VPU Scaler","CardID":"thisissometextforid506"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":50,"CardTypeLabel":"VPU Scaler","CardID":"thisissometextforid507"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":50,"CardTypeLabel":"VPU Scaler","CardID":"thisissometextforid508"}}]}}}}}
o	System—System name and index.
o	FrameCollection—Collection of frames in a system containing frame information.
o	Frame—Contains frame information.
o	Id—Mac Id of the frame.
o	Name—Name of the frame.
o	Contact—Contact information.
o	Version—Current version of the software installed on the frame.
o	OSVersion—Current OS version installed on the frame.
o	FrameType—0: E2, 1:S3, 2: Ex.
o	FrameTypeName—Type of the frame: E2/S3/Ex.
o	Enet—Ethernet settings.
o	SysCard—System card information.
o	Slot—List of Input/Output/Expansion card information.
–	success: (0=success, anything else is an error)
•	Example:
–	{"params":{}, "method":"getFrameSettings", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} cb
 */
eventmaster.prototype.getFrameSettings = function(cb) {
	var self = this;
	return self.query("getFrameSettings", {}, cb);
}

/**
listAuxContent
•	Definition:
–	This API shows Aux destination information.
•	Request:
–	params: {“id”: x}
o	Id—Index of the Aux destination.
•	Response:
–	response: {"id":0,"Name":"AuxDest1","PvwLastSrcIndex":0,"PgmLastSrcIndex":0}
o	id—Index of Aux destination.
o	Name—Name of Aux destination.
o	PvwLastSrcIndex—Input/Background source index in the preview area.
o	PgmLastSrcIndex—Input/Background source index in the program area.
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"id": 0}, "method":"listAuxContent", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} auxDestIndex
 * @param  {} cb
 */
eventmaster.prototype.listAuxContent = function(auxDestIndex, cb) {
	var self = this;
	return self.query("listAuxContent", { id: auxDestIndex }, cb);
}

/**
changeAuxContent
•	Definition:
–	This API changes the source in the Aux destinations.
•	Request:
–	params: {"id":x, "Name": "AuxDest1" , "PvwLastSrcIndex": y , "PgmLastSrcIndex": z}
o	id—Index of the Aux destination.
o	Name—Name of Aux destination. (Optional paramter)
o	PvwLastSrcIndex—Input/Background source index to set in Aux destination in the preview area.
o	PgmLastSrcIndex—Input/Background source index to set in Aux destination in the program area.
o	TestPattern – Provide test pattern id 

•	Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"id":0 , "Name": "AuxDest1" , "PvwLastSrcIndex": 6 , "PgmLastSrcIndex": 1}, "method":"changeAuxContent", "id":"1234", "jsonrpc":"2.0"}

–	{"params":{"id":0, "TestPattern" :3 }, "method":"changeAuxContent", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} id
 * @param  {} pvwLastSrcIndex
 * @param  {} pgmLastSrcIndex
 * @param  {} cb
 */
eventmaster.prototype.changeAuxContent = function(id, pvwLastSrcIndex, pgmLastSrcIndex, cb) {
	var self = this;
	return self.query("changeAuxContent", { id: id, PvwLastSrcIndex: pvwLastSrcIndex, PgmLastSrcIndex: pgmLastSrcIndex }, cb);
}
/**
 * @param  {} id
 * @param  {} name
 * @param  {} pvwLastSrcIndex
 * @param  {} pgmLastSrcIndex
 * @param  {} cb
 */
eventmaster.prototype.changeAuxContentName = function(id, name, pvwLastSrcIndex, pgmLastSrcIndex, cb) {
	var self = this;
	return self.query("changeAuxContent", { id: id, name: name, PvwLastSrcIndex: pvwLastSrcIndex, PgmLastSrcIndex: pgmLastSrcIndex }, cb);
}

/**
Subscription and Un-Subscription
When a subscription is done from a JSON-based application, a notification is sent to the ip port where the application is running when there is change for which the user has subscribed.
Actual notification is sent asynchronously as an HTTP Post, with the following structure: {result: {method: "notification", notificationType: "ScreenDestChanged",change: { add: [2], remove: [], update: [0, 1, 2] }}}.
The change field contains the XmlId(s) of the screens that were added/removed or updated.

All subscriptions are lost once the Event Master processor is restarted, and they must be subscribed again if required.

subscribe
•	Definition
–	User can use this API to subscribe to change events in the Event Master processor.
–	Once subscribed, the API sends a notification in the form of an HTTP Post to the Url: http://hostname:port/.
•	Request:
–	params: {"hostname": hostname, "port": port, "notification" : notificationType[]}
o	hostname—Hostname or IP Address to which the notifications are sent.
o	port—TCP port to which the notification are posted.
o	notificationTypes—an array of notifications to which a user wants to subscribe.
◦	ScreenDestChanged
◦	AUXDestChanged
◦	FrameChanged
◦	NativeRateChanged
◦	InputCfgChanged
◦	SourceChanged
◦	BGSourceChanged
◦	PresetChanged
◦	StillChanged
◦	OutputCfgChanged
◦	CueChanged
•	Response:
–	response: {"method": "subscribe"}
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"hostname" : "192.168.247.131", "port": "3000", "notification" : ["ScreenDestChanged", "AUXDestChanged"]}, "method":"subscribe", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} hostname
 * @param  {} port
 * @param  {} notificationTypes
 * @param  {} cb
 */
eventmaster.prototype.subscribe = function(hostname, port, notificationTypes, cb) {
	var self = this;
	return self.query("subscribe", { hostname: hostname, port: port, notification: notificationTypes }, cb);
}

/**
unsubscribe
•	Definition
–	User can use this API to remove the subscription for the given hostname: port and notificationType.
•	Request:
–	params: {"hostname": hostname, "port": port, "notification" : notificationType[]}
o	hostname—Hostname or IP Address from which the subscription is to be removed.
o	port—TCP port.
o	notificationTypes—an array of notifications to which a user wants to subscribe.
◦	ScreenDestChanged
◦	AUXDestChanged
◦	FrameChanged
◦	NativeRateChanged
◦	InputCfgChanged
◦	SourceChanged
◦	BGSourceChanged
◦	PresetChanged
◦	StillChanged
◦	OutputCfgChanged
◦	CueChanged
•	Response:
–	response: {"method": " unsubscribe"}
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"hostname" : "192.168.247.131", "port": "3000", "notification" : ["ScreenDestChanged", "AUXDestChanged"]}, "method":"unsubscribe", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} hostname
 * @param  {} port
 * @param  {} notificationTypes
 * @param  {} cb
 */
eventmaster.prototype.unsubscribe = function(hostname, port, notificationTypes, cb) {
	var self = this;
	return self.query("unsubscribe", { hostname: hostname, port: port, notification: notificationTypes }, cb);
}

/**
3dControlOutput
•	Definition:
–	This API provides the option to modify 3d Controls on output configs.
•	Request:
–	{"params": {"outputId": 0, "3Dtype": 1}, "method":"3dControlOutput", "id":"1234", "jsonrpc":"2.0"}
o	outputId – Index of the output config.
o	3Dtype – "x" can be: 0 – Type Off. 0 is the default value for the type parameter. 1 – Type Sequential.
o	To reset, do not provide any parameter except "outputId".
•	Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"outputId": 0, "3Dtype": 1}, "method":"3dControlOutput", "id":"1234", "jsonrpc":"2.0"}

 */

/**
armUnarmDestination
•	Definition:
–	Arm and Unarm the destinations.
•	Request:
–	params: {"arm": 1, "ScreenDestination":[{"id": 2}, {"id": 3}], "AuxDestination":[{"id": 1}, {"id": 2}]}
o	"arm": - “x” can be: 0 – to unarm and 1 to arm.
o	ScreenDestinations—ScreenDest ids to arm/unarm.
o	AuxDestinations—AuxDest ids to arm/unarm.
•	 Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"arm": 1, "ScreenDestination":[{"id": 0}, {"id": 2}], "AuxDestination":[{"id": 0}, {"id": 1}]}, "method":"armUnarmDestination", "id":"1234", "jsonrpc":"2.0"}
–	{"params": {"arm": 0, "ScreenDestination":[{"id": 0}, {"id": 2}], "AuxDestination":[{"id": 0}, {"id": 1}]}, "method":"armUnarmDestination", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} arm
 * @param  {} screenDestinations
 * @param  {} auxDestinations
 * @param  {} cb
 */
eventmaster.prototype.armUnarmDestination = function(arm, screenDestinations, auxDestinations, cb) {
	var self = this;
	return self.query("armUnarmDestination", { arm: arm , ScreenDestination: screenDestinations, AuxDestination: auxDestinations}, cb);
}
/**
fillHV
•	Definition:
–	Fits layers to screen destination horizontally and vertically.
•	Request:
–	params: {"screenId": x, "Layers": [{"id": 0}, {"id": 1}, {"id": 3}]}
o	screenId — index of screen destination
o	Layers — Array of layer indexes.

•	 Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"screenId": 0, "Layers": [{"id": 0}, {"id": 1}]}, "method":"fillHV", "id":"1234", "jsonrpc":"2.0"}
*/

/**
clearLayers
•	Definition:
–	Clear layers from screen destinations only for custom mode.
•	Request:
–	params: {"screenId": x, "Layers": [{"id": 0}, {"id": 1}, {"id": 3}]}
o	screenId — index of screen destination
o	Layers — Array of layer indexes.

•	 Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"screenId": 0, "Layers": [{"id": 0}, {"id": 1}]}, "method":"clearLayers", "id":"1234", "jsonrpc":"2.0"}
*/


/**
recallUserKey
•	Definition:
–	Recall a UserKey on the Event Master processor. User can recall UserKey with id or UserKey name.
–	Send any one of the parameters to recall UserKey.
•	Request params:
–	params: {"id": x, "ScreenDestination": [], "Layer":[] }
–	params: {" userkeyName": "UserKeyName", "ScreenDestination": [], "Layer":[] }
o	ScreenDestination— Indexes of screen destination
o	 Layer – Array of layers index in screen destination on which UserKey is to be recalled.
*Note: If user provide params: {"id": x, "ScreenDestination": [1,2], "Layer":[1,2,3]} then this means Screen 1 - Layer 1,2,3, Screen 2 - Layer 1,2,3 and so on.
•	 Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"id": 0, "ScreenDestination": [0,1,2], "Layer":[0,2,4]}, "method":"recallUserKey", "id":"1234", "jsonrpc":"2.0"} //Recall with id 0.
–	{"params": {"userkeyName": "abc", "ScreenDestination": [0,1], "Layer":[0]}, "method":"recallUserKey", "id":"1234", "jsonrpc":"2.0"} //Recall userkey name “abc”. 
*/


/**
listUserKey
•	Definition:
–	This API lists all userkeys in the system.

•	Request params:
–	params: {}
•	 Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {}, "method":"listUserKeys", "id":"1234", "jsonrpc":"2.0"}
*/


/**
listSourceMainBackup
•	Definition:
–	This API shows list of inputs and backgrounds which has backup configured.
•	Request:
–	params: {“inputType”: x}
o	x can be – 1(Default): For all Inputs, 0 for inputs and 1 for Background. This is not mandatory parameter, if not provided, all (Inputs + Background) are listed.  
•	Response:
–	response: Array of inputs / Background
[{"id":0,"Name":"HDMIInput1","Backup":[{"id":0,"inputId":8,"stillId":null,"destId":null,"Name":"DPBackground1"},{"id":2,"inputId":4,"stillId":null,"destId":null,"Name":"DPInput5"}]}]
o	id—Index of inputs or background.
o	Name—Name of inpt/Background.
o	VideoStatus: 
o	0: there is sync, but cannot acquire / lock mismatch
o	1: Video status is OK
o	2: Format mismatch between Input config and connector(s)
o	3: Capacity / system mode error
o	4: A connector lost sync
o	Array of Backup
o	Id – backup Index (0, 1, 2). (Max we can set 3 backup)
o	InputId: index of input which is configured as backup source.
o	stillId: index of still which is configured as backup source.
o	destId: index of screen destination which is configured as backup source.
o	Name: Name of source configured as backup.

–	success: (0=success, anything else is an error)
•	Example:
–	{"params":{"inputType": -1}, "method":"listSourceMainBackup", "id":"1234", "jsonrpc":"2.0"}
*/

/**
activateSourceMainBackup
•	Definition:
–	This API configure backups on inputs and backgrounds.
•	Request:
–	params: {"inputId":8, 
"Backup1": {"SrcType": 1, "SourceId": 1},
"Backup2": {"SrcType": 0, "SourceId": 0},			"Backup3": {"SrcType": 1, "SourceId": 0},
"BackUpState":1}
o	inputId: index of input/Background for which backup needs to be configured.
o	Backup1/Backup2/Backup3: 
o	SrcType: 0 for input, 1 for Stills.
o	SourceId: Index of input/background or Still.
o	BackupState: Backup id which needs to be set for backup of the main input. -1 to set primary and is default (If not provided then primary will be activated)
•	Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params":{"inputId":8, 
"Backup1": {"SrcType": 1, "SourceId": 1},
"Backup2": {"SrcType": 0, "SourceId": 0},			"Backup3": {"SrcType": 1, "SourceId": 0},
"BackUpState":1}, "method":"activateSourceMainBackup", "id":"1234", "jsonrpc":"2.0"}
*/ 

/**
resetSourceMainBackup
•	Definition:
–	This API reset the applied source backup to primary.

•	Request params:
–	params: {“id": 2}
o	id: Source index to be reset.
•	 Response:
–	response: null
–	success: (0=success, anything else is an error)
•	Example:
–	{"params": {"id": 22}, "method":"resetSourceMainBackup", "id":"1234", "jsonrpc":"2.0"}
*/

/**
listInputs
•	Definition:
–	This queries the list of inputs configured.
•	Request:
–	params: {"inputId": x},
“x” can be:
o	–1: For All inputs. (inputId is optional parameter, if not provided list of all inputs configured will be returned.) 
o	Anything else will be treated as input config index and will return input of that index.
•	Response:
–	response: Array of: {"id":8,"Name":"DPBackground1","SyncStatus":"None","VideoStatus":"No Sync","Format":"1920x1080p @59.94","Color_Space":"RGB, Full Range","Colorimetry":"BT.709","GammaFx":"SDR","ColorDepth":"N/A","Capacity":"SL"}]
o	Response contains the array of inputs. Above response contains id, name, Sync status, video status, Format, Color Space, Colorimetry, Gamma Fx, Color Depth and capacity.
–	success: (0=success, anything else is an error)
•	Example:
–	{"params":{"inputId": 1}, "method":"listInputs", "id":"1234", "jsonrpc":"2.0"}
*/

/**
listOutputs
•	Definition:
–	This queries the list of outputs configured.
•	Request:
–	params: {"outputCfgId": x},
“x” can be:
o	–1: For All outputs. (outputCfgId is not mandatory parameter, if not provided list of all outputs configured will be returned.) 
o	Anything else will be treated as output config index and will return output of that index.
•	Response:
–	response: Array of:[{"id":2,"Name":"HDMIOutput3","Format":"1920x1080p @59.94","ColorSampleBit":"RGB/4:4:4/8","Color_Space":"RGB, Full Range","Colorimetry":"BT.709","GammaFx":"SDR","HDRMetaFileIndex":0,"Capacity":"4K"}]
o	Response contains the array of outputs. Above response contains id, name, Format, Color/Sample/Bit, Color space, Colorimetry, Gamma Fx, HDRMetaFileIndex and capacity.
–	success: (0=success, anything else is an error)
•	Example:
–	{"params":{"outputCfgId": 1}, "method":"listOutputs", "id":"1234", "jsonrpc":"2.0"}
*/

/**
mvrLayoutChange
•	Definition:
–	This API changes layout in the given frame multiviewer.
•	Request:
–	params: {"frameUnitId": x, "mvrLayoutId": x}
o	frameUnitId: Frame unit id for which MVR layout needs to be changed.
o	mvrLayoutId: Mvr layout index. Possible value 0 to 3.
o	Both are mandatory parameters for this API.

•	Response:
–	response: null
–	success: (0=success, anything else is an error)

•	Example:
–	{"params": {"frameUnitId": 0, "mvrLayoutId": 1}, "method":"mvrLayoutChange", "id":"1234", "jsonrpc":"2.0"}

 * @param  {} frameUnitId
 * @param  {} mvrLayoutId
 * @param  {} cb
 */
eventmaster.prototype.mvrLayoutChange = function (frameUnitId, mvrLayoutId, cb) {
	var self = this;
	return self.query("mvrLayoutChange", {frameUnitId: frameUnitId, mvrLayoutId: mvrLayoutId}, cb);
}

/**
 listOperators
•	Definition:
–	This queries the list of outputs configured.
•	Request:
–	params: {}
•	Response:
–	response: Array of [{"id":0,"Name":"Operator 1","Enable":0,"StartRange":1,"EndRange":1000,"InvertColor":0,"DestCollection":[]},{"id":1,"Name":"Operator 2 ","Enable":1,"StartRange":3,"EndRange":4,"InvertColor":0,"DestCollection":[{"id":0,"DestType":1,"DestXmlId":0,"Name":"ScreenDest1"},{"id":1,"DestType":0,"DestXmlId":0,"Name":"AuxDest1"}]},{"id":2,"Name":"Operator 3","Enable":0,"StartRange":1,"EndRange":1000,"InvertColor":0,"DestCollection":[{"id":0,"DestType":1,"DestXmlId":0,"Name":"ScreenDest1"}]}]
o	Response contains the array of multioperators. Above response contains id, name, Enable mode , Start Range of preset serial number,  End Range of preset serial number, color of controller is inverted for this operator and collection of destination selected for this operator.
–	success: (0=success, anything else is an error)
•	Example:
–	{"params":{}, "method":"listOperators", "id":"1234", "jsonrpc":"2.0"}

 * @param {*} cb 
 */
eventmaster.prototype.listOperators = function (cb) {
	var self = this;
	return self.query("listOperators", {}, cb)
}

/**
 configureOperator
•	Definition:
–	This API helps user to configure operator.
•	Request:
–	params: {"operatorId": 2, "name": "qwert", "startRange":89, "endRange":95, "enable": 0, "add" :{"destType": 1, "destIndex":0}, "remove" :{"destType": 1, "destIndex":1}}
o	operatorId: Operator index which needs to be configured.
o	name: User can set the name of the operator.
o	startRange : This is start range of preset serial number assigned to the operator.
o	endRange: This is end range of preset serial number assigned to the operator.
o	enable:  enable(1) or disable(0) the operator.
o	add/remove: Add/Remove destination for the operator.
o	destType: 0- aux, 1 - screen, 2 – link destination and 3 for super aux.
o	destIndex: destination index. 

•	Response:
–	response: null
–	success: (0=success, anything else is an error)

•	Example:
–	{"params": {"operatorId": 2, "name": "qwert", "startRange":89, "endRange":95, "enable": 0}, "method":"configureOperator", "id":"1234", "jsonrpc":"2.0"}
–	{"params": {"operatorId": 1, "add" :{"destType": 1, "destIndex":0}, "remove" :{"destType": 1, "destIndex":1}}, "method":"configureOperator", "id":"1234", "jsonrpc":"2.0"}
–	{"params": {"operatorId": 1, "name": "operator1", "endRange":34}, "method":"configureOperator", "id":"1234", "jsonrpc":"2.0"}
–	{"params": {"operatorId": 1, "name": "operator1", "startRange":89}, "method":"configureOperator", "id":"1234", "jsonrpc":"2.0"}

 * @param {*} operatorId 
 * @param {*} enable 
 * @param {*} cb 
 */
eventmaster.prototype.configureOperator = function(operatorId, enable, cb) {
	var self = this;
	return self.query("configureOperator", {operatorId: operatorId, enable: enable }, cb);
}


/** NOT DOCUMENTED BY BARCO **/

/*
Definition:
-This API to add test pattern control for changeContent for Screen Dest and changeAuxContent for Aux Dest

Example:
params:{"id":0, "TestPattern" :5 },
"method":"changeContent", "id":"1234", "jsonrpc":"2.0"}
Example:
params:{"id":0, "TestPattern" :3 },
"method":"changeAuxContent", "id":"1234", "jsonrpc":"2.0"}
*/
eventmaster.prototype.changeAuxContentTestPattern = function(id, testPattern, cb) {
	var self = this;
	return self.query("changeAuxContent", { id: id, TestPattern: testPattern }, cb);
}
eventmaster.prototype.changeContentTestPattern = function(id, testPattern, cb) {
	var self = this;
	return self.query("changeContent", { id: id, TestPattern: testPattern }, cb);
}

/**
 * "listDestGroups" to return a list of all Destination Groups group names and IDs including all member destination names and IDs.   
 * Example to return all Destination Groups: {"params": {}, "method":"listDestGroups", "id":"1234", "jsonrpc":"2.0"} 
 * @param {*} cb 
 */
eventmaster.prototype.listDestGroups = function(cb) {
	var self = this;
	return self. query("listDestGroups", {}, cb);
}

/**
 * "listDestGroups" to return a list of all Destination Groups group names and IDs including all member destination names and IDs.   
 * An additional parameter ("destGroupId", "destGroupSno", "destGroupName") may be added to return only the names and IDs of a particular Destination Group 
 * Example to return all Destination Groups: {"params": {destGroupId}, "method":"listDestGroups", "id":"1234", "jsonrpc":"2.0"} 
 * @param {*} type (destGroupId, destGroupSno, destGroupName)
 * @param {*} cb 
 */
eventmaster.prototype.listDestGroupsPerType = function(type, cb) {
	var self = this;
	return self. query("listDestGroups", {type}, cb);
}

exports = module.exports = eventmaster;
