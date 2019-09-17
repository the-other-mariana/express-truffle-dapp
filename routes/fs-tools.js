const fs = require('fs');
const readline = require('readline');
const lineReader = require('line-reader');

module.exports = {
    register: function (params) {
      var already = false;
      var text;

      // if file does not exist, register account
      try {
        text = fs.readFileSync("./" + params.file).toString('utf-8');
      } catch (err) {
        fs.appendFile(params.file, params.data + '\n', function (err) {
            if (err) throw err;
            console.log('Saved account');
            return;
        });
      }

      // if file exists, write only if account is not there already
      var accs = text.split("\n");
      for(var i = 0; i < accs.length; i++){
          if(params.data == accs[i]){
              already = true;
          }
      }

      // new account:
      if(already == false){
        fs.appendFile(params.file, params.data + '\n', function (err) {
            if (err) throw err;
            console.log('Saved account');
        });
      }

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
