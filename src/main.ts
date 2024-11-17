import "./style.css";

const noteSubmit = document.querySelector<HTMLButtonElement>("#noteSubmit");
const noteInput = document.querySelector<HTMLInputElement>("#noteInput");
const noteDescription =
  document.querySelector<HTMLTextAreaElement>("#noteDescription");

if (!noteSubmit || !noteInput || !noteDescription) {
  console.error("Required elements are missing in the DOM!");
} else {
  noteSubmit.addEventListener("click", event => {
    event.preventDefault();

    if (noteInput.value.length > 0 && noteDescription.value.length > 0) {
      const block = document.createElement("div");
      block.classList.add("note-block");

      block.innerHTML = `
            <div class="noteDiv1">
              <p>${noteInput.value}</p>
              <div>${noteDescription.value}</div>
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

      const rightContainer =
        document.querySelector<HTMLElement>("#rightContainer");
      if (rightContainer) {
        rightContainer.appendChild(block);
      } else {
        console.error("rightContainer not found in the DOM!");
      }

      noteInput.value = "";
      noteDescription.value = "";

      const noteImage = block.querySelector<HTMLImageElement>(".noteImage");
      if (noteImage) {
        noteImage.addEventListener("click", event => {
          event.preventDefault();
          block.remove();
        });
      }
    } else {
      console.log("Write your note firstly");
    }
  });
}
