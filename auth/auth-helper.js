const db = require('../database/dbConfig')

function register(user){
    return db('users').insert(user)
    .then(id =>{
        return findById({id: id[0]})
    })
    .catch(
        err=> {return err}
    )
}

function findBy(filter){
    return db('users').where(filter).first
}

module.exports = {register, findBy}