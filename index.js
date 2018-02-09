
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

	self.rest.post("http://"+self.ip+":9999/jsonrpc", args, function (data, response) {
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

// DEFINITIONS FROM EM 5.0

/*
Definition
–	It executes “allTrans” command.

Request
params: {} - It doesn’t require any parameter.

Returns
response: null

success: (0=success, anything else an error)

Example
–	{"params":{}, "method":"allTrans", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.allTrans = function(cb) {
	var self = this;
	self.query("allTrans", {}, cb);
}

/*
Definition
–	It executes “Cut” command.

Request
params: {} - It doesn’t require any parameter.

Returns
response: null

success: (0=success, anything else an error)

Example
–	{"params":{}, "method":"cut", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.cut = function(cb) {
	var self = this;
	self.query("cut", {}, cb);
}

/*
Definition
–	Expose ALL reset types on Event Master processor with different options.

Request
params: –	{"reset":x}

possible Value: “x” can be 0 – 5. - 0: Soft reset.- 1: Factory reset. - 2: Factory reset (save IP). - 3: Factory reset (save IP/EDID). - 4: Factory reset (save VPID). - 5: Shut Down.

Returns
response: null

success: (0=success, anything else an error)

Example
–	{"params":{"reset": 0}, "method":"resetFrameSettings", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.resetFrameSettings = function(resetKind, cb) {
	var self = this;
	self.query("resetFrameSettings", { reset: resetKind }, cb);
}

/*
Definition
–	This queries the power plug status of the Event Master processor. (There can be 1 or 2 power slots in Event Master processor).

Request
params: {} It doesn’t require any parameter.

Returns
response: {FrameId1 :{ PwrStatus1, PwrStatus2},{FrameId2 :{ PwrStatus1, PwrStatus2} -	PwrStatus1 gives the power status of the 1st slot in Event Master processor with frame id FrameId1, FrameId2. - PwrStatus2 gives the power status of the 2nd slot in Event Master processor with frame id FrameId1, FrameId2.

success: (0=success, anything else an error)

Example
–	{"params":{}, "method":"powerStatus", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.powerStatus = function(cb) {
	var self = this;
	self.query("powerStatus", {}, cb);
}

/*
Definition
–	This queries the list of presets on a particular destination or on the system.

Request
params: {"ScreenDest":x , "AuxDest":x}

possible Value: “x” can be: -2: Do not include any destinations of this type.	–1: Do not care (All presets).	0–999: want to see the presets with the destination this particular id in it or array of ids. Eg. "ScreenDest":0

Returns
response: Array of presets: [{"id": 0, "Name": "Preset3.00", "LockMode": 0, "presetSno": 3.00},{"id": 1, "Name": "Preset4.00", "LockMode": 0, "presetSno": 4.00}]. Response contains id, name, lock mode preset serial number of the all the presets.

success: (0=success, anything else an error)

Example
–	{"params":{"ScreenDest": 0}, "method":"listPresets", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.listPresets = function(ScreenDest, AuxDest, cb) {
	var self = this;
	if (ScreenDest == null) ScreenDest = -1;
	if (AuxDest == null) AuxDest = -1;
	self.query("listPresets", { ScreenDest: ScreenDest, AuxDest: AuxDest }, cb);
}

/*
Definition
–	Lists the content of a Preset.

Request
params: {“id”:x }

possible Value: “x” can be: –1: List all presets.	0–999: list only that specific preset.

Returns
response: Array of presets: [{"id": 0, "Name": "Preset3.00", "LockMode": 0, "presetSno": 3.00,"ScreenDest":[{"id": 0}, {"id": 3}],"AuxDest":[{"id": 0}, {"id": 1}]}]. Response contains id, name, lock mode preset serial number and associated Screen and Aux destinations of the all the presets.

success: (0=success, anything else an error)

Example
–	{ "params":{"id": 0}, "method":"listDestinationsForPreset", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.listDestinationsForPreset = function(presetId) {
	var self = this;
	if (presetId == null) presetId = -1;
	self.query("listDestinationsForPreset", { id: presetId }, cb);
}

/*
Definition
–	Creates a Preset on the Event Master processor.

Request
params: {"presetName": "NewPreset", "ScreenDestination":[{"id": 2}, {"id": 3}],"AuxDestination":[{"id": 1}, {"id": 2}]}

possible Value: “presetName”—Name of the preset to save. -	ScreenDestinations—ScreenDest id for which preset to be created. - AuxDestinations—AuxDest id for which preset to be created. -	ScreenDestination, AuxDestinations are optional parameters. If user didn’t provide it, preset will be saved for selected destinations.

Returns
response: null

success: (0=success, anything else an error)

Example
–	{"params": {"presetName": "NewPreset"}, "method":"savePreset", "id":"1234", "jsonrpc":"2.0"}

–	{"params": {"presetName": "NewPreset", "ScreenDestination":{"id": 0},"AuxDestination":{"id": 0}}, "method":"savePreset", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.savePreset = function(presetName, ScreenDestinationsArray, AuxDestinationsArray, cb) {
	var self = this;
	self.query("savePreset", {
		presetName: presetName,
		ScreenDestination: ScreenDestinationsArray,
		AuxDestination: AuxDestinationsArray
	}, cb);
};

/*
Definition
–	Rename a Preset on the Event Master processor. User can rename Preset with id, Preset serial number, or preset name. –	Send any one of the parameters to rename Preset.

Request
params: {"id": x, "newPresetName": "NewPresetName"}

params: {"presetSno": x.y, "newPresetName": "NewPresetName"}

params: {"presetName": "OldPresetName", "newPresetName": "NewPresetName"}

possible Value: "x" is the valid preset id. "x.y" is possible preset serial number. “newPresetName”— New Preset name to set

Returns
response: null

success: (0=success, anything else an error)

Example
–	{"params": {"id": 0, "newPresetName": " newPresetName "}, "method":"renamePreset", "id":"1234", "jsonrpc":"2.0"}

–	{"params": {"presetName": "NewPreset", "newPresetName": "NewPresetName"}, "method":"renamePreset", "id":"1234", "jsonrpc":"2.0"}

–	{"params": {"presetSno": 1.00, "newPresetName": " newPresetName "}, "method":"renamePreset", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.renamePresetById = function(presetId, newPresetName, cb) {
	var self = this;
	self.query("renamePreset", { id: presetId, newPresetName: newPresetName }, cb);
}

eventmaster.prototype.renamePresetBySno = function(presetSno, newPresetName, cb) {
	var self = this;
	self.query("renamePreset", { presetSno: presetSno, newPresetName: newPresetName }, cb);
}

eventmaster.prototype.renamePresetByName = function(presetName, newPresetName, cb) {
	var self = this;
	self.query("renamePreset", { presetName: presetName, newPresetName: newPresetName }, cb);
}

/*
Definition
–	Recall a Preset on the Event Master processor. User can recall Preset with id, Preset serial number, or Preset name. –	Send any one of the parameters to recall Preset.

Request
params: {"id": x, "type": x}

params: {"presetSno": x.y, "type": x}

params: {"presetName": "PresetName"}

possible Value: “type”—0 to recall in preview (default), 1 to recall in program. This is not a mandatory parameter but should be given when the user wants to recall a Preset in program.

Returns
response: null

success: (0=success, anything else an error)

Example
–	{"params": {"id": 0, "type": 0}, "method":"activatePreset", "id":"1234", "jsonrpc":"2.0"}

–	{"params": {"presetName": "abc" }, "method":"activatePreset", "id":"1234", "jsonrpc":"2.0"}

–	{"params": {"presetSno": 1.00, "type": 1}, "method":"activatePreset", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.activatePresetById = function(presetId, recallInProgramInt, cb) {
	var self = this;
	self.query("activatePreset", { id: presetId, type: recallInProgramInt }, cb);
}

eventmaster.prototype.activatePresetBySno = function(presetSno, recallInProgramInt, cb) {
	var self = this;
	self.query("activatePreset", { presetSno: presetSno, type: recallInProgramInt }, cb);
}

eventmaster.prototype.activatePresetByName = function(presetName, recallInProgramInt, cb) {
	var self = this;
	self.query("activatePreset", { presetName: presetName, type: recallInProgramInt }, cb);
}

/*
Definition
–	Delete a Preset on the Event Master processor. User can delete Preset with id, Preset serial number, or Preset name. –	Send any one of the parameters to delete Preset.

Request
params: {"id": x}

params: {"presetSno": x.y}

params: {"presetName": "PresetName"}

Returns
response: null

success: (0=success, anything else an error)

Example
–	{"params": {"id": 1}, "method":"deletePreset", "id":"1234", "jsonrpc":"2.0"}

–	{"params": {"presetSno": 1.00}, "method":"deletePreset", "id":"1234", "jsonrpc":"2.0"}

–	{"params": {"presetName": "Preset 5.00"}, "method":"deletePreset", "id":"1234", "jsonrpc":"2.0"}
*/


eventmaster.prototype.deletePresetById = function(presetId, cb) {
	var self = this;
	self.query("deletePreset", { id: presetId }, cb);
}

eventmaster.prototype.deletePresetBySno = function(presetSno, cb) {
	var self = this;
	self.query("deletePreset", { presetSno: presetSno }, cb);
}

eventmaster.prototype.deletePresetByName = function(presetName, cb) {
	var self = this;
	self.query("deletePreset", { presetName: presetName }, cb);
}

/*
Definition
–	Recall the next Preset on the Event Master processor. –	No parameter is required –	Make sure that the user has at least recalled one Preset. Web app recalls the next Preset from the last Preset recalled

Request
params: {}

Returns
response: null

success: (0=success, anything else an error)

Example
–	{"params": {}, "method":" recallNextPreset", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.recallNextPreset = function(cb) {
	var self = this;
	self.query("recallNextPreset", {}, cb);
}

/*
Definition
–	This API lists all the destinations with properties such as layers, outputs, id, size, and name.

Request
params: {"type": x}

possible Value: "x" can be 0 — Show all the destinations, 0 is the default value for the type parameter.	1—Only screen destinations,	2—Only aux destinations.

Returns
response: Array of destinations : {"ScreenDestination":[{"id": 0, "Name": "Dest1", "HSize": 3840, "VSize": 1080, "Layers": 1,"DestOutMapColl":[{"id": 0"DestOutMap":[{"id": 0, "Name": "Out1", "HPos": 0, "VPos": 0, "HSize": 1920, "VSize":1080, "Freeze": 0},{"id": 1, "Name": "Out2", "HPos": 1920, "VPos": 0, "HSize": 1920, "VSize":1080, "Freeze": 1}]}]}],"AuxDestination":[{"id": 0, "AuxStreamMode": 4}, {"id": 1, "AuxStreamMode": 4}]}"

success: (0=success, anything else an error)

Example
–	{"params": {"type": 0}, "method":"listDestinations", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.listDestinations = function(type, cb) {
	var self = this;
	self.query("listDestinations", { type: type  }, cb);
}

/*
Definition
–	This API lists all the input sources with properties.

Request
params: {"type": x}

possible Value: "x" can be : 0 — Show all the input sources. 0 is the default value for the type parameter. 1 — Only background sources.

Returns
response: Array of : {"id": 0, "Name": "InSource1", "HSize": 3840, "VSize": 1080, "Src-Type": 0, "InputCfgIndex": -1, "StillIndex": 0, "DestIndex": -1, "UserKeyIndex": -1, "Mode3D": 0, "Freeze": 1, "Capacity": 2, "InputCfgVideoStatus": 4}

success: (0=success, anything else an error)

Example
–	{"params": {"type": 0}, "method":"listSources", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.listSources = function(type, cb) {
	var self = this;
	self.query("listSources", { type: type }, cb);
}

/*
listContent
Definition
–	This API shows the content of a screen destination.

Request
params: {"id": x}

possible Value: “id”—Screen destination index.

Returns
response: { "id": 0, "Name": "ScreenDest1""BGLyr":[{"id": 0, "LastBGSourceIndex": 0,"BGShowMatte":0, "BGColor":[{"id":0, "Red":0, "Green":0, "Blue":0}]}, {"id": 1, "LastBGSourceIndex":0, "BGShowMatte":0, "BGColor":[{"id":0, "Red":0, "Green":0, "Blue":0}]}],(0= PGM Background, 1 = PVW Background)"Layers":[{"id": 0, "LastSrcIdx": 0, "HPos": 0,"VPos": 0, "HSize": 400, "VSize": 300, "PvwMode": 0, "PgmMode": 0, "Freeze": 0,"FlexZOrder": 0,"LayerTrans":[{"id": 0, "TransTime": 30, "TransPos": 0}, {"id": 1,"TransTime": 30, "TransPos": 0}] , "3D": "Yes", "Freeze": 0, "Capacity": 2}]}]}

Response Param: -	id—index of screen destination. -	Name—Name of ScreenDestination. -	BGLayer—There are 2 bglayer , one in program and one in preview. Hence, showing Index of background on screen destination. -	LastBGSoureIndex—This is –1 if no background is dropped, else this is index of last background dropped on screen destination. -	BGShowMatte—This is if BG to be matte or not. -	BGColor—This is background color. -	Layers—Lists layers on screen destination with its properties. -	Transition—This property of screen destination contains the transition time (from time to move from preview to program).

success: (0=success, anything else an error)

Example
–	{"params": {"id": 0}, "method":"listContent", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.listContent = function(id, cb) {
	var self = this;
	self.query("listContent", { id: id }, cb);
}

/*
Definition
–	This API changes the content of a screen destination by putting background and layers in it.

Request
params: {
	"id":0,
	"BGLyr":[
		{
			"id":0,
			"LastBGSourceIndex":0,
			"BGShowMatte":0,
			"BGColor":[
				{ "id":0, "Red":0, "Green":0, "Blue":0 }
			]
		},
		{
			"id":1,
			"LastBGSourceIndex":0,
			"BGShowMatte":0,
			"BGColor":[
				{ "id":0, "Red":0, "Green":0, "Blue":0 }
			]
		}
	],
	"Layers":[
		{
			"id":0,
			"LastSrcIdx":0,
			"Window":{
				"HPos":0,"VPos":0,"HSize":400,"VSize":300
			},
			"Source":{
				"HPos":0,"VPos":0,"HSize":1920,"VSize":1080
			},
			"Mask":{
				"Left":0.01,"Right":10.1, "Top":0.0,"Bottom":0.0
			},
			"PvwMode":1,
			"PgmMode":0,
			"Freeze":0,
			"Pgm-ZOrder":0,
			"PvwZOrder":0
		}
	]
}

Request Param,: -	id—index of screen destination. -	BGLayer—Background layer index, Last source index of background -	Layers—Layer information. -	Window—Layer window size. -	Source—Source info and size. -	Mask—Crop the visible part of the layer. -	PvwMode—Set 1 if you want the content in preview. (Default). -	PgmMode—Set 1 if you want the content in program.

Returns
response: null

success: (0=success, anything else an error)

Example
–	{"params":{"id":0,"BGLyr":[{"id":0,"LastBGSourceIndex":0,"BGShowMatte":0,"BGColor":[{"id":0,"Red":0,"Green":0,"Blue":0}]},{"id":1,"LastBGSourceIndex":0,"BGShowMatte":0,"BGColor":[{"id":0,"Red":0,"Green":0,"Blue":0}]}],"Layers":[{"id":0,"LastSrcIdx":0,"Window":{"HPos":0,"VPos":0,"HSize":400,"VSize":300},"Source":{"HPos":0,"VPos":0,"HSize":1920,"VSize":1080}, "Mask":{ "Left":0.01,"Right":10.1, "Top":0.0,"Bottom":0.0},"PvwMode":1,"PgmMode":0,"Freeze":0,"Pgm-ZOrder":0,"PvwZOrder":0}]}, "method":"changeContent", "id":"1234", "jsonrpc":"2.0"}.
*/

eventmaster.prototype.changeContent = function(screenDestIndex, bgLayer, Layers, cb) {
	var self = this;
	self.query("changeContent", { id: screenDestIndex, BGLyr: bgLayer, Layers: Layers }, cb);
}

/*
Definition
–	This API changes the source in the Aux destinations.

Request
params: {
	"id":x ,
	"Name": "AuxDest1" ,
	"PvwLastSrcIndex": y ,
	"PgmLastSrcIndex": z
}

Request Param,: -	Id—Index of the Aux destination.

Returns
response: null

success: (0=success, anything else an error)

Example
–	{"params": {"id":0 , "Name": "AuxDest1" , "PvwLastSrcIndex": 6 , "PgmLastSrcIndex":1}, "method":"changeAuxContent", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.changeAuxContent = function(auxDestIndex, name, pvwLastSrcIndex, pgmLastSrcIndex, cb) {
	var self = this;
	self.query("changeAuxContent", { id: id, Name: name, PvwLastSrcIndex: pvwLastSrcIndex, PgmLastSrcIndex: pgmLastSrcIndex }, cb);
}

/*
Definition
–	This API Freezes/Unfreezes the sources.

Request
params: {
	"type": x,
	"id": y,
	"screengroup": z ,
	"mode": z
}

Request Param,: -	type — type of source. 0 — Input source.◦	1 — Background source.◦	2 — ScreenDestination. 3 — AuxDestination. - id—Index of the source. -	Screengroup—For future use. Always set to 0 .–	Mode- 0 : UnFreeze, 1 : Freeze.

Returns
response: null

success: (0=success, anything else an error)

Example
–	{"params": {"type": 0, "id": 0, "screengroup": 0 ,"mode": 1}, "method":"freezeDest-Source", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.freezeDestSource = function(type, id, screenGroup, mode, cb) {
	var self = this;
	self.query("freezeDestSource", { type: type, id: id, screengroup: screenGroup, mode: mode }, cb);
}

/*
Definition
–	This API lists all the stills with properties such as id, Name, H/V size, LockMode, StillState, PngState, File size.

Request
params: –	{}

Returns
response: Array of : [{"id":0,"Name":"StillStore1","Lock-Mode":0,"HSize":{"Min":0,"Max":99999,"$t":1920},"VSize":{"Min":0,"Max":99999,"$t":1080},"Still-State":{"Min":0,"Max":4,"$t":3},"PngState":{"Min":0,"Max":2,"$t":0},"File-Size":{"Min":0,"Max":100000,"$t":9331.2}}]

Response Param: -	id—Index of still store. -	Name—Name of still store. -	LockMode—For future use. Always set to 0. -	H/V size—Horizontal and vertical size, Min, max and current value. It shows the current value. -	StillState—This tells user if the still is currently being captured or not, or if it is getting deleted. -	PngState—The “PNG” for stills are for the thumbnails we capture for the stills. - FileSize—Size of the file created in KBs.

success: (0=success, anything else an error)

Example
–	{"params": {}, "method":"listStill", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.listStill = function(cb) {
	var self = this;
	self.query("listStill", {}, cb);
}

/*
Definition
–	This API deletes a still.

Request
params: –	{“id”: x}

Request Param,: -	id—Index of still.

Returns
response: null

success: (0=success, anything else an error)

Example
–	{"params":{"id": 0}, "method":"deleteStill", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.deleteStill = function(stillIndex,cb) {
	var self = this;
	self.query("deleteStill", { id:stillIndex }, cb);
}

/*
Definition
–	This API creates/overwrites a still.

Request
params: - {
	"type": x,
	"id": y,
	“file”: z
}

Request Param,: -	type – 0 for input source, 1 for BG source. Id – Index of the input source. If source id of destination is provided, no still be create and an error will be shown. File – still file id. If you pass “file” : 5, this will create StillStore6

Returns
response: null

success: (0=success, anything else an error)

Example
–	{"params":{"type":0 , "id": 1, “file”: 5}, "method":"takeStill", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.takeStill = function(type, id, fileid, cb) {
	var self = this;
	self.query("takeStill", { type: type, id: id, file: fileid }, cb);
}

/*
Definition
–	This API shows system information, including all the frames information.

Request
params: –	{}

Returns
response: –	{"System":{"id":0,"Name":"System1","FrameCollection":{"id":0,"Frame":{"id":"00:0c:29:0e:86:d4","Name":"E2","Contact":"","Version":"4.2.30738","OSVersion":"NA","FrameType":0,"FrameTypeName":"E2","Enet":{"Dhcp-Mode":0,"DhcpModeName":"Static","IP":"10.98.0.165","StaticIP":"192.168.000.175","MacAddress":"00:0c:29:0e:86:d4","StaticMask":"255.255.255.000","StaticGateway":"192.168.000.001"},"SysCard":{"SlotState":2,"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":80,"CardTypeLabel":"System","CardID":0},"Slot":[{"Card":{"Card-StatusID":2,"CardStatusLabel":"Ready","CardTypeID":70,"CardTypeLabel":"Expansion","CardID":"thisissometextforid0"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":70,"CardTypeLabel":"Expansion","CardID":"thisissometextforid1"}},{"Card":{"CardStatusID":0,"CardStatusLabel":"NotInstalled","CardTypeID":255,"CardTypeLabel":"Unknown","CardID":"Undefined"}},{"Card":{"CardStatusID":2,"CardStatus-Label":"Ready","CardTypeID":1,"CardTypeLabel":"SDIInput","CardID":"thisissometextforid211"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":3,"CardID":"thisissometextforid2"}},{"Card":{"Card-StatusID":2,"CardStatusLabel":"Ready","CardTypeID":0,"CardTypeLabel":"DVIInput","CardID":"thisissometextforid4"}},{"Card"{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":2,"CardTypeLabel":"HDMI/DPInput","CardID":"thisissometextforid5"}},{"Card"{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":2,"CardTypeLabel":"HDMI/DPInput","CardID":"thisissometextforid7"}},{"Card"{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":2,"CardTypeLabel":"HDMI/DPInput","CardID":"thisissometextforid8"}},{"Card"{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":2,"CardTypeLabel":"HDMI/DPInput","CardID":"thisissometextforid9"}},{"Card":{"CardStatusID":2,"Card-StatusLabel":"Ready","CardTypeID":22,"CardTypeLabel":"HDMIOutput","CardID":"CardID3"}},{"Card":{"CardStatusID":2,"Card-StatusLabel":"Ready","CardTypeID":22,"CardTypeLabel":"HDMIOutput","CardID":"CardID4"}},{"Card":{"CardStatusID":2,"Card-StatusLabel":"Ready","CardTypeID":21,"CardTypeLabel":"SDIOutput","CardID":"CardID415"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","Card-TypeID":40,"CardTypeLabel":"MVR","CardID":"CardID15"}},{"Card":{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":50,"CardTypeLabel":"VPUScaler","CardID":"thisissometextforid501"},{"Card"{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":50,"CardTypeLabel":"VPUScaler","CardID":"thisissometextforid502"}},{"Card"{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":50,"CardTypeLabel":"VPUScaler","CardID":"thisissometextforid503"}},{"Card"{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":50,"CardTypeLabel":"VPUScaler","CardID":"thisissometextforid504"}},{"Card":{"Card-StatusID":0,"CardStatusLabel":"NotInstalled","CardTypeID":255,"CardTypeLabel":"Unknown","CardID":"Undefined"}},{"Card":{"CardStatusID":2,"CardStatus-Label":"Ready","CardTypeID":50,"CardTypeLabel":"VPUScaler","CardID":"thisissometextforid505"}},{"Card"{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":50,"CardTypeLabel":"VPUScaler","CardID":"thisissometextforid506"}}{"Card"{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":50,"CardTypeLabel":"VPUScaler","CardID":"thisissometextforid507"}}{"Card"{"CardStatusID":2,"CardStatusLabel":"Ready","CardTypeID":50,"CardTypeLabel":"VPUScaler","CardID":"thisissometextforid508"}}]}}}}}

Response Param: -	System—System name and index. -	FrameCollection—Collection of frames in a system containing frame information. -	Frame—Contains frame information. -	Id—Mac Id of the frame. -	Name—Name of the frame. -	Contact—Contact information. -	Version—Current version of the software installed on the frame. -	OSVersion—Current OS version installed on the frame. -	FrameType—0: E2, 1:S3, 2: Ex -	FrameTypeName—Type of the frame: E2/S3/Ex. -	Enet—Ethernet settings -	SysCard—System card information -	Slot—List of Input/Output/Expansion card information

success: (0=success, anything else an error)

Example
–	{"params":{}, "method":"getFrameSettings", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.getFrameSettings = function(cb) {
	var self = this;
	self.query("getFrameSettings", {}, cb);
}

/*
Definition
–	This API shows Aux destination information.

Request
params: - {“id” : x}

Request Param,: -	Id—Index of the Aux destination.

Returns
response: {"id":0,"Name":"AuxDest1","PvwLastSrcIndex":0,"PgmLastSrcIndex":0}

Response Param: -	id—Index of Aux destination. -	Name—Name of Aux destination. -	PvwLastSrcIndex—Input/Background source index in preview area. -	PgmLastSrcIndex—Input/Background source index in program area.

success: (0=success, anything else an error)

Example
–	{"params": {"id": 0}, "method":"listAuxContent", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.listAuxContent = function(auxDestIndex, cb) {
	var self = this;
	self.query("listAuxContent", { id: auxDestIndex }, cb);
}

/*
Definition
–	User can use this API to subscribe to change events in the Event Master processor. Once subscribed, the API sends a notification in the form of an HTTP Post to the Url: http://hostname:port/.

Request
params: {
	"hostname": hostname,
	"port": port,
	"notification" : notificationTypes[]
}

Request Param,: -	hostname—Hostname or IP Address to which the notifications are sent. -	port—TCP port to which the notification are posted. -	notificationTypes—an array of notifications to which a user wants to subscribe. -	ScreenDestChanged -	AUXDestChanged -	FrameChanged -	NativeRateChanged -	InputCfgChanged -	SourceChanged -	BGSourceChanged -	PresetChanged -	StillChanged - OutputCfgChanged

Returns
response: {"jsonrpc": "2.0","result": {"success": 0,"response": {"method": "subscribe"}},"id": "1234"} Actual notification will be sent asynchronously as HTTP Post, with the following structure {result: {method: "notification",notificationType: "ScreenDestChanged",change: { add: [2], remove: [], update: [0, 1, 2] }}} The change fields contains the XmlId(s) of the screens which were added/removed or updated.

success: (0=success, anything else an error)

Example
–	{"params": {"hostname" : "192.168.247.131", "port": "3000", "notification" : ["Screen-DestChanged", "AUXDestChanged"]}, "method":"subscribe", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.subscribe = function(hostname, port, notificationTypes, cb) {
	var self = this;
	self.query("subscribe", { hostname: hostname, port: port, notification: notificationTypes }, cb);
}

/*
Definition
–	User can use this API to remove the subscription for the given hostname: port and notificationType.

Request
params: {"hostname": hostname, "port": port, "notification" : notificationType[]} Removes the subscription for the given hostname: port and notificationType array. Please see the subscribe section for a detailed explanation of the subscription. NOTE: All subscriptions are lost once the E2 is restarted, and need to be subscribed again if required.

Returns
response: {"jsonrpc": "2.0","result": {"success": 0,"response": {"method": "unsubscribe"}},"id": "1234"}

success: (0=success, anything else an error)

Example
–	{"params": {"hostname" : "192.168.247.131", "port": "3000", "notification" : ["Screen-DestChanged", "AUXDestChanged"]}, "method":"unsubscribe", "id":"1234", "jsonrpc":"2.0"}
*/

eventmaster.prototype.unsubscribe = function(hostname, port, notificationTypes, cb) {
	var self = this;
	self.query("unsubscribe", { hostname: hostname, port: port, notification: notificationTypes }, cb);
}

exports = module.exports = eventmaster;
