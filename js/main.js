/* global $ch */
var LOCAL_STORE = 'dials';
$ch.require(['node', 'event', 'store', 'layout', 'string', './router'], function () {
  'use strict';

  var dials;

  $ch.event.listen('dials', function () {
    // show search form
    $ch.find('form').removeClass('hidden');
    $ch.find('form input[type=text]').focus();

    // add class ch-align-left to dials-div
    $ch.find('#dials-div').removeClass('ch-align-center').addClass('ch-align-left');

    dials = $ch.store.local(LOCAL_STORE) || [{
      img: 'http://4.bp.blogspot.com/-JOqxgp-ZWe0/U3BtyEQlEiI/AAAAAAAAOfg/Doq6Q2MwIKA/s1600/google-logo-874x288.png',
      name: 'Google',
      url: 'http://www.google.com'
    }];

    var htmlBuffer = $ch.string.buffer();
    var dialsTemplate = $ch.find('#dials-template').html();
    $ch.each(dials, function (dial) {
      htmlBuffer.append($ch.template(dialsTemplate, {
        name: dial.name,
        url: dial.url,
        img: dial.img
      }));
    });

    // appending add dial button
    htmlBuffer.append($ch.find('#add-btn-template').html());
    $ch.find('#dials-div').node().html(htmlBuffer.toString(''));
  })
  .listen('setting', function () {
    // hide search form
    $ch.find('form').addClass('hidden');

    // add class ch-align-center to dials-div
    $ch.find('#dials-div').removeClass('ch-align-left').addClass('ch-align-center');

    $ch.find('#dials-div').node().html($ch.find('#setting-template').html());
    var buffer = $ch.string.buffer();
    $ch.each(dials, function (item) {
      buffer.append('\n{');
      buffer.append('\n  "name": "' + item.name + '",');
      buffer.append('\n  "url": "' + item.url + '",');
      buffer.append('\n  "img": "' + item.img + '"');
      buffer.append('\n},');
    });
    var json = buffer.toString('');
    json = json.substr(0, json.length - 1);
    $ch.find('#setting-area').val('[' + json + '\n]');
  })
  .listen('save', function () {
    var code = $ch.find('#setting-area').val().trim();
    if (code.length !== 0) {
      try {
        code = JSON.parse(code);
        $ch.store.local(LOCAL_STORE, code);
        $ch.router.navigate('home');
      } catch (err) {
        alert('Invalid JSON setting.');
        console.log(err);
      }
    }
  });


  $ch.router.add({
    'home': function () {
      $ch.event.emit('dials');
    },

    'setting': function () {
      if (!dials) {
        $ch.event.emit('dials');
      } else {
        $ch.event.emit('setting');
      }
    }
  });

  $ch.router.navigate('home');

});