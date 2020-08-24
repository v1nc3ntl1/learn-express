const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id: 1, name:'course 1'},
    {id: 2, name:'course 2'},
    {id: 3, name:'course 3'}
]
app.get('/', (req, res) => {
    res.send('Hello world');

});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the given id is not found.');

    res.send(course);
});

app.post('/api/courses', (req,res)=>{
    const result = validateCourse(req.body);
    const { error } = validateCourse(req.body);

    if (error) {
        return res.status(400).send(result.error);
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    courses.push(course);

    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    // If no existing, return 404
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given id is not found.');

    // Validate
    // If invalid, return 400 - Bad request
    const { error } = validateCourse(req.body);

    if (error) {
        return res.status(400).send(result.error);
    }

    // update course
    // return the updated course
    course.name = req.body.name;
    res.send(course);
});

app.get('/api/posts/:year/:month', (req, res) => {
    res.send(`${req.params.year}${req.params.month}`);
});

app.delete('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given id is not found.');

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`listening on port ${port}`));

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(course);
}