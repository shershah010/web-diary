/** The entry class represents a journal entry. It handles details for how an 
 * entry should look like. For example, entries with good moods appear blue and 
 * entries with bad moods appear red. */
export class Entry {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    preview: string;
    color: string;
  
    constructor(entry: any) {
      this.title = entry.title;
      this.date = entry.date;
      this.startTime = entry.startTime;
      this.endTime = entry.endTime;
      this.preview = entry.content.substr(0, 50) + "...";
      this.color = entry.goodMood ? '#DEF3FD' : '#FDDFDF'
    }
  
  }