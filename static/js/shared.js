(function() {
  var send_search;

  this.Flash = (function() {
    function Flash(div_id) {
      this.div_id = div_id;
      this.stack = [];
      this.timeout = 5000;
      this.init_div();
    }

    Flash.prototype.init_div = function() {
      var e;
      e = $("<div id='" + this.div_id + "'></div>");
      e.appendTo('html');
      return this.base_el = $("#" + this.div_id);
    };

    Flash.prototype.show = function(message) {
      var el, t, that;
      el = $("<div class='child'>" + message + "</div>");
      el.appendTo(this.base_el);
      that = this;
      t = window.setTimeout(function() {
        return that.hide(el);
      }, this.timeout);
      return this.stack.push({
        t: t,
        el: el
      });
    };

    Flash.prototype.hide = function(item, clean) {
      var i, new_stack, _i, _len, _ref;
      new_stack = [];
      _ref = this.stack;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if (i.el === item) {
          i.el.remove();
          window.clearTimeout(i.t);
        } else {
          if (!clean) {
            new_stack.push(i);
          }
        }
      }
      if (!clean) {
        return this.stack = new_stack;
      }
    };

    Flash.prototype.hide_all = function() {
      var s, _i, _len, _ref, _results;
      _ref = this.stack;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        this.hide(s.el(true));
        _results.push(window.clearTimeout(s.t));
      }
      return _results;
    };

    return Flash;

  })();

  $('[data-href]').on('click', function() {
    return document.location.href = $(this).data('href');
  });

  this.set_get_param = function(name_, value_) {
    var addr, e, erase, k, n, name, new_params, obj, obj_, param, params, url, v, value, _i, _j, _len, _len1;
    obj = {};
    if (typeof name_ !== 'object') {
      obj[name_] = value_;
    } else {
      obj = name_;
    }
    url = document.location.href.split('?');
    addr = url.shift();
    new_params = {};
    erase = [];
    for (n in obj) {
      v = obj[n];
      if (!v || v === 'null' || v === '') {
        erase.push(n);
      }
    }
    if (url.length === 0 || url[0] === '') {
      for (name in obj) {
        value = obj[name];
        new_params[name] = value;
      }
    } else {
      params = url[0].split('&');
      obj_ = obj;
      for (_i = 0, _len = params.length; _i < _len; _i++) {
        param = params[_i];
        param = param.split('=');
        for (name in obj) {
          value = obj[name];
          if (param[0] === name) {
            param[1] = value;
            delete obj_[name];
          }
        }
        if (param[0] && param[1]) {
          new_params[param[0]] = param[1];
        }
      }
      for (name in obj_) {
        value = obj_[name];
        new_params[name] = value;
      }
    }
    for (_j = 0, _len1 = erase.length; _j < _len1; _j++) {
      e = erase[_j];
      delete new_params[e];
    }
    params = [];
    for (k in new_params) {
      v = new_params[k];
      params.push("" + k + "=" + v);
    }
    new_params = params.join('&');
    return document.location.href = "" + addr + "?" + new_params;
  };

  send_search = function() {
    var val;
    val = $('.search').val();
    if (!val) {
      return set_get_param({
        query: 'null',
        page: 'null'
      });
    } else {
      return set_get_param({
        query: val,
        page: 'null'
      });
    }
  };

  $(document).ready(function() {
    $('.search').on('blur', function() {
      return send_search();
    });
    return $('.search').on('keypress', function(e) {
      if (e.which === 13) {
        return send_search();
      }
    });
  });

}).call(this);
