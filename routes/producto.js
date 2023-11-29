var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

/* GET users listing. */
router.get('/', function (req, res, next) {

  dbConn.query('SELECT * FROM productos ORDER BY id desc', function (err, rows) {

    if (err) {
      req.flash('error', err);

      res.render('producto/index', { data: '' });

    } else {

      res.render('producto/index', { data: rows });
    }
  });
});

/*formulario para agregar */
router.get ('/add',function(req,res ,next) {
  res.render('producto/add',{
    nombre:'',
    descripcion:'',
    foto:'',
    stock:'',
    precio:''
  })
})

// add a new categoria
router.post('/add', function(req, res, next) {    

  let nombre = req.body.nombre;
  let descripcion = req.body.descripcion;
  let foto= req.body.foto;
  let stock = req.body.stock;
  let precio = req.body.precio;
  let errors = false;

  if(nombre.length === 0 ) {
      errors = true;
      req.flash('error', "Please enter name ");
      // render to add.ejs with flash message
      res.render('producto/add', {
          nombre: nombre,
          descripcion: descripcion,
          foto:foto,
          stock:stock,
          precio:precio,
      })
  }

  // if no error
  if(!errors) {

      var form_data = {
        nombre: nombre,
        descripcion: descripcion,
        foto:foto,
        stock:stock,
        precio:precio
      }      
      // insert query
      dbConn.query('INSERT INTO productos SET ?', form_data, function(err, result) {
          //if(err) throw err
          if (err) {
              req.flash('error', err)
              res.render('producto/add', {
                  nombre: form_data.nombre ,
                  descripcion: form_data.dsescripcion,
                  foto: form_data.foto ,
                  stock: form_data.stock ,
                  precio: form_data.precio                 
              })
          } else {                
              req.flash('success', 'producto successfully added');
              res.redirect('/producto');
          }
      })
  }
})

// ver formulario editar
router.get('/edit/(:id)', function(req, res, next) {
  let id = req.params.id;
  dbConn.query('SELECT * FROM productos WHERE id = ' + id, function(err, rows, fields) {
      if(err) throw err       
      // if user not found
      if (rows.length <= 0) {
          req.flash('error', 'Registro not found with id = ' + id)
          res.redirect('/producto')
      }
      // if book found
      else {
          // render to edit.ejs
          res.render('producto/edit', {
              id: rows[0].id,
              nombre: rows[0].nombre,
              descripcion: rows[0].descripcion ,
              foto: rows[0].foto, 
              stock: rows[0].stock, 
              precio: rows[0].precio               
          })
      }
  })
})

// update categoria data
router.post('/update/:id', function(req, res, next) {
  let id = req.params.id;
  let nombre = req.body.nombre;
  let descripcion = req.body.descripcion;
  let foto= req.body.foto;
  let stock = req.body.stock;
  let precio = req.body.precio;
  let errors = false;

  if(nombre.length === 0) {
      errors = true;      
      // set flash message
      req.flash('error', "Please enter name ");
      // render to add.ejs with flash message
      res.render('producto/edit', {
          id: req.params.id,
          nombre: nombre,
          descripcion: descripcion,
          foto:foto,
          stock:stock,
          precio:precio,
      })
  }
  // if no error
  if( !errors ) { 
      var form_data = {
          nombre: nombre,
          descripcion: descripcion,
          foto:foto,
          stock:stock,
          precio:precio,
      }
      // update query
      dbConn.query('UPDATE productos SET ? WHERE id = ' + id, form_data, function(err, result) {
          //if(err) throw err
          if (err) {
              // set flash message
              req.flash('error', err)
              // render to edit.ejs
              res.render('producto/edit', {
                  id: req.params.id,
                  nombre: form_data.nombre,
                  descripcion: form_data.dsescripcion,
                  foto: form_data.foto ,
                  stock: form_data.stock ,
                  precio: form_data.precio  
              })
          } else {
              req.flash('success', 'productos successfully updated');
              res.redirect('/producto');
          }
      })
  }
})

// delete producto
router.get('/delete/(:id)', function(req, res, next) {
  let id = req.params.id;   
  dbConn.query('DELETE FROM productos WHERE id = ' + id, function(err, result) {
      //if(err) throw err
      if (err) {
          // set flash message
          req.flash('error', err)
          // redirect to books page
          res.redirect('/producto')
      } else {
          // set flash message
          req.flash('success', 'producto successfully deleted! ID = ' + id)
          // redirect to books page
          res.redirect('/producto')
      }
  })
})


module.exports = router;