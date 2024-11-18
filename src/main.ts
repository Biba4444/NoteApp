import "./style.css";

const notes: { title: string; description: string }[] = [];
let currentPage = 1;
const pageSize = 5;

const renderNotes = () => {
  const rightContainer = document.querySelector<HTMLElement>("#rightContainer");
  if (!rightContainer) {
    console.error("rightContainer not found in the DOM!");
    return;
  }

  rightContainer.innerHTML = "";

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, notes.length);
  const notesToDisplay = notes.slice(startIndex, endIndex);

  notesToDisplay.forEach(note => {
    const block = document.createElement("div");
    block.classList.add("note-block");

    block.innerHTML = `
      <div class="noteDiv1">
        <p>${note.title}</p>
        <div>${note.description}</div>
      </div>
      <div class="noteDiv2">
        <img 
          width="20px" 
          height="20px" 
          src="https://img.icons8.com/ios-glyphs/30/multiply.png" 
          alt="multiply"
          class="noteImage"
        />
      </div>
    `;

    const noteImage = block.querySelector<HTMLImageElement>(".noteImage");
    if (noteImage) {
      noteImage.addEventListener("click", () => {
        const index = notes.indexOf(note);
        if (index > -1) {
          notes.splice(index, 1);
        }
        renderNotes();
      });
    }

    rightContainer.appendChild(block);
  });

  renderPagination();
};

const renderPagination = () => {
  const paginationContainer =
    document.querySelector<HTMLElement>("#pagination");
  if (!paginationContainer) {
    console.error("Pagination container not found!");
    return;
  }

  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(notes.length / pageSize);

  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    currentPage = Math.max(1, currentPage - 1);
    renderNotes();
  });

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    currentPage = Math.min(totalPages, currentPage + 1);
    renderNotes();
  });

  paginationContainer.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i.toString();
    pageButton.disabled = i === currentPage;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderNotes();
    });

    paginationContainer.appendChild(pageButton);
  }

  paginationContainer.appendChild(nextButton);
};

const noteSubmit = document.querySelector<HTMLButtonElement>("#noteSubmit");
const noteInput = document.querySelector<HTMLInputElement>("#noteInput");
const noteDescription =
  document.querySelector<HTMLTextAreaElement>("#noteDescription");

if (noteSubmit && noteInput && noteDescription) {
  noteSubmit.addEventListener("click", event => {
    event.preventDefault();

    if (noteInput.value.length > 0 && noteDescription.value.length > 0) {
      notes.push({
        title: noteInput.value,
        description: noteDescription.value,
      });
      noteInput.value = "";
      noteDescription.value = "";
      noteInput.focus();
      renderNotes();
    } else {
      console.log("Write your note firstly");
    }
  });

  renderNotes();
} else {
  console.error("Required elements are missing in the DOM!");
}
