import { ComponentWithSubscription } from './../../abstract-components/component-with-subscription';
import { UserQuery } from '../../state/user/user.query';
import { PlaylistQuery } from '../../state/playlist/playlist.query';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidenavComponent
  extends ComponentWithSubscription
  implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  watchLaterURL: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private playlistQuery: PlaylistQuery,
    private userQuery: UserQuery
  ) {
    super();
  }

  ngOnInit(): void {
    this.autoUnsubscribe(this.userQuery.selectMyAccount()).subscribe(
      async (me) => {
        const watchLaterPlaylist = me
          ? await this.playlistQuery.getDefaultPlaylistForUser(me.id)
          : null;

        if (watchLaterPlaylist) {
          this.watchLaterURL = `/playlist/${watchLaterPlaylist.id}`;
        } else {
          this.watchLaterURL = '/login';
        }
      }
    );
  }
}
