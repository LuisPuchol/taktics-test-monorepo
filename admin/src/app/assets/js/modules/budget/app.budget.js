import angular from 'angular';
import budgetUrl from './views/budget.index.html';
import budgetController from './controllers/budget.index.controller';

export default angular.module('app.budget', []).config(routeConfig).name;

function routeConfig($stateProvider) {
  $stateProvider.state('budget', {
    url: '/budget',
    templateUrl: budgetUrl,
    controller: budgetController,
    controllerAs: 'vm',
  });
}

routeConfig.$inject = ['$stateProvider'];