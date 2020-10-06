var mysql      = require('mysql');
var crypto = require('crypto');
var fs = require('fs');





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

exports.getPartsIduser = function(req,res)
{

    connection.query('SELECT * FROM parts WHERE owner = ?',[req.body.username],function(error,results,fields)
    {
        if(error){

            Console.log("error ocurred",error);
             res.status(400).json({error: "error ocurred"})

        }
        if(results.length > 0)
        {
             res.status(200).json(results)

        }else
        {
            res.status(404).json({notfound: "no parts are found for the username "+req.body.username})   
        }
    })

}

exports.addParts = function(req,res)
{
    var Created = new Date()
    const owner = req.body.username
    const name =req.body.name
    const refrence = req.body.refrence
    const Type = req.body.Type
    const tag_description = req.body.tag_description
    const other1 = req.body.other1
    const other2 = req.body.other2
    const other3 = req.body.other3
    const String_image = req.body.String_image
    if(!String_image || !String_image === "" || String_image != null){
    var path = ImageCreator(String_image)
    }else
    {
        path = " "
    }
    


   var part =
     {
        "owner" : owner,
        "name" : name,
        "refrence" : refrence,
        "Type" : Type,
        "tag_description" : tag_description,
        "other1" : other1,
        "other2" : other2,
        "other3" : other3,
        "Created" : Created,
        "String_image" : path
    }
    

    connection.query('INSERT INTO parts SET ?',[part],function(error,results,fields)
    {
        if(error){

            Console.log("error ocurred",error);
             res.status(400).json({error: "error ocurred"})

        }else
        {
             res.status(201).json({success: "the Part has been added sucessfully"})

        }
    })




}

exports.updateParts = function(req,res)
{

    var name =req.body.name
    var refrence = req.body.refrence
    var Type = req.body.Type
    var tag_description = req.body.tag_description
    var other1 = req.body.other1
    var other2 = req.body.other2
    var other3 = req.body.other3
    var String_imagey = req.body.String_image
    
    var name_b,refrence_b,Type_b,tag_description_b,other1_b,other2_b,other3_b,string_path
    connection.query('SELECT * from parts where idparts = ?',[req.body.idparts],function(error,results,fields)
    {
        if(error){

            console.log("error ocurred",error);
             res.status(400).json({error: "error ocurred"})

        }
        if(results.length > 0)
        {
           name_b = results[0].name
           refrence_b = results[0].refrence
           Type_b = results[0].Type
           tag_description_b = results[0].tag_description
           other1_b = results[0].other1
           other2_b = results[0].other2
           other3_b = results[0].other3
           string_path=results[0].String_image
           String_image_b= ImageSelector(results[0].String_image);

           

    if(refrence == null )
    {
        refrence = refrence_b
    }

    if(Type == null)
    {
        Type = Type_b
    }
    if(name == null)
    {
        name = name_b
    }
    if(tag_description == null)
    {
    tag_description = tag_description_b
    }
    if(other1 == null)
    {
      other1 = other1_b
    }
    if(other2 == null)
    {
      other2 = other2_b
    }
    if(other3 == null)
    {
     other3= other3_b

    }

    if(String_imagey == null){
        String_imagey = string_path
    }else
    {
        if(!String_imagey || !String_imagey === "" || String_imagey != null){
            String_imagey = ImageCreator(String_imagey)
            }else
            {
                String_imagey = " "
            }

    }
    

    

   var part =
     {
        "refrence" : refrence,
        "Type" : Type,
        "tag_description" : tag_description,
        "other1" : other1,
        "other2" : other2,
        "other3" : other3,
        "name" : name,
        "String_image" : String_imagey
    }
    connection.query('UPDATE parts SET  ? where idparts = ?',[part,req.body.idparts],function(error,results,fields){
  
        if (error) {
            console.log("error ocurred",error);
            res.status(400).json({error: "error ocurred"})
        }else{
            console.log('The solution is: ', results)
            res.status(200).json({succes: "part updated sucessfully"})
        }
      })
        }else
        {
           return res.status(200).json({notfound: "no Auctions are found"})   
        }

    })
    

}

exports.deleteId = function(req ,res)
{
    connection.query('DELETE  From parts where idparts = ?',[req.body.deleteId],function(error,results,fields){

        if(error){

            console.log("error ocurred",error);
             res.status(400).json({error: "error ocurred"})

        }else
        {
            res.status(202).json({sucess: "the Part has been deleted sucessfully"})   
        }

        
    })
    


}

exports.getAuctions = function (req,res)
{
    
    connection.query('SELECT * FROM parts WHERE AUCTION ="YES" order by Starting_ah DESC',function(error,results,fields)
    {
        if(error){

            console.log("error ocurred",error);
             res.status(400).json({error: "error ocurred"})

        }
        if(results.length > 0)
        {
             res.status(201).json(results)

        }else
        {
            res.status(404).json({notfound: "no Auctions are found"})   
        }
    })


}

