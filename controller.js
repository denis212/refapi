'use strict';

var response = require('./res');
var connection = require('./conn');

exports.listref = function(req, res) {
    connection.query('SELECT * from referral', function (error, rows, fields){
        if(error){
            console.log(error)
        } else{
            response.ok(rows, res)
        }
    });
};

exports.achieved = async function(req, res) {
  //function untuk parent level check sudah mendapat berapa referal dan dapat award berapa?
    var notlp = req.params.no_tlp;

    let log = await findTlp(notlp);
    let paramachieve = await findAchieve();

    var id_driver = log[0].id;

    connection.query('SELECT count(id) as total_referral from referral where status = 1 and id_driver = ?',[id_driver], function (error, rows, fields){
        if(error){
            console.log(error)
        } else{
            rows[0].target = paramachieve[0].value;
            rows[0].reward = Math.floor(rows[0].total_referral / rows[0].target);
            response.ok(rows, res);
        }
    });
};

function findTlp(notlp){
  /*function untuk cek nomor tlp yg digunakan apakah sudah ada dalam tbl parent*/
    return new Promise(resolve => {
        var query = 'SELECT * FROM parent where no_tlp = ?';
        connection.query(query,
            [ notlp ], function (error, rows, fields){
            if(error){
                console.log(error)
            } else{
                resolve(rows); //Kembalian berupa kontak data
            }
        });
    });
}

function findAchieve(){
  /*function untuk check parmeter dinamis yg bisa diset dari cms untuk minimum req. dptkan award*/
    return new Promise(resolve => {
        var query = 'SELECT * FROM achieve_param where id = 1';
        connection.query(query, function (error, rows, fields){
            if(error){
                console.log(error)
            } else{
                resolve(rows); //Kembalian berupa kontak data
            }
        });
    });
}

exports.addref = async function(req, res) {

    var jam = new Date();
    var postData = req.body;
    postData.created = jam;
    postData.updated = jam;

    /*check apakah code sudah terpakai di tbl parent?*/
    let log = await checkExistCode(postData.kode);
    // console.log(log.length);
    if(log.length >= 1){
      postData.id_driver = log[0].id;

      /*check nomor tlp apakah sudah terdaftar di table referal?*/
      let extcode = await checkExistPhoneRef(postData.no_tlp);
      // console.log(extcode.length);
      if(extcode.length == 0){
        connection.query('INSERT INTO referral set ?', postData , function (error, rows, fields){
            if(error){
                console.log(error)
            } else{
                response.ok(rows, res)
            }
        });
      }else {
          response.NotOk("No Telephone Telah terdaftar!", res);
      }
    }else {
      /*check nomor tlp apakah sudah terdaftar di table parent?*/
      let extcode = await checkExistPhoneDrv(postData.no_tlp);
      // console.log(extcode.length);
      if(extcode.length == 0){
        connection.query('INSERT INTO parent set ?', postData , function (error, rows, fields){
            if(error){
                console.log(error)
            } else{
                response.ok(rows, res)
            }
        });
      }else {
          response.NotOk("No Telephone Telah terdaftar!", res);
      }
    }

};

function checkExistCode(kode){
    return new Promise(resolve => {
        var query = 'SELECT * FROM parent where kode = ?';
        connection.query(query,
            [ kode ], function (error, rows, fields){
            if(error){
                console.log(error)
            } else{
                resolve(rows); //Kembalian berupa kontak data
            }
        });
    });
}

function checkExistPhoneRef(phone){
    return new Promise(resolve => {
        var query = 'SELECT no_tlp FROM referral where no_tlp = ?';
        connection.query(query,
            [ phone ], function (error, rows, fields){
            if(error){
                console.log(error)
            } else{
                resolve(rows); //Kembalian berupa kontak data
            }
        });
    });
}

function checkExistPhoneDrv(phone){
    return new Promise(resolve => {
        var query = 'SELECT no_tlp FROM parent where no_tlp = ?';
        connection.query(query,
            [ phone ], function (error, rows, fields){
            if(error){
                console.log(error)
            } else{
                resolve(rows); //Kembalian berupa kontak data
            }
        });
    });
}

exports.index = function(req, res) {
    response.ok("Hello from the Node JS RESTful side!", res)
};
