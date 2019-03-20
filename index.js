const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const dbConfig = require('./knexfile.js')


const db = knex(dbConfig.development);

const server = express();

server.use(helmet());
server.use(express.json());

const port = 4000;

server.get('/api/cohorts', async (req, res) => {
    try {
      const cohorts = await db('cohorts');
      res.status(200).json(cohorts);
    } catch (error) {
      res.status(500).json(error);
    }
});

server.get('/api/cohorts/:id', async (req, res) => {
    try {
        const cohort = await db('cohorts')
        .where({ id: req.params.id })
        .first();
        res.status(200).json(cohort)
    } catch (error) {
        res.status(500).json(error)
    }
})

server.get('/api/cohorts/:id/students', async (req,res) => {
   const cohortForStudents = req.params.id;
   db.from('students')
   .where({cohort_id: `${cohortForStudents}`})
   .then(students => {
       res.status(200).json(students)
   })
   .catch(err => {
       res.status(500).json(err)
   })
})


server.post('/api/cohorts', async(req, res) => {
    try {
        const [id] = await db('cohorts').insert(req.body);
        const cohorts = await db('cohorts')
        .where({id})
        .first();
        res.status(201).json(cohorts)
    } catch(error) {
        res.status(400).json(error)
    }
})
    

server.put('/api/cohorts/:id', async (req, res) => {
    try {
      const count = await db('cohorts')
        .where({ id: req.params.id })
        .update(req.body);
  
      if (count > 0) {
        const cohorts = await db('cohorts')
          .where({ id: req.params.id })
          .first();
  
        res.status(200).json(cohorts);
      } else {
        res.status(404).json({ message: 'Records not found' });
      }
    } catch (error) {}
});

  

server.get('/api/students', async (req, res) => {
    try {
        const students = await db('students');
        res.status(200).json(students);

    } catch(error) {
        res.status(500).json(error)
    }
})

server.delete('/api/cohorts/:id', async (req, res) => {
    try {
        const count = await db('cohorts').where({id: req.params.id})
        .del();

        if (count > 0) {
            res.status(200).end();
        }
        else {
            res.status(400).json({message: "No relevent data"})
        }
    }
    catch(error) {
        res.status(500).json(error)
    }

})


server.listen(port, () => 
    console.log(`\nrunning on ${port}\n`)
);