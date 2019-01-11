const knex = require('../../modules/knex')

async function start() {
  try {
    const names = ['Max', 'James', 'David', 'John', 'Robert', 'Michael', 'William', 'Richard', 'Charles', 'Joseph', 'Olivia', 'Zoe', 'Mia', 'Lily', 'Sophia', 'Isabella', 'Poppy', 'Elsa', 'Daisy', 'Alice']
    const last_names = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Wilson', 'Anderson', 'White', 'Harris', 'Martin', 'Garcia']
    let users = []
    let n = 1500

    console.log(`Generating ${n} users.`);

    for (let i = 0; i < n; i++) {
      let nameI = Math.floor(Math.random() * 19) + 0
      let surnameI = Math.floor(Math.random() * 11) + 0
      let gender = (nameI <= 9) ? 'male' : 'female'

      let u = {
        first_name: names[nameI],
        last_name: last_names[surnameI],
        messenger_id: i,
        gender
      }

      users.push(u)
    }

    console.log('Truncating users database')
    await knex.raw('TRUNCATE TABLE public.users RESTART IDENTITY CASCADE;')
    console.log('Saving to database.')
    await knex('users').insert(users)
    console.log('Saved')
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

start()
