import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

import {
  debounceTime,
  tap,
  distinctUntilChanged,
  startWith,
  takeUntil
} from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'tmo-book-search-form',
  templateUrl: './book-search-form.component.html',
  styleUrls: ['./book-search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookSearchFormComponent implements OnInit, OnDestroy {
  @Output() searchBooks = new EventEmitter<string>();
  private unsubscribe$ = new Subject<void>();

  searchForm = this.fb.group({
    term: ''
  });

  constructor(private readonly fb: FormBuilder, private metaTagService: Meta) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.metaTagService.updateTag(
      { name: 'description', content: 'Search Books' }
    );

    this.searchForm
      .get('term')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
        tap(term => this.searchBooks.emit(term)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

}