/** @jsx h */
import { h, Component } from 'preact';

import './style.scss';

import Room from '../../components/Room';
import Align from '../../components/Align';
import ButtonItem from '../../components/ButtonItem';
import ShareButtons from '../../components/ShareButtons';
import audio from '../../audio';
import viewer from '../../viewer';

import transition from '../../transition';

export default class Submission extends Component {
  constructor({ roomId, id }) {
    super();
    this.state = {
      loading: 'Loading performance…',
      deepLink: `https://tonite.dance/${roomId}/${id}`,
    };

    this.shareURL = {
      googlePlus: 'https://plus.google.com/share?url=',
      twitter: 'https://twitter.com/intent/tweet?text=',
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.asyncMount();
  }

  componentWillUnmount() {
    this.mounted = false;
    audio.fadeOut();
  }

  async asyncMount() {
    if (transition.isInside()) {
      await transition.fadeOut();
    }
    if (!this.mounted) return;
    if (viewer.vrEffect.isPresenting) {
      viewer.vrEffect.exitPresent();
    }
    viewer.switchCamera('orthographic');
    transition.reset();
  }

  render({ roomId, id, fromRecording, onGotoFullExperience }, { deepLink }) {
    return (
      <div className="submission">
        <Room
          roomId={roomId}
          id={id}
          orbs
        />
        <Align type="bottom-right">
          <ButtonItem
            text={fromRecording
              ? `Watch yourself in the
full experience.`
              : `Press here to watch them
in the full experience.`
            }
            onClick={onGotoFullExperience}
            underline
          />
        </Align>
        { fromRecording &&
          <ShareButtons deepLink={deepLink}>
            <ButtonItem text="Create animated GIF" navigate="/" underline />
          </ShareButtons>
        }
      </div>
    );
  }
}
