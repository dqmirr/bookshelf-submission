const books = [];
const RENDER_EVENT = 'render-books';
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateId() {
  return +new Date();
}

function generateBooksList(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author, 
    year,
    isCompleted
  }
}

function findBooks(booksId) {
  for (const item of books) {
    if (item.id === booksId) {
      return item;
    }
  }
  return null;
}

function findBooksIndex(booksId) {
  for (const index in books) {
    if (books[index].id === booksId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser anda tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}


function insertBooks(booksList) {
  const {id, title, author, year, isCompleted} = booksList;

  const textTitle = document.createElement('h2');
  textTitle.innerText =title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = "Penulis : "+author;

  const textYear = document.createElement('p');
  textYear.innerText = "Tahun Terbit: "+year;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement('div');
  container.classList.add('item')
  container.append(textContainer);
  container.setAttribute('id', `books-${id}`);

  if (isCompleted) {
    const buttonContainer  = document.createElement('div');
    buttonContainer.classList.add('button-container');
   
    const undoButton = document.createElement('button');
    undoButton.classList.add('uncomplete');
    undoButton.addEventListener('click', function () {
      undoBooksFromCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('delete');
    trashButton.addEventListener('click', function () {
      if(confirm("Daata yang anda pilih akan dihapus"))
      {
        removeBooksFromCompleted(id);
      };
    });

    buttonContainer.appendChild(undoButton);
    buttonContainer.appendChild(trashButton);
    container.appendChild(buttonContainer);
  } else {

    const checkButton = document.createElement('button');
    checkButton.classList.add('check');
    checkButton.addEventListener('click', function () {
      addBooksToCompleted(id);
      
    });

    container.append(checkButton);
    const buttonContainer  = document.createElement('div');
    buttonContainer.classList.add('button-container');

  }

  return container;
}

function addBooks() {

    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const completed = document.getElementById('inputBookIsComplete').checked;
  const generatedID = generateId();
  const booksList = generateBooksList(generatedID, title, author, year, completed);
  
  
  books.push(booksList);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBooksToCompleted(booksId) {
  const targetBooks = findBooks(booksId);

  if (targetBooks == null) return;

  targetBooks.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBooksFromCompleted(booksId) {
  const targetBooks = findBooksIndex(booksId);

  if (targetBooks === -1) return;

  books.splice(targetBooks, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBooksFromCompleted(booksId) {

  const targetBooks = findBooks(booksId);
  if (targetBooks == null) return;

  targetBooks.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {

  const submitForm = document.getElementById('inputBook');
  const isCompleted = document.getElementById('inputBookIsComplete').checked
  submitForm.addEventListener('submit', function (event) {
    if(isCompleted.checked==true){
      addBooksToCompleted(booksId);
    }else{
      addBooks();
    }
    event.preventDefault();
    
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedReadingList = document.getElementById('incompleteBookshelfList');
  const completedReadingList = document.getElementById('completeBookshelfList');

  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  for (const item of books) {
    const element = insertBooks(item);
    if (item.isCompleted) {
      completedReadingList.append(element);
    } else {
      uncompletedReadingList.append(element);
    }
  }
})