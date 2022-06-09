const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const now = new Date();

    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, name, year, now, now],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: "SELECT id, name, year FROM albums WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const songs = await this._pool.query({
      text: "SELECT id, title, performer FROM songs WHERE album_id = $1",
      values: [result.rows[0].id],
    });

    if (songs.rowCount) {
      result.rows[0].songs = songs.rows;
    }

    return result.rows[0];
  }

  async editAlbumById(id, { name, year }) {
    const now = new Date();
    const query = {
      text: "UPDATE albums SET name = $1, year = $2, updated_at= $3 WHERE id = $4",
      values: [name, year, now, id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Gagal menghapus album. Id tidak ditemukan");
    }
  }
}

module.exports = AlbumsService;
