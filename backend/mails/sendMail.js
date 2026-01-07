import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";
import { emailContent,resetPasswordEmailContent, resetSuccessfulEmailContent } from "../templates/emailTemplate.js";
dotenv.config();

export const sendEmail = async (to,verificationToken,name) => {
  try {
    // Initialize Brevo API
    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { email: process.env.EMAIL_FROM };
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = "Email Verification";
    sendSmtpEmail.htmlContent =  emailContent(name, verificationToken);

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent.");
  }
};

const sendPasswordResetEmail = async(to,firstName, resetLink) => {
    try {
        // Initialize Brevo API
        let defaultClient = SibApiV3Sdk.ApiClient.instance;
        let apiKey = defaultClient.authentications["api-key"];
        apiKey.apiKey = process.env.BREVO_API_KEY;
    
        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = { email: process.env.EMAIL_FROM };
        sendSmtpEmail.to = [{ email: to }];
        sendSmtpEmail.subject = "Password Reset";
        sendSmtpEmail.htmlContent =  resetPasswordEmailContent(fullName, resetLink);
    
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Email sent successfully:", response);
        return response;
      } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email could not be sent.");
      }
}

const sendResetSuccessfullEmail = async (to) =>{
    try {
        // Initialize Brevo API
        let defaultClient = SibApiV3Sdk.ApiClient.instance;
        let apiKey = defaultClient.authentications["api-key"];
        apiKey.apiKey = process.env.BREVO_API_KEY;
    
        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = { email: process.env.EMAIL_FROM };
        sendSmtpEmail.to = [{ email: to }];
        sendSmtpEmail.subject = "Password Reset";
        sendSmtpEmail.htmlContent =  resetSuccessfulEmailContent(to);
    
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Email sent successfully:", response);
        return response;
      } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email could not be sent.");
      }
}


