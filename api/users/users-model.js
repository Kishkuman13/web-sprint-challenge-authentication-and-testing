const db = require('../../data/dbConfig');

function find() {
  return db('users');
}

function findBy(filter) {
  return db('users').where(filter);
}

function findById(id) {
  return db('users').where({ id }).first();
}

async function add(user) {
  const [id] = await db('users').insert(user);

  return findById(id);
}

async function update(id, changes) {
  await db('users').where({ id }).update(changes);

  return findById(id);
}

function remove(id) {
  return db('users').where({ id }).del();
}

module.exports = {
  find,
  findBy,
  findById,
  add,
  update,
  remove,
}