var express = require("express");
var login = require('./routes/loginroutes');
var comment = require('./routes/comments_routes');
const path = require('path') 

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var parts = require('./routes/parts_services')
const { check } = require('express-validator');
var bodyParser = require('body-parser');
app.set('view engine', 'ejs');

app.use(bodyParser.json({limit: '15mb'}));
app.use(bodyParser.urlencoded({limit: '15mb', extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
})
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

io.on('connection', function(socket){

    //socket id is the identifier that changes everytime someone gets in side a room
    console.log(' user connected on '+socket.id);

    socket.on('connect user', function(user){
      console.log("Connected user ");
      io.emit('connect user', user);
    });
  
    socket.on('on typing', function(typing){
      console.log("Typing.... ");
      io.emit('on typing', typing);
    });
    socket.on('message',function(data){
        Object.keys(io.sockets.sockets).forEach(function(sock){
            if(sock != socket.id)
            {
                io.to(sock).emit('message',data);
                return
            }
        })
    })
    socket.on('disconnect',function(){
        console.log('user disconnected '+socket.id);
    })

  })

var router = express.Router();// test route
router.get('/', function(req, res) {
    res.json({ message: 'Connected' });
});

//route to handle user registration

//,[check('username').isEmail().withMessage('must be an email'),check('password').isLength({ min: 6 }).withMessage('must be at least 6 chars long'),
//check('passwordConfirmation').exists().custom((value, { req }) => value === req.body.password).withMessage('must be identical to the password')],
router.post('/register', login.register)
router.post('/login', login.login);

router.put('/registaprovider', login.registerProvider);
router.post('/loginProvider',login.loginProvider)
router.put('/Dataupadte',login.Updater)
router.put('/Changepassword',[check('password').isLength({ min: 6 }).withMessage('must be at least 6 chars long'),
check('passwordConfirmation').exists().custom((value, { req }) => value === req.body.password).withMessage('must be identical to the password')],login.ChangePasword)
router.post('/getUser',login.getUser)
router.post('/reset-password',login.passwordRequester)
//router.get('/annonces/getAll',login.getAllAnnounces)
//router.delete('/annonces/delete',login.delete)
router.post('/parts/getPartsIduser',parts.getPartsIduser)
//router.post('/annonces/add',login.addAnnoncement)
router.post('/parts/add',parts.addParts)
router.delete('/parts/deletePart',parts.deleteId)
router.get('/parts/getAuctions',parts.getAuctions)
router.get('/parts/getSells',parts.getSells)
router.put('/parts/addAuction',parts.addAuction)
router.put('/parts/addSell',parts.addSell)
router.put('/parts/neutralizeParts',parts.neutralizeParts)
router.put('/parts/updatePart',parts.updateParts)
router.put('/parts/auctioning',parts.Auctioning)
router.put('/parts/deadauction',parts.DeadAuction)
router.put('/parts/deadSellable',parts.DeadSellable)
router.post('/parts/myparts',parts.myparts)
router.post('/parts/searchSell',parts.searchDynamicSells)
router.post('/parts/searchAuction',parts.searchDynamicAuctions)
router.post('/comments/getComments',comment.getComments)
router.put('/comments/UpdateVotes',comment.UpdateUpvote)
router.post('/comments/addComment',comment.addComment)
router.post('/comments/checkVoter',comment.checkVoter)
router.put('/parts/UpdateVues',parts.vues)
router.post('/parts/getCatDeal',parts.getCatDeal)
router.post('/comments/Neutralize',comment.NeturalizeVote)
router.post('/comments/getUsernameandComments',comment.getUsernameandComments)
router.post('/comments/DisableComments',comment.DisableComments)
router.post('/comments/EditComment',comment.EditComment)
router.post('/parts/getSellSorted',parts.getSellSorted)
router.post('/parts/getOneSell',parts.getOneSell)
router.post('/parts/DeadParts',parts.DeadParts)
router.put('/updateUserF',login.updateUserF)
app.use('/api', router);

http.listen(5000);

