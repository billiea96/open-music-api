const { asyncHandler } = require("../../utils");

const routes = (handler) => [
  {
    method: "POST",
    path: "/albums",
    handler: asyncHandler(handler.postAlbumHandler),
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: asyncHandler(handler.getAlbumByIdHandler),
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: asyncHandler(handler.putAlbumByIdHandler),
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: asyncHandler(handler.deleteAlbumByIdHandler),
  },
];

module.exports = routes;
