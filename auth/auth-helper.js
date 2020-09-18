const db = require('../database/dbConfig')

function register(user){
    return db("users").insert(user)
    // .then(id =>{
    //     return findBy(id[0])
    // })
    // .catch(
    //     err=> {return err}
    // )
}

function findBy(id){
    return db("users").where({id}).first()
}

module.exports = {register, findBy}