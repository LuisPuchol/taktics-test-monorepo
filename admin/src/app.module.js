import jQuery from 'jquery/src/jquery';
window.jQuery = jQuery;
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import 'webpack-jquery-ui/css';
import 'webpack-jquery-ui/sortable';
import angular from 'angular';
import 'angular-cookies';
import 'angular-ui-router';
import 'angular-ui-sortable';
import 'angular-animate';
import 'angular-sanitize';
import 'ng-table/dist/ng-table';
import 'angular-simple-logger';
import _ from 'lodash';
window._ = _;
import * as moment from 'moment';
window.moment = moment;
import 'angular-google-maps';
import 'ui-select';
import 'ui-select/dist/select.min.css';
import 'angular-bootstrap-colorpicker';
import 'angular-bootstrap-colorpicker/css/colorpicker.css';
import c3 from 'c3';
import 'c3/c3.min.css';
window.c3 = c3;
import 'c3-angular';
import 'angular-elastic';
import 'angular-strap';
import 'angular-strap/dist/angular-strap.tpl';
import 'angular-ui-bootstrap';
import 'ng-file-upload';
import 'ng-sortable';
import 'angular-local-storage';
import 'angular-translate';
import 'angular-translate-loader-url';
import 'angular-resource';
import 'angular-float-thead';
import './app/assets/js/common/services/lb-services';
import 'angular-native-dragdrop';
import 'angular-ui-tree';
import 'angularjs-dropdown-multiselect';
import './app/assets/js/common/config/app.config';
import './app/assets/js/common/config/app.statics';
import directives from './app/assets/js/common/directives/app.directives';
import sessions from './app/assets/js/modules/sessions/app.sessions';
import MainController from './app/assets/js/common/controllers/main.controller';
import dashboard from './app/assets/js/modules/dashboard/app.dashboard';
import users from './app/assets/js/modules/users/app.users';
import 'gm.datepicker-multi-select';


angular
  .module('app', [
    'ngCookies',
    'ui.router',
    'ngAnimate',
    'ngSanitize',
    'ngTable',
    'nemLogging',
    'uiGmapgoogle-maps',
    'ui.select',
    'gridshore.c3js.chart',
    'monospaced.elastic',
    'mgcrea.ngStrap',
    'ui.bootstrap',
    'ngFileUpload',
    'as.sortable',
    'LocalStorageModule',
    'pascalprecht.translate',
    'ngResource',
    'floatThead',
    'lbServices',
    'ang-drag-drop',
    'ui.tree',
    'angularjs-dropdown-multiselect',
    'colorpicker.module',
    'app.config',
    'app.statics',
    directives,
    sessions,
    dashboard,
    users,
    'ui.sortable',
    'gm.datepickerMultiSelect',
  ])
  .controller('MainController', MainController);
