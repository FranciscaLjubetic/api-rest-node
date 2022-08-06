const mongoose = require("mongoose");

const connection = async() => {
    try{
        await mongoose.connect("mongodb://localhost:27017/mi_blog");
        console.log("succesfully connected.")

    } catch(error){
        console.log(error);
        throw new Error("Not connected to the Database.")
    }
}

module.exports = {
    connection
}