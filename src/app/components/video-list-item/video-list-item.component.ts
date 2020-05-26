import { PlaylistService } from './../../services/playlist/state/playlist.service';
import { Router } from '@angular/router';
import { UserQuery } from '../../services/user/state/user.query';
import { Video } from '../../services/video/state/video.model';
import { VideoQuery } from '../../services/video/state/video.query';
import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../services/user/state/user.model';

@Component({
  selector: 'app-video-list-item',
  templateUrl: './video-list-item.component.html',
  styleUrls: ['./video-list-item.component.scss'],
})
export class VideoListItemComponent implements OnInit {
  @Input() playlistId: string;
  @Input() videoListItemId: string;
  video: Video;
  owner: User;

  constructor(
    private playlistService: PlaylistService,
    private videoQuery: VideoQuery,
    private userQuery: UserQuery,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.video = await this.videoQuery.getVideo(this.videoListItemId);
    this.owner = await this.userQuery.getUser(this.video.ownerRef);
  }

  async removeVideoListItem(event: MouseEvent): Promise<void> {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.playlistService.removeVideoFromPlaylist(
      this.videoListItemId,
      this.playlistId
    );
  }

  navigateToOwnerChannel(event: MouseEvent): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.router.navigate([`/channel/${this.owner.id}`]);
  }
}
