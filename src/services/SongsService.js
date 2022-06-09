const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong(payload) {
    const { title, year, genre, performer, duration, albumId } = payload;
    const id = `song-${nanoid()}`;

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getSongs(params) {
    const { title, performer } = params;
    const values = [];
    let filter = "";
    if (title) {
      filter += "LOWER(title) like $1";
      values.push(`%${title.toLowerCase()}%`);
    }

    if (performer) {
      filter += values.length ? " AND " : "";
      filter += `LOWER(performer) like $${values.length + 1}`;
      values.push(`%${performer.toLowerCase()}%`);
    }

    const query = {
      text: `SELECT id, title, performer FROM songs ${
        filter ? `WHERE ${filter}` : ""
      }`,
      values,
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: "SELECT id, title, year, performer, genre, duration, album_id as albumId FROM songs WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    return result.rows[0];
  }

  async editSongById(id, payload) {
    const now = new Date();

    const querySet = Object.keys(payload)
      .map(
        (val, idx) => `${val === "albumId" ? "album_id" : val} = $${idx + 3}`
      )
      .join(",");
    const params = Object.values(payload);

    const query = {
      text: `UPDATE songs SET ${querySet}, updated_at = $2 WHERE id = $1`,
      values: [id, now, ...params],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Gagal memperbarui lagu. Id tidak ditemukan");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Gagal menghapus lagu. Id tidak ditemukan");
    }
  }
}

module.exports = SongsService;
