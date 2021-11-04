const buttonForAccepting = document.querySelectorAll('.accept-friend-request');
buttonForAccepting.forEach(ele=>{
    ele.addEventListener('click',acceptRequest)
})
async function acceptRequest(event){
    // console.log('clicked');
    const url ='/api/v1/users/acceptFriendRequest'
    // console.log(event.target);
    try{
        if(event.target.textContent!="accepted")
            event.target.textContent="accepting..."
        const response = await axios.post(url,{
            id:event.target.dataset.thisid
        })
        // console.log(response);
        if(response.data.status==="success"){
            event.target.textContent="accepted"
        }
    }catch(err){
        if(event.target.textContent!="accepted")
            event.target.textContent="accept request"
        // console.log(err);
    }
}