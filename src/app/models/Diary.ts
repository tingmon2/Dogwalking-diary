export class Diary {
  id: number;
  userId: number; // 해당 유저의 다이어리 기록만 나오도록
  title: string;
  date: string;
  content: string;
  latitude: number;
  longitude: number;
  constructor(userId?: number, title?: string, date?: string, content?: string, latitude?: number, longitude?: number) {
    this.userId = userId;
    this.title = title;
    this.date = date;
    this.content = content;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
