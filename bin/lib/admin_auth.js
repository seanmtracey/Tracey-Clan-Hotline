const auth = require('basic-auth');
const compare = require('tsscmp')
 
 
// Basic function to validate credentials for example
function check (name, pass) {
	let valid = true

	// Simple method to prevent short-circut and use timing-safe compare
	valid = compare(name, process.env.ADMIN_USER) && valid;

	console.log(name, process.env.ADMIN_USER);
	console.log(pass, process.env.ADMIN_PASS);

	valid = compare(pass, process.env.ADMIN_PASS) && valid;

	return valid

}

// Create server
function checkCreds(req, res, next) {
	
	console.log("CREDS BEING CHECKED", req.path);
	process.exit();

	const credentials = auth(req);
	console.log(credentials);
  if (!credentials || !check(credentials.name, credentials.pass)) {
	res.statusCode = 401
	res.setHeader('WWW-Authenticate', 'Basic realm="example"')
	res.end('Access denied');
  } else {
	next();
  }

}

module.exports = checkCreds;