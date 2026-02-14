(function () {
  var data = window.HandymanData.getData();

  var servicesGrid = document.getElementById("servicesGrid");
  var pricingGrid = document.getElementById("pricingGrid");
  var portfolioGrid = document.getElementById("portfolioGrid");
  var testimonialsGrid = document.getElementById("testimonialsGrid");
  var footerServices = document.getElementById("footerServices");
  var serviceSelect = document.getElementById("service");

  function iconSvg(name) {
    return '<i data-lucide="' + name + '" class="service-icon" aria-hidden="true"></i>';
  }

  function renderServices() {
    servicesGrid.innerHTML = data.services
      .map(function (service) {
        return (
          '<article class="service-card animate-on-scroll">' +
          iconSvg(service.icon || "wrench") +
          "<h3>" + service.title + "</h3>" +
          "<p>" + service.description + "</p>" +
          '<a class="service-link" href="#contact">Learn More →</a>' +
          "</article>"
        );
      })
      .join("");

    footerServices.innerHTML = data.services
      .slice(0, 6)
      .map(function (service) {
        return '<li><a href="#services">' + service.title + "</a></li>";
      })
      .join("");

    serviceSelect.innerHTML = '<option value="">Select a service</option>' +
      data.services
        .map(function (service) {
          return '<option value="' + service.title + '">' + service.title + "</option>";
        })
        .join("");
  }

  function renderPricing() {
    pricingGrid.innerHTML = data.pricing
      .map(function (tier) {
        return (
          '<article class="pricing-card animate-on-scroll ' + (tier.popular ? "popular" : "") + '">' +
          (tier.popular ? '<span class="popular-badge">POPULAR</span>' : "") +
          "<h3>" + tier.name + "</h3>" +
          '<p class="price">£' + Number(tier.price).toFixed(0) +
          " <span>" + (tier.unit || "") + "</span></p>" +
          "<p>" + tier.description + "</p>" +
          '<ul class="pricing-features">' +
          tier.features.map(function (feature) { return "<li>" + feature + "</li>"; }).join("") +
          "</ul>" +
          '<a class="btn ' + (tier.popular ? "btn-primary" : "btn-outline") + '" href="#contact">Book Now</a>' +
          "</article>"
        );
      })
      .join("");
  }

  function renderPortfolio() {
    portfolioGrid.innerHTML = data.portfolio
      .map(function (item, index) {
        var hasImage = Boolean(item.imageUrl);
        var placeholder = '<div class="portfolio-placeholder" aria-hidden="true">' +
          ["🏠", "🛁", "💡", "🎨", "🪵", "🧰"][index % 6] +
          "</div>";

        return (
          '<article class="portfolio-item animate-on-scroll">' +
          (hasImage
            ? '<img src="' + item.imageUrl + '" alt="' + item.title + " project in " + item.location + ', London" loading="lazy">'
            : placeholder) +
          '<div class="portfolio-overlay"><strong>' + item.title + '</strong><br><small>' + item.location + ', London</small></div>' +
          "</article>"
        );
      })
      .join("");
  }

  function renderTestimonials() {
    testimonialsGrid.innerHTML = data.testimonials
      .map(function (item) {
        var stars = "★".repeat(Math.max(1, Math.min(5, item.rating || 5)));
        return (
          '<article class="testimonial-card animate-on-scroll">' +
          '<div class="stars" aria-label="' + (item.rating || 5) + ' star rating">' + stars + "</div>" +
          "<blockquote>\"" + item.quote + "\"</blockquote>" +
          "<cite>" + item.author + "</cite><br>" +
          "<small>" + item.location + ", London</small>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderBusiness() {
    document.getElementById("businessPhone").textContent = data.business.phone;
    document.getElementById("businessEmail").textContent = data.business.email;
    document.getElementById("businessAddress").textContent = data.business.address;
    document.getElementById("businessHours").textContent = data.business.hours;
    document.getElementById("footerPhone").textContent = data.business.phone;
    document.getElementById("footerEmail").textContent = data.business.email;
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  function showToast(message, isSuccess) {
    var toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.background = isSuccess ? "#28a745" : "#dc3545";
    toast.classList.add("show");
    window.setTimeout(function () {
      toast.classList.remove("show");
    }, 3000);
  }

  function attachContactForm() {
    var form = document.getElementById("contactForm");
    var submitBtn = document.getElementById("submitBtn");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var formData = new FormData(form);
      var payload = {
        id: window.HandymanData.nextId(data.inquiries),
        date: new Date().toISOString(),
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        service: String(formData.get("service") || "General"),
        preferredDate: String(formData.get("preferredDate") || ""),
        message: String(formData.get("message") || "").trim(),
        status: "New"
      };

      if (!payload.name || !payload.email || !payload.phone) {
        showToast("Please complete all required fields.", false);
        return;
      }

      if (!/^\S+@\S+\.\S+$/.test(payload.email)) {
        showToast("Please enter a valid email address.", false);
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      window.setTimeout(function () {
        data.inquiries.unshift(payload);
        data = window.HandymanData.saveData(data);
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Request";
        showToast("Thank you! We'll contact you within 2 hours.", true);
      }, 500);
    });
  }

  function attachNav() {
    var header = document.querySelector(".site-header");
    var menuToggle = document.getElementById("menuToggle");
    var mobileClose = document.getElementById("mobileClose");
    var mobileMenu = document.getElementById("mobileMenu");

    function setMenu(open) {
      mobileMenu.classList.toggle("open", open);
      mobileMenu.setAttribute("aria-hidden", String(!open));
      menuToggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    }

    menuToggle.addEventListener("click", function () {
      setMenu(!mobileMenu.classList.contains("open"));
    });

    mobileClose.addEventListener("click", function () {
      setMenu(false);
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });

    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 10);
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (event) {
        var href = anchor.getAttribute("href");
        if (!href || href === "#") {
          return;
        }

        var target = document.querySelector(href);
        if (!target) {
          return;
        }

        event.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 76;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }

  function attachScrollAnimations() {
    var elements = document.querySelectorAll(".animate-on-scroll");
    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (el) {
        el.classList.add("visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initCoverageMap() {
    var mapEl = document.getElementById("coverageMap");
    if (!mapEl || !window.L) {
      return;
    }

    var map = window.L.map(mapEl, { scrollWheelZoom: false }).setView([51.5074, -0.1278], 10);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    window.L.circle([51.5074, -0.1278], {
      radius: 40000,
      color: "#ff6b35",
      fillColor: "#ff6b35",
      fillOpacity: 0.15,
      weight: 2
    }).addTo(map);

    window.L.marker([51.5074, -0.1278]).addTo(map).bindPopup("London Handyman Pro - Core coverage");
  }

  function init() {
    renderServices();
    renderPricing();
    renderPortfolio();
    renderTestimonials();
    renderBusiness();
    attachContactForm();
    attachNav();
    attachScrollAnimations();
    initCoverageMap();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  init();
})();
