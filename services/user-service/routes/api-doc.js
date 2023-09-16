const apiDoc = {
  swagger: '2.0',
  basePath: '/',
  info: {
    title: 'API for user data and match preferences',
    version: '1.0.0'
  },
  definitions: {
    User: {
      type: 'object',
      properties: {
        // TODO: Add the match properties
        uid: {
          description: 'The uid of the user in Firestore',
          type: 'string'
        },
        displayName: {
          description: 'The display name of the user in GitHub',
          type: 'string'
        }
      },
      required: ['uid']
    }
  },
  paths: {}
};

export default apiDoc;