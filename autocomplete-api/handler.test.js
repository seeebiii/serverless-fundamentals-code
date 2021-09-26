const handler = require('./handler');
const AWS = require('aws-sdk');

jest.mock('aws-sdk');

describe('handler', () => {
  let mockQuery;

  beforeEach(() => {
    mockQuery = jest.fn().mockImplementation(() => ({
      promise: jest.fn(() => ({
        Items: [{foo: 'bar'}]
      }))
    }));

    AWS.DynamoDB.DocumentClient.prototype.query.mockImplementation(mockQuery);
  });

  it('document client is called with query and country', async () => {
    const result = await handler.autocomplete(
        { queryStringParameters: { country: 'GER', query: 'A' } });

    expect(result.body).toBe(JSON.stringify({suggestions: [{ foo: 'bar'}]}));
    expect(mockQuery.mock.calls).toHaveLength(1);
    expect(mockQuery.mock.calls[0][0].ExpressionAttributeValues).toStrictEqual({
      ':hkey': 'GER',
      ':rkey': 'A'
    });
  });
});
