// Sample Employee Data - No API needed
const initialEmployees = [
  {
    id: 101,
    name: "Aarav Sharma",
    phone: "9876543210",
    dept: "Engineering",
    address: "12 MG Road, Bengaluru",
    project: "Phoenix",
  },
  {
    id: 102,
    name: "Priya Patel",
    phone: "9811122233",
    dept: "QA",
    address: "220 Aundh, Pune",
    project: "Aurora",
  },
  {
    id: 103,
    name: "Rohit Kumar",
    phone: "9822233344",
    dept: "Engineering",
    address: "55 Andheri, Mumbai",
    project: "Zephyr",
  },
  {
    id: 104,
    name: "Neha Verma",
    phone: "9899988776",
    dept: "HR",
    address: "Sector 18, Noida",
    project: "Onboarding",
  },
  {
    id: 105,
    name: "Vikram Singh",
    phone: "9877700011",
    dept: "Support",
    address: "Charminar, Hyderabad",
    project: "Nimbus",
  },
  {
    id: 106,
    name: "Anita Desai",
    phone: "9834567890",
    dept: "Marketing",
    address: "Fort, Mumbai",
    project: "Brand Campaign",
  },
  {
    id: 107,
    name: "Ravi Gupta",
    phone: "9845678901",
    dept: "Engineering",
    address: "Koramangala, Bengaluru",
    project: "Quantum",
  },
  {
    id: 108,
    name: "Kavya Nair",
    phone: "9856789012",
    dept: "QA",
    address: "Infopark, Kochi",
    project: "Testing Suite",
  },
];

// Vuex Store - No build process needed
const { createStore } = Vuex;

// Employees Module - Handles all employee data and search
const employeesModule = {
  namespaced: true,
  state: {
    employees: [],
    searchFilters: {
      employeeId: "",
      name: "",
      phone: "",
      dept: "",
    },
  },
  getters: {
    // Get all employees
    allEmployees: (state) => state.employees,

    // Get current search filters
    searchFilters: (state) => state.searchFilters,

    // Get filtered employees based on search criteria
    filteredEmployees: (state) => {
      const { employeeId, name, phone, dept } = state.searchFilters;

      return state.employees.filter((employee) => {
        const matchesId =
          !employeeId || employee.id.toString().includes(employeeId);
        const matchesName =
          !name || employee.name.toLowerCase().includes(name.toLowerCase());
        const matchesPhone = !phone || employee.phone.includes(phone);
        const matchesDept = !dept || employee.dept === dept;

        return matchesId && matchesName && matchesPhone && matchesDept;
      });
    },

    // Get employee by ID
    getEmployeeById: (state) => (id) => {
      return state.employees.find((employee) => employee.id === id);
    },

    // Get departments list
    departments: (state) => {
      const depts = [...new Set(state.employees.map((emp) => emp.dept))];
      return depts.sort();
    },
  },
  mutations: {
    // Set all employees
    SET_EMPLOYEES(state, employees) {
      state.employees = employees;
    },

    // Add new employee
    ADD_EMPLOYEE(state, employee) {
      state.employees.push(employee);
    },

    // Update existing employee
    UPDATE_EMPLOYEE(state, updatedEmployee) {
      const index = state.employees.findIndex(
        (emp) => emp.id === updatedEmployee.id
      );
      if (index !== -1) {
        // Use Vue.set equivalent for reactivity
        state.employees[index] = { ...updatedEmployee };
      }
    },

    // Delete employee
    DELETE_EMPLOYEE(state, employeeId) {
      state.employees = state.employees.filter((emp) => emp.id !== employeeId);
    },

    // Update search filters
    UPDATE_SEARCH_FILTERS(state, filters) {
      state.searchFilters = { ...state.searchFilters, ...filters };
    },

    // Clear all search filters
    CLEAR_SEARCH_FILTERS(state) {
      state.searchFilters = {
        employeeId: "",
        name: "",
        phone: "",
        dept: "",
      };
    },
  },
  actions: {
    // Load employees from localStorage or use initial data
    loadEmployees({ commit }) {
      try {
        const savedEmployees = localStorage.getItem("employees");
        if (savedEmployees) {
          const employees = JSON.parse(savedEmployees);
          commit("SET_EMPLOYEES", employees);
        } else {
          commit("SET_EMPLOYEES", initialEmployees);
          localStorage.setItem("employees", JSON.stringify(initialEmployees));
        }
      } catch (error) {
        console.error("Error loading employees:", error);
        commit("SET_EMPLOYEES", initialEmployees);
      }
    },

    // Add new employee
    addEmployee({ commit, state }, employee) {
      // Generate new ID
      const maxId = Math.max(...state.employees.map((emp) => emp.id), 100);
      const newEmployee = { ...employee, id: maxId + 1 };

      commit("ADD_EMPLOYEE", newEmployee);

      // Save to localStorage
      localStorage.setItem("employees", JSON.stringify(state.employees));

      return newEmployee;
    },

    // Update employee
    updateEmployee({ commit, state }, employee) {
      commit("UPDATE_EMPLOYEE", employee);

      // Save to localStorage
      localStorage.setItem("employees", JSON.stringify(state.employees));
    },

    // Delete employee
    deleteEmployee({ commit, state }, employeeId) {
      commit("DELETE_EMPLOYEE", employeeId);

      // Save to localStorage
      localStorage.setItem("employees", JSON.stringify(state.employees));
    },

    // Update search filters
    updateSearchFilters({ commit }, filters) {
      commit("UPDATE_SEARCH_FILTERS", filters);
    },

    // Clear search filters
    clearSearchFilters({ commit }) {
      commit("CLEAR_SEARCH_FILTERS");
    },
  },
};

