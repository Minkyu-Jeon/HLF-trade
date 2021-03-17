'use strict';

const { Contract } = require('fabric-contract-api');

class UserChainCode extends Contract {

  async InitLedger(ctx) {
    // empty
  }

  async SignUp(ctx, id, email, password_digest, nickname, phone, address) {
    const user = {
      docType: 'user',
      ID: id,
      Email: email,
      PasswordDigest: password_digest,
      Nickname: nickname,
      Phone: phone,
      Address: address,
    };
    ctx.stub.putState(id, Buffer.from(JSON.stringify(user)));

    return JSON.stringify(user);
  }

	async QueryUsersByEmail(ctx, email) {
		let queryString = {};
		queryString.selector = {};
		queryString.selector.docType = 'user';
		queryString.selector.Email = email;
		return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
	}

	async QueryAssets(ctx, queryString) {
		return await this.GetQueryResultForQueryString(ctx, queryString);
	}

	async GetQueryResultForQueryString(ctx, queryString) {
		let resultsIterator = await ctx.stub.getQueryResult(queryString);
		let results = await this.GetAllResults(resultsIterator, false);

		return JSON.stringify(results);
	}

  async Show(ctx, id) {
    const userJSON = await ctx.stub.getState(id); 
    if (!userJSON || userJSON.length === 0) {
      throw new Error(`The user ${id} does not exist`);
    }
    return userJSON.toString();
  }

  async UpdateUser(ctx, id, email, nickname, phone, address) {
    const exists = await this.UserExists(ctx, id);
    if (!exists) {
      throw new Error(`The user ${id} does not exist`);
    }

    const UpdatedUser = {
      ID: id,
      Email: email,
      Nickname: nickname,
      Phone: phone,
      Address: address,
    };
    return ctx.stub.putState(id, Buffer.from(JSON.stringify(UpdatedUser)));
  }

  async DeleteUser(ctx, id) {
    const exists = await this.UserExists(ctx, id);
    if (!exists) {
      throw new Error(`The user ${id} does not exist`);
    }
    return ctx.stub.deleteState(id);
  }

  async UserExists(ctx, id) {
    const userJSON = await ctx.stub.getState(id);
    return userJSON && userJSON.length > 0;
  }

  async GetAllResults(iterator, isHistory) {
		let allResults = [];
		let res = await iterator.next();
		while (!res.done) {
			if (res.value && res.value.value.toString()) {
				let jsonRes = {};
				console.log(res.value.value.toString('utf8'));
				if (isHistory && isHistory === true) {
					jsonRes.TxId = res.value.tx_id;
					jsonRes.Timestamp = res.value.timestamp;
					try {
						jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Value = res.value.value.toString('utf8');
					}
				} else {
					jsonRes.Key = res.value.key;
					try {
						jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Record = res.value.value.toString('utf8');
					}
				}
				allResults.push(jsonRes);
			}
			res = await iterator.next();
		}
		iterator.close();
		return allResults;
	}
}

module.exports = UserChainCode;
