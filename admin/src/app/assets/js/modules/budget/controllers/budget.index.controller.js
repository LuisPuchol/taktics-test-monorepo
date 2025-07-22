export default function BudgetController($rootScope, $translate, $uibModal, Budget) {
  const vm = this;

  vm.budgets = [];
  vm.filters = {
    client: '',
    name: '',
    dateFrom: null,
    dateTo: null
  };

  vm.loadBudgets = loadBudgets;
  vm.applyFilters = applyFilters;
  vm.resetFilters = resetFilters;
  vm.showDeleteModal = showDeleteModal;
  vm.deleteBudget = deleteBudget;

  activate();

  function activate() {
    loadBudgets();
  }

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

  // TODO: hacerlo case-insensitive
  function buildFilter() {
    const where = {};

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

    const filter = {};
    if (Object.keys(where).length > 0) {
      filter.where = where;
    }

    return filter;
  }

  function applyFilters() {
    loadBudgets();
  }

  function resetFilters() {
    vm.filters = {
      client: '',
      name: '',
      dateFrom: null,
      dateTo: null
    };
    loadBudgets();
  }

  function showDeleteModal(budget) {
    const modalInstance = $uibModal.open({
      template: `
        <div class="modal-header">
          <h4 class="modal-title" id="modal-title">Confirm Delete</h4>
          <button type="button" class="btn-close" aria-label="Close" ng-click="$ctrl.cancel()">
            <span aria-hidden="true">&times;</span>
          </button>
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

    modalInstance.result.then(function(result) {
      if (result === 'delete') {
        deleteBudget(budget);
      }
    }).catch(function(dismissReason) {
      console.log('Delete modal dismissed:', dismissReason);
    });
  }

  function deleteBudget(budget) {
    Budget.deleteById({ id: budget.id }).$promise
      .then(function() {
        const index = vm.budgets.indexOf(budget);
        vm.budgets.splice(index, 1);
    
        console.log('Budget deleted successfully');
      })
      .catch(function(error) {
        console.error('Error deleting budget:', error);
        
        showErrorModal('Error deleting budget. Please try again.');
      });
  }

  function showErrorModal(message) {
    $uibModal.open({
      template: `
        <div class="modal-header">
          <h4 class="modal-title">Error</h4>
        </div>
        <div class="modal-body">
          <div class="alert alert-danger" role="alert">
            <i class="fa fa-exclamation-triangle"></i> ${message}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" type="button" ng-click="$ctrl.ok()">OK</button>
        </div>
      `,
      controller: function($uibModalInstance) {
        const $ctrl = this;
        $ctrl.ok = function() {
          $uibModalInstance.close();
        };
      },
      controllerAs: '$ctrl',
      size: 'sm'
    });
  }
}

function DeleteBudgetModalController($uibModalInstance, budget) {
  const $ctrl = this;
  
  $ctrl.budget = budget;
  
  $ctrl.ok = function() {
    $uibModalInstance.close('delete');
  };
  
  $ctrl.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}

BudgetController.$inject = ['$rootScope', '$translate', '$uibModal', 'Budget'];
DeleteBudgetModalController.$inject = ['$uibModalInstance', 'budget'];