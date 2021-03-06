import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { List } from 'immutable';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ComponentWithSubscription } from '../../abstract-components/component-with-subscription';
import { Video } from '../../models';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchComponent
  extends ComponentWithSubscription
  implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef;

  searchText$ = new Subject<string>();
  results: Array<Video>;
  loading: boolean = false;

  constructor(private searchService: SearchService) {
    super();
  }

  ngOnInit(): void {
    this.search();
  }

  handleSearchInput(event: any): void {
    this.loading = true;
    this.searchText$.next(event.target.value);
  }

  clearSearch(): void {
    this.searchText$.next('');
    (this.searchInput.nativeElement as HTMLInputElement).value = '';
  }

  search() {
    this.autoUnsubscribe(this.searchText$)
      .pipe(distinctUntilChanged(), debounceTime(500))
      .subscribe(async (text: string) => {
        try {
          if (text) {
            this.results = await this.searchService.search(text.toLowerCase());
          } else {
            this.results = [];
          }
        } catch (err) {
          console.error('Failed to search videos!');
          console.error(err);
        }
        this.loading = false;
      });
  }
}
