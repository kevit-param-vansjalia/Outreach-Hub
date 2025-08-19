interface Contact {
  id?: string;
  name?: string;
  phoneNumber?: string;
  tags?: string[] | string | null;
  createdAt?: string;
}

declare global {
  interface Window {
    logout: () => void;
    openDetailsPopup: (id: string) => void;
    openEditPopup: (id: string) => void;
    showDeleteConfirmation: (id: string) => void;
    renderContacts: () => void;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const BASE_URL = "http://localhost:3000";

  const addContactBtn = document.getElementById("add-contact-btn") as HTMLButtonElement | null;
  const addContactModal = document.getElementById("addContactModal") as HTMLElement | null;
  const addForm = document.getElementById("addForm") as HTMLFormElement | null;
  const cancelBtn = document.getElementById("cancelBtn") as HTMLButtonElement | null;
  const contactList = document.getElementById("contact-list") as HTMLElement | null;
  const popup = document.getElementById("popup") as HTMLElement | null;
  const popupContent = document.getElementById("popup-content") as HTMLElement | null;
  const searchInput = document.querySelector(".tenants-search-input") as HTMLInputElement | null;

  let allContacts: Contact[] = [];

  function getInitials(name?: string): string {
    if (!name) return "?";
    return name.split(" ")
      .map(word => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }

  async function fetchContacts(): Promise<Contact[]> {
    try {
      const res = await fetch(`${BASE_URL}/contacts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      return Array.isArray(data?.data) ? data.data : [];
    } catch (err) {
      console.error("Error fetching contacts:", err);
      return [];
    }
  }

  function renderContactCards(contacts: Contact[]): void {
    if (!contactList) return;

    if (contacts.length === 0) {
      contactList.innerHTML = `
        <div class="no-contacts">
          <i class="fas fa-users"></i>
          <p>No contacts found</p>
        </div>
      `;
      return;
    }

    contactList.innerHTML = "";

    contacts.forEach(contact => {
      if (!contact.id) return;

      const tags = Array.isArray(contact.tags)
        ? contact.tags
        : typeof contact.tags === "string"
          ? contact.tags.split(",").map(t => t.trim())
          : contact.tags ? [String(contact.tags)] : [];

      const div = document.createElement("div");
      div.className = "tenant-card";
      div.innerHTML = `
        <div class="contact-avatar">${getInitials(contact.name)}</div>
        <div class="tenant-name">${contact.name || "Unknown Contact"}</div>
        <div class="tenant-phone">
          <i class="fas fa-phone"></i>
          ${contact.phoneNumber || "No phone"}
        </div>
        <div class="contact-tags">
          ${tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
        </div>
        <div class="tenant-actions">
          <button class="action-btn details-btn" data-id="${contact.id}">
            <i class="fas fa-eye"></i> Details
          </button>
          <button class="action-btn edit-btn" data-id="${contact.id}">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="action-btn delete-btn" data-id="${contact.id}">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      `;
      contactList.appendChild(div);
    });

    document.querySelectorAll<HTMLButtonElement>(".details-btn").forEach(btn => {
      btn.addEventListener("click", () => openDetailsPopup(btn.dataset.id || ""));
    });

    document.querySelectorAll<HTMLButtonElement>(".edit-btn").forEach(btn => {
      btn.addEventListener("click", () => openEditPopup(btn.dataset.id || ""));
    });

    document.querySelectorAll<HTMLButtonElement>(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => showDeleteConfirmation(btn.dataset.id || ""));
    });
  }

  async function renderContacts(): Promise<void> {
    if (!contactList) return;
    contactList.innerHTML = `<div class="loading-state"><div class="loading-spinner"></div><p>Loading contacts...</p></div>`;
    try {
      allContacts = await fetchContacts();
      renderContactCards(allContacts);
    } catch (err) {
      console.error("Error rendering contacts:", err);
      contactList.innerHTML = `<div class="error-state"><p>Error loading contacts.</p></div>`;
    }
  }

  async function openDetailsPopup(id: string): Promise<void> {
    if (!popup || !popupContent) return;
    if (!id) return;

    try {
      popupContent.innerHTML = `<p>Loading contact details...</p>`;
      popup.classList.add("active");

      const res = await fetch(`${BASE_URL}/contacts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const contact: Contact = await res.json();

      const tagsDisplay = Array.isArray(contact.tags)
        ? contact.tags.join(", ")
        : typeof contact.tags === "string"
          ? contact.tags
          : contact.tags
            ? String(contact.tags)
            : "None";

      popupContent.innerHTML = `
        <h3>Contact Details</h3>
        <p><b>Name:</b> ${contact.name || "N/A"}</p>
        <p><b>Phone:</b> ${contact.phoneNumber || "N/A"}</p>
        <p><b>Tags:</b> ${tagsDisplay}</p>
        <p><b>Created:</b> ${contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : "N/A"}</p>
        <button onclick="document.getElementById('popup')?.classList.remove('active')">Close</button>
      `;
    } catch (err) {
      console.error("Error opening details:", err);
      popupContent.innerHTML = `<p>Error loading contact details.</p>`;
    }
  }

  async function openEditPopup(id: string): Promise<void> {
    if (!popup || !popupContent) return;
    if (!id) return;

    popupContent.innerHTML = `<p>Loading contact...</p>`;
    popup.classList.add("active");

    try {
      const res = await fetch(`${BASE_URL}/contacts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const contact: Contact = await res.json();

      popupContent.innerHTML = `
        <h3>Edit Contact</h3>
        <form id="editForm">
          <input type="hidden" id="editId" value="${contact.id}">
          <input type="text" id="editName" value="${contact.name || ""}" required>
          <input type="tel" id="editPhone" value="${contact.phoneNumber || ""}" required>
          <input type="text" id="editTags" value="${Array.isArray(contact.tags) ? contact.tags.join(", ") : contact.tags || ""}">
          <button type="submit">Save</button>
        </form>
      `;

      const editForm = document.getElementById("editForm") as HTMLFormElement | null;
      editForm?.addEventListener("submit", async (e: Event) => {
        e.preventDefault();
        const name = (document.getElementById("editName") as HTMLInputElement).value;
        const phoneNumber = (document.getElementById("editPhone") as HTMLInputElement).value;
        const tags = (document.getElementById("editTags") as HTMLInputElement).value
          .split(",")
          .map(t => t.trim());

        await fetch(`${BASE_URL}/contacts/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ name, phoneNumber, tags }),
        });

        popup.classList.remove("active");
        await renderContacts();
      });
    } catch (err) {
      console.error("Error editing contact:", err);
      popupContent.innerHTML = `<p>Error editing contact.</p>`;
    }
  }

  function showDeleteConfirmation(id: string): void {
    if (!popup || !popupContent) return;
    if (!id) return;

    popupContent.innerHTML = `
      <h3>Delete Contact</h3>
      <p>Are you sure?</p>
      <button id="confirmDeleteBtn">Delete</button>
      <button onclick="document.getElementById('popup')?.classList.remove('active')">Cancel</button>
    `;
    popup.classList.add("active");

    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn") as HTMLButtonElement | null;
    confirmDeleteBtn?.addEventListener("click", async () => {
      await fetch(`${BASE_URL}/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      popup.classList.remove("active");
      await renderContacts();
    });
  }

  window.logout = function () {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("access_token");
      window.location.href = "./login.html";
    }
  };

  window.openDetailsPopup = openDetailsPopup;
  window.openEditPopup = openEditPopup;
  window.showDeleteConfirmation = showDeleteConfirmation;
  window.renderContacts = renderContacts;

  renderContacts();
});

export {};
