class Destination {
  constructor(id, name, summary, image, details) {
    this.id = id;
    this.name = name;
    this.summary = summary;
    this.image = image;
    this.details = details;
  }

  makeCard() {
    const div = document.createElement("div");
    div.className = "card";
    const href =
      this.id === "bali"
        ? "bali.html"
        : `all-destinations.html?dest=${encodeURIComponent(this.id)}`;
    div.innerHTML = `
      <a href="${href}">
        <img src="${this.image}" alt="${this.name}">
        <div class="card-content">
          <p class="title">${this.name}</p>
          <p class="summary">${this.summary}</p>
        </div>
      </a>
    `;
    return div;
  }

  showDetails(container) {
    container.innerHTML = `
      <h2>${this.name}</h2>
      <img src="${this.image}" alt="${this.name}" style="max-width:100%;border-radius:10px;">
      <p>${this.details}</p>
    `;
  }
}

class DestinationManager {
  constructor(filePath) {
    this.filePath = filePath || "js/destinations.json";
    this.destinations = [];
  }

  async loadDestinations() {
    try {
      const res = await fetch(this.filePath);
      const data = await res.json();

      // create Destination objects one by one
      this.destinations = data.map((item) => {
        return new Destination(
          item.id,
          item.name,
          item.summary,
          item.image,
          item.details
        );
      });
    } catch (err) {
      console.log("Failed to load destinations:", err);
    }
  }

  // find a destination by its id
  getDestinationById(id) {
    for (let i = 0; i < this.destinations.length; i++) {
      if (this.destinations[i].id === id) {
        return this.destinations[i];
      }
    }
    return null;
  }

  // search destinations by term
  searchDestinations(term) {
    if (!term) return this.destinations;
    term = term.toLowerCase();
    return this.destinations.filter((d) => {
      return (
        d.name.toLowerCase().includes(term) ||
        d.summary.toLowerCase().includes(term) ||
        d.details.toLowerCase().includes(term)
      );
    });
  }

  // show all destinations
  showAll(container, list) {
    container.innerHTML = "";
    const data = list || this.destinations;

    if (data.length === 0) {
      container.innerHTML = "<p>No destinations found.</p>";
      return;
    }

    const grid = document.createElement("div");
    grid.className = "grid";

    data.forEach((dest) => {
      const card = dest.makeCard();
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }
}

// Helper object for handling pages
const App = {
  manager: new DestinationManager(),

  getQuery(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  },

  setQuery(name, value) {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set(name, value);
    } else {
      url.searchParams.delete(name);
    }
    history.replaceState(null, "", url.toString());
  },

  // for all-destinations.html
  async initList(containerSelector, searchSelector) {
    await this.manager.loadDestinations();
    const container = document.querySelector(containerSelector);
    const searchBox = document.querySelector(searchSelector);
    const q = this.getQuery("q") || "";

    if (searchBox) searchBox.value = q;

    const filtered = this.manager.searchDestinations(q);
    this.manager.showAll(container, filtered);

    if (searchBox) {
      searchBox.addEventListener("input", (e) => {
        const val = e.target.value;
        this.setQuery("q", val);
        const results = this.manager.searchDestinations(val);
        this.manager.showAll(container, results);
      });
    }
  },

  // for single destination page
  async initDetail(containerSelector) {
    await this.manager.loadDestinations();
    const container = document.querySelector(containerSelector);
    const id = this.getQuery("dest");
    const dest = this.manager.getDestinationById(id);

    if (dest) {
      dest.showDetails(container);
    } else {
      container.innerHTML = "<p>Destination not found.</p>";
    }
  },
};
