/**
 * Struktur data
 * [
 *  {
 *    id: string | number,
 *    title: string,
 *    author: string,
 *    year: number,
 *    isComplete: boolean,
 *  }
 * ]
 */

const ACTION = {
  CREATE: "menambahkan buku baru",
  UPDATE: "mengubah buku",
  DELETE: "menghapus buku",
};

const STATE = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

const STATE_MESSAGE = {
  SUCCESS: "Berhasil",
  ERROR: "Gagal",
};

const BOOKSHELF = {
  ALL: "Semua",
  UNREAD: "Belum selesai dibaca",
  READ: "Selesai dibaca",
};

const books = [];
const RENDER_EVENT = "render-book";
const CREATED_EVENT = "saved-book";
const DELETED_EVENT = "deleted-book";
const UPDATED_EVENT = "update-book";
const STORAGE_KEY = "BOOKSHELF_DATA";

/**
 * Mengecek apakah fitur Storage Browser dapat digunakan
 * @returns boolean
 */
function isStorageAvailable() {
  return typeof Storage !== "undefined";
}

/**
 * Menyimpan data buku ke localstorage
 */
function saveData() {
  if (isStorageAvailable()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

/**
 * Memuat data yang ada di localstorage
 */
function loadDataFromStorage() {
  if (isStorageAvailable()) {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      books.push(...JSON.parse(data));
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

/**
 *
 * @param {boolean} filter
 * @returns number of books
 */
function getBookLength(filter = null) {
  if (filter !== null) {
    return books.filter((book) => book.isComplete === filter).length;
  }
  return books.length;
}

/**
 * Memperbarui label jumlah buku pada tab menu navigasi
 */
function updateCountLabel() {
  const label = document.querySelectorAll('[role="tab"] .count-label');
  const bookLength = {
    all: getBookLength(),
    unread: getBookLength(false),
    read: getBookLength(true),
  };

  label.forEach((item) => {
    const count = bookLength[item.getAttribute("data-name")];
    item.innerHTML = count > 0 ? count : "";
  });
}
/**
 * Mengubah judul form sesuai aksi
 * @param {string} action 
 */
function setFormTitle(action) {
  if (action === ACTION.CREATE) {
    document.querySelector("#form-title").innerHTML = "Tambah Buku";
  } else {
    document.querySelector("#form-title").innerHTML = "Ubah Buku";
  }
}

/**
 * Mengubah atribut pada form menyesuaikan aksi yang dipilih
 * @param {string} container 
 * @param {string} action 
 */
function setForm(container, action) {
  const form = document.querySelector(container);
  if (action === ACTION.UPDATE) {
    form.setAttribute("data-action", "edit");
  } else {
    form.setAttribute("data-action", "add");
  }
  setFormTitle(action);
}

function markAsComplete(bookId, isComplete) {
  const book = books.find((book) => book.id === bookId);
  book.isComplete = isComplete;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

/**
 * Menambahkan data buku baru
 */
function addBook() {
  const title = document.querySelector("#title").value.trim();
  const author = document.querySelector("#author").value.trim();
  const year = document.querySelector("#year").value.trim();
  const isComplete = document.querySelector("#is-complete-checkbox").checked;

  if (title && author && year) {
    books.push({
      id: +new Date(),
      title,
      author,
      year,
      isComplete,
    });
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#year").value = "";
    document.querySelector("#is-complete-checkbox").checked = false;
    document.querySelector("#is-complete-label").innerHTML = BOOKSHELF.UNREAD;
    document.dispatchEvent(new Event(CREATED_EVENT));
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

/**
 * Mengisi form berdasarkan id buku untuk digunakan pada fitur update
 * @param {number} bookId
 */
function editBook(bookId) {
  const book = books.find((book) => book.id === bookId);
  const title = document.querySelector("#title");
  const author = document.querySelector("#author");
  const year = document.querySelector("#year");
  const isComplete = document.querySelector("#is-complete-checkbox");
  const form = document.querySelector("#form")
  form.setAttribute("data-id", bookId);
  setForm('#form', ACTION.UPDATE);

  title.value = book.title;
  author.value = book.author;
  year.value = book.year;
  isComplete.checked = book.isComplete;
}

/**
 * Untuk memperbarui data buku
 * @param {number} bookId
 */
function updateBook(bookId) {
  const title = document.querySelector("#title").value.trim();
  const author = document.querySelector("#author").value.trim();
  const year = document.querySelector("#year").value.trim();
  const isComplete = document.querySelector("#is-complete-checkbox").checked;

  if (title && author && year) {
    const book = books.find((book) => book.id == bookId);
    book.title = title;
    book.author = author;
    book.year = year;
    book.isComplete = isComplete;
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#year").value = "";
    document.querySelector("#is-complete-checkbox").checked = false;
    document.querySelector("#is-complete-label").innerHTML = BOOKSHELF.UNREAD;
    document.dispatchEvent(new Event(UPDATED_EVENT));
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

/**
 * Membuat elemen buku dan menambahkan ke dalam DOM
 * @param {string} shelf 
 * @param {string} container 
 */
function pushBooksIntoShelfContainer(shelf, container) {
  const shelfContainer = document.getElementById(container);
  shelfContainer.innerHTML = "";
  const filteredBooks = books.filter((book) => book.isComplete === (shelf === BOOKSHELF.READ));
  filteredBooks.forEach((book) => {
    const textLabel = book.isComplete ? BOOKSHELF.READ.toLowerCase() : BOOKSHELF.UNREAD.toLocaleLowerCase();
    const unReadIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>';
    const readIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>'

    const iconButton = book.isComplete ? unReadIcon : readIcon;
    const bookElement = document.createElement("div");
    bookElement.className = "flex justify-between items-center bg-gray-200/50 px-3 lg:px-6 py-4 border-b border-gray-300 gap-x-3"
    bookElement.setAttribute("data-id", book.id);
    bookElement.innerHTML = `
      <div class="space-y-1 w-full">
        <dt class="text-sm text-gray-600/90">
          <span class="font-semibold lg:text-lg">${book.title}</span>
        </dt>
        <div class="inline-flex space-x-2 divide-x-bullet">  
          <dd class="text-sm text-gray-600/90">${book.author}</dd>
          <dd class="text-sm text-gray-600/90">${book.year}</dd>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-x-5">
        <button type="button" class="text-blue-600 btn-edit" title="Ubah data buku">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button type="button" class="text-emerald-600 btn-tag" title="Tandai sebagai ${textLabel}">
          ${iconButton}
        </button>
        <button type="button" class="text-red-500 btn-delete" title="Hapus buku">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    `;
    bookElement.querySelector(".btn-edit").addEventListener("click", () => {
      editBook(book.id);
      document.querySelector("#tab-form").dispatchEvent(new Event('click'));
    });
    bookElement.querySelector(".btn-tag").addEventListener("click", () => {
      markAsComplete(book.id, !book.isComplete);
      document.dispatchEvent(new Event(UPDATED_EVENT));
      document.dispatchEvent(new Event(RENDER_EVENT));
    })
    bookElement.querySelector(".btn-delete").addEventListener("click", () => {
      removeConfirmDialog();
      createConfirmDialog(ACTION.DELETE, confirmationMessage(ACTION.DELETE), () => {
        bookElement.remove();
        books.splice(books.indexOf(book), 1);
        saveData();
        document.dispatchEvent(new Event(DELETED_EVENT));
        document.dispatchEvent(new Event(RENDER_EVENT));
      });
    });
    shelfContainer.appendChild(bookElement);
  });
  if (filteredBooks.length === 0) {
    shelfContainer.innerHTML = '<p class="py-3 px-4 text-sm">Belum ada buku di rak ini</p>'
  }
}

/**
 * Merender data buku ke masing-masing rak sesuai dengan statusnya
 */
function renderShelfData() {
  pushBooksIntoShelfContainer(BOOKSHELF.UNREAD, "unread-books-in-all-shelf");
  pushBooksIntoShelfContainer(BOOKSHELF.READ, "read-books-in-all-shelf");
  pushBooksIntoShelfContainer(BOOKSHELF.UNREAD, "unread-books");
  pushBooksIntoShelfContainer(BOOKSHELF.READ, "read-books");
}
/**
 * Fungsi ini digunakan untuk memeriksa apakah checkbox 'selesai dibaca' terceklis
 * Jika terceklis maka label pada tombol berisi 'selesai dibaca'
 * Jika tidak terceklis maka label tombol berisi 'belum selesai dibaca'
 */
function toggleIsCompleteCheckbox() {
  const isCompleteCheckbox = document.querySelector("#is-complete-checkbox");
  const isComplete = isCompleteCheckbox.checked;
  const isCompleteLabel = isComplete ? BOOKSHELF.READ : BOOKSHELF.UNREAD;
  document.querySelector("#is-complete-label").innerHTML = isCompleteLabel;
}

/**
 * Fungsi ini digunakan untuk mengelola tab navigasi pada halaman utama
 */
function handleTabs() {
  const triggers = document.querySelectorAll('[role="tab"]');

  const toggleTabs = (event) => {
    const target = event.target.closest('[role="tab"]');
    const tab = target.getAttribute("aria-controls");
    const allTabs = document.querySelectorAll('[role="tab"]');
    const tabPanel = document.getElementById(tab);
    const tabPanels = document.querySelectorAll('[role="tabpanel"]');

    allTabs.forEach((tab) => {
      tab.setAttribute("aria-selected", "false");
    });
    tabPanels.forEach((panel) => {
      panel.setAttribute("aria-hidden", "true");
    });

    target.setAttribute("aria-selected", "true");
    tabPanel.setAttribute("aria-hidden", "false");
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      toggleTabs(e);
    });
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        toggleTabs(e);
      }
    });
  });
}

/**
 * Menampilkan toast notifikasi berdasarkan message dan type
 * @param {string} message
 * @param {string} type
 */
function createNotificationToast(message, type) {
  const toast = document.querySelector(".toast");
  toast.innerHTML = message;
  toast.classList.add("show");
  toast.classList.add(type);
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/**
 * Menampilkan dialog konfirmasi ketika hendak menghapus data
 * @param {string} title
 * @param {string} message
 * @param {function} callback
 */

function createConfirmDialog(title, message, callback) {
  const dialog = document.createElement("div");
  dialog.setAttribute("open", "true");
  dialog.setAttribute("aria-labelledby", title);
  dialog.setAttribute("aria-describedby", message);
  dialog.setAttribute("role", "alertdialog");
  dialog.innerHTML = `
    <div class="dialog-content text-gray-700">
      <h3 class="capitalize font-bold text-lg">${title}</h3>
      <p>${message}</p>
      <div class="flex justify-end gap-x-3 pt-3">
        <button id="dialog-confirm" type="button" class="px-3 py-2 bg-red-500/20 text-red-600">Hapus</button>
        <button id="dialog-cancel" type="button" class="px-3 py-2 bg-slate-300">Batal</button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);

  const confirmButton = dialog.querySelector("#dialog-confirm");
  const cancelButton = dialog.querySelector("#dialog-cancel");

  confirmButton.addEventListener("click", () => {
    dialog.remove();
    callback();
  });

  cancelButton.addEventListener("click", () => {
    dialog.remove();
  });
}

function removeConfirmDialog() {
  const dialog = document.querySelector("dialog");
  if (dialog) { 
    dialog.remove()
  };
}

function confirmationMessage(action) {
  return `Apakah anda yakin ingin ${action} ini?`;
}

document.addEventListener(CREATED_EVENT, () => {
  createNotificationToast(
    `${STATE_MESSAGE.SUCCESS} ${ACTION.CREATE}`,
    STATE.SUCCESS
  );
});

document.addEventListener(UPDATED_EVENT, () => {
  createNotificationToast(
    `${STATE_MESSAGE.SUCCESS} ${ACTION.UPDATE}`,
    STATE.SUCCESS
  );
});

document.addEventListener(DELETED_EVENT, () => {
  createNotificationToast(
    `${STATE_MESSAGE.SUCCESS} ${ACTION.DELETE}`,
    STATE.SUCCESS
  );
});

document.addEventListener(RENDER_EVENT, () => {
  setForm("#form", ACTION.CREATE);
  updateCountLabel();
  renderShelfData();
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector('[name="is-complete"]')
    .addEventListener("change", toggleIsCompleteCheckbox);
  handleTabs();

  if (isStorageAvailable()) {
    loadDataFromStorage();
  }

  const form = document.querySelector("#form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (form.getAttribute("data-action") === "add") {
      addBook();
    } else {
      updateBook(form.getAttribute("data-id"));
    }
  });

  renderShelfData();
});
