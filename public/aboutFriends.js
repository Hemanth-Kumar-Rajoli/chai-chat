document.querySelector('.home').addEventListener('click',()=>{
    window.location.replace('/')
})
const buttonTag = document.querySelector('.send-request')
try{
    buttonTag.addEventListener('click',async()=>{
        try{
            const url = `/api/v1/users/sendFriendRequestById`
            if(buttonTag.textContent!="request sended")
                buttonTag.textContent="sending..."
            const response = await axios.post(url,{
                id:document.querySelector('.userDetails').dataset.thisid
            })
            if(response.data.status==="success"){
                buttonTag.textContent="request sended"
                buttonTag.classList.replace('send-request','request-sended');

            }
        }catch(err){
            if(buttonTag.textContent!="request sended")
                buttonTag.textContent="send request"
            // console.log(err);
        }
    })
}
catch(err){

}
const buttonForAcceptRequest = document.querySelector('.accept-request');
try{
    buttonForAcceptRequest.addEventListener('click',async()=>{
        console.log('clicked');
        const url ='/api/v1/users/acceptFriendRequest'
        try{
            if(buttonForAcceptRequest.textContent!="accepted")
                buttonForAcceptRequest.textContent="accepting..."
            const response = await axios.post(url,{
                id:document.querySelector('.userDetails').dataset.thisid
            })
            console.log(response);
            if(response.data.status==="success"){
                buttonForAcceptRequest.textContent="accepted"
            }
        }catch(err){
            if(buttonForAcceptRequest.textContent!="accepted")
                buttonForAcceptRequest.textContent="accept request"
            console.log(err);
        }
    })
}catch(err){
    
}