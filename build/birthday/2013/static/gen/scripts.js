var Format, Utils, Widget, isDefined,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.serious = {};

window.serious.Utils = {};

isDefined = function(obj) {
  return typeof obj !== 'undefined' && obj !== null;
};

jQuery.fn.opacity = function(int) {
  return $(this).css({
    opacity: int
  });
};

window.serious.Utils.clone = function(obj) {
  var flags, key, newInstance;
  if ((obj == null) || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  if (obj instanceof RegExp) {
    flags = '';
    if (obj.global != null) {
      flags += 'g';
    }
    if (obj.ignoreCase != null) {
      flags += 'i';
    }
    if (obj.multiline != null) {
      flags += 'm';
    }
    if (obj.sticky != null) {
      flags += 'y';
    }
    return new RegExp(obj.source, flags);
  }
  newInstance = new obj.constructor();
  for (key in obj) {
    newInstance[key] = window.serious.Utils.clone(obj[key]);
  }
  return newInstance;
};

jQuery.fn.cloneTemplate = function(dict, removeUnusedField) {
  var klass, nui, value;
  if (removeUnusedField == null) {
    removeUnusedField = false;
  }
  nui = $(this[0]).clone();
  nui = nui.removeClass("template hidden").addClass("actual");
  if (typeof dict === "object") {
    for (klass in dict) {
      value = dict[klass];
      if (value !== null) {
        nui.find(".out." + klass).html(value);
      }
    }
    if (removeUnusedField) {
      nui.find(".out").each(function() {
        if ($(this).html() === "") {
          return $(this).remove();
        }
      });
    }
  }
  return nui;
};

Object.size = function(obj) {
  var key, size;
  size = 0;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      size++;
    }
  }
  return size;
};

