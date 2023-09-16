export default function(userDatabase) {
  let operations = {
    GET,
    PUT,
    DELETE
  };

  function GET(req, res, next) {
    // TODO: Actually implement it
    // res.status(200).json(worldsService.getWorlds(req.query.worldName));
  }
  function PUT(req, res, next) {
    // TODO: Actually implement it
    // res.status(200).json(worldsService.getWorlds(req.query.worldName));
  }

  function DELETE(req, res, next) {
    // TODO: Actually implement it
    // res.status(200).json(worldsService.getWorlds(req.query.worldName));
  }

  GET.apiDoc = {
    summary: 'Get the data and match preferences for the user corresponding to the uid',
    operationId: 'getUserEntry',
    parameters: [
      {
        in: 'path',
        name: 'uid',
        required: true,
        type: 'string'
      }
    ],
    responses: {
      200: {
        description: "The user matching the uid",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/User",
            },
          },
        },
      },
    },
  };

  PUT.apiDoc = {
    summary: 'Update the data and match preferences for the user corresponding to the uid',
    operationId: 'updateUserEntry',
    parameters: [
      {
        in: 'path',
        name: 'uid',
        required: true,
        type: 'string'
      }
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/User",
          },
        },
      },
    },
    responses: {
      200: {
        description: "User updated successfully",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/User",
            },
          },
        },
      },
    },
  };

  DELETE.apiDoc = {
    summary: 'Delete the data and match preferences for the user corresponding to the uid',
    operationId: 'deleteUserEntry',
    parameters: [
      {
        in: 'path',
        name: 'uid',
        required: true,
        type: 'string'
      }
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/User",
          },
        },
      },
    },
    responses: {
      204: {
        description: "User deleted",
        content: {},
      },
    },
  };

  return operations;
}
