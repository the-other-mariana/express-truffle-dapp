const fs = require('fs');
const readline = require('readline');
const lineReader = require('line-reader');

module.exports = {
    register: function (params) {
        fs.appendFile(params.file, params.data + '\n', function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
    },
    check: function (params) {

        var text = fs.readFileSync("./" + params.file).toString('utf-8');
        var accs = text.split("\n");

        console.log(accs);
        
        for(var i = 0; i < accs.length; i++){
            if(params.account == accs[i]){
                return true;
            }
        }
        return false;
    }
  };
  