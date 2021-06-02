class displayEntryWC extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement('template');

    template.innerHTML = `
            <style>
                .entry-modal {
                    display: none; /* Hidden by default */
                    position: fixed; /* Stay in place */
                    z-index: 1; /* Sit on top */
                    padding-top: 100px; /* Location of the box */
                    left: 0;
                    top: 0;
                    width: 100%; /* Full width */
                    height: 100%; /* Full height */
                    overflow: auto; /* Enable scroll if needed */
                    background-color: rgb(0,0,0); /* Fallback color */
                    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
                }

                .entry-content {
                    position: relative;
                    background-color: #fefefe;
                    margin: auto;
                    padding: 0;
                    border: 1px solid #888;
                    width: 80%;
                    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
                    -webkit-animation-name: animatetop;
                    -webkit-animation-duration: 0.4s;
                    animation-name: animatetop;
                    animation-duration: 0.4s
                }
            </style>

            <div class="entry-modal">
                <div class="entry-content">
                    <div class="entry-header">
                        <h1 class="entry-title"></h1>
                        <h2 class="entry-date"></h2>
                    </div>
                    <div class="entry-tags">
                        <ul class="entry-tags-list"></ul>
                    </div>
                    <div class="entry-description">
                        <p class="entry-descript-text"></p>
                    </div>
                    <div class="entry-body">

                    </div>
                    <div class="entry-footer">
                        <button class="close-btn">close</button>
                    </div>
                </div>
            </div>
        `;
    // create a shadow root for this web component
    this.attachShadow({ mode: 'open' });
    // attach cloned content of template to shadow DOM
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  get notes() {
    return this.getAttribute('notes');
  }

  set notes(notes) {
    const display = this.shadowRoot.querySelector('div[class="entry-modal"]');

    display.querySelector('.entry-title').textContent = notes.title;
    display.querySelector('.entry-date').textContent = notes.start_date;
    display.querySelector('.entry-descript-text').innerText = notes.description;
    const tagsList = display.querySelector('.entry-tags-list');

    // render list of todos - assumes todos is a list
    notes.tags.forEach((tag) => {
      const newLi = document.createElement('li');
      newLi.textContent = tag;
      tagsList.appendChild(newLi);
    });
  }
}

customElements.define('entry-display', displayEntryWC);
