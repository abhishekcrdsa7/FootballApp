var express = require("express");
var app = express();
var request = require("request");
app.set("view engine","ejs");
var bodyParser = require("body-parser");
app.use(express.static(__dirname+"/public"));


app.get("/",function(req, res){
    res.render("landing");
});


app.use(function(req, res, next){
    request("http://api.football-data.org/v1/competitions",function(error,response,body){
       if(!error && response.statusCode == 200){
          var bdy = JSON.parse(body);
          res.locals.comp = bdy;
          next();
       }
    });
});






app.get("/competitions",function(req, res){
    res.render("index");
});

app.get("/competitions/:id/fixtures", function(req, res){
            request("http://api.football-data.org/v1/competitions/"+req.params.id+"/fixtures",function(error, response, body){
            if(!error && response.statusCode == 200){
                var bdy = JSON.parse(body);
                res.render("fixtures",{bdy: bdy.fixtures,id: req.params.id});
            }
        });
});

app.get("/competitions/:id/leagueTable", function(req, res){
            
         request("http://api.football-data.org/v1/competitions/"+req.params.id+"/leagueTable",function(error, response, body){
                if(!error && response.statusCode == 200){
                        var bdy = JSON.parse(body);
                        res.render("leagueTable",{table: bdy.standing,id: req.params.id});
                }
           
         });    
});



app.get("/competitions/:id/teams",function(req,res){
    request("http://api.football-data.org/v1/competitions/"+req.params.id+"/teams",function(error, response, body){
        if(!error && response.statusCode == 200){
            var body = JSON.parse(body);
            res.render("teams",{teams: body.teams,id: req.params.id});
        }
    });
});


app.get("/teams/:id",function(req, res){
    var crest;
    var name;
    request("http://api.football-data.org/v1/teams/"+req.params.id,function(error, response,body){
        if(!error && response.statusCode == 200){
            var b = JSON.parse(body);
            crest = b.crestUrl;
            name = b.name;
        }
    });
    request("http://api.football-data.org/v1/teams/"+req.params.id+"/fixtures", function(error, response, body){
        if(!error && response.statusCode == 200){
            var fix = JSON.parse(body);
                request("http://api.football-data.org/v1/teams/"+req.params.id+"/players", function(error, response, body){
                    if(!error && response.statusCode == 200){
                        var players = JSON.parse(body);
                        res.render("team",{fixture: fix.fixtures,players: players.players,logo : crest, name: name});
                    }        
                });
            
            
            
            
            
        }
    });
});


app.listen(process.env.PORT,process.env.IP, function(){
    console.log("football app has started");
});