const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  let finished;

  if (readPage === pageCount) {
    finished = true;
  } else {
    finished = false;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!newBook.name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',

    }).code(400);
  }

  if (newBook.readPage > newBook.pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',

    }).code(400);
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }

  return h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  }).code(500);
};

const getBook = (request, h) => {
  const { name, reading, finished } = request.query;

  let book = books;

  if (name !== undefined) {
    const fixString = name.toLowerCase();

    book = books.filter((b) => b.name.toLowerCase() === name.toLowerCase()
    || b.name.toLowerCase().includes(fixString));
  }

  if (reading !== undefined) {
    let cek;

    if (reading === '0') {
      cek = false;
    } else {
      cek = true;
    }

    book = books.filter((b) => b.reading === cek);
  }

  if (finished !== undefined) {
    let cek;

    if (finished === '1') {
      cek = true;
    } else {
      cek = false;
    }

    book = books.filter((b) => b.finished === cek);
  }

  try {
    return h.response({
      status: 'success',
      data: {
        books: book.map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        })),
      },
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }
};

const getById = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const editById = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  let finished;

  if (readPage === pageCount) {
    finished = true;
  } else {
    finished = false;
  }

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const i = books.findIndex((b) => b.id === id);

  if (i !== -1) {
    books[i] = {
      ...books[i],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt: new Date().toISOString(),
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const deleteById = (request, h) => {
  const { id } = request.params;

  const i = books.findIndex((b) => b.id === id);

  if (i !== -1) {
    books.splice(i, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
    // console.log(response);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  addBook,
  getBook,
  getById,
  editById,
  deleteById,
};
