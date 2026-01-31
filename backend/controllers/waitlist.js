import waitlist from "../models/waitlist.js";


export const joinWaitlist = async (req,res) => {
    try {
        const {fullName, email, interest} = req.body;

        if(!fullName || !email  || !interest ){
            return res.status(400).json({success: false , message: "Allfieds are required"})
        }

        const isEmail = await waitlist.findOne({email});
        if(isEmail){
            return res.status(409).json({success: false, message:"Email Already exist"})
        }

        const newEntry = await waitlist.create({
            fullName,
            email,
            interest
        }) 

        res.status(201).json({sucess: true, dat: newEntry, message:"congratulations on joining the waitlist"})
    } catch (error) {
           console.log(error)
        res.status(500).json({success: false , message: error.message})
    }
}