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
  });



  exports.getComments =  function(req,res)
  {
    var dealid =req.body.dealid
    connection.query('SELECT firstname,lastname,username,c.idcomments,c.text,c.dealid,c.votes,c.state,c.created from user as p  join (select * from comments where dealid = ? and (state = 0 or state =2) order by votes DESC , created ASC) as c where p.username = c.userid ',[dealid],function(error,results,fields){

      if(error)
      {
        console.log("error ocurred",error)
        res.status(400).json({error: "error ocurred"})
      }
      if(results.length>0)
      {
        res.status(200).json(results)
      }else
      {
        res.status(200).json({failed: "no comments found"})
      }
      }
      )}

    exports.UpdateUpvote = function(req,res)
    {
      const ref = req.body.ref
      const commentid = req.body.commentid
    
      const username = req.body.username
      var oldVotes 
      var vote 
    
        if(ref === "up")
        {
            connection.query('SELECT * from votes where username = ? and idcomment = ?',[username,commentid],function(error,results,fields){
                if(error)
                {
                  console.log("error ocurred",error)
                }
                if(results.length>0)
                { 
                    connection.query('DELETE  from votes where username = ? and idcomment = ?',[username,commentid],function(error,results,fields){

                        if(error){
                
                            console.log("error ocurred",error);
                        }else
                        {
                            console.log("arro yo !");

                            
                        }
                
                        
                    })  
                }
                connection.query('SELECT  (Select count(idVotes) as votes  from  votes where idcomment = ? and ref="up") -(Select count(idVotes) as votes  from  votes where idcomment = ? and ref="down") AS result ',[commentid,commentid],function(error,results,fields){
 
                  if(error)
                {
                  console.log("error ocurred",error)
                  
                }
                if(results.length>0)
                {
                  oldVotes = results[0].result
                  vote = oldVotes +1
                  var comment = {
                    "votes" : vote
                  } 
                
                  connection.query('UPDATE comments SET  ? where idcomments = ?',[comment,commentid],function(error,results,fields){
    
                    if (error) {
        
                        console.log("error ocurred",error)
                        res.status(400).json({error: "error ocurred"})
                      }else{
                               var part= {
                                "username" : username,
                                "idcomment": commentid,
                                "ref" : ref
                            }
                        connection.query('INSERT INTO votes SET ?',[part],function(error,results,fields)
                        {
                            if(error){
                    
                                console.log("error ocurred",error);
                                 
                    
                            }else
                            {
                                console.log("everythingis good"); 
                    
                            }
                        })
                          console.log('The solution is: ', results)
                          
                       res.status(200).json({success: "vote has been added"})
                        }})
                }
              })
            
              })

              

          }else if (ref === "down")
          {
            connection.query('SELECT * from votes where username = ? and idcomment = ?',[username,commentid],function(error,results,fields){
              if(error)
              {
                console.log("error ocurred",error)
              }
              if(results.length>0)
              { 
                  connection.query('DELETE  from votes where username = ? and idcomment = ?',[username,commentid],function(error,results,fields){

                      if(error){
              
                          console.log("error ocurred",error);
                      }else
                      {
                          console.log("arro yo !");

                          
                      }
              
                      
                  })  
              }
              connection.query('SELECT  (Select count(idVotes) as votes  from  votes where idcomment = ? and ref="up") -(Select count(idVotes) as votes  from  votes where idcomment = ? and ref="down") AS result ',[commentid,commentid],function(error,results,fields){

                if(error)
              {
                console.log("error ocurred",error)
                
              }
              if(results.length>0)
              {
                oldVotes = results[0].result
                vote = oldVotes -1
                var comment = {
                  "votes" : vote
                } 
              
                connection.query('UPDATE comments SET  ? where idcomments = ?',[comment,commentid],function(error,results,fields){
  
                  if (error) {
      
                      console.log("error ocurred",error)
                      res.status(400).json({error: "error ocurred"})
                    }else{
                             var part= {
                              "username" : username,
                              "idcomment": commentid,
                              "ref" : ref
                          }
                      connection.query('INSERT INTO votes SET ?',[part],function(error,results,fields)
                      {
                          if(error){
                  
                              console.log("error ocurred",error);
                               
                  
                          }else
                          {
                              console.log("everythingis good"); 
                  
                          }
                      })
                        console.log('The solution is: ', results)
                        
                     res.status(200).json({success: "vote has been added"})
                      }})
              }
            })
          
            })
  
                
          }
  }


      
        

