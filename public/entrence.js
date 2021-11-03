
const query = document.querySelector('button#entrence').addEventListener('click',buttonClicked)
const doc = document.querySelectorAll('input');
// const url = 'http://localhost/api/v1/users/signup';
// const body={

// }
// axios.post()
function buttonClicked(){
    console.log(this.name);
    const name=this.name
    if(name==='log in'){
        document.querySelector('button#entrence').textContent="logging in..."
        loginFun(this)
    }
    else if(name==='sign up'){
        document.querySelector('button#entrence').textContent="creating..."
        signupFun(this);
    }
    else if(name==='forgot password'){
        document.querySelector('button#entrence').textContent="sending..."
        forgotPasswordFun(this)
    }
    else if(name==='reset password'){
        document.querySelector('button#entrence').textContent="logging in..."
        resetPassswordFun(this)
    }
}
const resetPassswordFun = async(obj)=>{
    const presentUrl = window.location.href;
    const token = presentUrl.split('reset-password/')[1]
    const url = `/api/v1/users/reset-password/${token}`
    const body={
        newPassword:doc[0].value,
        conformPassword:doc[1].value
    }
    try{
        const response= await axios.patch(url,body);
        console.log(response.data.status);
        console.log(typeof(response.data.status));
        if(response.data.status==='success'){
            const replaceUrl = '/login'
            window.location.replace(replaceUrl)
        }
    }
    catch(err){
        document.getElementById('reset-password-message').textContent='check password and password conform are same'
        document.querySelector('button').textContent="Submit"
    }
    console.log(token);
}
const forgotPasswordFun = async(obj)=>{
    const url = '/api/v1/users/forgot-password';
    // const url= 'http://localhost:3000/loginRequest'
    const body={
        email:doc[0].value,
    }
    try{
        const response= await axios.post(url,body);
        console.log(response.data.status);
        console.log(typeof(response.data.status));
        if(response.data.status==='success'){
            document.getElementById('forgot-password-message').style.color='black'
            document.getElementById('forgot-password-message').textContent='verification link sended to your email, please check your mail'
            document.querySelector('button').textContent="Submit"
        }

    }
    catch(err){
        document.getElementById('forgot-password-message').style.color='red'
        document.getElementById('forgot-password-message').textContent='please provide valid email'
        document.querySelector('button').textContent="Submit"
    }
}
const signupFun = async(obj)=>{
    const url = '/api/v1/users/signup';
    // const url= 'http://localhost:3000/loginRequest'
    const body={
        name:doc[0].value,
        email:doc[1].value,
        password:doc[2].value,
        passwordConform:doc[3].value
    }
    try{
        const response= await axios.post(url,body);
        console.log(response.data.status);
        console.log(typeof(response.data.status));
        if(response.data.status==='success'){
            const replaceUrl = '/'
            window.location.replace(replaceUrl)
        }
    }
    catch(err){
        document.getElementById('signup-message').textContent='check password and password conform'
        document.querySelector('button').textContent="sign up"
    }
}
const loginFun=async(obj)=>{
    console.log(doc);
    const url = '/api/v1/users/login';
    // const url= 'http://localhost:3000/loginRequest'
    const body={
        email:doc[0].value,
        password:doc[1].value
    }
    try{
        const response= await axios.post(url,body);
        console.log(response.data.status);
        console.log(typeof(response.data.status));
        if(response.data.status==='success'){
            const replaceUrl = '/'
            window.location.replace(replaceUrl)
        }
    }
    catch(err){
        document.getElementById('login-message').textContent='Incorrect password or email'
        document.querySelector('button').textContent="log in"
    }
}



