require('../index');

const K = require('knex')({ client: 'mssql' });

describe('K.case', () => {
  it('should have the case specific methods', () => {
    // when
    expect(K.client.when).toBeInstanceOf(Function);
    expect(K.queryBuilder().when).toBeInstanceOf(Function);

    // orWhen
    expect(K.client.orWhen).toBeInstanceOf(Function);
    expect(K.client.queryBuilder().orWhen).toBeInstanceOf(Function);

    // andWhen
    expect(K.client.andWhen).toBeInstanceOf(Function);
    expect(K.client.queryBuilder().andWhen).toBeInstanceOf(Function);

    // thenElse
    expect(K.client.thenElse).toBeInstanceOf(Function);
    expect(K.client.queryBuilder().thenElse).toBeInstanceOf(Function);

    // else
    expect(K.client.else).toBeInstanceOf(Function);
    expect(K.client.queryBuilder().else).toBeInstanceOf(Function);
  });

  it('should be able to take a single when clause', () => {
    const expected = `(CASE WHEN column=1 THEN 1 ELSE 0 END)`;

    const result = K.queryBuilder()
      .when('column', '=', 1)
      .thenElse(1, 0)
      .toQuery();

    expect(result).toBe(expected);
  });

  it('should be able to take a multiple when clauses', () => {
    const expected = `(CASE WHEN column=1 THEN 1 WHEN column=2 THEN 2 ELSE 0 END)`;

    const result = K.queryBuilder()
      .when('column', '=', 1)
      .thenElse(1)
      .when('column', '=', 2)
      .thenElse(2, 0)
      .toQuery();

    expect(result).toBe(expected);
  });

  it('should be able to take a multiple when `or` and `and` clauses', () => {
    const expected = `(CASE WHEN column=1 OR column_two=3 AND column_three=2 THEN 1 WHEN column=2 THEN 2 ELSE 0 END)`;

    const result = K.queryBuilder()
      .when('column', '=', 1)
      .orWhen('column_two', '=', 3)
      .andWhen('column_three', '=', 2)
      .thenElse(1)
      .when('column', '=', 2)
      .thenElse(2, 0)
      .toQuery();

    expect(result).toBe(expected);
  });

  it('should be able to take a multiple when `or` and `and` clauses, also alias', () => {
    const expected = `(CASE WHEN column=1 OR column_two=3 AND column_three=2 THEN 1 WHEN column=2 THEN 2 ELSE 0 END) AS COL`;

    const result = K.queryBuilder()
      .when('column', '=', 1)
      .orWhen('column_two', '=', 3)
      .andWhen('column_three', '=', 2)
      .thenElse(1)
      .when('column', '=', 2)
      .thenElse(2, 0)
      .as('COL')
      .toQuery();

    expect(result).toBe(expected);
  });

  it('should be able to nest kase statements', () => {
    const expected = `(CASE WHEN column=1 OR column_two=3 THEN (CASE WHEN column=2 THEN 2 ELSE 5 END) ELSE 0 END)`;

    const result = K.queryBuilder()
      .when('column', '=', 1)
      .orWhen('column_two', '=', 3)
      .thenElse(
        K.queryBuilder()
          .when('column', '=', 2)
          .thenElse(2, 5)
      )
      .else(0)
      .toQuery();

    expect(result).toBe(expected);
  });

  it('should be able to nest kase statements, with alias', () => {
    const expected = `(CASE WHEN column=1 OR column_two=3 THEN (CASE WHEN column=2 THEN 2 ELSE 5 END) ELSE 0 END) AS COL`;

    const result = K.queryBuilder()
      .when('column', '=', 1)
      .orWhen('column_two', '=', 3)
      .thenElse(
        K.queryBuilder()
          .when('column', '=', 2)
          .thenElse(2, 5)
      )
      .else(0)
      .as('COL')
      .toQuery();

    expect(result).toBe(expected);
  });
  describe('value formatting', () => {
    describe('when value', () => {
      it('should be able to handle empty string as a value', () => {
        const expected = `(CASE WHEN column='' THEN 1 ELSE 0 END)`;

        const result = K.queryBuilder()
          .when('column', '=', '')
          .thenElse(1, 0)
          .toQuery();

        expect(result).toEqual(expected);
      });

      it('should be able to handle string as a value', () => {
        const expected = `(CASE WHEN column='hello' THEN 1 ELSE 0 END)`;

        const result = K.queryBuilder()
          .when('column', '=', 'hello')
          .thenElse(1, 0)
          .toQuery();

        expect(result).toEqual(expected);
      });

      it('should be able to handle numbers of a value', () => {
        const expected = `(CASE WHEN column=1 THEN 1 ELSE 0 END)`;

        const result = K.queryBuilder()
          .when('column', '=', 1)
          .thenElse(1, 0)
          .toQuery();

        expect(result).toEqual(expected);
      });
    });

    describe('thenElse values', () => {
      it('should be able to handle string as a value', () => {
        const expected = `(CASE WHEN column='hello' THEN '1' ELSE '0' END)`;

        const result = K.queryBuilder()
          .when('column', '=', 'hello')
          .thenElse('1', '0')
          .toQuery();

        expect(result).toEqual(expected);
      });

      it('should be able to handle numbers of a value', () => {
        const expected = `(CASE WHEN column=1 THEN 1 ELSE 0 END)`;

        const result = K.queryBuilder()
          .when('column', '=', 1)
          .thenElse(1, 0)
          .toQuery();

        expect(result).toEqual(expected);
      });
    });

    describe('else values', () => {
      it('should be able to handle string as a value', () => {
        const expected = `(CASE WHEN column=1 OR column_two=3 THEN (CASE WHEN column=2 THEN 2 ELSE 5 END) ELSE 'wow' END)`;

        const result = K.queryBuilder()
          .when('column', '=', 1)
          .orWhen('column_two', '=', 3)
          .thenElse(
            K.queryBuilder()
              .when('column', '=', 2)
              .thenElse(2, 5)
          )
          .else('wow')
          .toQuery();

        expect(result).toBe(expected);
      });

      it('should be able to handle numbers of a value', () => {
        const expected = `(CASE WHEN column=1 OR column_two=3 THEN (CASE WHEN column=2 THEN 2 ELSE 5 END) ELSE 0 END)`;

        const result = K.queryBuilder()
          .when('column', '=', 1)
          .orWhen('column_two', '=', 3)
          .thenElse(
            K.queryBuilder()
              .when('column', '=', 2)
              .thenElse(2, 5)
          )
          .else(0)
          .toQuery();

        expect(result).toBe(expected);
      });
    });
  });
});