window.serious.Widget = (function() {
  function Widget() {
    this.applyState = __bind(this.applyState, this);
    this.setState = __bind(this.setState, this);
    this.cloneTemplate = __bind(this.cloneTemplate, this);
    this.show = __bind(this.show, this);
    this.hide = __bind(this.hide, this);
    this.set = __bind(this.set, this);
  }

  Widget.bindAll = function() {
    var first, firsts, _i, _len;
    firsts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (firsts) {
      for (_i = 0, _len = firsts.length; _i < _len; _i++) {
        first = firsts[_i];
        Widget.ensureWidget($(first));
      }
    }
    return $(".widget").each(function() {
      var self;
      self = $(this);
      if (!self.hasClass('template') && !self.parents().hasClass('template')) {
        return Widget.ensureWidget(self);
      }
    });
  };

  Widget.ensureWidget = function(ui) {
    var widget, widget_class;
    ui = $(ui);
    if (!ui.length) {
      return null;
    } else if (ui[0]._widget != null) {
      return ui[0]._widget;
    } else {
      widget_class = Widget.getWidgetClass(ui);
      if (widget_class != null) {
        widget = new widget_class();
        widget.bindUI(ui);
        return widget;
      } else {
        console.warn("widget not found for", ui);
        return null;
      }
    }
  };

  Widget.getWidgetClass = function(ui) {
    return eval("(" + $(ui).attr("data-widget") + ")");
  };

  Widget.prototype.bindUI = function(ui) {
    var action, annotated, expected, key, node, nui, value, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
    this.ui = $(ui);
    if (this.ui[0]._widget) {
      delete this.ui[0]._widget;
    }
    this.ui[0]._widget = this;
    this.uis = {};
    if (typeof this.UIS !== "undefined") {
      _ref = this.UIS;
      for (key in _ref) {
        value = _ref[key];
        nui = this.ui.find(value);
        if (nui.length < 1) {
          console.warn("uis", key, "not found in", ui);
        }
        this.uis[key] = nui;
      }
    }
    if (this.ACTIONS != null) {
      _ref1 = this.ACTIONS;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        action = _ref1[_i];
        this._bindClick(this.ui.find(".do[data-action=" + action + "]"), action);
      }
    }
    this._states = {};
    if (this.STATES != null) {
      _ref2 = this.STATES;
      _results = [];
      for (key in _ref2) {
        value = _ref2[key];
        this._states[key] = {};
        annotated = this.ui.find(".when-" + key);
        if (annotated.length < 1) {
          console.warn("state", key, "not found in", ui);
        }
        for (_j = 0, _len1 = annotated.length; _j < _len1; _j++) {
          node = annotated[_j];
          node = $(node);
          this._states[key][node] = {
            expected: node.data('state') || true,
            current: value
          };
        }
        annotated = this.ui.find(".when_not-" + key);
        if (annotated.length < 1) {
          console.warn("state", key, "not found in", ui);
        }
        for (_k = 0, _len2 = annotated.length; _k < _len2; _k++) {
          node = annotated[_k];
          node = $(node);
          expected = node.data('state');
          if (expected == null) {
            expected = false;
          } else {
            expected = '!' + expected;
          }
          this._states[key][node] = {
            expected: expected,
            current: value
          };
        }
        _results.push(this.applyState(key));
      }
      return _results;
    }
  };

  Widget.prototype.set = function(field, value, context) {
    /* Set a value to all tag with the given data-field attribute.
    		Field can be a dict or a field name.
    		If it is a dict, the second parameter should be a context.
    		The default context is the widget itself.
    */

    var name, _value;
    if (typeof field === "object") {
      context = value || this.ui;
      for (name in field) {
        _value = field[name];
        context.find("[data-field=" + name + "]").html(_value);
      }
    } else {
      context = context || this.ui;
      context.find("[data-field=" + field + "]").html(value);
    }
    return context;
  };

  Widget.prototype.hide = function() {
    return this.ui.addClass("hidden");
  };

  Widget.prototype.show = function() {
    return this.ui.removeClass("hidden");
  };

  Widget.prototype.cloneTemplate = function(template_nui, dict, removeUnusedField) {
    var action, klass, nui, value, _i, _len, _ref;
    if (removeUnusedField == null) {
      removeUnusedField = false;
    }
    nui = template_nui.clone();
    nui = nui.removeClass("template hidden").addClass("actual");
    if (typeof dict === "object") {
      for (klass in dict) {
        value = dict[klass];
        if (value !== null) {
          nui.find(".out." + klass).html(value);
        }
      }
      if (removeUnusedField) {
        nui.find(".out").each(function() {
          if ($(this).html() === "") {
            return $(this).remove();
          }
        });
      }
    }
    if (this.ACTIONS != null) {
      _ref = this.ACTIONS;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        action = _ref[_i];
        this._bindClick(nui.find(".do[data-action=" + action + "]"), action);
      }
    }
    return nui;
  };

  Widget.prototype._bindClick = function(nui, action) {
    var _this = this;
    if ((action != null) && __indexOf.call(this.ACTIONS, action) >= 0) {
      return nui.click(function(e) {
        _this[action](e);
        return e.preventDefault();
      });
    }
  };

  Widget.prototype.setState = function(key, value) {
    if (this._states != null) {
      if (this._states[key] != null) {
        this._states[key]['current'] = value;
        return this.applyState(key);
      }
    }
  };

  Widget.prototype.applyState = function(key) {
    var annotated, values, _ref, _results;
    if ((this._states != null) && (this._states[key] != null)) {
      _ref = this._states[key];
      _results = [];
      for (annotated in _ref) {
        values = _ref[annotated];
        console.log($(annotated), values);
        if (typeof values.expected === 'string' && values.expected[0] === '!') {
          _results.push($(annotated).toggleClass('hidden', values.expected.slice(1) === values.current));
        } else {
          _results.push($(annotated).toggleClass('hidden', values.expected !== values.current));
        }
      }
      return _results;
    }
  };

  return Widget;

})();

