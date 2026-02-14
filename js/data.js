(function () {
  const STORAGE_KEY = "handymanData";

  const defaultData = {
    business: {
      name: "London Handyman Pro",
      phone: "+44 7XXX XXX XXX",
      email: "info@londonhandymanpro.co.uk",
      address: "Serving all London areas",
      hours: "Monday - Sunday: 7:00 AM - 9:00 PM"
    },
    services: [
      {
        id: 1,
        icon: "zap",
        title: "Electrical Work",
        description: "Installations, repairs, lighting, sockets, and full rewiring services."
      },
      {
        id: 2,
        icon: "droplets",
        title: "Plumbing",
        description: "Leak repairs, tap installations, boiler maintenance, and bathroom fitting."
      },
      {
        id: 3,
        icon: "paintbrush",
        title: "Painting & Decorating",
        description: "Interior and exterior painting, wallpapering, and plastering."
      },
      {
        id: 4,
        icon: "tv",
        title: "Appliance Installation",
        description: "TV mounting, washing machines, dishwashers, and cooker installation."
      },
      {
        id: 5,
        icon: "grid-2x2",
        title: "Tiling & Flooring",
        description: "Kitchen and bathroom tiling, laminate, vinyl, and wooden floors."
      },
      {
        id: 6,
        icon: "package",
        title: "Furniture Assembly",
        description: "Flat-pack assembly, IKEA furniture, custom shelving, and more."
      }
    ],
    pricing: [
      {
        id: 1,
        name: "Hourly Rate",
        price: 45,
        unit: "/hour",
        description: "Perfect for small jobs",
        features: ["Minimum 1 hour", "All tools included", "Same-day availability"],
        popular: false
      },
      {
        id: 2,
        name: "Half Day",
        price: 160,
        unit: "",
        description: "Up to 4 hours of work",
        features: ["Multiple tasks", "Priority scheduling", "Free consultation"],
        popular: true
      },
      {
        id: 3,
        name: "Full Day",
        price: 280,
        unit: "",
        description: "Up to 8 hours of work",
        features: ["Large projects", "Best value", "Dedicated service"],
        popular: false
      }
    ],
    portfolio: [
      {
        id: 1,
        title: "Kitchen Renovation",
        description: "Complete kitchen remodel with new tiling and appliances",
        location: "Islington",
        imageUrl: ""
      },
      {
        id: 2,
        title: "Bathroom Fitting",
        description: "Full bathroom installation including plumbing and tiling",
        location: "Camden",
        imageUrl: ""
      },
      {
        id: 3,
        title: "Electrical Rewiring",
        description: "Complete house rewiring with new consumer unit",
        location: "Hackney",
        imageUrl: ""
      },
      {
        id: 4,
        title: "Interior Painting",
        description: "Full house interior painting and decorating",
        location: "Westminster",
        imageUrl: ""
      },
      {
        id: 5,
        title: "Flooring Installation",
        description: "Hardwood flooring throughout ground floor",
        location: "Kensington",
        imageUrl: ""
      },
      {
        id: 6,
        title: "Furniture Assembly",
        description: "Home office setup with custom shelving",
        location: "Shoreditch",
        imageUrl: ""
      }
    ],
    testimonials: [
      {
        id: 1,
        quote:
          "Excellent service! Fixed multiple issues in one visit. Very professional and tidy. Would definitely recommend to anyone looking for a reliable handyman.",
        author: "James Thompson",
        location: "Hackney",
        rating: 5
      },
      {
        id: 2,
        quote:
          "Called in the morning, arrived by afternoon. Fantastic work on our bathroom tiling. Fair price and great communication throughout the project.",
        author: "Sarah Mitchell",
        location: "Camden",
        rating: 5
      },
      {
        id: 3,
        quote:
          "Best handyman in London! Have used them three times now for various jobs. Always punctual, professional, and the quality of work is outstanding.",
        author: "David Roberts",
        location: "Westminster",
        rating: 5
      }
    ],
    inquiries: [],
    admin: {
      password: "admin123"
    }
  };

  function deepClone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  function ensureShape(data) {
    const clean = deepClone(defaultData);
    const merged = Object.assign(clean, data || {});
    merged.business = Object.assign(clean.business, (data && data.business) || {});
    merged.admin = Object.assign(clean.admin, (data && data.admin) || {});
    merged.services = Array.isArray(data && data.services) ? data.services : clean.services;
    merged.pricing = Array.isArray(data && data.pricing) ? data.pricing : clean.pricing;
    merged.portfolio = Array.isArray(data && data.portfolio) ? data.portfolio : clean.portfolio;
    merged.testimonials = Array.isArray(data && data.testimonials) ? data.testimonials : clean.testimonials;
    merged.inquiries = Array.isArray(data && data.inquiries) ? data.inquiries : clean.inquiries;
    return merged;
  }

  function getData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return deepClone(defaultData);
    }

    try {
      return ensureShape(JSON.parse(stored));
    } catch (error) {
      return deepClone(defaultData);
    }
  }

  function saveData(data) {
    const safe = ensureShape(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    return safe;
  }

  function resetData() {
    const fresh = deepClone(defaultData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }

  function nextId(items) {
    return items.reduce(function (max, item) {
      return Math.max(max, Number(item.id) || 0);
    }, 0) + 1;
  }

  window.HandymanData = {
    STORAGE_KEY: STORAGE_KEY,
    defaultData: defaultData,
    getData: getData,
    saveData: saveData,
    resetData: resetData,
    nextId: nextId,
    deepClone: deepClone
  };
})();
