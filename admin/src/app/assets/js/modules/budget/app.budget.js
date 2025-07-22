import angular from 'angular';
import budgetUrl from './views/budget.index.html';
import budgetDetailsUrl from './views/budget.detail.html';

import BudgetController from './controllers/budget.index.controller';
import BudgetDetailsController from './controllers/budget.detail.controller';

export default angular.module('app.budget', []).config(routeConfig).name;

// Configure routes for budget module
function routeConfig($stateProvider) {
  $stateProvider
      // Budget list view
    .state('budget', {
      url: '/budget',
      templateUrl: budgetUrl,
      controller: BudgetController,
      controllerAs: 'vm',
    })
      // Budget detail/edit view
    .state('budget-detail', {
      url: '/budget/detail/:id',
      templateUrl: budgetDetailsUrl,
      controller: BudgetDetailsController,
      controllerAs: 'vm',
    })
    // Budget creation view (reuses detail template)
    .state('budget-create', {
      url: '/budget/create',
      templateUrl: budgetDetailsUrl,
      controller: BudgetDetailsController,
      controllerAs: 'vm',
    });
}

routeConfig.$inject = ['$stateProvider'];