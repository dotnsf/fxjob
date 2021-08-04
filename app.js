//. app.js
var request = require( 'request' );
var Cloudantlib = require( '@cloudant/cloudant' );

//. env values
var settings_db_username = 'DB_USERNAME' in process.env ? process.env.DB_USERNAME : ''; 
var settings_db_password = 'DB_PASSWORD' in process.env ? process.env.DB_PASSWORD : ''; 
var settings_db_name = 'DB_NAME' in process.env ? process.env.DB_NAME : 'fx_job_db'; 
var settings_db_url = 'DB_URL' in process.env ? process.env.DB_URL : ''; 

//. FX information server
var fxserver = 'http://www.gaitame.com/rate/neo20/rate_UTF8.asp';

if( settings_db_username && settings_db_password && settings_db_url ){
  var option = {
    method: 'GET',
    url: fxserver,
    encoding: null
  };
  request( option, function( err0, res0, buf0 ){
    if( err0 ){
      console.log( { err0 } );
    }else{
      var rate = {};
      var csv = buf0.toString( 'utf-8' );
      csv = csv.split( "\r" ).join( "" );
      var lines = csv.split( "\n" );
      for( var i = 0; i < lines.length; i ++ ){
        var line = lines[i];
        var x = line.split( "," );
        if( x.length > 1 ){
          var name = x[0];
          var bid = x[1];
          rate[name] = parseFloat( bid );
        }
      }

      var id = ( new Date() ).toISOString();
      var doc = { _id: id };
      doc['datetime'] = timestamp2datetime( ( new Date() ).getTime() );
      doc['rate'] = rate;

      connect( settings_db_username, settings_db_password, settings_db_url, settings_db_name ).then( function( db ){
        if( db ){
          db.insert( doc, function( err1, body1 ){
            if( err1 ){
              console.log( { err1 } );
            }else{
              console.log( { body1 } );
            }
          });
        }else{
          console.log( "No db found." );
        }
      }).catch( function( err2 ){
        console.log( { err2 } );
      });
    }
  });
}else{
  console.log( "No enough env settings." );
}


function timestamp2datetime( ts ){
  var dt = new Date( ts );
  var yyyy = dt.getFullYear();
  var mm = dt.getMonth() + 1;
  var dd = dt.getDate();
  var hh = dt.getHours();
  var nn = dt.getMinutes();
  var ss = dt.getSeconds();
  var tz = dt.getTimezoneOffset() / -60;
  var datetime = yyyy + '-' + ( mm < 10 ? '0' : '' ) + mm + '-' + ( dd < 10 ? '0' : '' ) + dd
    + ' ' + ( hh < 10 ? '0' : '' ) + hh + ':' + ( nn < 10 ? '0' : '' ) + nn + ':' + ( ss < 10 ? '0' : '' ) + ss
    + ( tz >= 0 ? '+' : '-' ) + Math.abs( tz );
  return datetime;
}

async function connect( db_username, db_password, db_url, db_name ){
  return new Promise( ( resolve, reject ) => {
    var db = null;
    if( db_username && db_password && db_url && db_name ){
      var cloudant = Cloudantlib( { username: db_username, password: db_password, url: db_url } );
      if( cloudant ){
        cloudant.db.get( db_name, function( err, body ){
          if( err ){
            if( err.statusCode == 404 ){
              cloudant.db.create( db_name, function( err, body ){
                if( err ){
                  db = null;
                  reject( 'failed to create db.' );
                }else{
                  db = cloudant.db.use( db_name );
                  resolve( db );
                }
              });
            }else{
              db = cloudant.db.use( db_name );
              resolve( db );
            }
          }else{
            db = cloudant.db.use( db_name );
            resolve( db );
          }
        });
      }else{
        reject( 'failed to connect.' );
      }
    }else{
      reject( 'no enough information to connet.' );
    }
  });
}
