// ===== EMPLOYEE DATA CONFIGURATION =====
const DATA_CONFIG = {
  // Choose data source: 'offline', 'api-dummyjson', 'api-jsonplaceholder'
  source: "api-dummyjson", // Start with offline for guaranteed working

  // API endpoints (if using APIs)
  apis: {
    dummyjson:
      "https://dummyjson.com/users?limit=15&select=id,firstName,lastName,phone,company,address",
    jsonplaceholder: "https://jsonplaceholder.typicode.com/users",
  },
};

// ===== OFFLINE EMPLOYEE DATA (GUARANTEED TO WORK) =====
const OFFLINE_EMPLOYEES = [
  {
    employeeId: "E1001",
    name: "Aisha Kumar",
    phone: "9876543210",
    dept: "Engineering",
    address: "12 MG Road, Bengaluru, Karnataka 560001",
    project: "Phoenix Web Platform",
  },
  {
    employeeId: "E1002",
    name: "Rahul Verma",
    phone: "9876501234",
    dept: "Engineering",
    address: "Plot 21, Hinjewadi, Pune, Maharashtra 411057",
    project: "Orion Mobile App",
  },
  {
    employeeId: "E1003",
    name: "Meera Iyer",
    phone: "9833011122",
    dept: "HR",
    address: "Andheri East, Mumbai, Maharashtra 400069",
    project: "PeopleOps Portal",
  },
  {
    employeeId: "E1004",
    name: "Arjun Singh",
    phone: "9810012345",
    dept: "Sales",
    address: "Sector 62, Noida, Uttar Pradesh 201309",
    project: "NorthStar CRM",
  },
  {
    employeeId: "E1005",
    name: "Pooja Shah",
    phone: "9820098200",
    dept: "Finance",
    address: "SG Highway, Ahmedabad, Gujarat 380015",
    project: "LedgerX Analytics",
  },
  {
    employeeId: "E1006",
    name: "Vikram Rao",
    phone: "9971997199",
    dept: "Engineering",
    address: "Madhapur, Hyderabad, Telangana 500081",
    project: "Atlas Cloud Services",
  },
  {
    employeeId: "E1007",
    name: "Sneha Patel",
    phone: "9898989898",
    dept: "Marketing",
    address: "Koramangala, Bengaluru, Karnataka 560034",
    project: "Brand Vision Campaign",
  },
  {
    employeeId: "E1008",
    name: "Rajesh Gupta",
    phone: "9123456789",
    dept: "Engineering",
    address: "Salt Lake, Kolkata, West Bengal 700091",
    project: "DataFlow Engine",
  },
  {
    employeeId: "E1009",
    name: "Priya Reddy",
    phone: "9444555666",
    dept: "Design",
    address: "T. Nagar, Chennai, Tamil Nadu 600017",
    project: "UI/UX Revamp",
  },
  {
    employeeId: "E1010",
    name: "Amit Sharma",
    phone: "9191919191",
    dept: "Operations",
    address: "Connaught Place, New Delhi 110001",
    project: "Process Optimization",
  },
  {
    employeeId: "E1011",
    name: "Neha Singh",
    phone: "9888888888",
    dept: "HR",
    address: "Cyber City, Gurgaon, Haryana 122002",
    project: "Talent Acquisition Portal",
  },
  {
    employeeId: "E1012",
    name: "Karan Mehta",
    phone: "9777777777",
    dept: "Finance",
    address: "Bandra West, Mumbai, Maharashtra 400050",
    project: "Budget Management System",
  },
];

// ===== GLOBAL VARIABLES =====
let employees = [];
let filteredEmployees = [];
let selectedEmployee = null;

// ===== DOM ELEMENTS =====
const elements = {
  // Form elements
  searchForm: document.getElementById("searchForm"),
  employeeIdInput: document.getElementById("employeeId"),
  nameInput: document.getElementById("name"),
  phoneInput: document.getElementById("phone"),
  deptInput: document.getElementById("dept"),

  // Button elements
  searchBtn: document.getElementById("searchBtn"),
  resetBtn: document.getElementById("resetBtn"),
  clearBtn: document.getElementById("clearBtn"),

  // Display elements
  tableBody: document.getElementById("tableBody"),
  employeeView: document.getElementById("employeeView"),
  stats: document.getElementById("stats"),
};

