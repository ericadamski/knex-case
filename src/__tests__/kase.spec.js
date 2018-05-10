const kase = require('../kase');

describe('.kase', () => {
  it('should be able to take a single when clause', () => {
    const expected = `(CASE WHEN column=1 THEN 1 ELSE 0 END)`;

    const result = kase()
      .when('column', '=', 1)
      .thenElse(1, 0);

    expect(result).toBe(expected);
  });

  it('should be able to take a multiple when clauses', () => {
    const expected = `(CASE WHEN column=1 THEN 1 WHEN column=2 THEN 2 ELSE 0 END)`;

    const result = kase()
      .when('column', '=', 1)
      .thenElse(1)
      .when('column', '=', 2)
      .thenElse(2, 0);

    expect(result).toBe(expected);
  });

  it('should be able to take a multiple when `or` and `and` clauses', () => {
    const expected = `(CASE WHEN column=1 OR column_two=3 AND column_three=2 THEN 1 WHEN column=2 THEN 2 ELSE 0 END)`;

    const result = kase()
      .when('column', '=', 1)
      .orWhen('column_two', '=', 3)
      .andWhen('column_three', '=', 2)
      .thenElse(1)
      .when('column', '=', 2)
      .thenElse(2, 0);

    expect(result).toBe(expected);
  });

  it('should be able to nest kase statements', () => {
    const expected = `(CASE WHEN column=1 OR column_two=3 THEN (CASE WHEN column=2 THEN 2 ELSE 5 END) ELSE 0 END)`;

    const result = kase()
      .when('column', '=', 1)
      .orWhen('column_two', '=', 3)
      .thenElse(
        kase()
          .when('column', '=', 2)
          .thenElse(2, 5)
      )
      .else(0);

    expect(result).toBe(expected);
  });
});
