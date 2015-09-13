angular.module('openboard', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate', 'ngResource']);

angular.module('openboard').config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'partial/home/home.html'
  });
  $stateProvider.state('dashboard', {
        url: '/b/:id',
        templateUrl: 'partial/dashboard/dashboard.html'
    });
  /* Add New States Above */
  $urlRouterProvider.otherwise('/');

});

angular.module('openboard').run(function ($rootScope) {

  $rootScope.safeApply = function (fn) {
    var phase = $rootScope.$$phase;
    if (phase === '$apply' || phase === '$digest') {
      if (fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

});
