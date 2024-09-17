const jwt = require('jsonwebtoken');

 class JwtAdapter {


    static async generateToken(payload, duration= '2h'){
        return new Promise((resolve) => {
            
            jwt.sign(payload, process.env.JWT_SEED, {
              expiresIn: duration,
              issuer: 'ingesis.uniquindio.edu.co',
              
            }, (err, token) => {

              console.log(err);

                if(err) return resolve(null)

                    resolve(token);
            })
        })
    }

    static async validateToken(token) {
    
        return new Promise( (resolve) => {
    
          jwt.verify( token, process.env.JWT_SEED, (err, decoded) => {
    
            if( err ) return resolve(null);
    
            resolve( decoded );
    
          });
        })
      }
}

module.exports = JwtAdapter;