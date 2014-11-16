/* global $ch, CodeMirror */
$ch.require(['./scope', 'node', 'event', 'store', 'layout', 'string', './router'], function () {
  'use strict';

  $ch.scope('dialScope', function ($scope) {
    var LOCAL_STORE = 'dials';

    $ch.event.listen('dials', function ($scope) {
      $scope.dials = $ch.store.local(LOCAL_STORE) || [{
        img: 'http://4.bp.blogspot.com/-JOqxgp-ZWe0/U3BtyEQlEiI/AAAAAAAAOfg/Doq6Q2MwIKA/s1600/google-logo-874x288.png',
        name: 'Google',
        url: 'http://www.google.com'
      }];

      // show search form
      $scope.form.removeClass('hidden');
      $scope.input.focus();

      // add class ch-align-left to dials-div
      $scope.dialsDiv.removeClass('ch-align-center').addClass('ch-align-left');

      var htmlBuffer = $ch.string.buffer();
      var dialsTemplate = $scope.dialsTemplate.html();
      $ch.each($scope.dials, function (dial) {
        htmlBuffer.append($ch.template(dialsTemplate, {
          name: dial.name,
          url: dial.url,
          img: dial.img
        }));
      });

      // appending add dial button
      htmlBuffer.append($scope.addBtnTemplate.html());
      $scope.dialsDiv.node().html(htmlBuffer.toString(''));
    })
    .listen('setting', function ($scope) {
      // hide search form
      $scope.form.addClass('hidden');

      // add class ch-align-center to dials-div
      $scope.dialsDiv.removeClass('ch-align-left').addClass('ch-align-center');

      $scope.dialsDiv.node().html($ch.find('#setting-template').html());
      var buffer = $ch.string.buffer();
      $ch.each($scope.dials, function (item) {
        buffer.append('\n{');
        buffer.append('\n  "name": "' + item.name + '",');
        buffer.append('\n  "url": "' + item.url + '",');
        buffer.append('\n  "img": "' + item.img + '"');
        buffer.append('\n},');
      });
      var json = buffer.toString('');
      json = json.substr(0, json.length - 1);
      var editor = $scope.settingArea;
      editor.val('[' + json + '\n]');
      editor = CodeMirror.fromTextArea(editor.el, {
        lineNumbers: true,
        matchBrackets: true,
        continueComments: 'Enter'
      });
      $ch.source('editor', editor);
    })
    .listen('save', function () {
      var code = $ch.source('editor').getValue().trim();
      if (code.length !== 0) {
        try {
          code = JSON.parse(code);
          $ch.store.local(LOCAL_STORE, code);
          $ch.router.navigate('home');
        } catch (err) {
          $scope.messageDiv.html('Error: ' + err.message);
          console.log(err);
        }
      }
    });

    $ch.router.add({
      'home': function () {
        $ch.event.emit('dials', $scope);
      },

      'setting': function () {
        if (!$scope.dials) {
          $ch.event.emit('dials', $scope);
        } else {
          $ch.event.emit('setting', $scope);
        }
      }
    });

    $ch.router.navigate('home');

  });

});