const mongoose = require('mongoose');
const config = require('./config');
const Student = require('./models/student')

async function main(){
    await mongoose.connect(`mongodb+srv://admin:${config.pass}@freecluster.o4maq.mongodb.net/test2`,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Database connected');
    
    const someStudent = new Student({
        firstName:'Pesho',
        lastName:'Peshev',
        facilityNumber:'123',
        age:33
    });

    await someStudent.save()
        

    

}
main();