exports.getSells = function (req,res)
{

    connection.query('SELECT sellable_date,vues,String_image,idparts,name,refrence,Type,Created,tag_description,Price,other1,other2,other3,state,owner FROM parts WHERE SELL ="YES" order by vues DESC',function(error,results,fields)
    {
        if(error){

            console.log("error ocurred",error);
             res.status(400).json({error: "error ocurred"})

        }
        if(results.length > 0)
        {
            for(var i = 0; i < results.length;i++) {

                var Convertion = ImageSelector(results[i].String_image);
                results[i].String_image =  Convertion;
            }
             res.status(201).json(results)

        }else
        {
            res.status(404).json({notfound: "no Sells are found"})   
        }
    })


}

exports.addAuction = function(req,res)
{
    var Starting_timer = new Date()
    const id = req.body.idparts
    const Starting_Price =req.body.Starting_Price
    const timer = req.body.timer
    const adding_price = Starting_Price
    var date = Starting_timer.getTime()
    date += (timer * 60 * 60 * 1000);
    ending_date = new Date(date)
    
    var auction = {
        "Auction" : "YES",
        "Sell" :"NO",
        "Price" : null,
        "Starting_price" : Starting_Price,
        "adding_price" : adding_price,
        "Ending_date" : ending_date,
        "Starting_ah" : Starting_timer,
        "auction_time" : timer+"h"
    } 
    
        connection.query('UPDATE parts SET  ? where idparts = ?',[auction,id],function(error,results,fields){
  
            if (error) {
                console.log("error ocurred",error)
                res.status(400).json({error: "error ocurred"})
              }else{
                  console.log('The solution is: ', results)
                  
               res.status(200).json({success: "Auction added sucessfully"})
                }})
                
}

exports.addSell = function(req,res)
{

     var Starting_timer = new Date()
    const id = req.body.idparts
    const price = req.body.price
    var sell = {

        "Auction" : "NO",
        "Sell" :"YES",
        "Price" : price,
        "Starting_price" : null,
        "adding_price" : null,
        "Ending_date" : null,
        "Starting_ah" : null,
        "auction_time" : null,
        "sellable_date":Starting_timer
    
    } 
    
        connection.query('UPDATE parts SET  ? where idparts = ?',[sell,id],function(error,results,fields){
  
          
            if (error) {
                console.log("error ocurred",error)
                res.status(400).json({error: "error ocurred"})
              }else{
                  console.log('The solution is: ', results)
                  
               res.status(200).json({success: "a Sellable added sucessfully"})
                }})
            
}

exports.neutralizeParts = function (req,res)
{
    const id = req.body.idparts
    var part = {

        "Auction" : "NO",
        "Sell" :"NO",
        "Price" : 0,
        "Starting_price" : null,
        "adding_price" : null,
        "Ending_date" : null,
        "Starting_ah" : null,
        "auction_time" : null
    
    } 
    
        connection.query('UPDATE parts SET  ? where idparts = ?',[part,id],function(error,results,fields){
  
            if (error) {
                console.log("error ocurred",error)
                res.status(400).json({error: "error ocurred"})
              }else{
                  console.log('The solution is: ', results)
                  
               res.status(200).json({success: "part Neutralized sucessfully"})
                }})
                
         


}

exports.Auctioning = function(req,res)
{
    const id= req.body.idparts
    
    var adding_price = req.body.adding_price
    var new_price 
    connection.query('SELECT adding_Price from parts where idparts = ?',[id],function(error,results,fields)
    {
        if(error){

            console.log("error ocurred",error);
             res.status(400).json({error: "error ocurred"})

        }
        if(results.length > 0)
        {
          new_price = parseFloat(results[0].adding_Price) + parseFloat(adding_price)
          connection.query('UPDATE parts SET  adding_Price = ? where idparts = ?',[new_price,id],function(error,results,fields){
  
            if (error) {
              console.log("error ocurred",error)
              res.status(400).json({error: "error ocurred"})
            }else{
                console.log('The solution is: ', results)
                
             res.status(200).json({success: "Price incremented sucessfully"})
              }})
               
        

        }else
        {
            res.status(404).json({notfound: "no Sells are found"})   
        }      




    })


}

