
const query = document.querySelector('button#entrence').addEventListener('click',buttonClicked)
const doc = document.querySelectorAll('input');
// const url = 'http://localhost/api/v1/users/signup';
// const body={

// }
// axios.post()
function buttonClicked(){
    document.querySelector('button#entrence').textContent="logging in..."
    console.log(this.name);
    const name=this.name
    if(name==='log in'){
        loginFun(this)
    }
    else if(name==='sign up'){
        signupFun(this);
    }
    else if(name==='forgot password'){
        forgotPasswordFun(this)
    }
}
const loginFun=async(obj)=>{
    console.log(doc);
    const url = './api/v1/users/login';
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



