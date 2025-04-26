const API_URL = 'http://localhost:3000/api/books'; // Replace with Azure URL for deployment

// Load books on page load
document.addEventListener('DOMContentLoaded', loadBooks);

// Create book
document.getElementById('bookForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const book = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    isbn: document.getElementById('isbn').value,
    quantity: parseInt(document.getElementById('quantity').value),
  };
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    loadBooks();
    document.getElementById('bookForm').reset();
  } catch (error) {
    alert('Error creating book: ' + error.message);
  }
});

// Load books
async function loadBooks() {
  try {
    const response = await fetch(API_URL);
    const books = await response.json();
    const tableBody = document.getElementById('booksTable');
    tableBody.innerHTML = '';
    books.forEach((book) => {
      const row = `
        <tr>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.isbn}</td>
          <td>${book.quantity}</td>
          <td>${book.available}</td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="openUpdateModal('${book._id}', '${book.title}', '${book.author}', '${book.isbn}', ${book.quantity})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteBook('${book._id}')">Delete</button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    alert('Error loading books: ' + error.message);
  }
}

// Open update modal
function openUpdateModal(id, title, author, isbn, quantity) {
  document.getElementById('updateBookId').value = id;
  document.getElementById('updateTitle').value = title;
  document.getElementById('updateAuthor').value = author;
  document.getElementById('updateIsbn').value = isbn;
  document.getElementById('updateQuantity').value = quantity;
  new bootstrap.Modal(document.getElementById('updateBookModal')).show();
}

// Update book
document.getElementById('updateBookForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('updateBookId').value;
  const book = {
    title: document.getElementById('updateTitle').value,
    author: document.getElementById('updateAuthor').value,
    isbn: document.getElementById('updateIsbn').value,
    quantity: parseInt(document.getElementById('updateQuantity').value),
  };
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    loadBooks();
    bootstrap.Modal.getInstance(document.getElementById('updateBookModal')).hide();
  } catch (error) {
    alert('Error updating book: ' + error.message);
  }
});

// Delete book
async function deleteBook(id) {
  if (confirm('Are you sure you want to delete this book?')) {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      loadBooks();
    } catch (error) {
      alert('Error deleting book: ' + error.message);
    }
  }
}