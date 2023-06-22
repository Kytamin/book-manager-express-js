export class AuthController {
    static getFormLogin(req, res) {
       try{
        if(req.isAuthenticated()){
            return  res.redirect('/book')
          }
          res.render('login')
       }catch(err){
        res.send(err.message)
       }
    }
}