exports.DeadAuction = function(req,res)
{

    const id = req.body.idparts
    var now =  new Date()

    connection.query('SELECT Ending_date ,adding_Price from parts where idparts = ?',[id],function(error,results,fields)
    {
        if(error){

            console.log("error ocurred",error);
             res.status(400).json({error: "error ocurred"})

        }
        if(results.length > 0)
        {
            
            var old = Date.parse(results[0].Ending_date)
            if(!old)
            {
             console.log("Auction has been Neutrilzed")    
                
            }
            else if(now >= old)
            {

            const id = req.body.idparts
            var part = {

                "Auction" : "NO",
                "Sell" :"NO",
                "Final_Price" : results[0].adding_Price,
                "state" : "SOLD"            
            } 
            
                connection.query('UPDATE parts SET  ? where idparts = ?',[part,id],function(error,results,fields){
          
                    if (error) {
                        console.log("error ocurred",error)
                        res.status(400).json({error: "error ocurred"})
                      }else{
                          console.log('The solution is: ', results)
                          
                       res.status(200).json({success: "part Neutralized sucessfully"})
                        }})
                        
                    }
                    else{

                        return console.log("Auction still in process")
                    }    

        }else
        {
            res.status(404).json({notfound: "no Sells are found"})   
        }     
    })



}

exports.DeadSellable = function(req,res)
{
    const id = req.body.idparts

    connection.query('SELECT * from parts where idparts = ?',[id],function(error,results,fields)
    {
        if(error){

            console.log("error ocurred",error);
             res.status(400).json({error: "error ocurred"})

        }

        if(results.length > 0)
        {
            
            var part =
            {
               "owner" : results[0].owner,
               "name" : results[0].name,
               "refrence" : results[0].refrence,
               "Type" : results[0].Type,
               "tag_description" : results[0].tag_description,
               "other1" : results[0].other1,
               "other2" : results[0].other2,
               "other3" : results[0].other3,
               "Created" : results[0].Created,
               "Auction" : results[0].Auction,
               "Sell" : results[0].Sell,
               "Final_Price" : results[0].Final_Price,
               "Price" : results[0].Price,
               "state" : results[0].state,
               "Starting_price" : results[0].Starting_price,
               "adding_Price" : results[0].adding_Price,
               "Ending_date" : results[0].Ending_date,
               "Starting_ah" : results[0].Starting_ah,
               "auction_time" : results[0].auction_time,
               "last_idparts" : results[0].idparts
           }
          
           
         
           connection.query('INSERT INTO historique_parts SET ?',[part],function(error,results,fields)
           {
               if(error){
         
                   console.log("error ocurred",error);
                   
            }}) 
            
            var parts = {
         
                "Auction" : "NO",
                "Sell" :"NO",
                "Final_Price" : results[0].Price,
                "state" : "SOLD"            
            } 
           
                connection.query('UPDATE parts SET  ? where idparts = ?',[parts,id],function(error,results,fields){
          
                    if (error) {
                        console.log("error ocurred",error)
                        res.status(400).json({error: "error ocurred"})
                      }else{
                          console.log('The solution is: ', results)
                          
                       res.status(200).json({success: "sellable is sold sucessfully"})
                        }})
         
               }else
               {
                    
                console.log("Insert done",error);
               }
           })


}

 function ImageCreator(String_image_base64)
{
    var dir = './images';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    const String_image = String_image_base64
    const String_imag_name = 'image'+crypto.randomBytes(4).readUInt32LE(0)+'_'
    var base64Data = String_image.replace(/^data:image\/png;base64,/, "");
    fs.writeFile(dir+"/"+String_imag_name+".png", base64Data, 'base64', function(err) {
    console.log(err)
  
})
        console.log(dir+"/"+String_imag_name+".png")
        return dir+"/"+String_imag_name+".png";
}



function ImageDestroyer(String_image_path)
{
    fs.unlinkSync(String_image_path,function(err){console.log(err)})

}

function ImageSelector(path)
{
    var imageAsBase64 = fs.readFileSync(path, 'base64');
        return imageAsBase64
}

exports.myparts = function(req,res)
  {
    var username =req.body.username
    connection.query('SELECT * from parts where owner= ?',[username],function(error,results,fields){

      if(error)
      {
        console.log("error ocurred",error)
        res.status(400).json({error: "error ocurred"})
      }
      if(results.length>0)
      {
        for(var i = 0; i < results.length;i++) {

            var Convertion = ImageSelector(results[i].String_image);
            results[i].String_image =  Convertion;
        }
        res.status(200).json(results)
      }else
      {
        res.status(200).json({failed: "no parts found"})
      }
  
      }
      )}
      
 
 exports.searchDynamicSells = function(req,res)
 {  

        var search =req.body.search
        connection.query('select * from parts where (name like ? or price like ? or Type like ?) and  (SELL = "YES" and State ="UNSORTED")',[search,search,search],function(error,results,fields){
    
          if(error)
          {
            console.log("error ocurred",error)
            res.status(400).json({error: "error ocurred"})
          }
          if(results.length>0)
          {
            for(var i = 0; i < results.length;i++) {
    
                var Convertion = ImageSelector(results[i].String_image);
                results[i].String_image =  Convertion;
            }
            res.status(200).json(results)
          }else
          {
            res.status(200).json({failed: "no parts found"})
          }
      
          }
          )}

