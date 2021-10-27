document.querySelector('#continueWithoutSave').addEventListener('click',async()=>{
    try{
        window.location.replace('/');
    }catch(err){

    }
})

document.querySelector('#editAndSave').addEventListener('click',async()=>{
    try{
        const x = document.querySelectorAll('input');
        const xTextAre = document.querySelector('textarea');
        let form = new FormData();
        form.append('name',x[0].value);
        form.append('email',x[1].value);
        form.append('DateOfBirth',x[2].value);
        form.append('aboutMe',xTextAre.value,)
        if(x[3].files.length>0)
            form.append('photo',x[3].files[0]);
        // const body={
        //     name:x[0].value,
        //     email:x[1].value,
        //     dateOfBirth:x[2].value,
        //     aboutMe:xTextAre.value,
        // }
        // console.log(body);
        const response = await axios.patch('/api/v1/users/updateMySelf',form)
        if(response.data.status==='success'){
            const replaceUrl = '/'
            window.location.replace(replaceUrl)
        }
        // window.location.replace('/');
    }catch(err){

    }
})