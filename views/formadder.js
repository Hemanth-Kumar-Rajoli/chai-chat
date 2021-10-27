function sendHtml(obj){
    if(obj.type==='email')
        obj.modified='text'
    else if(obj.type==='password' || obj.type==='password')
        obj.modified='password'
    return `<div>
    <input type="${obj.modified}" name="${obj.type}" id="${obj.type}" required>
    <label for="${obj.type}">${obj.type}</label>
    <div class="for-after"></div>
</div>`
}