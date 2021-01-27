import { Injectable } from '@nestjs/common';
import { Book, ReadingListItem } from '@tmo/shared/models';
import {  StorageService} from '@tmo/shared/storage';

const KEY = '[okreads API] Reading List';

@Injectable()
export class ReadingListService {
  private readonly storage = new StorageService<ReadingListItem[]>(KEY, []);

  async getList(): Promise<ReadingListItem[]> {
    return this.storage.read();
  }

  async addBook(b: Book): Promise<void> {
    this.storage.update(list => {
      const { id, ...rest } = b;
      list.push({
        bookId: id,
        ...rest
      });
      return list;
    });
  }

  async removeBook(id: string): Promise<void> {
    this.storage.update(list => {
      return list.filter(x => x.bookId !== id);
    });
  }

  async updateMarkedAsRead(id: string, item: ReadingListItem): Promise<void> {
    this.storage.update(list => {
      const index = list.findIndex(x => x.bookId === id);
      if (index > -1) {
        list[index] = item;
      }
      return list;
    })
  }
}
