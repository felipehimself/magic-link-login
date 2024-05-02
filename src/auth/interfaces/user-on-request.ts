export interface UserOnRequest {
  id: string;
  email: string;
  name: string;
  username: string;
  created_at: string;
  update_at: string;
  account_confirmed: {
    userId: string;
    confirmed: boolean;
    code_confirmation: string;
    created_at: string;
    update_at: string;
  };
}
