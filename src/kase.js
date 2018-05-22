function when(op) {
  return function(column, operator, value) {
    return `${(op && `${op}`) || 'WHEN'} ${column}${operator}${value}`;
  };
}

const or = when('OR');
const and = when('AND');

function kase() {
  const k = {
    q: [],
    when(column, operator, value) {
      k.q.length <= 2
        ? (k.q = ['CASE', when()(column, operator, value)])
        : k.q.push(when()(column, operator, value));

      return k;
    },
    orWhen(column, operator, value) {
      k.q.push(or(column, operator, value));

      return k;
    },
    andWhen(column, operator, value) {
      k.q.push(and(column, operator, value));

      return k;
    },
    thenElse(t, e) {
      const hasE = e !== undefined;

      k.q.push(`THEN ${t}`);
      hasE && k.q.push(`ELSE ${e} END`);

      if (!hasE) return k;

      const str = `(${k.q.join(' ')})`;
      k.q = [];

      return str;
    },
    else(e) {
      k.q.push(`ELSE ${e} END`);

      const str = `(${k.q.join(' ')})`;
      k.q = [];

      return str;
    },
  };

  return k;
}

module.exports = kase;