exports.searchDynamicAuctions = function(req,res)
          {  
         
                 var search =req.body.search
                 connection.query('select * from parts where (name like ? or price like ? or refrence like ?) and  (AUCTION = "YES" and State ="UNSORTED")',[search,search,search],function(error,results,fields){
             
                   if(error)
                   {
                     console.log("error ocurred",error)
                     res.status(400).json({error: "error ocurred"})
                   }
                   if(results.length>0)
                   {
                     for(var i = 0; i < results.length;i++) {
             
                         var Convertion = ImageSelector(results[i].String_image);
                         results[i].String_image =  Convertion;
                     }
                     res.status(200).json(results)
                   }else
                   {
                     res.status(200).json({failed: "no parts found"})
                   }
               
                   }
                   )}          
                   
exports.vues = function(req,res)
{
    const id = req.body.idparts
    var newVues; 
    connection.query('SELECT vues FROM parts WHERE idparts = ? ',[id],function(error,results,fields)
    {
        if(error){
            console.log("error ocurred",error);
        }
        if(results.length > 0)
        {
           
            newVues = results[0].vues+1
            var part = {

                "vues" : newVues
            
            } 
        connection.query('UPDATE parts SET  ? where idparts = ?',[part,id],function(error,results,fields){
  
            if (error) {
                console.log("error ocurred",error)
                res.status(400).json({error: "error ocurred"})
              }else{
                  console.log('The solution is: ', results)
               res.status(200).json({success: " vues updated"})
                }})
        }
    })


   
    

} 

exports.getCatDeal = function(req,res)
{

    var key = req.body.key
    
    connection.query('SELECT vues,String_image,idparts,name,refrence,Type,Created,tag_description,Price,other1,other2,other3,state,sellable_date,owner FROM parts WHERE SELL ="YES" AND Type= ?',[key],function(error,results,fields)
    {
        if(error){

            console.log("error ocurred",error);
             res.status(400).json({error: "error ocurred"})

        }
        if(results.length > 0)
        {
            for(var i = 0; i < results.length;i++) {

                var Convertion = ImageSelector(results[i].String_image);
                results[i].String_image =  Convertion;
            }
             res.status(201).json(results)

        }else
        {
            res.status(404).json({notfound: "no Sells are found"})   
        }
    })



}

exports.getSellSorted = function(req,res)
{

    var key = req.body.key
    console.log("",key)
    connection.query('SELECT vues,String_image,idparts,name,refrence,Type,Created,tag_description,Price,other1,other2,other3,state,sellable_date,owner FROM parts WHERE SELL ="YES" Order by '+key,function(error,results,fields)
    {
        if(error){

            console.log("error ocurred",error);
             res.status(400).json({error: "error ocurred"})

        }
        if(results.length > 0)
        {
            for(var i = 0; i < results.length;i++) {

                var Convertion = ImageSelector(results[i].String_image);
                results[i].String_image =  Convertion;
            }
             res.status(201).json(results)

        }else
        {
            res.status(404).json({notfound: "no Sells are found"})   
        }
    })



}

exports.getOneSell= function(req,res)
{

    var idpart = req.body.idpart
    
    connection.query('SELECT vues,String_image,idparts,name,refrence,Type,Created,tag_description,Price,other1,other2,other3,state,owner FROM parts WHERE SELL ="YES" AND idparts= ?',[idpart],function(error,results,fields)
    {
        if(error){

            console.log("error ocurred",error);
             res.status(400).json({error: "error ocurred"})

        }
        if(results.length > 0)
        {
            for(var i = 0; i < results.length;i++) {

                var Convertion = ImageSelector(results[i].String_image);
                results[i].String_image =  Convertion;
            }
             res.status(201).json(results)

        }else
        {
            res.status(404).json({notfound: " Sell not found"})   
        }
    })

}

exports.DeadParts = function (req,res)
{
    const id = req.body.idparts
    var part = {

        "Auction" : "NO",
        "Sell" :"NO",
        "Price" : 0,
        "state" : "SOLDE"
    
    } 
    
        connection.query('UPDATE parts SET  ? where idparts = ?',[part,id],function(error,results,fields){
  
            if (error) {
                console.log("error ocurred",error)
                res.status(400).json({error: "error ocurred"})
              }else{
                  console.log('The solution is: ', results)
                  
               res.status(200).json({success: "part Disabled sucessfully"})
                }})
                
         


}





