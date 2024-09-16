import { expect } from 'chai';
import sinon from 'sinon';
import { MongoClient } from 'mongodb';
import mongoDBConnector from '../../../../server/databaseConnector/mongoConnector/mongoConnector.js';
import User from '../../../../server/dataObjects/user.js';
import {InternalServerResponse} from '../../../../utils/interal_response.js'

describe('mongoDBConnector', function() {
  let dbConnector, clientStub, dbStub, collectionStub, recipeStub;

  beforeEach(function() {
    clientStub = sinon.createStubInstance(MongoClient);
    dbStub = {
      collection: sinon.stub()
    };
    collectionStub = {
      find: sinon.stub(),
      updateOne: sinon.stub(),
      deleteOne: sinon.stub(),
      insertMany: sinon.stub()
    };
    dbStub.collection.returns(collectionStub);
    clientStub.db.returns(dbStub);

    sinon.stub(MongoClient.prototype, 'connect').resolves(clientStub);
    dbConnector = new mongoDBConnector('mongodb://localhost:27017', 'path/to/credentials', 'testDB');
    dbConnector.client = clientStub;
    dbConnector.db = dbStub;
    recipeStub = {
      toJSON: sinon.stub()
    }
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should connect to the database', async function() {
    await dbConnector.connect();
    expect(dbConnector.connected).to.be.true;
    expect(MongoClient.prototype.connect.calledOnce).to.be.true;
  });

  it('should disconnect from the database', async function() {
    await dbConnector.disconnect();
    expect(dbConnector.connected).to.be.false;
    expect(clientStub.close.calledOnce).to.be.true;
  });

  it('should create users', async function() {
    const users = [new User('user1'), new User('user2')];
    collectionStub.insertMany.resolves(true);

    const result = await dbConnector.createUser(users);
    expect(result.code).to.equal(201)
    expect(result.msg).to.equal("Successfully created Users. Count: 2")
    expect(collectionStub.insertMany.calledOnce).to.be.true;
  });

  it('should read a user', async function() {
    const user = new User('user1');
    collectionStub.find.returns({
      next: sinon.stub().resolves(user.toJSON())
    });

    const result = await dbConnector.readUser('user1');
    expect(result.data).to.be.an.instanceof(User);
    expect(result.data.userName).to.equal('user1');
  });

  it('should search users', async function() {
    const user = new User('user1');
    const findStub = {
      toArray: sinon.stub().returns([user.toJSON()]) 
    };
    collectionStub.find.returns(findStub); 

    const result = await dbConnector.searchUsers('user1');
    expect(result.data).to.be.an('array');
    expect(result.data[0]).to.be.an.instanceof(User);
    expect(result.data[0].userName).to.equal('user1');
  });

  it('should update a user', async function() {
    const user = new User('user1');
    collectionStub.updateOne.resolves({ modifiedCount: 1 });

    const result = await dbConnector.updateUser(user);
    expect(result.code).to.equal(201)
  });

  it('should delete a user', async function() {
    collectionStub.deleteOne.resolves({ deletedCount: 1 });

    await dbConnector.deleteUser('user1');
    expect(collectionStub.deleteOne.calledOnce).to.be.true;
  });

  it('should create recipes', async function() {
    const recipes = [recipeStub, recipeStub];
    collectionStub.insertMany.resolves(true);

    await dbConnector.createRecipe(recipes);
    expect(collectionStub.insertMany.calledOnce).to.be.true;
  });

  it('should search recipes', async function() {
    const recipes = [{ name: 'recipe1' }, { name: 'recipe2' }];
    collectionStub.find.returns({
      toArray: sinon.stub().resolves(recipes)
    });

    const result = await dbConnector.searchRecipes('recipe', ['ingredient1']);
    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(2);
  });

  it('should update a recipe', async function() {
    const recipe = { getRecipeName: () => 'recipe1', toJSON: () => ({ name: 'recipe1' }) };
    collectionStub.updateOne.resolves({ modifiedCount: 1 });

    const result = await dbConnector.updateRecipe(recipe);
    expect(result).to.have.property('modifiedCount', 1);
    expect(collectionStub.updateOne.calledOnce).to.be.true;
  });

  it('should delete a recipe', async function() {
    collectionStub.deleteOne.resolves({ deletedCount: 1 });

    await dbConnector.deleteRecipe('recipe1');
    expect(collectionStub.deleteOne.calledOnce).to.be.true;
  });
});