// ===== UTILITY FUNCTIONS =====
function normalizeString(str) {
  return (str || "").toString().toLowerCase().trim();
}

function showMessage(message, type = "info") {
  const className = type === "error" ? "error" : "loading";
  elements.tableBody.innerHTML = `
        <tr>
            <td colspan="4" class="${className}">${message}</td>
        </tr>
    `;
}

// ===== DATA LOADING FUNCTIONS =====

// Load offline data (always works)
function loadOfflineData() {
  console.log("📂 Loading offline employee data...");
  employees = OFFLINE_EMPLOYEES;
  filteredEmployees = [...employees];
  renderTable();
  updateStats();
  console.log(
    "✅ Offline data loaded successfully:",
    employees.length,
    "employees"
  );
}

// Load data from DummyJSON API
async function loadFromDummyJSON() {
  try {
    console.log("🌐 Loading data from DummyJSON API...");
    showMessage("🔄 Loading from DummyJSON API...");

    const response = await fetch(DATA_CONFIG.apis.dummyjson);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📡 DummyJSON API response:", data);

    // Map DummyJSON users to employee format
    employees = data.users.map((user, index) => ({
      employeeId: `E${(index + 1).toString().padStart(4, "0")}`,
      name: `${user.firstName} ${user.lastName}`,
      phone: user.phone || "N/A",
      dept:
        user.company?.department ||
        ["Engineering", "HR", "Sales", "Finance", "Marketing"][index % 5],
      address: user.address
        ? `${user.address.address || ""}, ${user.address.city || ""}`.trim()
        : "N/A",
      project: user.company?.name || `Project ${index + 1}`,
    }));

    filteredEmployees = [...employees];
    renderTable();
    updateStats();
    console.log(
      "✅ DummyJSON data loaded successfully:",
      employees.length,
      "employees"
    );
  } catch (error) {
    console.error("❌ DummyJSON API failed:", error.message);
    throw error;
  }
}

// Load data from JSONPlaceholder API
async function loadFromJSONPlaceholder() {
  try {
    console.log("🌐 Loading data from JSONPlaceholder API...");
    showMessage("🔄 Loading from JSONPlaceholder API...");

    const response = await fetch(DATA_CONFIG.apis.jsonplaceholder);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const users = await response.json();
    console.log("📡 JSONPlaceholder API response:", users);

    // Map JSONPlaceholder users to employee format
    employees = users.slice(0, 10).map((user, index) => ({
      employeeId: `E${(index + 1).toString().padStart(4, "0")}`,
      name: user.name,
      phone: user.phone,
      dept: ["Engineering", "HR", "Sales", "Finance", "Marketing"][index % 5],
      address: `${user.address.street}, ${user.address.city}`,
      project: user.company.name,
    }));

    filteredEmployees = [...employees];
    renderTable();
    updateStats();
    console.log(
      "✅ JSONPlaceholder data loaded successfully:",
      employees.length,
      "employees"
    );
  } catch (error) {
    console.error("❌ JSONPlaceholder API failed:", error.message);
    throw error;
  }
}

// Universal data loader with fallbacks
async function loadEmployeeData() {
  const loaders = {
    offline: () => Promise.resolve(loadOfflineData()),
    "api-dummyjson": loadFromDummyJSON,
    "api-jsonplaceholder": loadFromJSONPlaceholder,
  };

  // Primary data source
  try {
    const primaryLoader = loaders[DATA_CONFIG.source];
    if (primaryLoader) {
      await primaryLoader();
      return;
    }
  } catch (error) {
    console.warn(
      `❌ Primary source (${DATA_CONFIG.source}) failed:`,
      error.message
    );
  }

  // Fallback to offline data if API fails
  if (DATA_CONFIG.source.startsWith("api-")) {
    console.log("🔄 Falling back to offline data...");
    loadOfflineData();
    showMessage("⚠️ Using offline data - API unavailable", "info");
    return;
  }

  // Last resort
  console.error("❌ All data loading methods failed");
  showMessage("❌ Unable to load employee data", "error");
}

// ===== RENDERING FUNCTIONS =====

