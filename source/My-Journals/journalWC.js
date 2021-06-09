class journalWC extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement('template');

    template.innerHTML = `
            <style>
                .entry {
                    border-radius: 3px;
                }
                .title {
                  text-align: center;
                }

                .close {
                  color: #aaa;
                  float: right;
                  font-size: 28px;
                  font-weight: bold;
                }

                .close:hover,
                .close:focus {
                  color: gainsboro;
                  text-decoration: none;
                  cursor: pointer;
                }
              
            </style>

            <span class="close">&times;</span>

            <article class="entry">
                <h1 class="title"></h1>
            </article>`;

    // create a shadow root for this web component
    this.attachShadow({ mode: 'open' });
    // attach cloned content of template to shadow DOM
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  /**
   * Gets data stored in the 'entry' attribute of this web component
   */
  get entry() {
    return this.getAttribute('entry');
  }

  /**
   * Used to set data for the custom web component
   */
  set entry(entry) {
    const article = this.shadowRoot.querySelector('article');
    article.querySelector('.title').textContent = entry.title;
  }
}

customElements.define('journal-collection', journalWC);
