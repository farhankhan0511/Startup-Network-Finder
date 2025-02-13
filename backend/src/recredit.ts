import { google } from 'googleapis';
import { User } from './models/User.models';
import { SendMail } from './utils/SendMail';
import { apology } from './Emailtemplates/Appology.mail';
import moment from 'moment';

const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];

async function authenticate() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // Retrieve the refresh token from your database
  const user = await User.findOne({ email: 'your-email@example.com' });
  if (!user || !user?.refreshtoken) {
    throw new Error('Refresh token not found');
  }

  auth.setCredentials({ refresh_token: user?.refreshtoken});

  // Listen for token events to handle token refresh
  auth.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
      // Update the refresh token in your database
      user.refreshtoken = tokens.refresh_token;
      user.save();
    }
  });

  return auth;
}

export async function processEmails() {
  console.log('Running recredit check...');
  const auth = await authenticate();
  const gmails = google.gmail({ version: 'v1', auth });
  const sinceTime = moment().subtract(90, 'minutes').unix();
  const query = `is:unread after:${sinceTime} subject:"Recharge 5 credits"`;

  const userId = 'me';
  const response = await gmails.users.messages.list({ userId, q: query });

  if (!response.data.messages || response.data.messages.length === 0) {
    console.log('No messages found');
    return;
  }

  for (const message of response.data.messages) {
    if (!message.id) {
      continue;
    }

    const email = await gmails.users.messages.get({
      userId,
      id: message.id,
    });

    const headers = email.data.payload?.headers;
    if (!headers) {
      continue;
    }

    const from = headers.find((header) => header.name === 'From')?.value || 'Unknown';
    const subject = headers.find((header) => header.name === 'Subject')?.value || 'No Subject';

    console.log(from);

    const toupdateuser = await User.findOne({ email: from });
    if (!toupdateuser) {
      return;
    }

    if (toupdateuser.credits > 1) {
      SendMail(from, 'Credit Request Failed', apology());
    }

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
