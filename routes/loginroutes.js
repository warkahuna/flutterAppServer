var mysql      = require('mysql');
var bcrypt = require('bcryptjs');

const {  validationResult } = require('express-validator');

  var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database : 'project'
  });
  connection.connect(function(err){ 
if(!err) {
    console.log("Database is connected");
} else {
    console.log("Error connecting database");
}
  });
  

  exports.login =   function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    connection.query('SELECT * FROM user WHERE username = ?',[username], function (error, results, fields) {
    if (error) {
      // console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      // console.log('The solution is: ', results);
      if(results.length >0){
        if( bcrypt.compareSync(password,results[0].password)){ 
          res.status(200).json({
            message: "JSON Data received successfully"
          })
        }
        else{
          res.send({
            "code":204,
            "success":"Username and password does not match"
              });
        }
      }
      else{
        res.send({
          "code":204,
          "success":"Username does not exits"
            });
      }
    }
    });
  }
  exports.register =  function(req,res){
    var today = new Date()
   const hasedPassword =  bcrypt.hashSync(req.body.password,10) 
   var username = req.body.username;
   var address = req.body.address;
   var mobile = req.body.mobile
   var first_name = req.body.firstname
   var last_name = req.body.lastname
   connection.query('SELECT * from user where username = ?',[username], function (error, results, fields) {
        if (error) {
      console.log("error ocurred",error);
         res.status(400).json({error: "error ocurred"})}
        if(results.length >0)
        {
            if(!results[0].password && results[0].provider && results[0].idprovider)
            {
                var users={
                  "password":hasedPassword,
                   "created":today,
                   "modified":today,
                   "firstname":first_name,
                    "lastname":last_name,
                    "tele_num" : mobile,
                    "address" : address
                }
                connection.query('UPDATE user SET ? where username = ?',[users,username],function(error, results, fields) {if (error) {
                  console.log("error ocurred",error);
                  res.status(400).json({error: "error ocurred"})
                }else{
                  console.log('The solution is: ', results);
                  res.status(200).json({success: "user registered sucessfully"})
                }
                });
            }else
            {
              return res.status(200).json({err:"username already exist "})
            }

        }else
        {
    var users={
      //"first_name":req.body.first_name,
      //"last_name":req.body.last_name,
      "username":req.body.username,
      "password":hasedPassword,
      "created":today,
      "modified":today,
      "firstname":first_name,
      "lastname":last_name,
      "tele_num" : mobile,
      "address" : address
    }
    connection.query('INSERT INTO user SET ?',users, function (error, results, fields) {
    if (error) {
      console.log("error ocurred",error);
      res.status(400).json({error: "something went wrong"})
    }else{
      console.log('The solution is: ', results);
      res.status(200).json({success: "user registered sucessfully"})
    }
    });
  }})}
  exports.registerProvider =  function(req,res){
  
    // console.log("req",req.body);
    var username = req.body.username
    var provider = req.body.provider_facebook
    var uniqueid = req.body.uniqueid
    var first_name = req.body.firstname
    var last_name = req.body.lastname
    
    
    connection.query('SELECT * from user where username = ?',[req.body.username],function(error,results,fields)
    {
      if(error){

        console.log("error ocurred",error);
         res.status(400).json({error: "error ocurred"})

      }
      if(results.length > 0)
      {
        var today = new Date()

        var users={
      "provider_facebook":provider,
      "idprovider_facebook": uniqueid,
      "modified":today
       }
       
       connection.query('UPDATE user SET  ? where username = ?',[users,username],function(error,results,fields){
  
        if (error) {
            console.log("error ocurred",error);
            res.status(400).json({error: "error ocurred"})
        }else{
            console.log('The solution is: ', results)
            res.status(200).json({success: "user exists and updated sucessfully"})
        }})


      }else
      {
        var today = new Date()

        var users={

      "username":username,
      "provider_facebook":provider,
      "idprovider_facebook":uniqueid,
      "firstname":first_name,
      "lastname":last_name,
      "created":today,
      "modified":today
      }
      connection.query('INSERT INTO user SET ?',users, function (error, results, fields) {
        if (error) {
          console.log("error ocurred",error);
          res.status(400).json({error: "error ocurred"})
          
        }else{
          console.log('The solution is: ', results);
          res.status(201).json({created: "user added provider"}) 
               
          
        }
        });




      }






    })
    
  }

  exports.loginProvider = function(req,res){

    var username = req.body.username;
    var provider = req.body.provider;
    var idprovider = req.body.idprovider;
    connection.query('SELECT * FROM user WHERE username = ? and provider = ? and idprovider_facebook= ?',[username,provider,idprovider], function (error, results, fields) {
    if (error) {
      // console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      // console.log('The solution is: ', results);
      if(results.length >0){
         
          res.send({
            "code":200,
            "success":"login Provier "+req.body.provider+" sucessfull"              });
      }
      else{
        res.send({
          "code":404,
          "failed":"User not Found"
            });
      }
    }
    });
  }
  exports.Updater = function(req,res){

    var firstname = req.body.firstname
    var lastname = req.body.lastname
    var username = req.body.username
    var telenumber = req.body.telenumber
    var address = req.body.address

    var user={
    
      "firstname":  firstname,
      "lastname" : lastname,
      "tele_num" : telenumber,
      "address" : address
    }
    connection.query('Select * from user where username = ?',[username],function(error,results,fields){
      if(results.length> 0)
      {
          connection.query('UPDATE user SET ? where username = ?',[user,username], function(error,results,fields){
            if (error) {
              console.log("error ocurred",error);
              res.send({
                "code":400,
                "failed":"error ocurred"
              })}else{
                console.log('The solution is: ', results);
                res.send({
                  "code":200,
                  "success":"Update sucessfull"});
            }
            
          })
        }else
        {
          res.send({
            "code":404,
            "failed":"User not found"}); 
        }
      
      })
  }

  exports.ChangePasword = function (req,res)
  {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })}
    const hasedPassword =  bcrypt.hashSync(req.body.password,10) 
    var username = req.body.username


    var user ={
      "password" : hasedPassword
      }
      connection.query('UPDATE user SET  ? where username = ?',[user,username],function(error,results,fields){

        if (error) {
          console.log("error ocurred",error)
          res.send({
            "code":400,
            "failed":"error ocurred"

          })}else{
            console.log('The solution is: ', results)
            res.send({
              "code":200,
              "success":"Password upated sucessfully"})
        }
      })


  }

  exports.getUser = function(req,res)
  {
    var username = req.body.username

    connection.query('SELECT * from user where username= ?',[username],function(error,results,fields){

      if(error)
      {
        console.log("error ocurred",error)
          res.send({
            "code":400,
            "failed":"error ocurred"

          })
      }
      if(results.length>0)
      {
        res.status(200).json(results)
      }else
      {
        res.send({
          "code":404,
          "failed":"User not found"}); 
      }

    })
  }

  exports.passwordRequester = function(req,res){
    
  }

  exports.updateUserF = function(req,res)
{

    var firstname =req.body.firstname
    var lastname = req.body.lastname
    var phone = req.body.phone
    var username = req.body.username
    var address = req.body.address
  
    var firstname_b,lastname_b,phone_b,address_b
    connection.query('SELECT * from user where username = ?',[username],function(error,results,fields)
    {
        if(error){

            console.log("error ocurred",error);
             res.status(400).json({error: "error ocurred"})

        }
        if(results.length > 0)
        {
          firstname_b = results[0].firstname
          lastname_b = results[0].lastname
          phone_b = results[0].tele_num
          address_b = results[0].address

    if(firstname == null )
    {
        firstname = firstname_b
    }

    if(lastname == null)
    {
      lastname = lastname_b
    }
    if(phone == null)
    {
      phone = phone_b
    }
    if(address == null)
    {
      address = address_b
    }
    var today = new Date()
    
   var user =
     {
        "firstname" : firstname,
        "lastname" : lastname,
        "tele_num" : phone,
        "address" : address,
        "modified":today 
    }
    connection.query('UPDATE user SET  ? where username = ?',[user,username],function(error,results,fields){
  
        if (error) {
            console.log("error ocurred",error);
            res.status(400).json({error: "error ocurred"})
        }else{
            console.log('The solution is: ', results)
            res.status(200).json({success: "user updated sucessfully"})
        }
      })
        }else
        {
           return res.status(404).json({notfound: "no Auctions are found"})   
        }

    })
    

  }
  
  