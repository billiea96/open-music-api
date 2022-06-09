/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("songs", {
    id: {
      type: "varchar(50)",
      primaryKey: true,
    },
    title: {
      type: "varchar(200)",
      notNull: true,
    },
    year: {
      type: "integer",
      notNull: true,
    },
    performer: {
      type: "varchar(200)",
      notNull: true,
    },
    genre: {
      type: "varchar(200)",
      notNull: true,
    },
    duration: "integer",
    album_id: "varchar(50)",
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("songs");
};
