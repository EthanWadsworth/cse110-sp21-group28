const modal = document.getElementById('new-journal');

const createBtn = document.getElementById('create-button');
const cancelBtn = document.querySelector('.cancel');

const closeSpan = document.querySelector(".close");

createBtn.addEventListener("click", () => {
    modal.style.display = 'block';
});

closeSpan.addEventListener("click", () => {
    modal.style.display ='none'; 
});

cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener("click", (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    } 
});