/**
 * Copyright 2013 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

// If you use this as a template, replace IBM Corp. with your own name.

// Sample Node-RED node file

// Require main module
var RED = require(process.env.NODE_RED_HOME+"/red/red");

// The main node definition - most things happen in here
function ZwaveNode(n) {
    // Create a RED node
    RED.nodes.createNode(this,n);

    // Store local copies of the node configuration (as defined in the .html)
    this.port = n.port;
    this.nodeId = n.nodeid;

    var node = this;

    var OpenZWave = require('openzwave');

    var zwave = new OpenZWave(this.port);

    zwave.connect();

    zwave.on('scan complete', function() {
        node.log('[zwave] scan complete.');
    });

    zwave.on('notification', function(nodeid, notif) {
    switch (notif) {
    case 0:
        node.log('[zwave] message complete');
        break;
    case 1:
        node.log('[zwave] timeout');
        break;
    case 2:
        node.log('[zwave] nop');
        break;
    case 3:
        node.log('[zwave] node awake');
        break;
    case 4:
        node.log('[zwave] node sleep');
        break;
    case 5:
        node.log('[zwave] node dead');
        break;
    case 6:
        node.log('[zwave] node alive');
        break;
        }
    });

    this.on("input", function(msg) {

	var value = msg.payload;
	var node = msg.nodeId||this.nodeId
	this.log('[zwave] setting '+node+' to '+value);
	if(value == "true"){
	    zwave.switchOn(node);
	} else if(value == "false"){
	    zwave.switchOff(node)
	} else {
	    zwave.setLevel(node,value);
	}
    });

    this.on("close", function() {
    	zwave.disconnect();
    });

}

// Register the node by name. This must be called before overriding any of the
// Node functions.
RED.nodes.registerType("zwave",ZwaveNode);
