import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'tmo-book-search-form',
  templateUrl: './book-search-form.component.html',
  styleUrls: ['./book-search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookSearchFormComponent implements OnInit {
  @Output() searchBooks = new EventEmitter<string>();
  searchForm = this.fb.group({
    term: ''
  });

  constructor(private readonly fb: FormBuilder, private metaTagService: Meta) { }

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.metaTagService.updateTag(
      { name: 'description', content: 'Search Books' }
    );
  }

  search() {
    this.searchBooks.emit(this.searchTerm);
  }
}