function renderTable() {
  if (filteredEmployees.length === 0) {
    showMessage("📭 No employees found matching your search criteria", "info");
    return;
  }

  const tableHTML = filteredEmployees
    .map(
      (employee) => `
        <tr data-employee-id="${employee.employeeId}" 
            class="${
              employee.employeeId === selectedEmployee?.employeeId
                ? "selected"
                : ""
            }">
            <td>${employee.employeeId}</td>
            <td>${employee.name}</td>
            <td>${employee.phone}</td>
            <td>${employee.dept}</td>
        </tr>
    `
    )
    .join("");

  elements.tableBody.innerHTML = tableHTML;
}

function renderEmployeeDetails(employee) {
  if (!employee) {
    elements.employeeView.innerHTML = `
            <div class="no-selection">
                Select an employee from the table below
            </div>
        `;
    return;
  }

  selectedEmployee = employee;
  elements.employeeView.innerHTML = `
        <div class="detail-item">
            <span class="detail-label">Employee ID:</span>
            <span class="detail-value">${employee.employeeId}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Name:</span>
            <span class="detail-value">${employee.name}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${employee.phone}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Department:</span>
            <span class="detail-value">${employee.dept}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Address:</span>
            <span class="detail-value">${employee.address}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Project:</span>
            <span class="detail-value">${employee.project}</span>
        </div>
    `;

  renderTable(); // Re-render to show selection
}

function updateStats() {
  const count = filteredEmployees.length;
  elements.stats.textContent = `${count} employee${
    count !== 1 ? "s" : ""
  } found`;
}

// ===== SEARCH & FILTER FUNCTIONS =====

function filterEmployees() {
  const searchCriteria = {
    employeeId: normalizeString(elements.employeeIdInput.value),
    name: normalizeString(elements.nameInput.value),
    phone: normalizeString(elements.phoneInput.value),
    dept: normalizeString(elements.deptInput.value),
  };

  filteredEmployees = employees.filter((employee) => {
    return Object.keys(searchCriteria).every((key) => {
      if (!searchCriteria[key]) return true;
      return normalizeString(employee[key]).includes(searchCriteria[key]);
    });
  });

  // Clear selection if selected employee is not in filtered results
  if (
    selectedEmployee &&
    !filteredEmployees.find(
      (emp) => emp.employeeId === selectedEmployee.employeeId
    )
  ) {
    clearSelection();
    return;
  }

  renderTable();
  updateStats();
}

function resetSearch() {
  elements.searchForm.reset();
  filteredEmployees = [...employees];
  renderTable();
  updateStats();
}

function clearSelection() {
  selectedEmployee = null;
  renderEmployeeDetails(null);
  renderTable();
}

// ===== EVENT HANDLERS =====

function attachEventListeners() {
  // Button clicks
  elements.searchBtn.addEventListener("click", filterEmployees);
  elements.resetBtn.addEventListener("click", resetSearch);
  elements.clearBtn.addEventListener("click", clearSelection);

  // Live search as user types
  [
    elements.employeeIdInput,
    elements.nameInput,
    elements.phoneInput,
    elements.deptInput,
  ].forEach((input) => {
    input.addEventListener("input", filterEmployees);
  });

  // Table row clicks (event delegation)
  elements.tableBody.addEventListener("click", (event) => {
    const row = event.target.closest("tr[data-employee-id]");
    if (row) {
      const employeeId = row.getAttribute("data-employee-id");
      const employee = employees.find((emp) => emp.employeeId === employeeId);
      if (employee) {
        renderEmployeeDetails(employee);
      }
    }
  });

  // Prevent form submission
  elements.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case "f":
          event.preventDefault();
          elements.employeeIdInput.focus();
          break;
        case "r":
          event.preventDefault();
          resetSearch();
          break;
      }
    }
    if (event.key === "Escape") {
      clearSelection();
    }
  });
}

// ===== INITIALIZATION =====

async function initializeApplication() {
  try {
    console.log("🚀 Starting Employee Management System...");
    console.log("📊 Data source:", DATA_CONFIG.source);

    showMessage("🔄 Initializing system...");

    // Load employee data
    await loadEmployeeData();

    // Attach event listeners
    attachEventListeners();

    console.log("✅ Employee Management System initialized successfully!");
  } catch (error) {
    console.error("❌ Failed to initialize application:", error);
    showMessage(
      "❌ System initialization failed. Please refresh the page.",
      "error"
    );
  }
}

// ===== START APPLICATION =====
document.addEventListener("DOMContentLoaded", initializeApplication);
