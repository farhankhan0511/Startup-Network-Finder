import { google } from 'googleapis';
import { User } from './models/User.models';
import { SendMail } from './utils/SendMail';
import { apology } from './Emailtemplates/Appology.mail';
import moment from 'moment';
import TokenManager from './TokenManager';

const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];


// const auth = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI
// );
// auth.setCredentials({ refresh_token:process.env.GOOGLE_REFRESH_TOKEN});

export async function processEmails() {
  const tokenManager=TokenManager.getInstance()
  const  auth=await tokenManager.getValidClient()
  console.log('Running recredit check...');

  const gmails = await google.gmail({ version: 'v1',auth:auth});
  const sinceTime = moment().subtract(90, 'minutes').unix();
  const query = `is:unread after:${sinceTime} subject:"Recharge 5 credits"`;

  const userId = 'me';
  const response = await gmails.users.messages.list({ userId:userId });
  
  if (!response.data.messages || response.data.messages.length === 0) {
    console.log('No messages found');
    return;
  }

  for (const message of response.data.messages) {
    if (!message.id) {
      continue;
    }

    const email = await gmails.users.messages.get({
      userId:userId,
      id: message.id,
    });


    const headers = email.data.payload?.headers;
    if (!headers) {
      continue;
    }

    const fromHeader = headers.find((header) => header.name === 'From')?.value || 'Unknown';
    const subject = headers.find((header) => header.name === 'Subject')?.value || 'No Subject';
    
    const emailMatch = fromHeader.match(/<([^>]+)>/);
    const from = emailMatch ? emailMatch[1] : fromHeader;
    console.log(from);
    console.log(subject)

    const toupdateuser = await User.findOne({ email: from });
    console.log(toupdateuser)
    if (!toupdateuser) {
      return;
    }
    if (toupdateuser.credits > 1) {
      console.log("apology")
      SendMail(from, 'Credit Request Failed', apology());
    }
    console.log()
    const upuser = await User.findByIdAndUpdate(
      toupdateuser._id,
      { $set: { credits: 5 } },
      { new: true }
    );
    if (!upuser) {
      return;
    }

    await gmails.users.messages.modify({
      userId: 'me',
      id: message.id,
      requestBody: {
        removeLabelIds: ['UNREAD'],
      },
    });
  }
}
