const generatemsg = (username,text)=>{
    return {
        username,
        text,
        createdat: new Date().getTime()
    }
}

const genelocmsg = (username,coords)=>{
    return {
        username,
        coords,
        createdat: new Date().getTime()
    }
}

module.exports = {
    generatemsg,
    genelocmsg
}