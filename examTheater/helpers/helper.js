const jwt = require("jsonwebtoken")
const { TOKEN_SECRET } = require("../config/variables.js")
// module.exports = {
//     createErrorMsg: errors =>
//         errors
//             .array()
//             .map(x => x.msg)
//             .join("<br />"),
// }

module.exports = {
    // createErrorMsg: errors =>        
    //     errors.array().map(x => x.msg).join("<br />"),
    createErrorMsg: function (errors) {
        try {
            return errors.array().map(x => x.msg).join("<br />")            
        } catch {
            return errors.message.split(':')[2].split(',')[0]
        }
    } ,   
            
    createErrorFromModel: error => error.message.split(':')[2].split(',')[0],
    createToken: (payload) =>{	
			return new Promise((resolve, reject) => {
				jwt.sign(payload, TOKEN_SECRET, function(err, token) {
					if (err) {
						reject(err);
					} else {
						resolve(token);
					}
				})
			})		
		}   
}