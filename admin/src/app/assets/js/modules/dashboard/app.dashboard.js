import dashboardUrl from './views/dashboard.index.html';
import DashboardController from './controllers/dashboard.index.controller';

export default angular.module('app.dashboard', []).config(routeConfig).name;

function routeConfig($stateProvider) {
  $stateProvider.state('dashboard', {
    url: '/dashboard',
    templateUrl: dashboardUrl,
    controller: DashboardController,
    controllerAs: 'vm',
  });
}

routeConfig.$inject = ['$stateProvider']