const statusCode = {
  SUCCESS: {
    code: 200,
    description: 'ok',
  },
  SUCCESS_NO_CONTENT: {
    code: 204,
    description: 'no content',
  },
  BAD_REQUEST: {
    code: 400,
    description: 'bad request',
  },
  NOT_AUT: {
    code: 401,
    description: 'unauthorized',
  },
  NEED_TOKEN: {
    code: 403,
    description: 'not permission',
  },
  NOT_FOUND: {
    code: 404,
    description: 'not found',
  },
  NOT_ALLOWED: {
    code: 405,
    description: 'not allowed',
  },
  CONFLICT: {
    code: 409,
    description: 'conflict',
  },
  ERROR_IN_SERVER: {
    code: 500,
    description: 'error in server',
  },
};

export default statusCode;
