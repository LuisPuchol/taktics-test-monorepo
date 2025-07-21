export default function BudgetController($rootScope, $translate, Budget) {
  const vm = this;

  // Initialize
  vm.budgets = [];
  vm.filters = {
    client: '',
    name: '',
    dateFrom: null,
    dateTo: null
  };

  // Methods
  vm.loadBudgets = loadBudgets;
  vm.applyFilters = applyFilters;
  vm.deleteBudget = deleteBudget;

  // Load budgets on controller init
  activate();

  function activate() {
    loadBudgets();
  }

  function loadBudgets() {
    var filter = buildFilter();
    
    Budget.find({ filter: filter }).$promise
      .then(function(budgets) {
        vm.budgets = budgets;
      })
      .catch(function(error) {
        console.error('Error loading budgets:', error);
      });
  }

  // TODO: hacerlo case-insensitive
  function buildFilter() {
    var where = {};

    if (vm.filters.client) {
      where.clientName = { like: vm.filters.client, options: 'i' };
    }

    if (vm.filters.name) {
      where.name = { like: vm.filters.name, options: 'i' };
    }

    if (vm.filters.dateFrom || vm.filters.dateTo) {
      where.date = {};
      if (vm.filters.dateFrom) {
        where.date.gte = vm.filters.dateFrom;
      }
      if (vm.filters.dateTo) {
        where.date.lte = vm.filters.dateTo;
      }
    }

    var filter = {};
    if (Object.keys(where).length > 0) {
      filter.where = where;
    }

    return filter;
  }

  function applyFilters() {
    loadBudgets();
  }

  function deleteBudget(budget) {
    if (confirm('Are you sure you want to delete this budget?')) {
      Budget.deleteById({ id: budget.id }).$promise
        .then(function() {
          // Remove from local array
          var index = vm.budgets.indexOf(budget);
          
            vm.budgets.splice(index, 1);
          
        })
        .catch(function(error) {
          console.error('Error deleting budget:', error);
          alert('Error deleting budget');
        });
    }
  }
}

BudgetController.$inject = ['$rootScope', '$translate', 'Budget'];