// UI Module - Handles UI state like modals and editing
const uiModule = {
  namespaced: true,
  state: {
    showViewModal: false,
    selectedEmployee: null,
    isEditing: false,
    editingEmployee: null,
    loading: false,
  },
  getters: {
    showViewModal: (state) => state.showViewModal,
    selectedEmployee: (state) => state.selectedEmployee,
    isEditing: (state) => state.isEditing,
    editingEmployee: (state) => state.editingEmployee,
    loading: (state) => state.loading,
  },
  mutations: {
    SET_VIEW_MODAL(state, show) {
      state.showViewModal = show;
    },
    SET_SELECTED_EMPLOYEE(state, employee) {
      state.selectedEmployee = employee;
    },
    SET_EDITING(state, isEditing) {
      state.isEditing = isEditing;
    },
    SET_EDITING_EMPLOYEE(state, employee) {
      state.editingEmployee = employee;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
  },
  actions: {
    // Show employee details modal
    showEmployeeView({ commit }, employee) {
      commit("SET_SELECTED_EMPLOYEE", employee);
      commit("SET_VIEW_MODAL", true);
    },

    // Hide employee details modal
    hideEmployeeView({ commit }) {
      commit("SET_VIEW_MODAL", false);
      setTimeout(() => {
        commit("SET_SELECTED_EMPLOYEE", null);
      }, 300);
    },

    // Start editing employee
    startEditing({ commit }, employee) {
      commit("SET_EDITING", true);
      commit("SET_EDITING_EMPLOYEE", { ...employee });
    },

    // Stop editing employee
    stopEditing({ commit }) {
      commit("SET_EDITING", false);
      commit("SET_EDITING_EMPLOYEE", null);
    },

    // Set loading state
    setLoading({ commit }, loading) {
      commit("SET_LOADING", loading);
    },
  },
};

// Create Vuex Store
const store = createStore({
  modules: {
    employees: employeesModule,
    ui: uiModule,
  },
});

// Vue 3 Application
const { createApp, ref, computed, watch, onMounted, nextTick } = Vue;

const app = createApp({
  setup() {
    // Template References
    const searchInput = ref(null);
    const nameInput = ref(null);

    // Reactive Data
    const searchFilters = ref({
      employeeId: "",
      name: "",
      phone: "",
      dept: "",
    });

    const employeeForm = ref({
      name: "",
      phone: "",
      dept: "",
      address: "",
      project: "",
    });

    // Computed Properties
    const filteredEmployees = computed(
      () => store.getters["employees/filteredEmployees"]
    );

    const selectedEmployee = computed(
      () => store.getters["ui/selectedEmployee"]
    );

    const showViewModal = computed(() => store.getters["ui/showViewModal"]);

    const isEditing = computed(() => store.getters["ui/isEditing"]);

    const editingEmployee = computed(() => store.getters["ui/editingEmployee"]);

    const loading = computed(() => store.getters["ui/loading"]);

    // Watchers
    // Watch search filters and update store
    watch(
      searchFilters,
      (newFilters) => {
        store.dispatch("employees/updateSearchFilters", newFilters);
      },
      { deep: true }
    );

    // Watch editing employee and populate form
    watch(
      editingEmployee,
      (employee) => {
        if (employee) {
          employeeForm.value = { ...employee };
          // Focus on name input when editing starts
          nextTick(() => {
            if (nameInput.value) {
              nameInput.value.focus();
            }
          });
        }
      },
      { deep: true }
    );

    // Lifecycle Hook
    onMounted(async () => {
      // Load employee data
      await store.dispatch("employees/loadEmployees");

      // Focus on search input
      if (searchInput.value) {
        searchInput.value.focus();
      }
    });

    // Methods
    const viewEmployee = (employee) => {
      store.dispatch("ui/showEmployeeView", employee);
    };

    const closeViewModal = () => {
      store.dispatch("ui/hideEmployeeView");
    };

    const editEmployee = (employee) => {
      store.dispatch("ui/startEditing", employee);
    };

    const editFromModal = () => {
      const employee = selectedEmployee.value;
      closeViewModal();
      setTimeout(() => {
        editEmployee(employee);
      }, 300);
    };

    const cancelEdit = () => {
      store.dispatch("ui/stopEditing");
      resetForm();
    };

    const deleteEmployee = async (employee) => {
      if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
        store.dispatch("ui/setLoading", true);

        // Simulate async operation
        setTimeout(() => {
          store.dispatch("employees/deleteEmployee", employee.id);
          store.dispatch("ui/setLoading", false);
        }, 500);
      }
    };

    const submitEmployee = async () => {
      if (!validateForm()) return;

      store.dispatch("ui/setLoading", true);

      // Simulate async operation
      setTimeout(() => {
        if (isEditing.value) {
          // Update existing employee
          const updatedEmployee = {
            ...editingEmployee.value,
            ...employeeForm.value,
          };
          store.dispatch("employees/updateEmployee", updatedEmployee);
          store.dispatch("ui/stopEditing");
        } else {
          // Add new employee
          store.dispatch("employees/addEmployee", employeeForm.value);
        }

        resetForm();
        store.dispatch("ui/setLoading", false);
      }, 500);
    };

    const resetForm = () => {
      employeeForm.value = {
        name: "",
        phone: "",
        dept: "",
        address: "",
        project: "",
      };
    };

    const validateForm = () => {
      const { name, phone, dept, address, project } = employeeForm.value;

      if (!name.trim()) {
        alert("Name is required");
        return false;
      }

      if (!phone.trim()) {
        alert("Phone number is required");
        return false;
      }

      if (phone.trim().length !== 10 || !/^\d+$/.test(phone.trim())) {
        alert("Please enter a valid 10-digit phone number");
        return false;
      }

      if (!dept) {
        alert("Department is required");
        return false;
      }

      if (!address.trim()) {
        alert("Address is required");
        return false;
      }

      if (!project.trim()) {
        alert("Project is required");
        return false;
      }

      return true;
    };

    const clearSearch = () => {
      searchFilters.value = {
        employeeId: "",
        name: "",
        phone: "",
        dept: "",
      };
      store.dispatch("employees/clearSearchFilters");
    };

    // Return all reactive properties and methods
    return {
      // Template refs
      searchInput,
      nameInput,

      // Reactive data
      searchFilters,
      employeeForm,

      // Computed properties
      filteredEmployees,
      selectedEmployee,
      showViewModal,
      isEditing,
      loading,

      // Methods
      viewEmployee,
      closeViewModal,
      editEmployee,
      editFromModal,
      cancelEdit,
      deleteEmployee,
      submitEmployee,
      clearSearch,
      validateForm,
    };
  },
});

// Mount the app
app.use(store).mount("#app");

// Console message for debugging
console.log("Vue 3 + Vuex Employee Management System loaded successfully!");
console.log(
  "Features: Search, View, Create, Update, Delete with localStorage persistence"
);
