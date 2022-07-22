const verifyEmailMessage = (verifyLink) => {
    const message = `
    <div style="width: 500px; margin: auto; padding: 20px; background: black; color: #aaa!important; text-align: center;">
        <h1 style="margin: 30px 0;">Active Your account</h1> 
        <p style="margin-bottom: 50px">Please click the link below to activate Your account</p>
        <a href="${verifyLink}" clicktracking=off style="padding: 15px 50px; background: blue; color: white; display: block; text-decoration: none; margin-bottom: 50px">Active Your account</a>
    </div>
    `
    return message;
}

module.exports = {
    verifyEmailMessage
}