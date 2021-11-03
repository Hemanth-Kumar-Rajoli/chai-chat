// import io from 'socket.io-client';
// const socket = io('http://localhost:8000')
let socket = io()
let lastRecordOfSender;
let lastRecordOfResiver;
let timeOfSearchStart;
let numberOfSearchesHappend=1;
let presentSelectedUser;
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
document.querySelector('.back-pointer').addEventListener('click',()=>{
    presentSelectedUser=undefined
    document.querySelector('#message-section').classList.remove('show-conversation'); 
    document.querySelector('#message-section').classList.add('hide-conversation'); 
    document.querySelector('#friends-section').classList.remove('hide-friends-area');  
    document.querySelector('#friends-section').classList.add('show-friends-area');  
})
const oneOfFriend = document.querySelectorAll('.friend-chat')
socket.on(document.querySelector('#present-user').dataset.userid,(message)=>{
    if(message.sender_resiver.sender===presentSelectedUser){
        console.log(presentSelectedUser);
        console.log('message sended to the selected user');
        socket.emit('message-resived',message);
    }
    else{
        console.log('im unselected user ok aaa!');
        // socket.emit('countIncrement',message)
        const incremantMessage = document.querySelector(`.noOfUnreadMessages${message.sender_resiver.sender}`);
        if(incremantMessage.textContent==""||incremantMessage.textContent==" ")
            incremantMessage.textContent=1;
        else{
            if(isNaN(parseInt(incremantMessage.textContent)))
                incremantMessage.textContent=1
            else
                incremantMessage.textContent=parseInt(incremantMessage.textContent)+1;
        }
    }
    console.log(message);
})
oneOfFriend.forEach(ele=>{
    //here no of unread messages are going to the "friend that are to the main user"
    console.log(ele);
    ele.addEventListener('click',function(event){
        document.querySelector(`.noOfUnreadMessages${event.target.dataset.wid}`).textContent='';
        presentSelectedUser=event.target.dataset.wid;
        document.querySelector('#message-section').classList.add('show-conversation');
        document.querySelector('#message-section').classList.remove('hide-conversation'); 
        document.querySelector('#friends-section').classList.add('hide-friends-area');
        document.querySelector('#friends-section').classList.remove('show-friends-area');  
        document.querySelector('#message-section-hider').style.display='none';
        // document.querySelector('#message-section').style.display='block'
        document.querySelector('#your-friend').textContent=event.target.dataset.wname
        document.querySelector('.get-more-about-friend').dataset.wid=event.target.dataset.wid;
        // sender_event_name+=event.target.dataset.wid;
        resiver_event_name=document.querySelector('#present-user').dataset.userid+event.target.dataset.wid
        send_message_details.resiver=event.target.dataset.wid
        getAllMessages(document.querySelector('#present-user').dataset.userid,event.target.dataset.wid);
        socket.emit('open-message-resived',{message:"",sender_resiver:send_message_details})
        socket.off(resiver_event_name);
        socket.on(resiver_event_name,message=>{
            socket.emit('message-resived',message)
            const doc = document.querySelector('#message-box');
            let tag = document.createElement("p");
            let text = document.createTextNode(message.message)
            tag.style.textAlign='left'
            tag.appendChild(text);
            doc.appendChild(tag);
            let msgBody=document.querySelector('#message-section')
            msgBody.scrollTop=msgBody.scrollHeight-msgBody.clientHeight
            // console.log(message);
        })
    })
})
// document.querySelector('body').addEventListener('click',(event)=>{
//     console.log(event.target);
// })
document.querySelector('.get-more-about-friend').addEventListener('click',async()=>{
    try{
        window.location.replace(`/get-more/${document.querySelector('.get-more-about-friend').dataset.wid}`)
    }catch(err){
        console.log(err);
    }
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
        document.querySelector('#send-input-message').style.display='none';
        document.querySelector('#input-message-placeholder').value="Loading..."
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
        document.querySelector('#input-message-placeholder').value=""
        document.querySelector('#send-input-message').style.display='inline-block'
    }catch(err){
        document.querySelector('#input-message-placeholder').value=""
        document.querySelector('#send-input-message').style.display='inline-block'
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
        socket.emit('send-message-as-notification',{message:msg.value,sender_resiver:send_message_details})
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

async function enlargeTheFriend(event){
    console.log(event.target.dataset.thisId);
    try{
        window.location.replace(`/get-more/${event.target.dataset.thisId}`)
        // const response = await axios.get(`/get-more/${event.target.dataset.thisId}`)
        // console.log(response);
    }catch(err){
        console.log(err);
    }
}
function addSearchList(users,div){
    // const div = document.querySelector('.main-search-list');
    users.forEach((ele)=>{
        // searchData.firstSearch.push(ele)
        const childDiv = document.createElement('div');
        childDiv.style.alignItems='center'
        childDiv.style.cursor='pointer'
        childDiv.addEventListener('click',enlargeTheFriend);
        // childDiv.classList.add('child-search-list');
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
        // return div;
    })
}
function addPTag(div){
    const ptag = document.createElement('p');
    ptag.textContent="load more"
    ptag.classList.add('load-more-search-friends');
    ptag.style.cursor='pointer'
    ptag.style.textAlign='center'
    ptag.style.color='#f0e286'
    ptag.addEventListener('click',getMoreeFrinedsSearch)
    div.appendChild(ptag)
}
const searchFriends = document.querySelector(".search-global")

searchFriends.addEventListener('keydown',()=>{
    if(searchFriends.value.length===0){
        timeOfSearchStart=Date.now();
        document.querySelector('#serach-friends').innerHTML=""
    }
})
searchFriends.addEventListener('focusout',(event)=>{
    console.log('yes in out');
    if(searchFriends.value.length===0){
        timeOfSearchStart=Date.now();
        searchFriends.value=""
        document.querySelector('#serach-friends').innerHTML="" 
    }
})
searchFriends.addEventListener('keyup',async(event)=>{
    numberOfSearchesHappend=1;
    const searchText = searchFriends.value;
    if(searchText.length>0){
        if(searchText.length===1){
            timeOfSearchStart=Date.now();
        }
        console.log(searchText);
        try{
            const div = document.createElement('div');
            div.classList.add('main-search-list');
            // div.style.zIndex=1
            console.log(timeOfSearchStart);
            // while(!timeOfSearchStart)
            const users = await axios.get(`/api/v1/users?regex=${searchText}&timeOfSearchStart=${timeOfSearchStart}&page=1&limit=5`);
            // const okThis = users.data.data
            // console.log(users.data.data);
            addSearchList(users.data.data.users,div);
            searchFriends.innerHTML="";
            document.querySelector('#serach-friends').innerHTML="";
            // searchFriends.appendChild(div2)
            document.querySelector('#serach-friends').appendChild(div)
            addPTag(div)
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
async function getMoreeFrinedsSearch(){
    document.querySelector('.load-more-search-friends').remove();
    console.log("number of searches happpend are"+numberOfSearchesHappend);
    console.log('yes it is');
    const searchText = searchFriends.value;
    numberOfSearchesHappend++;
    const users = await axios.get(`/api/v1/users?regex=${searchText}&timeOfSearchStart=${timeOfSearchStart}&page=${numberOfSearchesHappend}&limit=5`);
    const div = document.querySelector('.main-search-list');
    addSearchList(users.data.data.users,div);
    addPTag(div);
}
document.querySelector('#friendRequests').addEventListener('click',()=>{
    try{
        window.location.replace(`/allFriendRequests`);
    }catch(err){
        console.log(err);
    }
})
function onclick(){
}
document.querySelector('.burger').addEventListener('click',()=>{
    document.querySelector('.urls').classList.toggle('clicked')
})
// document.querySelector('.load-more-search-friends').addEventListener('click',async()=>{
//     console.log('yes it is');
//     const searchText = searchFriends.value;
//     // const users = await axios.get(`/api/v1/users?regex=${searchText}&timeOfSearchStart=${timeOfSearchStart}&page=1&limit=5`);

// })
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