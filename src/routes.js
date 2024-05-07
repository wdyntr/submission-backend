const {
  addBook,
  getBook,
  getById,
  editById,
  deleteById,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBook,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getBook,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getById,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editById,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteById,
  },
];

module.exports = routes;
