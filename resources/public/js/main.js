(function() {
  "use strict";

  var app = angular.module("TodosApp", []); //namespace or package
  // app.controller( "", function(){} ); DON'T DO THIS!

  // app.service("MyService", [
  //   new function() {
  //     this.name = "Jason";
  //   }
  // ]);

  app.factory("TodoService", [
    "$http",
    function($http) {
      function getTodos() {
        return $http.get("/todos")
          .then(handleSuccess, handleError);
      }

      function addTodo(todo) {
        return $http.post("/todos", {text: todo.text})
          .then(handleSuccess, handleError);
      }

      function deleteTodo(deleteme, todos) {
        return $http.delete("/todos/" + deleteme.id)
          .then(handleSuccess, handleError);
      }

      function finishTodo(todo) {
        if (todo.done) {
          delete todo.done;
        } else {
          todo.done = new Date().getTime();
        }
        return $http.put("/todos/" + todo.id, todo)
          .then(function() {}, handleError);
      }

      function handleSuccess(response) {
        return response.data;
      }

      function handleError(error) {
        console.log("error=",error);
      }

      return {
        getTodos: getTodos,
        addTodo: addTodo,
        deleteTodo: deleteTodo,
        finishTodo: finishTodo
      };
    }
  ]);

  // do not use the $scope object...it is not properly protected from accessing the global scope
  //   this is fixed in Angular 2
  app.controller("MainCtrl", [
    "TodoService",
    function(todoSvc) {
      var vm = this;
      var refresh = function() {
        todoSvc.getTodos().then(function(todos) {
          vm.todos = todos;
          console.log(todos[0]);
        }, function(error) {
          console.log("error=",error);
        });
      };
      // vm.todos = todoSvc.getTodos();
      refresh();

      vm.addTodo = function(todo) {
        todoSvc.addTodo(todo).then(refresh);
        todo.text = "";
      };

      vm.deleteTodo = function(todo) {
        todoSvc.deleteTodo(todo).then(refresh);
      };

      vm.finishTodo = function(todo) {
        todoSvc.finishTodo(todo).then(refresh);
      };
    }
  ]);

  // app.controller("CounterCtrl", [
  //   "TodoService",
  //   function(todoSvc) {
  //     var vm = this;
  //     todoSvc.getTodos().then(function(success) {
  //       vm.todos = success;
  //     }, function(err) {});
  //   }
  // ]);

})();
