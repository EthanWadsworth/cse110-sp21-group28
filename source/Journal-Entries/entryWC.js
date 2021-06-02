class entryWC extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement('template');

    template.innerHTML = `
              <style>
                .entry {
                    border: solid black 3px;
                    border-radius: 10px;
                    max-width: 500px;
                    margin-top: 10px;
                    display: inline-block;
                    min-width: 200px;
                    margin-right: 20px;
                    padding-left: 5px;
                    padding-right: 5px;
                }

                .tags-list {
                  padding-left: 0;
                }
                
                .tags-list li {
                  display: inline-block;
                  margin-left: 3px;
                  border: solid red 3px;
                  padding: 3px;
                  background-color: pink;
                  color: gray;
                  border-radius: 3px;
                }

              </style>
              <article class="entry">
                  <h1 class="title"></h1>
                  <h1 class="date"></h1>
                  <p class="description"></p>
                  <ul class="tags-list">
                  </ul>
              </article>`;

    // create a shadow root for this web component
    this.attachShadow({ mode: 'open' });
    // attach cloned content of template to shadow DOM
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  get entry() {
    return this.getAttribute('entry');
  }

  set entry(entry) {
    const article = this.shadowRoot.querySelector('article');
    article.querySelector('.title').textContent = entry.title;
    article.querySelector('.date').textContent = entry.start_date;
    article.querySelector('.description').textContent = entry.description;
    const tagsList = article.querySelector('.tags-list');

    // render list of todos - assumes todos is a list
    entry.tags.forEach((tag) => {
      const newLi = document.createElement('li');
      newLi.textContent = tag;
      tagsList.appendChild(newLi);
    });
  }
}

customElements.define('journal-entry', entryWC);
