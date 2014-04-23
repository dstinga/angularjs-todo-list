'use strict';

angular.module('todoListApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

  'use strict';

/* Controllers */
var todoListApp = angular.module('todoListApp', []);

todoListApp.controller('TodoCtrl', ['$scope', '$filter', '$location', 'todoStorage', function($scope, $filter, $location, todoStorage) {
  // Reading todos from local storage
  $scope.todos = todoStorage.get();

  /**
   * Counts completed todos
   *
   * @return void
   */
  $scope.setCount = function() {
    $scope.completedCount = $filter('filter')($scope.todos, {
      completed: true
    }).length;

    $scope.remainingCount = $filter('filter')($scope.todos, {
      completed: false
    }).length;
  }

  $scope.setCount();

  /**
   * Adds a new todo
   *
   * @return void
   */
  $scope.addTodo = function() {
    if (!$scope.newTodo) return;

    $scope.todos.push({
      completed: false,
      title: $scope.newTodo
    });

    $scope.newTodo = null;
    todoStorage.set($scope.todos);
    $scope.setCount();
  }

  /**
   * Sets a todo as editing
   * @param {Todo} todo
   *
   * @return void
   */
  $scope.editTodo = function(todo) {
    this.editedTodo = todo;
  }

  /**
   * Saves an edited todo
   * @param {Todo} todo
   *
   * @return void
   */
  $scope.doneEditing = function(todo){
    todoStorage.set($scope.todos);
    this.editedTodo = null;
  }

  /**
   * Completes a todo
   * @param {Todo} todo
   *
   * @return void
   */
  $scope.completeTodo = function(todo) {
    todoStorage.set($scope.todos);
    $scope.setCount();
  }

  /**
   * Performs permanent removal of a todo
   * @param {Todo} todo
   *
   * @return void
   */
  $scope.removeTodo = function(todo) {
    $scope.todos.splice($scope.todos.indexOf(todo), 1);
    todoStorage.set($scope.todos);
    $scope.setCount();
  }

  /**
   * Performs permanent removal of completed todos
   *
   * @return void
   */
  $scope.clearCompletedTodos = function() {
    $scope.todos = $filter('filter')($scope.todos, {
      completed: false
    });
    todoStorage.set($scope.todos);
    $scope.setCount();
  }

  /**
   * Toggles completes todos
   * @param {Boolean} allChecked
   *
   * @return void
   */
  $scope.markAll = function(allChecked) {
      $scope.todos.forEach(function(todo) {
        todo.completed = allChecked;
      });
      todoStorage.set($scope.todos);
      $scope.setCount();
  }

  // Setting a watch for completed todos
  if ($location.path() === '') {
    $location.path('/');
  }
  $scope.location = $location;
  $scope.$watch('location.path()', function (path) {
    $scope.status = path.substr(1);
    $scope.statusFilter = {
      '/active': {
        completed: false
      },
      '/completed': {
        completed: true
      }
    }[path];
  });

  // Setting a watch for checking all todos
  $scope.$watch('completedCount == 0', function (val) {
    $scope.allChecked = val;
  });
}]);

/**
 * Factory for browser's local storage
 */
todoListApp.factory('todoStorage', function() {
  var STORAGE_KEY = 'todo-storage-key';

  return {
    get: function() {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    },
    set: function(data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  };
});
