export const checkvalidData=(email,password)=>{
    const isEmailvalid=/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email)
    const isPassvalid=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)
    if(!isEmailvalid)return "Email is not valild"
    if (!isPassvalid) return "Password is not valid"
    
    return null;
}