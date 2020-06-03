const socket =  io()

// Elements
const $messageform = document.querySelector('#MSG')
const $messageformInput = $messageform.querySelector('#message')
const $messagebutton = $messageform.querySelector('button')
const $sendlocation = document.querySelector('#sendlocation')
const $messages = document.querySelector('#messages')

// templates
const messagetemplate = document.querySelector('#message-template').innerHTML
const locationtemplate = document.querySelector('#location-template').innerHTML
const sidebar = document.querySelector('#sidebar-template').innerHTML

// options
const {username , room} = Qs.parse(location.search,{ ignoreQueryPrefix: true})
const autoscroll = ()=>{

    // new message element
    const $newmessage = $messages.lastElementChild
    // height of the new msg
    const newmessagestyles = getComputedStyle($newmessage)
    const $newmessagemargin = parseInt(newmessagestyles.marginBottom)
    const newmessageheight = $newmessage.offsetHeight + $newmessagemargin

    // visible height
    const visibleheight = $messages.offsetHeight

    // height of messages container

    const contentheight = $messages.scrollHeight

    // how ar scroll
    const scrolloffset = $messages.scrollTop + visibleheight

    if(contentheight - newmessageheight <= scrolloffset ){

        $messages.scrollTop = $messages.scrollHeight

    }

}


socket.on('message',(message)=>{
    console.log(message)

    const html = Mustache.render(messagetemplate,{
        username:message.username,
        message: message.text,
        createdat: moment(message.createdat).format("h:mm a")
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()

})

socket.on('locmessage',(url)=>{
    console.log(url)
    const html = Mustache.render(locationtemplate,{
        username: url.username,
        url: url.coords,
        createdat: moment(url.createdat).format("h:mm a")
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
    })

    socket.on('roomdata',({room,users})=>{

        const html = Mustache.render(sidebar,{
            room,
            users
        })

        document.querySelector('#sidebar').innerHTML = html

    })





    $messageform.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messagebutton.setAttribute('disabled','disabled')
    socket.emit('sendmessage',$messageformInput.value,(error)=>{

        $messagebutton.removeAttribute('disabled')
        $messageformInput.value=''
        $messageformInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('message sent!')
    })
})


$sendlocation.addEventListener('click',()=>{

    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    $sendlocation.setAttribute('disabled','disabled')
    
    navigator.geolocation.getCurrentPosition((position)=>{

        socket.emit('sendlocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },(message)=>{
            $sendlocation.removeAttribute('disabled')
            console.log('location sent!',message)
        })
    })

})

socket.emit('join',{username , room},(error)=>{

    if(error){
        alert(error)
        location.href = '/'
    }

})