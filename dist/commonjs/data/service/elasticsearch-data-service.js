'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticSearchDataService = undefined;

var _dec, _class;

var _periscopeFramework = require('periscope-framework');

var _aureliaFramework = require('aurelia-framework');

var _aureliaFetchClient = require('aurelia-fetch-client');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ElasticSearchDataService = exports.ElasticSearchDataService = (_dec = (0, _aureliaFramework.transient)(), _dec(_class = function (_DataService) {
  _inherits(ElasticSearchDataService, _DataService);

  function ElasticSearchDataService() {
    _classCallCheck(this, ElasticSearchDataService);

    return _possibleConstructorReturn(this, _DataService.call(this));
  }

  ElasticSearchDataService.prototype.read = function read(options) {
    var _this2 = this;

    var url = this.url + "_search";
    var request = {};
    if (options.fields) request._source = { include: options.fields };
    if (options.filter) request.query = JSON.parse(this.filterParser.getFilter(options.filter));
    if (options.take) request.size = options.take;
    if (options.skip) request.from = options.skip;
    if (options.sort) {
      var s = options.sort;
      if (!options.sortDir) request.sort = [s];else {
        request.sort = [{}];
        request.sort[0][s] = options.sortDir;
      }
    }

    return this.httpClient.fetch(url, {
      method: 'post',
      body: (0, _aureliaFetchClient.json)(request)
    }).then(function (response) {
      var a = 2;
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
}(_periscopeFramework.DataService)) || _class);