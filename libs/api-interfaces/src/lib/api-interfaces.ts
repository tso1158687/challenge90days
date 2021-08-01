import { DocumentReference } from '@angular/fire/firestore';
export interface Message {
  message: string;
}

export interface UserInfo {
  userId: string;
  eventId: number[];
  name: string;
  email: string;
  createDate: Date;
  checkinList?: DocumentReference[];
}

export interface Checkin {
  content: string;
  postUser: string;
  url: string;
  imgFile: any;
  type: number;
  time: any;
  userId: string;
  emoji: string;
  isCheckinToday?: boolean;
}

export interface CheckinObj {
  user: string;
  message: string;
  url: string;
  imgFile: any;
  emoji: string;
  isCheckinTomorrow: boolean;
}
