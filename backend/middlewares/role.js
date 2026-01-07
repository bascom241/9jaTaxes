export const verifyRoles = (allowedRoles) => {
    return (req,res,next) => {
        console.log(req.user)
        if(!allowedRoles.includes(req.user.role)){
            return res.status(401).json({success:false, message :"Access Denied"})
        }
        next()
    }
}