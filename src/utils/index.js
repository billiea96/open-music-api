const ClientError = require("../exceptions/ClientError");

const errorResponse = (h, error) => {
  if (error instanceof ClientError) {
    const response = h.response({
      status: "fail",
      message: error.message,
    });

    response.code(error.statusCode);
    return response;
  }

  const response = h.response({
    status: "error",
    message: error.message,
  });

  response.code(500);
  console.log(error);
  return response;
};

const asyncHandler = (handler) => async (req, h) => {
  try {
    return await handler(req, h);
  } catch (error) {
    return errorResponse(h, error);
  }
};

module.exports = { errorResponse, asyncHandler };
