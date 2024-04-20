// mongoDBConnector.test.js

const { MongoClient } = require('mongodb');
const MongoDBConnector = require('./mongoDBConnector'); // Assuming the file is named mongoDBConnector.js

// Mock the MongoClient
jest.mock('mongodb');

describe('MongoDBConnector', () => {
  let connector;

  beforeEach(() => {
    // Create a new instance of the connector
    connector = new MongoDBConnector('mongodb://localhost:27017', 'mydb', 'mycredentials.pem');
  });

  afterEach(() => {
    // Clean up any mocks
    jest.clearAllMocks();
  });

  it('should connect to the database', async () => {
    // Mock the MongoClient.connect method
    MongoClient.prototype.connect.mockResolvedValue();

    // Call the connect method
    await connector.connect();

    // Check if the client is connected
    expect(connector.connected).toBe(true);
  });

  it('should handle connection errors', async () => {
    // Mock the MongoClient.connect method to throw an error
    MongoClient.prototype.connect.mockRejectedValue(new Error('Connection error'));

    // Call the connect method
    await connector.connect();

    // Check if the client is not connected
    expect(connector.connected).toBe(false);
  });

  it('should disconnect from the database', async () => {
    // Mock the MongoClient.close method
    MongoClient.prototype.close.mockResolvedValue();

    // Call the disconnect method
    await connector.disconnect();

    // Check if the client is disconnected
    expect(connector.connected).toBe(false);
  });

  it('should handle disconnection errors', async () => {
    // Mock the MongoClient.close method to throw an error
    MongoClient.prototype.close.mockRejectedValue(new Error('Disconnection error'));

    // Call the disconnect method
    await connector.disconnect();

    // Check if the client is still connected
    expect(connector.connected).toBe(true);
  });

  // Add more test cases for other methods (createUser, readUser, searchUsers, updateUser)
  // Mock the necessary MongoDB methods and verify the behavior of your class
});


// mongoDBConnector.test.js

// ... (Previous imports and setup)

describe('MongoDBConnector', () => {
    // ... (Previous setup)
  
    it('should create a user', async () => {
      // Mock the necessary methods for creating a user
      const mockCollection = {
        insertMany: jest.fn().mockResolvedValue(),
      };
      connector.db = {
        collection: jest.fn().mockReturnValue(mockCollection),
      };
  
      // Call the createUser method
      await connector.createUser([{ toJSON: () => ({ name: 'Alice' }) }]);
  
      // Verify that the insertMany method was called
      expect(mockCollection.insertMany).toHaveBeenCalledWith([{ name: 'Alice' }]);
    });
  
    it('should read a user', async () => {
      // Mock the necessary methods for reading a user
      const mockCollection = {
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([{ userName: 'alice123' }]),
        }),
      };
      connector.db = {
        collection: jest.fn().mockReturnValue(mockCollection),
      };
  
      // Call the readUser method
      const user = await connector.readUser('alice123');
  
      // Verify that the find method was called
      expect(mockCollection.find).toHaveBeenCalledWith({ userName: 'alice123' });
      // Verify that the returned user is correct
      expect(user).toEqual({ userName: 'alice123' });
    });
  
    it('should search users', async () => {
      // Mock the necessary methods for searching users
      const mockCollection = {
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([{ name: 'Alice', username: 'alice123' }]),
        }),
      };
      connector.db = {
        collection: jest.fn().mockReturnValue(mockCollection),
      };
  
      // Call the searchUsers method
      const users = await connector.searchUsers('alice', 'Alice');
  
      // Verify that the find method was called
      expect(mockCollection.find).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: 'Alice', $options: 'i' } },
          { username: { $regex: 'alice', $options: 'i' } },
        ],
      });
      // Verify that the returned users are correct
      expect(users).toEqual([{ name: 'Alice', username: 'alice123' }]);
    });
  
    it('should update a user', async () => {
      // Mock the necessary methods for updating a user
      const mockCollection = {
        updateOne: jest.fn().mockResolvedValue(),
      };
      connector.db = {
        collection: jest.fn().mockReturnValue(mockCollection),
      };
      const userObject = {
        toJSON: jest.fn().mockReturnValue({ userName: 'alice123' }),
        getUserName: jest.fn().mockReturnValue('alice123'),
      };
  
      // Call the updateUser method
      await connector.updateUser(userObject);
  
      // Verify that the updateOne method was called
      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { userName: 'alice123' },
        { userName: 'alice123' },
        { upsert: true }
      );
    });
  
    // Add more test cases for other methods if needed
  });
  