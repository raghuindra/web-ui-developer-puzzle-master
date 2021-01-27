import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList, toggleMarkedAsRead, undoToggledMarkedAsRead } from '@tmo/books/data-access';
import { ReadingListItem } from '@tmo/shared/models';
import { take } from 'rxjs/operators';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);

  constructor(private readonly store: Store, private snackBar: MatSnackBar) {}

  onRemovedFromReadingList(item: ReadingListItem) {
    this.store.dispatch(removeFromReadingList({ item }));
  }

  onToggleMarkedAsRead(item: ReadingListItem) {
    const readStatus = item.finished ? 'Unread' : 'Read';
    const message = `${item.title} Marked as '${readStatus}'`;
    this.store.dispatch(toggleMarkedAsRead({ item }));

    const snackBarRef = this.snackBar.open(message, 'Undo', { duration: 5000 });

    snackBarRef
      .onAction()
      .pipe(take(1))
      .subscribe(() => this.store.dispatch(undoToggledMarkedAsRead({ item })));
  }
}
