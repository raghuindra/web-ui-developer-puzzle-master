import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ReadingListBook } from '@tmo/books/data-access';

@Component({
  selector: 'tmo-book-search-results',
  templateUrl: './book-search-results.component.html',
  styleUrls: ['./book-search-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookSearchResultsComponent implements OnInit {
  @Input() books: ReadingListBook[];
  @Input() searchTerm: string;
  @Output() addedBookToReadingList = new EventEmitter<ReadingListBook>();

  constructor() { }

  ngOnInit(): void {
  }

  onAddedBookToReadingList(book: ReadingListBook) {
    this.addedBookToReadingList.emit(book);
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

}