export interface Message {
  message: string;
}

export interface UserInfo {
  userId: string;
  eventId: number[];
  name: string;
  email: string;
  createDate: Date;
}

export interface Checkin {
  content: string;
  postUser: string;
  url: string;
  imgFile: any;
  type: number;
  time: Date;
  userId: string;
  emoji: string;
}

export interface CheckinObj {
  user: string;
  message: string;
  url: string;
  imgFile: any;
  emoji: string;
  isCheckinTomorrow: boolean;
}
