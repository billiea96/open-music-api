const { asyncHandler } = require("../../utils");

const routes = (handler) => [
  {
    method: "POST",
    path: "/songs",
    handler: asyncHandler(handler.postSongHandler),
  },
  {
    method: "GET",
    path: "/songs",
    handler: asyncHandler(handler.getSongsHandler),
  },
  {
    method: "GET",
    path: "/songs/{id}",
    handler: asyncHandler(handler.getSongByIdHandler),
  },
  {
    method: "PUT",
    path: "/songs/{id}",
    handler: asyncHandler(handler.putSongByIdHandler),
  },
  {
    method: "DELETE",
    path: "/songs/{id}",
    handler: asyncHandler(handler.deleteSongByIdHandler),
  },
];

module.exports = routes;
