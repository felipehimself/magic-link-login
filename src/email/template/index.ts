import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailTemplate {
  static confirmAccountTemplate(
    userId: string,
    frontendURL: string,
    expiration = 15,
  ) {
    return `
      <div style="color: black">
        <p style="color:#c2410c; font-weight:bold;">Email confirmation from Silly App</p>
        <p>Click the link below to confirm your account ✨</p>
        <a href="${frontendURL}/api/auth/confirm-account/${userId}">Confirm</a>
        <p>This link will expire in ${expiration} minutes.</p>
        <p>If you haven't created this account please disregard this email.</p>
        <p>Best wishes,</p>
        <p>Felipe - Auth App</p>
      </div>
  
    `;
  }
}
