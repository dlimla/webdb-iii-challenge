
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students').del()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        {name: 'stever', cohort_id: 3},
        {name: 'fred', cohort_id: 2},
        {name: 'jon', cohort_id: 3}
      ]);
    });
};
