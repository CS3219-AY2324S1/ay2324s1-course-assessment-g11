const apiDoc = {
  openapi: '3.1.0',
  info: {
    title: 'API for user data and match preferences',
    version: '1.0.0'
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          displayName: {
            description: 'The display name of the user in GitHub',
            type: 'string'
          },
          photoUrl: {
            description: 'The URL of the user\'s GitHub photo',
            type: 'string'
          },
          matchDifficulty: {
            description: 'The user\'s preferred question difficulty',
            type: 'integer'
          },
          matchProgrammingLanguage: {
            description: 'The user\'s preferred programming language',
            type: 'string'
          }
        }
      }
    }
  },
  paths: {}
};

module.exports = apiDoc;