var _dec, _class;

import { DataService } from 'periscope-framework';
import { transient } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import * as _ from 'lodash';

export let ElasticSearchDataService = (_dec = transient(), _dec(_class = class ElasticSearchDataService extends DataService {
  constructor() {
    super();
  }

  read(options) {
    let url = this.url;
    let request = {};
    if (options.fields) request._source = { include: options.fields };
    if (options.filter) request.query = JSON.parse(this.filterParser ? this.filterParser.getFilter(options.filter) : options.filter);
    if (options.take) request.size = options.take;
    if (options.skip) request.from = options.skip;
    if (options.sort) {
      let s = options.sort;
      if (!options.sortDir) request.sort = [s];else {
        request.sort = [{}];
        request.sort[0][s] = options.sortDir;
      }
    }

    return this.httpClient.fetch(url, {
      method: 'post',
      body: json(request)
    }).then(response => {
      var a = 2;
      return response.json();
    }).then(jsonData => {
      let d = _.map(jsonData.hits.hits, "_source");
      return {
        data: d,
        total: this.totalMapper ? this.totalMapper(jsonData) : jsonData.hits.total
      };
    });
  }
}) || _class);