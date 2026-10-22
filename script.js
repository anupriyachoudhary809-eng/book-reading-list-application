
const form = document.getElementById("book-form");
const titleInput = document.getElementById("book-title");
const authorInput = document.getElementById("book-author");
const bookList = document.getElementById("book-list");
const bookCount = document.getElementById("book-count");
const emptyMessage = document.getElementById("empty-message");

let books = [];

try {
  books = JSON.parse(localStorage.getItem("readingList")) || [];
  if (!Array.isArray(books)) books = [];
} catch {
  books = [];
}

function saveBooks() {
  localStorage.setItem("readingList", JSON.stringify(books));
}

function renderBooks() {
  bookList.replaceChildren();

  const readCount = books.filter(book => book.read).length;
  bookCount.textContent =
    `${books.length} book(s) · ${readCount} read`;

  emptyMessage.hidden = books.length > 0;

  books.forEach(book => {
    const card = document.createElement("article");
    card.className = book.read ? "book read" : "book";

    const details = document.createElement("div");
    const title = document.createElement("h3");
    const author = document.createElement("p");

    title.textContent = book.title;
    author.textContent = `By ${book.author}`;

    details.append(title, author);

    const actions = document.createElement("div");
    actions.className = "book-actions";

    const statusButton = document.createElement("button");
    statusButton.textContent = book.read ? "Mark Unread" : "Mark Read";
    statusButton.addEventListener("click", () => {
      book.read = !book.read;
      saveBooks();
      renderBooks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete";
    deleteButton.addEventListener("click", () => {
      books = books.filter(item => item.id !== book.id);
      saveBooks();
      renderBooks();
    });

    actions.append(statusButton, deleteButton);
    card.append(details, actions);
    bookList.appendChild(card);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();

  if (!title || !author) return;

  books.push({
    id: Date.now().toString() + Math.random().toString(16).slice(2),
    title,
    author,
    read: false
  });

  saveBooks();
  renderBooks();
  form.reset();
  titleInput.focus();
});

renderBooks();
