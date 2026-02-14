(function () {
  var AUTH_KEY = "handymanAdminSession";
  var loginScreen = document.getElementById("loginScreen");
  var adminApp = document.getElementById("adminApp");
  var adminMain = document.getElementById("adminMain");
  var sidebar = document.getElementById("sidebar");
  var sidebarToggle = document.getElementById("sidebarToggle");
  var importFile = document.getElementById("importFile");

  var modal = document.getElementById("editorModal");
  var modalTitle = document.getElementById("modalTitle");
  var modalForm = document.getElementById("modalForm");
  var modalClose = document.getElementById("modalClose");

  var state = {
    data: window.HandymanData.getData(),
    view: "dashboard",
    expandedInquiries: {}
  };

  function persist() {
    state.data = window.HandymanData.saveData(state.data);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function isAuthenticated() {
    return localStorage.getItem(AUTH_KEY) === "1";
  }

  function setAuthenticated(value) {
    localStorage.setItem(AUTH_KEY, value ? "1" : "0");
  }

  function showApp() {
    loginScreen.classList.add("hidden");
    adminApp.classList.remove("hidden");
    renderView();
  }

  function showLogin() {
    adminApp.classList.add("hidden");
    loginScreen.classList.remove("hidden");
  }

  function closeSidebarOnMobile() {
    if (window.innerWidth < 992) {
      sidebar.classList.remove("open");
    }
  }

  function formatDate(iso) {
    var date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function openModal(config) {
    modalTitle.textContent = config.title;
    modalForm.innerHTML = config.fields
      .map(function (field) {
        if (field.type === "textarea") {
          return '<label for="modal_' + field.name + '">' + field.label + '</label>' +
            '<textarea id="modal_' + field.name + '" name="' + field.name + '" rows="4">' +
            escapeHtml(field.value || "") + "</textarea>";
        }

        if (field.type === "checkbox") {
          return '<label><input type="checkbox" name="' + field.name + '" ' + (field.value ? "checked" : "") + '> ' + field.label + '</label>';
        }

        return '<label for="modal_' + field.name + '">' + field.label + '</label>' +
          '<input id="modal_' + field.name + '" type="' + (field.type || "text") + '" name="' + field.name + '" value="' + escapeHtml(field.value || "") + '" ' + (field.required ? "required" : "") + '>';
      })
      .join("") +
      '<div class="inline-actions">' +
      '<button type="button" class="btn btn-outline" id="modalCancel">Cancel</button>' +
      '<button type="submit" class="btn btn-primary">' + (config.submitText || "Save") + "</button>" +
      "</div>";

    modal.classList.remove("hidden");

    document.getElementById("modalCancel").addEventListener("click", closeModal);
    modalForm.onsubmit = function (event) {
      event.preventDefault();
      var fd = new FormData(modalForm);
      var result = {};
      config.fields.forEach(function (field) {
        if (field.type === "checkbox") {
          result[field.name] = modalForm.querySelector('[name="' + field.name + '"]').checked;
        } else {
          result[field.name] = String(fd.get(field.name) || "").trim();
        }
      });
      config.onSubmit(result);
      closeModal();
      renderView();
    };
  }

  function closeModal() {
    modal.classList.add("hidden");
    modalForm.innerHTML = "";
    modalForm.onsubmit = null;
  }

  function bindSidebarEvents() {
    document.querySelectorAll(".nav-item").forEach(function (button) {
      button.addEventListener("click", function () {
        state.view = button.dataset.view;
        document.querySelectorAll(".nav-item").forEach(function (item) {
          item.classList.remove("active");
        });
        button.classList.add("active");
        renderView();
        closeSidebarOnMobile();
      });
    });
  }

  function renderDashboard() {
    var inquiries = state.data.inquiries;
    var month = new Date().getMonth();
    var year = new Date().getFullYear();
    var thisMonth = inquiries.filter(function (item) {
      var date = new Date(item.date);
      return date.getMonth() === month && date.getFullYear() === year;
    }).length;
    var contacted = inquiries.filter(function (item) {
      return item.status === "Contacted" || item.status === "Completed";
    }).length;

    adminMain.innerHTML =
      '<section class="panel">' +
      '<h1>Welcome back!</h1>' +
      '<p class="help-text">Manage your website content.</p>' +
      '<div class="grid-3">' +
      '<article class="stat"><strong>' + inquiries.length + '</strong><span>Total Inquiries</span></article>' +
      '<article class="stat"><strong>' + thisMonth + '</strong><span>This Month</span></article>' +
      '<article class="stat"><strong>' + contacted + '</strong><span>Contacted</span></article>' +
      '</div>' +
      '</section>' +
      '<section class="panel">' +
      '<div class="panel-head"><h2>Recent Inquiries</h2><button class="btn btn-outline" id="goInquiries">View All</button></div>' +
      '<div class="table-wrap"><table><thead><tr><th>Name</th><th>Service</th><th>Date</th><th>Status</th></tr></thead><tbody>' +
      (inquiries.slice(0, 6).map(function (item) {
        return "<tr><td>" + escapeHtml(item.name) + "</td><td>" + escapeHtml(item.service) + "</td><td>" + formatDate(item.date) + "</td><td>" + escapeHtml(item.status) + "</td></tr>";
      }).join("") || '<tr><td colspan="4">No inquiries yet.</td></tr>') +
      "</tbody></table></div>" +
      "</section>";

    var btn = document.getElementById("goInquiries");
    if (btn) {
      btn.addEventListener("click", function () {
        state.view = "inquiries";
        document.querySelector('[data-view="inquiries"]').click();
      });
    }
  }

  function renderServices() {
    adminMain.innerHTML =
      '<section class="panel">' +
      '<div class="panel-head"><h1>Services</h1><button class="btn btn-primary" id="addService">+ Add Service</button></div>' +
      '<div class="list">' +
      state.data.services
        .map(function (service) {
          return '<article class="list-item">' +
            '<div class="line"><strong>' + escapeHtml(service.title) + '</strong>' +
            '<div class="actions">' +
            '<button class="action-btn" data-action="edit-service" data-id="' + service.id + '">Edit</button>' +
            '<button class="action-btn" data-action="delete-service" data-id="' + service.id + '">Delete</button>' +
            "</div></div>" +
            '<p class="help-text">Icon: ' + escapeHtml(service.icon) + '</p>' +
            '<p>' + escapeHtml(service.description) + "</p>" +
            "</article>";
        })
        .join("") +
      "</div></section>";

    document.getElementById("addService").addEventListener("click", function () {
      openModal({
        title: "Add Service",
        fields: [
          { name: "icon", label: "Icon (lucide name)", type: "text", value: "wrench" },
          { name: "title", label: "Title", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea", required: true }
        ],
        onSubmit: function (values) {
          state.data.services.push({
            id: window.HandymanData.nextId(state.data.services),
            icon: values.icon || "wrench",
            title: values.title,
            description: values.description
          });
          persist();
        }
      });
    });

    adminMain.querySelectorAll('[data-action="edit-service"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = Number(btn.dataset.id);
        var item = state.data.services.find(function (service) { return service.id === id; });
        if (!item) return;

        openModal({
          title: "Edit Service",
          fields: [
            { name: "icon", label: "Icon (lucide name)", value: item.icon, type: "text" },
            { name: "title", label: "Title", value: item.title, type: "text", required: true },
            { name: "description", label: "Description", value: item.description, type: "textarea", required: true }
          ],
          onSubmit: function (values) {
            item.icon = values.icon || "wrench";
            item.title = values.title;
            item.description = values.description;
            persist();
          }
        });
      });
    });

    adminMain.querySelectorAll('[data-action="delete-service"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = Number(btn.dataset.id);
        if (!window.confirm("Delete this service?")) return;
        state.data.services = state.data.services.filter(function (service) { return service.id !== id; });
        persist();
        renderView();
      });
    });
  }

  function renderPricing() {
    adminMain.innerHTML =
      '<section class="panel">' +
      "<h1>Pricing</h1>" +
      '<div class="list">' +
      state.data.pricing
        .map(function (item) {
          return '<article class="list-item">' +
            '<div class="line"><strong>' + escapeHtml(item.name) + '</strong>' +
            '<button class="action-btn" data-action="edit-pricing" data-id="' + item.id + '">Edit</button></div>' +
            '<p>£' + escapeHtml(item.price) + ' ' + escapeHtml(item.unit) + '</p>' +
            '<p class="help-text">' + escapeHtml(item.description) + '</p>' +
            '<p class="help-text">Features: ' + escapeHtml(item.features.join(", ")) + '</p>' +
            (item.popular ? '<span class="badge badge-contacted">POPULAR</span>' : "") +
            "</article>";
        })
        .join("") +
      "</div></section>";

    adminMain.querySelectorAll('[data-action="edit-pricing"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = Number(btn.dataset.id);
        var item = state.data.pricing.find(function (tier) { return tier.id === id; });
        if (!item) return;

        openModal({
          title: "Edit Pricing Tier",
          fields: [
            { name: "name", label: "Tier Name", value: item.name, type: "text", required: true },
            { name: "price", label: "Price (GBP)", value: item.price, type: "number", required: true },
            { name: "unit", label: "Unit", value: item.unit, type: "text" },
            { name: "description", label: "Description", value: item.description, type: "text" },
            { name: "features", label: "Features (one per line)", value: item.features.join("\n"), type: "textarea" },
            { name: "popular", label: "Mark as popular", value: item.popular, type: "checkbox" }
          ],
          onSubmit: function (values) {
            item.name = values.name;
            item.price = Number(values.price) || 0;
            item.unit = values.unit;
            item.description = values.description;
            item.features = values.features
              .split("\n")
              .map(function (line) { return line.trim(); })
              .filter(Boolean);
            item.popular = Boolean(values.popular);
            persist();
          }
        });
      });
    });
  }

  function renderPortfolio() {
    adminMain.innerHTML =
      '<section class="panel">' +
      '<div class="panel-head"><h1>Portfolio</h1><button class="btn btn-primary" id="addPortfolio">+ Add Item</button></div>' +
      '<div class="list">' +
      state.data.portfolio
        .map(function (item) {
          return '<article class="list-item">' +
            '<div class="line"><strong>' + escapeHtml(item.title) + '</strong>' +
            '<div class="actions">' +
            '<button class="action-btn" data-action="edit-portfolio" data-id="' + item.id + '">Edit</button>' +
            '<button class="action-btn" data-action="delete-portfolio" data-id="' + item.id + '">Delete</button>' +
            "</div></div>" +
            '<p class="help-text">' + escapeHtml(item.location) + '</p>' +
            '<p>' + escapeHtml(item.description) + '</p>' +
            '<p class="help-text">Image URL: ' + escapeHtml(item.imageUrl || "(placeholder gradient)") + "</p>" +
            "</article>";
        })
        .join("") +
      "</div></section>";

    document.getElementById("addPortfolio").addEventListener("click", function () {
      openModal({
        title: "Add Portfolio Item",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "location", label: "Location", type: "text", required: true },
          { name: "imageUrl", label: "Image URL", type: "url" }
        ],
        onSubmit: function (values) {
          state.data.portfolio.push({
            id: window.HandymanData.nextId(state.data.portfolio),
            title: values.title,
            description: values.description,
            location: values.location,
            imageUrl: values.imageUrl
          });
          persist();
        }
      });
    });

    adminMain.querySelectorAll('[data-action="edit-portfolio"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = Number(btn.dataset.id);
        var item = state.data.portfolio.find(function (entry) { return entry.id === id; });
        if (!item) return;
        openModal({
          title: "Edit Portfolio Item",
          fields: [
            { name: "title", label: "Title", value: item.title, type: "text", required: true },
            { name: "description", label: "Description", value: item.description, type: "textarea", required: true },
            { name: "location", label: "Location", value: item.location, type: "text", required: true },
            { name: "imageUrl", label: "Image URL", value: item.imageUrl, type: "url" }
          ],
          onSubmit: function (values) {
            item.title = values.title;
            item.description = values.description;
            item.location = values.location;
            item.imageUrl = values.imageUrl;
            persist();
          }
        });
      });
    });

    adminMain.querySelectorAll('[data-action="delete-portfolio"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = Number(btn.dataset.id);
        if (!window.confirm("Delete this portfolio item?")) return;
        state.data.portfolio = state.data.portfolio.filter(function (entry) { return entry.id !== id; });
        persist();
        renderView();
      });
    });
  }

  function renderTestimonials() {
    adminMain.innerHTML =
      '<section class="panel">' +
      '<div class="panel-head"><h1>Reviews</h1><button class="btn btn-primary" id="addTestimonial">+ Add Review</button></div>' +
      '<div class="list">' +
      state.data.testimonials
        .map(function (item) {
          return '<article class="list-item">' +
            '<div class="line"><strong>' + escapeHtml(item.author) + '</strong>' +
            '<div class="actions">' +
            '<button class="action-btn" data-action="edit-testimonial" data-id="' + item.id + '">Edit</button>' +
            '<button class="action-btn" data-action="delete-testimonial" data-id="' + item.id + '">Delete</button>' +
            "</div></div>" +
            '<p>Rating: ' + "★".repeat(Math.max(1, Math.min(5, Number(item.rating) || 5))) + "</p>" +
            '<p class="help-text">' + escapeHtml(item.location) + '</p>' +
            '<p>"' + escapeHtml(item.quote) + '"</p>' +
            "</article>";
        })
        .join("") +
      "</div></section>";

    document.getElementById("addTestimonial").addEventListener("click", function () {
      openModal({
        title: "Add Review",
        fields: [
          { name: "quote", label: "Quote", type: "textarea", required: true },
          { name: "author", label: "Author Name", type: "text", required: true },
          { name: "location", label: "Location", type: "text", required: true },
          { name: "rating", label: "Rating (1-5)", type: "number", value: 5, required: true }
        ],
        onSubmit: function (values) {
          state.data.testimonials.push({
            id: window.HandymanData.nextId(state.data.testimonials),
            quote: values.quote,
            author: values.author,
            location: values.location,
            rating: Math.min(5, Math.max(1, Number(values.rating) || 5))
          });
          persist();
        }
      });
    });

    adminMain.querySelectorAll('[data-action="edit-testimonial"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = Number(btn.dataset.id);
        var item = state.data.testimonials.find(function (entry) { return entry.id === id; });
        if (!item) return;
        openModal({
          title: "Edit Review",
          fields: [
            { name: "quote", label: "Quote", value: item.quote, type: "textarea", required: true },
            { name: "author", label: "Author Name", value: item.author, type: "text", required: true },
            { name: "location", label: "Location", value: item.location, type: "text", required: true },
            { name: "rating", label: "Rating (1-5)", value: item.rating, type: "number", required: true }
          ],
          onSubmit: function (values) {
            item.quote = values.quote;
            item.author = values.author;
            item.location = values.location;
            item.rating = Math.min(5, Math.max(1, Number(values.rating) || 5));
            persist();
          }
        });
      });
    });

    adminMain.querySelectorAll('[data-action="delete-testimonial"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = Number(btn.dataset.id);
        if (!window.confirm("Delete this review?")) return;
        state.data.testimonials = state.data.testimonials.filter(function (entry) { return entry.id !== id; });
        persist();
        renderView();
      });
    });
  }

  function statusBadge(status) {
    var key = String(status || "New").toLowerCase();
    if (key === "contacted") return "badge badge-contacted";
    if (key === "completed") return "badge badge-completed";
    return "badge badge-new";
  }

  function renderInquiries() {
    adminMain.innerHTML =
      '<section class="panel">' +
      '<div class="panel-head"><h1>Inquiries</h1><button class="btn btn-outline" id="exportCsv">Export CSV</button></div>' +
      '<div class="list">' +
      (state.data.inquiries.map(function (item) {
        var expanded = Boolean(state.expandedInquiries[item.id]);
        return '<article class="list-item">' +
          '<div class="line">' +
          '<div><strong>' + escapeHtml(item.name) + '</strong><p class="help-text">' + escapeHtml(item.email) + '</p></div>' +
          '<div class="actions">' +
          '<select data-action="status" data-id="' + item.id + '">' +
          ["New", "Contacted", "Completed"].map(function (status) {
            return '<option value="' + status + '" ' + (item.status === status ? "selected" : "") + '>' + status + '</option>';
          }).join("") +
          "</select>" +
          '<button class="action-btn" data-action="expand" data-id="' + item.id + '">' + (expanded ? "Hide" : "View") + "</button>" +
          '<button class="action-btn" data-action="delete-inquiry" data-id="' + item.id + '">Delete</button>' +
          "</div></div>" +
          '<p><span class="' + statusBadge(item.status) + '">' + escapeHtml(item.status) + '</span> · ' + formatDate(item.date) + ' · ' + escapeHtml(item.service || "General") + '</p>' +
          (expanded
            ? '<div class="inquiry-expand"><p><strong>Phone:</strong> ' + escapeHtml(item.phone) + '</p><p><strong>Preferred date:</strong> ' + escapeHtml(item.preferredDate || "-") + '</p><p><strong>Message:</strong><br>' + escapeHtml(item.message || "No message") + "</p></div>"
            : "") +
          "</article>";
      }).join("")) +
      (state.data.inquiries.length ? "" : '<p class="help-text">No inquiries yet.</p>') +
      "</div></section>";

    var csvBtn = document.getElementById("exportCsv");
    if (csvBtn) {
      csvBtn.addEventListener("click", exportCsv);
    }

    adminMain.querySelectorAll('[data-action="status"]').forEach(function (select) {
      select.addEventListener("change", function () {
        var id = Number(select.dataset.id);
        var item = state.data.inquiries.find(function (entry) { return entry.id === id; });
        if (!item) return;
        item.status = select.value;
        persist();
        renderView();
      });
    });

    adminMain.querySelectorAll('[data-action="expand"]').forEach(function (button) {
      button.addEventListener("click", function () {
        var id = Number(button.dataset.id);
        state.expandedInquiries[id] = !state.expandedInquiries[id];
        renderView();
      });
    });

    adminMain.querySelectorAll('[data-action="delete-inquiry"]').forEach(function (button) {
      button.addEventListener("click", function () {
        var id = Number(button.dataset.id);
        if (!window.confirm("Delete this inquiry permanently?")) return;
        state.data.inquiries = state.data.inquiries.filter(function (entry) { return entry.id !== id; });
        persist();
        renderView();
      });
    });
  }

  function renderSettings() {
    var business = state.data.business;
    adminMain.innerHTML =
      '<section class="panel">' +
      '<h1>Business Information</h1>' +
      '<label for="businessName">Business name</label><input id="businessName" value="' + escapeHtml(business.name) + '">' +
      '<label for="businessPhone">Phone number</label><input id="businessPhone" value="' + escapeHtml(business.phone) + '">' +
      '<label for="businessEmail">Email address</label><input id="businessEmail" value="' + escapeHtml(business.email) + '">' +
      '<label for="businessAddress">Address / location</label><input id="businessAddress" value="' + escapeHtml(business.address) + '">' +
      '<label for="businessHours">Working hours</label><input id="businessHours" value="' + escapeHtml(business.hours) + '">' +
      '<div class="inline-actions"><button class="btn btn-primary" id="saveBusiness">Save Business Info</button></div>' +
      "</section>" +
      '<section class="panel">' +
      '<h2>Admin Security</h2>' +
      '<label for="currentPassword">Current password</label><input id="currentPassword" type="password">' +
      '<label for="newPassword">New password</label><input id="newPassword" type="password">' +
      '<label for="confirmPassword">Confirm new password</label><input id="confirmPassword" type="password">' +
      '<div class="inline-actions"><button class="btn btn-primary" id="changePassword">Change Password</button></div>' +
      '<p class="help-text" id="passwordMessage"></p>' +
      "</section>" +
      '<section class="panel">' +
      '<h2>Data Management</h2>' +
      '<div class="inline-actions">' +
      '<button class="btn btn-outline" id="exportJson">Export All Data</button>' +
      '<button class="btn btn-outline" id="importJson">Import Data</button>' +
      '<button class="btn btn-outline" id="resetData">Reset to Defaults</button>' +
      "</div></section>";

    document.getElementById("saveBusiness").addEventListener("click", function () {
      state.data.business = {
        name: document.getElementById("businessName").value.trim(),
        phone: document.getElementById("businessPhone").value.trim(),
        email: document.getElementById("businessEmail").value.trim(),
        address: document.getElementById("businessAddress").value.trim(),
        hours: document.getElementById("businessHours").value.trim()
      };
      persist();
      window.alert("Business information updated.");
    });

    document.getElementById("changePassword").addEventListener("click", function () {
      var current = document.getElementById("currentPassword").value;
      var next = document.getElementById("newPassword").value;
      var confirm = document.getElementById("confirmPassword").value;
      var message = document.getElementById("passwordMessage");

      if (current !== state.data.admin.password) {
        message.textContent = "Current password is incorrect.";
        message.style.color = "#b91c1c";
        return;
      }

      if (!next || next.length < 6) {
        message.textContent = "New password must be at least 6 characters.";
        message.style.color = "#b91c1c";
        return;
      }

      if (next !== confirm) {
        message.textContent = "Password confirmation does not match.";
        message.style.color = "#b91c1c";
        return;
      }

      state.data.admin.password = next;
      persist();
      message.textContent = "Password updated successfully.";
      message.style.color = "#0b6f2a";
      document.getElementById("currentPassword").value = "";
      document.getElementById("newPassword").value = "";
      document.getElementById("confirmPassword").value = "";
    });

    document.getElementById("exportJson").addEventListener("click", exportJson);
    document.getElementById("importJson").addEventListener("click", function () {
      importFile.click();
    });
    document.getElementById("resetData").addEventListener("click", function () {
      if (!window.confirm("This will reset all data. Continue?")) return;
      state.data = window.HandymanData.resetData();
      renderView();
      window.alert("Data reset to defaults.");
    });
  }

  function renderView() {
    switch (state.view) {
      case "services":
        renderServices();
        break;
      case "pricing":
        renderPricing();
        break;
      case "portfolio":
        renderPortfolio();
        break;
      case "testimonials":
        renderTestimonials();
        break;
      case "inquiries":
        renderInquiries();
        break;
      case "settings":
        renderSettings();
        break;
      default:
        renderDashboard();
        break;
    }

    adminMain.focus();
  }

  function exportJson() {
    var blob = new Blob([JSON.stringify(state.data, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "london-handyman-pro-data.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportCsv() {
    var headers = ["Date", "Name", "Email", "Phone", "Service", "Status", "Preferred Date", "Message"];
    var rows = state.data.inquiries.map(function (item) {
      return [
        formatDate(item.date),
        item.name,
        item.email,
        item.phone,
        item.service,
        item.status,
        item.preferredDate || "",
        item.message || ""
      ];
    });

    var csv = [headers].concat(rows).map(function (row) {
      return row
        .map(function (cell) {
          return '"' + String(cell || "").replace(/\"/g, '""') + '"';
        })
        .join(",");
    }).join("\n");

    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "inquiries.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function bindGlobalEvents() {
    document.getElementById("loginForm").addEventListener("submit", function (event) {
      event.preventDefault();
      var input = document.getElementById("adminPassword");
      var error = document.getElementById("loginError");
      if (input.value === state.data.admin.password) {
        error.textContent = "";
        setAuthenticated(true);
        showApp();
        input.value = "";
      } else {
        error.textContent = "Wrong password. Please try again.";
      }
    });

    document.getElementById("logoutBtn").addEventListener("click", function () {
      setAuthenticated(false);
      showLogin();
    });

    document.getElementById("togglePassword").addEventListener("click", function () {
      var input = document.getElementById("adminPassword");
      var isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      this.textContent = isHidden ? "Hide" : "Show";
    });

    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("open");
    });

    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });

    importFile.addEventListener("change", function () {
      if (!importFile.files || !importFile.files[0]) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var imported = JSON.parse(String(reader.result || "{}"));
          state.data = window.HandymanData.saveData(imported);
          renderView();
          window.alert("Data imported successfully.");
        } catch (error) {
          window.alert("Invalid JSON file.");
        }
      };
      reader.readAsText(importFile.files[0]);
      importFile.value = "";
    });

    bindSidebarEvents();
  }

  function init() {
    bindGlobalEvents();
    if (isAuthenticated()) {
      showApp();
    } else {
      showLogin();
    }
  }

  init();
})();
