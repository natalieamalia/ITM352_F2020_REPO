const fs = require('fs');

const user_data_filename = 
'user_data.json';
//check if file exists before reading
if(fs.existsSynce(filename)) {
    var data = fs.readFileSync(user_data_filename, 'utf-8');
    users_reg_data = JSON.parse(data);
// 
} if(typeof users_reg_data ['itm352'] == 'undefined') {
    console.log(users_reg_data['itm352']['password']=='xxx');
}
else {
    console.log(`ERR: ${user_data_filename} file does not exist!`);
}
var data = fs.readFileSync(user_data_filename, 'utf-8');
user_reg_data = JSON.parse(data);
//console.log(users_reg_data, typeof users_reg_data, typeof data);

// fs.readFileSync(user_data_filename, (err, thedata) => {
    //if (err) throw err;
    //data = thedata;
    //console.log(data); });

// console.log(users_reg_data['dport'].password)