window.serious.URL = (function() {
  function URL() {
    this.toString = __bind(this.toString, this);
    this.fromString = __bind(this.fromString, this);
    this.enableDynamicLinks = __bind(this.enableDynamicLinks, this);
    this.updateUrl = __bind(this.updateUrl, this);
    this.hasBeenAdded = __bind(this.hasBeenAdded, this);
    this.hasChanged = __bind(this.hasChanged, this);
    this.remove = __bind(this.remove, this);
    this.update = __bind(this.update, this);
    this.set = __bind(this.set, this);
    this.onStateChanged = __bind(this.onStateChanged, this);
    this.get = __bind(this.get, this);
    var _this = this;
    this.previousHash = [];
    this.handlers = [];
    this.hash = this.fromString(location.hash);
    $(window).hashchange(function() {
      var handler, _i, _len, _ref, _results;
      _this.previousHash = window.serious.Utils.clone(_this.hash);
      _this.hash = _this.fromString(location.hash);
      _ref = _this.handlers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handler = _ref[_i];
        _results.push(handler());
      }
      return _results;
    });
  }

  URL.prototype.get = function(field) {
    if (field == null) {
      field = null;
    }
    if (field) {
      return this.hash[field];
    } else {
      return this.hash;
    }
  };

  URL.prototype.onStateChanged = function(handler) {
    return this.handlers.push(handler);
  };

  URL.prototype.set = function(fields, silent) {
    var hash, key, value;
    if (silent == null) {
      silent = false;
    }
    hash = silent ? this.hash : window.serious.Utils.clone(this.hash);
    hash = [];
    for (key in fields) {
      value = fields[key];
      if (isDefined(value)) {
        hash[key] = value;
      }
    }
    return this.updateUrl(hash);
  };

  URL.prototype.update = function(fields, silent) {
    var hash, key, value;
    if (silent == null) {
      silent = false;
    }
    hash = silent ? this.hash : window.serious.Utils.clone(this.hash);
    for (key in fields) {
      value = fields[key];
      if (isDefined(value)) {
        hash[key] = value;
      } else {
        delete hash[key];
      }
    }
    return this.updateUrl(hash);
  };

  URL.prototype.remove = function(key, silent) {
    var hash;
    if (silent == null) {
      silent = false;
    }
    hash = silent ? this.hash : window.serious.Utils.clone(this.hash);
    if (hash[key]) {
      delete hash[key];
    }
    return this.updateUrl(hash);
  };

  URL.prototype.hasChanged = function(key) {
    if (this.hash[key] != null) {
      if (this.previousHash[key] != null) {
        return this.hash[key].toString() !== this.previousHash[key].toString();
      } else {
        return true;
      }
    } else {
      if (this.previousHash[key] != null) {
        return true;
      }
    }
    return false;
  };

  URL.prototype.hasBeenAdded = function(key) {
    return console.error("not implemented");
  };

  URL.prototype.updateUrl = function(hash) {
    if (hash == null) {
      hash = null;
    }
    if (!hash || Object.size(hash) === 0) {
      return location.hash = '_';
    } else {
      return location.hash = this.toString(hash);
    }
  };

  URL.prototype.enableDynamicLinks = function(context) {
    var _this = this;
    if (context == null) {
      context = null;
    }
    return $("a.internal[href]", context).click(function(e) {
      var href, link;
      link = $(e.currentTarget);
      href = link.attr("data-href") || link.attr("href");
      if (href[0] === "#") {
        if (href.length > 1 && href[1] === "+") {
          _this.update(_this.fromString(href.slice(2)));
        } else if (href.length > 1 && href[1] === "-") {
          _this.remove(_this.fromString(href.slice(2)));
        } else {
          _this.set(_this.fromString(href.slice(1)));
        }
      }
      return false;
    });
  };

  URL.prototype.fromString = function(value) {
    var hash, hash_list, item, key, key_value, val, _i, _len;
    value = value || location.hash;
    hash = {};
    value = value.replace('!', '');
    hash_list = value.split("&");
    for (_i = 0, _len = hash_list.length; _i < _len; _i++) {
      item = hash_list[_i];
      if (item != null) {
        key_value = item.split("=");
        if (key_value.length === 2) {
          key = key_value[0].replace("#", "");
          val = key_value[1].replace("#", "");
          hash[key] = val;
        }
      }
    }
    return hash;
  };

  URL.prototype.toString = function(hash_list) {
    var i, key, new_hash, value;
    if (hash_list == null) {
      hash_list = null;
    }
    hash_list = hash_list || this.hash;
    new_hash = "!";
    i = 0;
    for (key in hash_list) {
      value = hash_list[key];
      if (i > 0) {
        new_hash += "&";
      }
      new_hash += key + "=" + value;
      i++;
    }
    return new_hash;
  };

  return URL;

})();

