var express = require('express');
var app = express();

// let comments = [];  임시DB(저장x)

// DB -> sequelize
const { Sequelize, DataTypes } = require('sequelize');
// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
  });

const Comments = sequelize.define('Comments', {
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
//   lastName: {
//     type: DataTypes.STRING
//     // allowNull defaults to true
//   }
}, {
  // Other model options go here
});

// `sequelize.define` also returns the model
console.log(Comments === sequelize.models.Comments); // true

(async() => {
await Comments.sync();
console.log("The table for the Comments model was just (re)created!");
})();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', async function(req, res) {

// Find all Comments
const comments = await Comments.findAll();

  res.render('index', { comments: comments});
});

  
  app.post('/create', async function(req, res) {
    console.log(req.body);

    const { content } = req.body

    // comments.push(content)
    // sq lite 안쓰고 만든거

    // Create a new Comments
    await Comments.create({ content: content });

    // console.log(comments);
    // 변수 없애기 전

    res.redirect('/');
  });

    app.post('/update/:id', async function(req, res) {
    console.log(req.params);
    console.log(req.body);

    const { content } = req.body
    const { id } = req.params

    await Comments.update({ content: content }, {
        where: {
          id: id
        }
      });



    res.redirect('/');
  });

  app.post('/delete/:id', async function(req, res) {
    console.log(req.params);
    const { id } = req.params

    await Comments.destroy({
        where: {
          id: id
        }
      });



    res.redirect('/');
  });



app.listen(3000);
console.log('Server is listening on port 3000');
