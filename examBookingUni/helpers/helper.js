module.exports = {
    
    // createErrorMsg: errors =>        
    //     errors.array().map(x => x.msg).join("<br />"),
    createErrorMsg: function (errors) {
        try {
            return errors.array().map(x => x.msg).join("<br />")            
        } catch {
            return errors.message.split(':')[2].split(',')[0]
        }
    } ,       
       
            
    createErrorFromModel: error => error.message.split(':')[2].split(',')[0],


    // createErrorMsg(err){
    //     return{
    //         if(err.name == 'ValidationError'){

    //         }
    //     }
    // }
}
// function createErrorMsg(err){
//     if(err.name == 'ValidationError'){
//         const errors = Object.values(err.errors).map(x => x.properties.message);
//         console.log("🚀 ~ file: helper.js ~ line 30 ~ createErrorMsg ~ errors", errors)
//         return errors
//     } else {
//         return [err.message];
//     }
// }

// module.exports = {
//     createErrorMsg,
// };