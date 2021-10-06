// module.exports = (() => (err, req, res, next) =>{
// 	if (!err) return;
// 	console.log('in error mdl');
// 	res.status(500).render('404', {error: err})	
// });

module.exports = () => (req, res, next) => {
	console.log("Error Handling Middleware called")
  console.log('Path: ', req.path)
  console.error('Error: ', error)
 
  if (error.type == 'redirect')
      res.redirect('/error')

   else if (error.type == 'time-out') // arbitrary condition check
      res.status(408).send(error)
  else
      res.status(500).send(error)
};