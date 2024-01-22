/** The entry class represents a journal entry. It handles details for how an 
 * entry should look like. For example, entries with good moods appear blue and 
 * entries with bad moods appear red. */
export class Entry {
    title: string;
    date: string;
    content: string;
    startTime: string;
    endTime: string;
    preview: string;
    goodMood?: boolean;
    color?: string;
  
    constructor(entry: any) {
      this.title = entry.title;
      this.date = entry.date;
      this.startTime = entry.startTime;
      this.endTime = entry.endTime;
      this.content = entry.content;
      this.preview = entry.content.substr(0, 50) + "...";
      this.goodMood = entry.goodMood;
      this.color = entry.goodMood ? '#DEF3FD' : '#FDDFDF'
    }
  
  }