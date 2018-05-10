const Knex = require('knex');
const Client = Knex.Client.prototype;
const QueryBuilder = require('knex/lib/query/builder');

const kase = require('./src/kase');

const ext = {
  when(col, op, val) {
    (!this._kase || this._kase.q.length <= 2) && (this._kase = kase());

    this._kase.when(col, op, val);

    return this;
  },
  orWhen(col, op, val) {
    this._kase.orWhen(col, op, val);

    return this;
  },
  andWhen(col, op, val) {
    this._kase.andWhen(col, op, val);

    return this;
  },
  thenElse(t, e) {
    const query = this._kase.thenElse(t, e);

    if (typeof query === 'string') return this.client.raw(query);

    return this;
  },
  else(e) {
    const query = this._kase.else(e);

    return this.client.raw(query);
  },
};

Object.assign(QueryBuilder.prototype, ext);
Object.assign(Client, ext);

Client.queryBuilder = function queryBuilder() {
  return new QueryBuilder(this);
};
