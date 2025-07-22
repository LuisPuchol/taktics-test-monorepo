export default function BudgetController($rootScope, $translate, $uibModal, Budget) {
  const vm = this;

  // Initialize properties
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
  vm.resetFilters = resetFilters;
  vm.showDeleteModal = showDeleteModal;
  vm.deleteBudget = deleteBudget;

  activate();

  // Initialize controller
  function activate() {
    loadBudgets();
  }

  // Load budgets from backend with current filters applied
  function loadBudgets() {
    const filter = buildFilter();
    
    Budget.find({ filter: filter }).$promise
      .then(function(budgets) {
        vm.budgets = budgets;
      })
      .catch(function(error) {
        console.error('Error loading budgets:', error);
      });
  }

  // Build LoopBack filter object from form filters (option: 'i' didnt work)
  function buildFilter() {
    const where = {};

    // Apply client name filter
    if (vm.filters.client) {
      where.clientName = { regexp: `/${vm.filters.client}/i` };
    }

    // Apply budget name filter
    if (vm.filters.name) {
      where.name = { regexp: `/${vm.filters.name}/i` };
    }

    // Add date range filter
    if (vm.filters.dateFrom || vm.filters.dateTo) {
      where.date = {};
      if (vm.filters.dateFrom) {
        where.date.gte = vm.filters.dateFrom;
      }
      if (vm.filters.dateTo) {
        where.date.lte = vm.filters.dateTo;
      }
    }

    const filter = {};
    if (Object.keys(where).length > 0) {
      filter.where = where;
    }

    return filter;
  }

  // Apply current filters and reload budgets
  function applyFilters() {
    loadBudgets();
  }

  // Clear all filters and reload budgets
  function resetFilters() {
    vm.filters = {
      client: '',
      name: '',
      dateFrom: null,
      dateTo: null
    };
    loadBudgets();
  }

  // Show confirmation modal before deleting budget
  function showDeleteModal(budget) {
    const modalInstance = $uibModal.open({
      template: `
        <div class="modal-header">
          <h4 class="modal-title" id="modal-title">Confirm Delete</h4>
        </div>
        <div class="modal-body" id="modal-body">
          <p>Are you sure you want to delete the budget <strong>"${budget.name}"</strong>?</p>
          <p class="text-muted">This action cannot be undone.</p>
          <div class="alert alert-warning" role="alert">
            <strong>Warning:</strong> All chapters and batches associated with this budget will also be deleted.
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" ng-click="$ctrl.cancel()">Cancel</button>
          <button class="btn btn-danger" type="button" ng-click="$ctrl.ok()">
            <i class="fa fa-trash"></i> Delete Budget
          </button>
        </div>
      `,
      controller: DeleteBudgetModalController,
      controllerAs: '$ctrl',
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      resolve: {
        budget: function() {
          return budget;
        }
      }
    });

    // Handle modal result
    modalInstance.result.then(function(result) {
      if (result === 'delete') {
        deleteBudget(budget);
      }
    }).catch(function(dismissReason) {
      console.log('Delete modal dismissed:', dismissReason);
    });
  }

  // Delete budget from backend and update local list
  function deleteBudget(budget) {
    Budget.deleteById({ id: budget.id }).$promise
      .then(function() {
        // Remove from local array
        const index = vm.budgets.indexOf(budget);
        vm.budgets.splice(index, 1);
    
        alert('Budget deleted successfully');
      })
      .catch(function(error) {
        console.error('Error deleting budget:', error);
        alert('Error deleting budget. Please try again.');
      });
  }
}

// Controller for delete confirmation modal
function DeleteBudgetModalController($uibModalInstance, budget) {
  const $ctrl = this;
  
  $ctrl.budget = budget;
  
  // Confirm deletion
  $ctrl.ok = function() {
    $uibModalInstance.close('delete');
  };
  
  // Cancel deletion
  $ctrl.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}

BudgetController.$inject = ['$rootScope', '$translate', '$uibModal', 'Budget'];
DeleteBudgetModalController.$inject = ['$uibModalInstance', 'budget'];