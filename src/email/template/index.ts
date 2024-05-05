import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailTemplate {
  static confirmAccountTemplate(url: string, expiration = 15) {
    return `
      <div style="color: black">
        <p style="color:#663399; font-weight:bold;">Email confirmation from Magic Link Login</p>
        <p>Click <a href="${url}">here</a> to confirm your account ✨</p>
        <p>This link will expire in ${expiration} minutes.</p>
        <p>If you haven't created this account please disregard this email.</p>
        <p>Best wishes,</p>
        <p>Magic Link Login</p>
      </div>
  
    `;
  }

  static magicLinkTemplate(url: string) {
    return `
      <div style="color: black">
        <p style="color:#663399; font-weight:bold;">Magic Link Login</p>
        <p>Click <a href="${url}">here</a> to Login</p>
        <p>Best wishes,</p>
        <p>Magic Link Login</p>
      </div>
  
    `;
  }
}
