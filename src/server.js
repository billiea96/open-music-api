require("dotenv").config();

const Hapi = require("@hapi/hapi");
const albums = require("./api/albums");
const songs = require("./api/songs");
const AlbumsService = require("./services/AlbumsService");
const SongsService = require("./services/SongsService");
const AlbumsValidator = require("./validators/albums");
const SongsValidator = require("./validators/songs");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  const albumService = new AlbumsService();
  const songsService = new SongsService();

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
