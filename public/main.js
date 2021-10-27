// import io from 'socket.io-client';
// const socket = io('http://localhost:8000')
let socket = io()
let lastRecordOfSender;
let lastRecordOfResiver;
//const searchData={firstSearch:[]};
// let sender_event_name = document.querySelector('#present-user').dataset.userid;
let send_message_details  = {
    sender:document.querySelector('#present-user').dataset.userid
}
let resiver_event_name;//hemanth resiving message form jayanth
document.querySelector('#aboutMe').addEventListener('click',async()=>{
    console.log('yes');
    try{
        // const x = await axios.get('/about-me');
        window.location.replace('/about-me')
    }catch(err){

    }
})
document.querySelector('#logOut').addEventListener('click',async()=>{
    console.log('yes in logout');
    try{
        const x = await axios.get('/api/v1/users/logout');
        window.location.replace('/login')
    }catch(err){

    }
    
})
const oneOfFriend = document.querySelectorAll('.friend-chat')
oneOfFriend.forEach(ele=>{
    ele.addEventListener('click',function(event){
        document.querySelector('#message-section-hider').style.display='none';
        document.querySelector('#message-section').style.display='block'
        document.querySelector('#your-friend').textContent=event.target.dataset.wname
        // sender_event_name+=event.target.dataset.wid;
        resiver_event_name=document.querySelector('#present-user').dataset.userid+event.target.dataset.wid
        send_message_details.resiver=event.target.dataset.wid
        getAllMessages(document.querySelector('#present-user').dataset.userid,event.target.dataset.wid);
        socket.on(resiver_event_name,message=>{
            const doc = document.querySelector('#message-box');
            let tag = document.createElement("p");
            let text = document.createTextNode(message.message)
            tag.style.textAlign='left'
            tag.appendChild(text);
            doc.appendChild(tag);
            let msgBody=document.querySelector('#message-section')
            msgBody.scrollTop=msgBody.scrollHeight-msgBody.clientHeight
            console.log(message);
        })
    })
})
let senderPerson;
let resiverPerson;
async function getMessagesFromServer(sederQuery,resiverQuery){
    try{
        const senderResponse =await axios.get(sederQuery);
        if(senderResponse.data.result>0)
            lastRecordOfSender = senderResponse.data.data.messages[senderResponse.data.result-1].createdAt
        console.log(lastRecordOfSender);
        const resiverResponse =await axios.get(resiverQuery);
        // console.log(senderResponse);
        // console.log(resiverResponse);
        if(resiverResponse.data.result>0)
            lastRecordOfResiver = resiverResponse.data.data.messages[resiverResponse.data.result-1].createdAt
        console.log(lastRecordOfResiver);

        // if(senderResponse.data.length>0 && resiverResponse.data.length>0)
            let msgs = (senderResponse.data.data.messages).concat(resiverResponse.data.data.messages)
        // else if(senderResponse.data.length>0)

        msgs.sort(function(one,two){
            if(one.createdAt<two.createdAt)
                return -1
            return 1
        });
        return msgs
    }catch(err){
        return err
    }

}
async function getAllMessages(sender,resiver){
    try{
        senderPerson=sender;
        resiverPerson=resiver;
        const doc = document.querySelector('#message-box');
        doc.innerHTML="";
        let msgs = await getMessagesFromServer(`/api/v1/message?sender=${sender}&resiver=${resiver}&sort=-createdAt&page=1&limit=10`,`/api/v1/message?sender=${resiver}&resiver=${sender}&sort=-createdAt&page=1&limit=10`)
        // msgs.forEach(ele=>{
        //     console.log(ele.createdAt);
        // })
        msgs.forEach(message=>{
            let tag = document.createElement("p");
            let text = document.createTextNode(message.message)
            if(message.sender.id===sender)
                tag.style.textAlign='right'
            else
                tag.style.textAlign='left'
            tag.appendChild(text);
            doc.appendChild(tag);
        })
        let msgBody=document.querySelector('#message-section')
        msgBody.scrollTop=msgBody.scrollHeight-msgBody.clientHeight
        console.log('response resived');
    }catch(err){
        console.log(err);
    }
}
document.querySelector('#send-input-message').addEventListener('click',()=>{
    const msg = document.querySelector('#input-message-placeholder');
    console.log('yes');
    if(msg.value.length>0){
        const doc = document.querySelector('#message-box');
        let tag = document.createElement("p");
        let text = document.createTextNode(msg.value)
        tag.style.textAlign='right'
        tag.appendChild(text);
        doc.appendChild(tag);
        let msgBody=document.querySelector('#message-section')
        msgBody.scrollTop=msgBody.scrollHeight-msgBody.clientHeight
        socket.emit('send-message',{message:msg.value,sender_resiver:send_message_details});
        msg.value="";
    }
})
document.querySelector('#get-more').addEventListener('click',async()=>{
    if(lastRecordOfSender){
        try{
            let div = document.createElement('div')
            const msgs = await getMessagesFromServer(`/api/v1/message?sender=${senderPerson}&resiver=${resiverPerson}&sort=-createdAt&createdAt[lt]=${lastRecordOfSender}&limit=10`,`/api/v1/message?sender=${resiverPerson}&resiver=${senderPerson}&sort=-createdAt&createdAt[lt]=${lastRecordOfResiver}&limit=10`)
            msgs.forEach(message=>{
                let tag = document.createElement("p");
                let text = document.createTextNode(message.message)
                if(message.sender.id===senderPerson)
                    tag.style.textAlign='right'
                else
                    tag.style.textAlign='left'
                tag.appendChild(text);
                div.appendChild(tag);
            })
            const doc = document.querySelector('#message-box');
            doc.prepend(div)
        }catch(err){
            console.log(err);
        }
    }
})
const searchFriends = document.querySelector(".search-global")
searchFriends.addEventListener('keyup',async(event)=>{
    const searchText = searchFriends.value;
    if(searchText.length>0){
        console.log(searchText);
        try{
            const div = document.createElement('div');
            
            const users = await axios.get(`/api/v1/users?regex=${searchText}&page=1&limit=5`);
            // const okThis = users.data.data
            // console.log(users.data.data);
            users.data.data.users.forEach((ele)=>{
                searchData.firstSearch.push(ele)
                const childDiv = document.createElement('div');
                childDiv.style.alignItems='center'
                const Nametag = document.createElement('p');
                Nametag.classList.add('searched-user')
                Nametag.dataset.thisId=ele.id
                Nametag.textContent =  ele.name
                Nametag.style.display='inline-block'
                Nametag.style.textAlign='center'
                Nametag.style.width='80%'
                // Nametag.style.textAlign
                const img = document.createElement('img');
                img.classList.add('searched-user')
                img.src=ele.photo
                img.alt = ele.name
                img.dataset.thisId = ele.id
                childDiv.dataset.thisId = ele.id
                childDiv.appendChild(img);
                childDiv.appendChild(Nametag);
                div.appendChild(childDiv);
            })
            searchFriends.innerHTML="";
            document.querySelector('#serach-friends').innerHTML="";
            searchFriends.appendChild(div)
            document.querySelector('#serach-friends').appendChild(div)
            // console.log(users.data.data);
        }catch(err){
            console.log(err);
        }
    }
    else{
        searchFriends.innerHTML="";
        document.querySelector('#serach-friends').innerHTML="";
    }
})
// export function updateMessage(sender,resiver){
//     if(resiver===sender){
//         const doc = document.querySelector('#message-box');
//         let tag = document.createElement("p");
//         let text = document.createTextNode(message.message);
//         tag.style.textAlign='left'
//         tag.appendChild(text);
//         doc.appendChild(tag);
//     }
// }