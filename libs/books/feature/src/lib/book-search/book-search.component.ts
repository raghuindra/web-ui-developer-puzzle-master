import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks,
  getSearchTerm,
  undoAddToReadingList
} from '@tmo/books/data-access';

import { Book } from '@tmo/shared/models';
import { Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookSearchComponent implements OnInit {
  books$: Observable<ReadingListBook[]> = this.store.select(getAllBooks);
  searchTerm$: Observable<string> = this.store.select(getSearchTerm);

  constructor(
    private readonly store: Store,
    private metaTagService: Meta,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.books$.subscribe(book => {
      this.cd.markForCheck();
    });
    this.metaTagService.addTags([
      { name: 'keywords', content: 'Angular SEO Integration, Read Books, Search Books' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'T-Mobile Web UI Search' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'date', content: '2021-01-21', scheme: 'YYYY-MM-DD' },
      { charset: 'UTF-8' }
    ]);
  }

  onAddedBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
    const snackBarRef = this.snackbar.open(
      `${book.title} added to your reading list!`,
      'Undo',
      { duration: 5000 }
    );

    snackBarRef
      .onAction()
      .pipe(take(1))
      .subscribe(() => this.store.dispatch(undoAddToReadingList({ book })));
  }

  searchExample(searchTerm : string) {
    this.onSearchBooks(searchTerm);
  }

  onSearchBooks(searchTerm: string) {
    if (searchTerm) {
      this.store.dispatch(searchBooks({ term: searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }
}