window.network = {};

Widget = window.serious.Widget;

Format = window.serious.format;

Utils = window.serious.Utils;

network.Map = (function(_super) {
  __extends(Map, _super);

  function Map() {
    this.closeAll = __bind(this.closeAll, this);
    this.allclick = __bind(this.allclick, this);
    this.jppclick = __bind(this.jppclick, this);
    this.eventclick = __bind(this.eventclick, this);
    this.companyclick = __bind(this.companyclick, this);
    this.personclick = __bind(this.personclick, this);
    this.viewEurope = __bind(this.viewEurope, this);
    this.viewGlobal = __bind(this.viewGlobal, this);
    this.move = __bind(this.move, this);
    this.renderCountries = __bind(this.renderCountries, this);
    this.hideLegend = __bind(this.hideLegend, this);
    this.showLegend = __bind(this.showLegend, this);
    this.unStickMembers = __bind(this.unStickMembers, this);
    this.stickMembers = __bind(this.stickMembers, this);
    this.closeCircle = __bind(this.closeCircle, this);
    this.openCircle = __bind(this.openCircle, this);
    this.renderEntries = __bind(this.renderEntries, this);
    this.computeEntries = __bind(this.computeEntries, this);
    this.loadedDataCallback = __bind(this.loadedDataCallback, this);
    this.getBoundingBox = __bind(this.getBoundingBox, this);
    this.init_size = __bind(this.init_size, this);
    this.bindUI = __bind(this.bindUI, this);
    this.relayout = __bind(this.relayout, this);
    this.OPTIONS = {
      map_ratio: .5,
      litle_radius: 5,
      big_radius: 23
    };
    this.UIS = {
      panel: '.Panel'
    };
    this.Page = $(".Page");
    this.ACTIONS = ['jppclick', 'closeAll', 'companyclick', 'allclick', 'personclick', 'eventclick', 'ffctnclick', 'datastoryclick'];
    this.projection = void 0;
    this.groupPaths = void 0;
    this.path = void 0;
    this.force = void 0;
    this.width = void 0;
    this.height = void 0;
    this.hideLegendTimer = void 0;
    this.initialRotation = [0, -30, 0];
  }

  Map.prototype.relayout = function() {
    this.width = this.Page.width();
    this.height = this.width * this.OPTIONS.map_ratio;
    return this.ui.css({
      width: this.width,
      height: this.height
    });
  };

  Map.prototype.bindUI = function(ui) {
    var graticule,
      _this = this;
    Map.__super__.bindUI.apply(this, arguments);
    this.relayout();
    $(window).on('resize', this.relayout);
    this.svg = d3.select(this.ui.get(0)).insert("svg", ":first-child").on("mousedown", function() {
      if (_this.legendBlocked) {
        return _this.hideLegend(true)();
      }
    });
    this.projection = d3.geo.mercator().rotate(this.initialRotation);
    this.path = d3.geo.path().projection(this.projection);
    this.groupPaths = this.svg.append("g").attr("class", "all-path");
    graticule = d3.geo.graticule();
    this.groupPaths.append("path").datum(graticule).attr("class", "graticule").attr("d", this.path);
    d3.select(window).on('resize', this.init_size);
    return queue().defer(d3.json, "static/data/world.json").defer(d3.json, "static/data/entries.json").await(this.loadedDataCallback);
  };

  Map.prototype.init_size = function() {
    var bounds, center, height, hscale, scale, vscale;
    this.relayout();
    if (this.projection != null) {
      bounds = this.getBoundingBox();
      hscale = 150 * this.width / (bounds[1][0] - bounds[0][0]);
      vscale = 150 * this.height / (bounds[1][1] - bounds[0][1]);
      scale = Math.min(hscale, vscale);
      this.scale = scale;
      center = this.projection.invert([(bounds[1][0] + bounds[0][0]) / 2, (bounds[1][1] + bounds[0][1]) / 2]);
      this.projection.translate([this.width / 2, this.height / 2]).scale(this.scale).center([center[0], center[1] - 30]);
    }
    if (this.svg != null) {
      this.svg.style('width', this.width + 'px').style('height', this.height + 'px');
      this.svg.selectAll('.country').attr('d', this.path);
      this.svg.selectAll('.graticule').attr('d', this.path);
    }
    if (this.entries != null) {
      this.entries = this.computeEntries(this.entries);
    }
    if (this.force != null) {
      this.force.stop().start();
    }
    height = this.height * 0.3;
    return this.uis.panel.css({
      height: height,
      width: this.width + 5,
      top: -height - 3
    });
  };

  Map.prototype.getBoundingBox = function(filter) {
    var coords, e, maxX, maxY, minX, minY, padding, _i, _len, _ref;
    coords = [];
    padding = 30;
    _ref = this.entries;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      e = _ref[_i];
      if (filter != null) {
        if (e.name === filter) {
          coords.push([e.qx, e.qy]);
        }
      } else {
        coords.push([e.qx, e.qy]);
      }
    }
    maxY = d3.max(coords, function(e) {
      return e[1];
    });
    maxX = d3.max(coords, function(e) {
      return e[0];
    });
    minY = d3.min(coords, function(e) {
      return e[1];
    });
    minX = d3.min(coords, function(e) {
      return e[0];
    });
    return [[minX - padding, minY - padding], [maxX + padding, maxY + padding]];
  };

  Map.prototype.loadedDataCallback = function(error, worldTopo, entries) {
    this.countries = topojson.feature(worldTopo, worldTopo.objects.countries);
    this.entries = this.computeEntries(entries);
    this.init_size();
    this.renderCountries();
    return this.renderEntries();
  };

  Map.prototype.computeEntries = function(entries) {
    var coord, entry, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = entries.length; _i < _len; _i++) {
      entry = entries[_i];
      coord = entry.geo ? this.projection([entry.geo.lon, entry.geo.lat]) : [0, 0];
      entry.qx = coord[0];
      entry.qy = coord[1];
      entry.gx = entry.qx;
      entry.gy = entry.qy;
      if (!entry.radius) {
        entry.radius = this.OPTIONS.litle_radius;
      }
      _results.push(entry);
    }
    return _results;
  };

  Map.prototype.collide = function(alpha) {
    var quadtree;
    quadtree = d3.geom.quadtree(this.entries);
    return function(d) {
      var nx1, nx2, ny1, ny2, r;
      r = d.radius;
      nx1 = d.x - r;
      nx2 = d.x + r;
      ny1 = d.y - r;
      ny2 = d.y + r;
      d.x += (d.gx - d.x) * alpha * 0.1;
      d.y += (d.gy - d.y) * alpha * 0.1;
      return quadtree.visit(function(quad, x1, y1, x2, y2) {
        var l, x, y;
        if (quad.point && quad.point !== d) {
          x = d.x - quad.point.x;
          y = d.y - quad.point.y;
          l = Math.sqrt(x * x + y * y);
          r = d.radius + quad.point.radius;
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  };

  Map.prototype.renderEntries = function() {
    var that,
      _this = this;
    that = this;
    this.force = d3.layout.force().nodes(this.entries).gravity(0).charge(0).size([that.width, that.height]).on("tick", function(e) {
      return that.circles.each(that.collide(e.alpha)).attr('transform', function(d) {
        return "translate(" + d.x + ", " + d.y + ")";
      });
    }).start();
    this.circles = this.groupPaths.selectAll(".entity").data(this.entries).enter().append('g').attr('class', function(d) {
      return d.type + " entity";
    }).call(this.force.drag).on("mouseup", function(e, d) {
      var open, ui;
      ui = d3.select(this);
      open = e.radius === that.OPTIONS.big_radius;
      if (open) {
        if ((e.sticky != null) && e.sticky) {
          that.closeCircle(e, ui);
        } else if ((e.sticky != null) && !e.sticky) {
          that.circles.each(function(d) {
            return that.closeCircle(d, d3.select(this));
          });
          that.openCircle(e, ui, true);
          that.stickMembers(e);
        } else {
          that.closeCircle(e, ui);
        }
        if (that._previousOver === e) {
          return that.hideLegend(true)(e);
        }
      } else {
        that.circles.each(function(d) {
          return that.closeCircle(d, d3.select(this));
        });
        that.openCircle(e, ui, true);
        return that.showLegend(true)(e);
      }
    }).on("mouseover", function(d) {
      if (_this._previousOver !== d && !_this.legendBlocked) {
        _this.showLegend()(d);
        return _this._previousOver = d;
      }
    }).on("mouseout", this.hideLegend());
    return this.circles.append('circle').attr('r', function(d) {
      return d.radius;
    });
  };

  Map.prototype.openCircle = function(d, e, stick) {
    if (stick == null) {
      stick = false;
    }
    d.radius = this.OPTIONS.big_radius;
    if (d.img != null) {
      e.append('image').attr("width", d.radius * 2).attr("height", d.radius * 2).attr("x", 0 - d.radius).attr("y", 0 - d.radius).style('opacity', 0).attr("xlink:href", function(d) {
        return "static/" + d.img;
      }).transition().duration(250).style('opacity', 1);
    }
    e.select('circle').transition().duration(250).attr("r", function(d) {
      return d.radius;
    });
    if ((d.members != null) && stick) {
      this.stickMembers(d);
    }
    return this.force.start();
  };

  Map.prototype.closeCircle = function(d, e) {
    d.radius = this.OPTIONS.litle_radius;
    e.selectAll('image').remove();
    e.select('circle').transition().duration(250).attr("r", function(d) {
      return d.radius;
    });
    if (d.members != null) {
      this.unStickMembers(d);
    }
    return this.force.start();
  };

  Map.prototype.stickMembers = function(entry) {
    var data, e, _i, _len, _ref, _results;
    entry.sticky = true;
    _ref = this.circles.filter(function(e) {
      var _ref;
      return _ref = e.id, __indexOf.call(entry.members, _ref) >= 0;
    })[0];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      e = _ref[_i];
      e = d3.select(e);
      data = e.datum();
      data.gx = entry.gx;
      data.gy = entry.gy;
      _results.push(this.openCircle(data, e));
    }
    return _results;
  };

  Map.prototype.unStickMembers = function(entry) {
    var data, e, _i, _len, _ref, _results;
    entry.sticky = false;
    this.entries = this.computeEntries(this.entries);
    _ref = this.circles.filter(function(e) {
      var _ref;
      return _ref = e.id, __indexOf.call(entry.members, _ref) >= 0;
    })[0];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      e = _ref[_i];
      e = d3.select(e);
      data = e.datum();
      _results.push(this.closeCircle(data, e));
    }
    return _results;
  };

  Map.prototype.showLegend = function(blocked) {
    var _this = this;
    if (blocked == null) {
      blocked = false;
    }
    return (function(d, i) {
      var $github, link;
      _this.legendBlocked = blocked;
      clearTimeout(_this.hideLegendTimer);
      if (d.y > _this.height - _this.uis.panel.height()) {
        _this.uis.panel.addClass('top');
        _this.uis.panel.css('top', -_this.height - 11);
      } else {
        _this.uis.panel.removeClass('top');
        _this.uis.panel.css('top', -_this.uis.panel.height() - 3);
      }
      _this.uis.panel.css('display', 'block');
      _this.uis.panel.removeClass("hidden").find('.title').removeClass("company person event").addClass(d.type).html(d.name || d.title || d.description);
      _this.uis.panel.find('.description').removeClass("company person event").addClass(d.type).html(d.description || d.title || (d.id ? "@" + d.id : false || d.name));
      link = d.link || d.twitter || (d.github != null ? d.github.url : false || null);
      _this.uis.panel.find('.link').addClass(d.type).removeClass("company person event").html($("<a target=\"_blank\"/>").attr("href", link).html(link));
      _this.uis.panel.find(".icone img").attr("src", "static/" + d.img);
      $github = _this.uis.panel.find('.github');
      if (d.github != null) {
        $github.removeClass("hidden");
        _this.set("followers", d.github.followers);
        return _this.set("repos", d.github.repos);
      } else {
        return $github.addClass("hidden");
      }
    });
  };

  Map.prototype.hideLegend = function(force_blocked) {
    var _this = this;
    if (force_blocked == null) {
      force_blocked = false;
    }
    this.legendBlocked = force_blocked ? false : this.legendBlocked;
    return (function(d, i) {
      if (!_this.legendBlocked) {
        _this._previousOver = void 0;
        clearTimeout(_this.hideLegendTimer);
        return _this.hideLegendTimer = setTimeout(function() {
          _this.uis.panel.addClass("hidden");
          return _this.hideLegendTimer = setTimeout(function() {
            return _this.uis.panel.css('display', 'none');
          }, 250);
        }, 100);
      }
    });
  };

  Map.prototype.renderCountries = function() {
    var that;
    that = this;
    return this.groupPaths.selectAll(".country").data(this.countries.features).enter().append("path").attr("d", this.path).attr("class", "country");
  };

  Map.prototype.move = function(_rotation, _scale, _center) {
    var _this = this;
    this.n_rotation = _rotation != null ? _rotation : this.n_rotation || this.projection.rotate();
    this.n_scale = _scale != null ? _scale : this.n_scale || this.projection.scale();
    this.n_center = _center != null ? _center : this.n_center || this.projection.center();
    return function(timestamp) {
      var center, progress, rotation, scale;
      if (_this.start == null) {
        _this.start = timestamp;
      }
      progress = timestamp - _this.start;
      rotation = _this.projection.rotate();
      rotation[0] += (_this.n_rotation[0] - rotation[0]) * progress / 1000;
      rotation[1] += (_this.n_rotation[1] - rotation[1]) * progress / 1000;
      scale = _this.projection.scale();
      scale += (_this.n_scale - scale) * progress / 1000;
      center = _this.projection.center();
      center[0] += (_this.n_center[0] - center[0]) * progress / 1000;
      center[1] += (_this.n_center[1] - center[1]) * progress / 1000;
      _this.projection.scale(scale).rotate(rotation).center(center);
      if (!_this.groupPathsSelection) {
        _this.groupPathsSelection = _this.groupPaths.selectAll("path");
      }
      _this.groupPathsSelection.attr("d", _this.path);
      _this.entries = _this.computeEntries(_this.entries);
      if (progress < 1000) {
        return requestAnimationFrame(_this.move());
      } else {
        return _this.start = void 0;
      }
    };
  };

  Map.prototype.viewGlobal = function() {
    var bounds, center, hscale, scale, vscale;
    if (this.currentView !== "global") {
      bounds = this.getBoundingBox();
      hscale = this.scale * this.width / (bounds[1][0] - bounds[0][0]);
      vscale = this.scale * this.height / (bounds[1][1] - bounds[0][1]);
      scale = Math.min(hscale, vscale) * .95;
      center = this.projection.invert([(bounds[1][0] + bounds[0][0]) / 2, (bounds[1][1] + bounds[0][1]) / 2]);
      center = [center[0], center[1] - 30];
      this.scale = scale;
      this.animationRequest = requestAnimationFrame(this.move(this.initialRotation, this.scale, center));
    }
    return this.currentView = "global";
  };

  Map.prototype.viewEurope = function() {
    var bounds, center, hscale, scale, vscale;
    if (this.currentView !== "europe") {
      bounds = this.getBoundingBox("Journalism++");
      hscale = this.scale * this.width / (bounds[1][0] - bounds[0][0]);
      vscale = this.scale * this.height / (bounds[1][1] - bounds[0][1]);
      scale = Math.min(hscale, vscale);
      center = this.projection.invert([(bounds[1][0] + bounds[0][0]) / 2, (bounds[1][1] + bounds[0][1]) / 2]);
      center = [center[0], center[1] - 30];
      this.scale = scale;
      this.animationRequest = requestAnimationFrame(this.move(null, scale, center));
    }
    return this.currentView = "europe";
  };

  Map.prototype.personclick = function(e) {
    var that;
    that = this;
    $(".l").removeClass("clicked");
    if (this.current_filter === "person") {
      this.closeAll();
      this.current_filter = null;
      return;
    }
    this.viewEurope();
    this.closeAll();
    this.circles.filter(function(d) {
      return d.type === "person";
    }).each(function(d) {
      return that.openCircle(d, d3.select(this));
    });
    this.current_filter = "person";
    return $(e.currentTarget).addClass("clicked");
  };

  Map.prototype.companyclick = function(e) {
    var that;
    that = this;
    $(".l").removeClass("clicked");
    if (this.current_filter === "company") {
      this.closeAll();
      this.current_filter = null;
      return;
    }
    this.viewEurope();
    this.closeAll();
    this.circles.filter(function(d) {
      return d.type === "company" && d.name !== "Journalism++";
    }).each(function(d) {
      return that.openCircle(d, d3.select(this));
    });
    this.current_filter = "company";
    return $(e.currentTarget).addClass("clicked");
  };

  Map.prototype.eventclick = function(e) {
    var that;
    that = this;
    $(".l").removeClass("clicked");
    if (this.current_filter === "event") {
      this.closeAll();
      this.current_filter = null;
      return;
    }
    this.viewGlobal();
    this.closeAll();
    this.circles.filter(function(d) {
      return d.type === "event";
    }).each(function(d) {
      return that.openCircle(d, d3.select(this));
    });
    this.current_filter = "event";
    return $(e.currentTarget).addClass("clicked");
  };

  Map.prototype.jppclick = function(e) {
    var that;
    that = this;
    $(".l").removeClass("clicked");
    if (this.current_filter === "jpp") {
      this.closeAll();
      this.current_filter = null;
      return;
    }
    this.viewEurope();
    this.closeAll();
    this.circles.filter(function(d) {
      return d.type === "company" && d.name === "Journalism++";
    }).each(function(d) {
      return that.openCircle(d, d3.select(this), false);
    });
    this.current_filter = "jpp";
    return $(e.currentTarget).addClass("clicked");
  };

  Map.prototype.allclick = function() {
    var that;
    that = this;
    this.closeAll();
    this.viewGlobal();
    return this.circles.each(function(d) {
      return that.openCircle(d, d3.select(this));
    });
  };

  Map.prototype.closeAll = function() {
    var that;
    that = this;
    return this.circles.each(function(d) {
      return that.closeCircle(d, d3.select(this));
    });
  };

  return Map;

})(Widget);