exports.addComment = function(req,res)
{
    const text = req.body.text
    const username =req.body.username
    const dealid = req.body.dealid
    var comment =
     {
        "text" : text,
        "userid" : username,
        "dealid" : dealid
    }

    connection.query('INSERT INTO comments SET ?',[comment],function(error,results,fields)
    {
        if(error){

            console.log("error ocurred",error);
             res.status(400).json({error: "error ocurred"})

        }else
        {
             res.status(201).json({success: "the comment has been added sucessfully"})

        }
    })




}

exports.checkVoter = function(req,res)
{
username =req.body.username
dealid = req.body.dealid
connection.query('select idVotes,idcomments,o.ref,o.username from comments as b   join (select * from votes where username = ?) as o where o.idcomment = b.idcomments and  b.dealid =? ',[username,dealid],function(error,results,fields){
  if(error)
  {
    console.log("error ocurred",error)
    res.status(400).json({error: "error ocurred"})
  }
  if(results.length>0)
  { 
    res.status(200).json(results)
  }else
  {
    res.status(200).json({failed: "no comments found"})
  }
  }
  )}


  exports.DisableComments = function(req,res)
{
  const id = req.body.idcomment
  var comment = {

      "state" : "1"
  
  }
      connection.query('UPDATE comments SET  ? where idcomments = ?',[comment,id],function(error,results,fields){

          if (error) {
              console.log("error ocurred",error)
              res.status(400).json({error: "error ocurred"})
            }else{
                console.log('The solution is: ', results)
                
             res.status(200).json({success: "Comment disabled sucessfully"})
              }})
            
}

exports.NeturalizeVote = function(req,res)
{

  const commentid = req.body.commentid
    
      const username = req.body.username
  connection.query('SELECT * from votes where username = ? and idcomment = ?',[username,commentid],function(error,results,fields){
    if(error)
    {
      console.log("error ocurred",error)
      
    }
    if(results.length>0)
    { 
        connection.query('DELETE  from votes where username = ? and idcomment = ?',[username,commentid],function(error,results,fields){
            if(error){
    
                console.log("error ocurred",error);
                res.status(400).json({error: "error ocurred"})
            }else
            {
              connection.query('SELECT  (Select count(idVotes) as votes  from  votes where idcomment = ? and ref="up") -(Select count(idVotes) as votes  from  votes where idcomment = ? and ref="down") AS result ',[commentid,commentid],function(error,results,fields)
                {
                    if(error)
                  {
                    console.log("error ocurred",error)
                    
                  }
                  if(results.length>0)
                  {
                    oldVotes = results[0].result
                    vote = oldVotes 
                    var comment = {
                      "votes" : vote
                    } 
                  
                    connection.query('UPDATE comments SET  ? where idcomments = ?',[comment,commentid],function(error,results,fields)
                    {
      
                      if (error) {
          
                          console.log("error ocurred",error)
                          res.status(400).json({error: "error ocurred"})
                        }else{
                            
                            res.status(200).json({success: "Neutralized"})
                          }})
                  }
                })
                console.log("Neutralized !");
              
  
            }
    
            
        })  
    }})

}

exports.getUsernameandComments = function(req,res)
{

  var username =req.body.username
  var dealid =req.body.dealid
  connection.query('select firstname,lastname,(Select count(idcomments) from  comments where dealid = ? and (state = 0 or state =2))as result from user where username = ?',[dealid,username],function(error,results,fields){

    if(error)
    
    {
      console.log("error ocurred",error)
      res.status(400).json({error: "error ocurred"})
    }
    if(results.length>0)
    {
      res.status(200).json(results)
    }else
    {
      res.status(200).json({failed: "no comments found"})
    }
    }
    )}

    exports.EditComment = function(req,res)
    {
      const id = req.body.idcomment
      var text = req.body.text
      var comment = {
    
          "text" : text,
          "state": "2"
      
      }
          connection.query('UPDATE comments SET  ? where idcomments = ?',[comment,id],function(error,results,fields){
    
              if (error) {
                  console.log("error ocurred",error)
                  res.status(400).json({error: "error ocurred"})
                }else{
                    console.log('The solution is: ', results)
                    
                 res.status(200).json({success: "Comment Updated sucessfully"})
                  }})
                
    }    




