'use strict';

System.register(['periscope-framework', 'aurelia-framework', 'aurelia-fetch-client', 'lodash'], function (_export, _context) {
  "use strict";

  var DataService, inject, transient, HttpClient, json, _, _dec, _dec2, _class, ElasticSearchDataService;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_periscopeFramework) {
      DataService = _periscopeFramework.DataService;
    }, function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
      transient = _aureliaFramework.transient;
    }, function (_aureliaFetchClient) {
      HttpClient = _aureliaFetchClient.HttpClient;
      json = _aureliaFetchClient.json;
    }, function (_lodash) {
      _ = _lodash;
    }],
    execute: function () {
      _export('ElasticSearchDataService', ElasticSearchDataService = (_dec = transient(), _dec2 = inject(HttpClient), _dec(_class = _dec2(_class = function (_DataService) {
        _inherits(ElasticSearchDataService, _DataService);

        function ElasticSearchDataService(http) {
          _classCallCheck(this, ElasticSearchDataService);

          var _this = _possibleConstructorReturn(this, _DataService.call(this));

          http.configure(function (config) {
            config.useStandardConfiguration();
          });
          _this._http = http;
          return _this;
        }

        ElasticSearchDataService.prototype.read = function read(options) {
          var _this2 = this;

          var url = this.url + "_search";
          var request = {};
          if (options.fields) request._source = { include: options.fields };
          if (options.filter && options.filter.length > 0) request.query = JSON.parse(this.filterParser.getFilter(options.filter));
          if (options.take) request.size = options.take;
          if (options.skip) request.from = options.skip;
          if (options.sort) {
            var s = options.sort;
            if (!options.sortDir) request.sort = [s];else {
              request.sort = [{}];
              request.sort[0][s] = options.sortDir;
            }
          }

          return this._http.fetch(url, {
            method: 'post',
            body: json(request)
          }).then(function (response) {
            return response.json();
          }).then(function (jsonData) {
            var d = _.map(jsonData.hits.hits, "_source");
            return {
              data: d,
              total: _this2.totalMapper ? _this2.totalMapper(jsonData) : jsonData.hits.total
            };
          });
        };

        return ElasticSearchDataService;
      }(DataService)) || _class) || _class));

      _export('ElasticSearchDataService', ElasticSearchDataService);
    }
  };
});