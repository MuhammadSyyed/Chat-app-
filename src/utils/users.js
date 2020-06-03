const users = []

// adduser
// removeuser
// getuser
// getuserin room

const adduser = ({ id ,username ,room })=>{

    // cleaning data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return {
            error: 'Username and room are required!'
        }
    }

    // checking existing user
    const existinguser = users.find((user)=>{

        return user.room === room && user.username === username

    })

    // validate user name
    if(existinguser){
        return {
            error: 'Username is in use!'
        }

    }
    // storing user
    const user= {id,username,room}
    users.push(user)
    return {user}

}

const removeuser = (id)=>{

    const index= users.findIndex((user)=> user.id === id)
    if( index !==-1 ){
        return users.splice(index,1)[0]
    }
}


const getuser = (id)=>{

    const user = users.find((user)=> user.id === id )
    if(!user){
        return undefined
    }
    return user
}

const getuserinroom = (room)=>{

    room = room.trim().toLowerCase()
    return users.filter((user)=> user.room === room)

}

module.exports = { adduser , removeuser , getuser , getuserinroom }