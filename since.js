define([], function () {

  function Since (selector) {
    this.elements = Array.prototype.slice.call(document.querySelectorAll(selector || '[data-since]'));
    this.interval = 1000 * 30;
  }

  var members = {
    find: function (selector) {
      this.elements = Array.prototype.slice.call(document.querySelectorAll(selector || '[data-since]'));
    },

    addElement: function (element) {
      if (!element) return;
      if (element.length) {
        for (var i=0, len=element.length; i<len; i++) {
          var el = element[i].querySelector('[data-since]') || element[i];
          this.addElement(el);
        }
        return;
      }
      this.elements.push(element);
      this.updateTimeForElement(element);
    },

    update: function () {
      for (var i=0, len=this.elements.length; i<len; i++) {
        this.updateTimeForElement(this.elements[i]);
      }
    },

    updateTimeForElement: function (element) {
      element.innerHTML = this.prettyDate(new Date(element.getAttribute('data-since')));
    },

    prettyDate: function  (date) {
      var diff = ((new Date()).getTime() - date.getTime()) / 1000;
      var day_diff = Math.floor(diff / 86400);

      if (isNaN(day_diff)) return '';

      if (day_diff < 0) return 'Today';
      else if (day_diff === 0) {
        if (diff < 60) return 'just now';
        else if (diff < 120) return '1 minute ago';
        else if (diff < 3600) return Math.floor(diff / 60) + ' minutes ago';
        else if (diff < 7200) return '1 hour ago';
        else if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
      }
      else if (day_diff === 1) return 'yesterday';
      else if (day_diff < 7) return day_diff + ' days ago';
      else if (day_diff >= 7) return Math.ceil(day_diff / 7) + ' weeks ago';
      return '';
    },

    run: function () {
      var self = this;
      self.currentTimeout = setTimeout(function () {
        self.update();
        self.run();
      }, self.interval);
    },

    stop: function () {
      clearTimeout(this.currentTimeout);
    }
  };

  for (var key in members) {
    if (members.hasOwnProperty(key)) {
      Since.prototype[key] = members[key];
    }
  }

  return new Since();
});