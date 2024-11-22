import "./style.css";
import { Note } from "../types";
import { v1 as uuid } from "uuid";

// GET data function
const fetchData = async (): Promise<Note[]> => {
  const response = await fetch("http://localhost:3000/api/data");
  return await response.json();
};

// POST data function
const addData = async (postData: Note) => {
  try {
    const response = await fetch("http://localhost:3000/api/data-add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    // check response data
    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return;
    }

    const responseData = await response.json();
    console.log("Successfully added:", responseData);
  } catch (error) {
    console.error("An error occurred while posting data", error);
  }
};

const delData = async (id: string) => {
  try {
    const response = await fetch("http://localhost:3000/api/data-delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return;
    }

    const responseData = await response.json();
    console.log("Successfully deleted:", responseData);
  } catch (error) {
    console.error("An error occurred while deleting data", error);
  }
};

// Wrap all functions into one asyn
(async () => {
  let currentPage = 1;
  let newData = await fetchData();
  let dataToAdd;

  const pageSize = 5;
  const rightContainer =
    document.querySelector<HTMLDivElement>("#rightContainer");

  if (!newData) {
    console.log("Data is not found");
    return;
  }

  const renderNotes = () => {
    if (!rightContainer) {
      console.error("rightContainer not found in the DOM!");
      return;
    }

    rightContainer.innerHTML = "";

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, newData.length);
    const notesToDisplay = newData.slice(startIndex, endIndex);

    notesToDisplay.map(note => {
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
        noteImage.addEventListener("click", async () => {
          const noteId = note.id;
          await delData(noteId);
          newData = newData.filter(n => n.id !== note.id);
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
    const totalPages = Math.ceil(newData.length / pageSize);

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
    noteSubmit.addEventListener("click", async event => {
      event.preventDefault();

      if (noteInput.value.length > 0 && noteDescription.value.length > 0) {
        dataToAdd = {
          id: uuid(),
          title: noteInput.value,
          description: noteDescription.value,
        };

        newData.push(dataToAdd);

        await addData(dataToAdd);

        renderNotes();

        noteInput.value = "";
        noteDescription.value = "";
      } else {
        console.log("Write your note firstly");
      }
    });
  } else {
    console.error("Required elements are missing in the DOM!");
  }

  renderNotes();
})();
