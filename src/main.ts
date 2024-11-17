import "./style.css";

const noteSubmit = document.querySelector<HTMLButtonElement>("#noteSubmit");
const noteInput = document.querySelector<HTMLInputElement>("#noteInput");
const noteDescription =
  document.querySelector<HTMLInputElement>("#noteDescription");

if (!noteSubmit || !noteInput || !noteDescription) {
  console.error("Required elements are missing in the DOM!");
} else {
  noteSubmit.addEventListener("click", event => {
    event.preventDefault();

    if (noteInput.value.length > 0 && noteDescription.value.length > 0) {
      const block = document.createElement("div");
      block.classList.add("note-block");

      block.innerHTML = `
            <div>
              <p>${noteInput.value}</p>
              <div>${noteDescription.value}</div>
            </div>
            <div>
              <img 
                width="15px" 
                height="15px" 
                src="https://img.icons8.com/ios-glyphs/30/multiply.png" 
                alt="multiply"
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
    } else {
      console.log("Write your note firstly");
    }
  });
}
