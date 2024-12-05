import "./style.css";
import { Note } from "../types";
import { v1 as uuid } from "uuid";

const rightContainer =
  document.querySelector<HTMLDivElement>("#rightContainer");

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

const changeData = async (dataToChange: Note) => {
  try {
    const response = await fetch("http://localhost:3000/api/data-change", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToChange),
    });
    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return;
    }
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
      const uniqueId = uuid();
      block.classList.add("note-block");
      block.setAttribute("id", uniqueId);
      block.setAttribute("data-id", note.id);

      block.innerHTML = `
        <div class="noteDiv1">
          <p class="pMainText">${note.title}</p>
          <div class="divDescrText">${note.description}</div>
        </div>
        <div class="noteDiv2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
        class="redactImage"/></svg>
          <img 
            width="20px" 
            height="20px" 
            src="https://img.icons8.com/ios-glyphs/30/multiply.png" 
            alt="multiply"
            class="noteImage"
          />
        </div>
        <dialog id="editDialog">
    <form method="dialog">
        <label for="editInput">Edit note:</label>
        <input type="text" id="editInput" />
        <input type="text" id="editDescription" />
        <menu>
            <button value="cancel">Decline</button>
            <button value="confirm">Save</button>
        </menu>
    </form>
</dialog>
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
      const redactImage =
        block.querySelector<HTMLOrSVGImageElement>(".redactImage");

      if (redactImage) {
        redactImage.addEventListener("click", () => {
          const noteId = note.id;

          const dialog = block.querySelector<HTMLDialogElement>("#editDialog");
          const input = block.querySelector<HTMLInputElement>("#editInput");
          const descriptionInput =
            block.querySelector<HTMLInputElement>("#editDescription");

          if (!dialog || !input || !descriptionInput) {
            console.error("Dialog or input elements not found.");
            return;
          }

          input.value = note.title;
          descriptionInput.value = note.description;

          dialog.showModal();

          dialog.addEventListener(
            "close",
            async () => {
              if (dialog.returnValue === "confirm") {
                const updatedTitle = input.value.trim();
                const updatedDescription = descriptionInput.value.trim();

                if (updatedTitle && updatedDescription) {
                  note.title = updatedTitle;
                  note.description = updatedDescription;

                  await changeData({
                    id: noteId,
                    title: updatedTitle,
                    description: updatedDescription,
                  });

                  const pMainText =
                    block.querySelector<HTMLParagraphElement>(".pMainText");
                  const divDescrText =
                    block.querySelector<HTMLDivElement>(".divDescrText");

                  if (pMainText) pMainText.textContent = updatedTitle;
                  if (divDescrText)
                    divDescrText.textContent = updatedDescription;
                } else {
                  console.log("Both fields must be filled.");
                }
              }
            },
            { once: true }
          );
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
