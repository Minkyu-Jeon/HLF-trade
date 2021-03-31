/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const UsedThing = require('./UsedThing.js');

class ThingList extends StateList {

  constructor(ctx) {
    super(ctx, 'org.example.thing');
    console.log(`Initialized ThingList / this.name: ${this.name}`)
    this.use(UsedThing);
  }

  async addThing(thing) {
    return this.addState(thing);
  }

  async getThing(thingKey) {
    return this.getState(thingKey);
  }

  async updateThing(thing) {
    return this.updateState(thing);
  }

  async deleteThing(thing) {
    return this.deleteState(thing)
  }
}


module.exports = ThingList;