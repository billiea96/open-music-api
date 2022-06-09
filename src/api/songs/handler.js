class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(req, h) {
    this._validator.validateSongPayload(req.payload);

    const songId = await this._service.addSong(req.payload);

    const response = h
      .response({
        status: "success",
        data: {
          songId,
        },
      })
      .code(201);

    return response;
  }

  async getSongsHandler(req) {
    const songs = await this._service.getSongs(req.query);

    return {
      status: "success",
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(req) {
    const { id } = req.params;
    const song = await this._service.getSongById(id);

    return {
      status: "success",
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(req) {
    this._validator.validateSongPayload(req.payload);

    const { id } = req.params;
    await this._service.editSongById(id, req.payload);

    return {
      status: "success",
      message: "Lagu berhasil diperbarui",
    };
  }

  async deleteSongByIdHandler(req) {
    const { id } = req.params;

    await this._service.deleteSongById(id);

    return {
      status: "success",
      message: "Lagu berhasil dihapus",
    };
  }
}

module.exports = SongsHandler;
