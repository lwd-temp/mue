import { PureComponent } from 'react';
import { Email, Twitter, Chat, Instagram, Facebook } from '@material-ui/icons';

import Tooltip from '../../../../helpers/tooltip/Tooltip';

const other_contributors = require('../../../../../modules/other_contributors.json');

export default class About extends PureComponent {
  constructor() {
    super();
    this.state = {
      contributors: [],
      sponsors: [],
      other_contributors: [],
      photographers: window.language.modals.main.loading,
      update: window.language.modals.main.settings.sections.about.version.checking_update,
      loading: window.language.modals.main.loading
    };
    this.language = window.language.modals.main.settings.sections.about;
    this.controller = new AbortController();
  }

  async getGitHubData() {
    let contributors, sponsors, photographers, versionData;

    try {
      versionData = await (await fetch(window.constants.GITHUB_URL + '/repos/' + window.constants.ORG_NAME + '/' + window.constants.REPO_NAME + '/releases', { signal: this.controller.signal })).json();

      contributors = await (await fetch(window.constants.GITHUB_URL + '/repos/'+ window.constants.ORG_NAME + '/' + window.constants.REPO_NAME + '/contributors', { signal: this.controller.signal })).json();
      sponsors = (await (await fetch(window.constants.SPONSORS_URL + '/list', { signal: this.controller.signal })).json()).sponsors;

      photographers = await (await fetch(window.constants.API_URL + '/images/photographers', { signal: this.controller.signal })).json();
    } catch (e) {
      if (this.controller.signal.aborted === true) {
        return;
      }

      return this.setState({
        update: this.language.version.error.title,
        loading: this.language.version.error.description
      });
    }

    if (this.controller.signal.aborted === true) {
      return;
    }

    const newVersion = versionData[0].tag_name;

    let update = this.language.version.no_update;
    if (Number(window.constants.VERSION.replaceAll('.', '')) < Number(newVersion.replaceAll('.', ''))) {
      update = `${this.language.version.update_available}: ${newVersion}`;
    }

    this.setState({
      // exclude bots
      contributors: contributors.filter((contributor) => !contributor.login.includes('bot')),
      sponsors,
      update,
      other_contributors,
      photographers: photographers.sort().join(', '), 
      loading: null
    });
  }

  componentDidMount() {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      this.setState({
        update: this.language.version.offline_mode,
        loading: window.language.modals.main.marketplace.offline.description
      });
      return;
    }

    this.getGitHubData();
  }

  componentWillUnmount() {
    // stop making requests
    this.controller.abort();
  }

  render() {
    return (
      <>
        <h2>{this.language.title}</h2>
        <img draggable='false' className='aboutLogo' src='./././icons/logo_horizontal.png' alt='Logo'></img>
        <p>{this.language.copyright} {window.constants.COPYRIGHT_YEAR}-{new Date().getFullYear()} <a href={'https://github.com/' + window.constants.ORG_NAME + '/' + window.constants.REPO_NAME + '/graphs/contributors'} className='aboutLink' target='_blank' rel='noopener noreferrer'>{window.constants.COPYRIGHT_NAME}</a> ({window.constants.COPYRIGHT_LICENSE})</p>
        <p>{this.language.version.title} {window.constants.VERSION} ({this.state.update})</p>
        <a href={window.constants.PRIVACY_URL} className='aboutLink' target='_blank' rel='noopener noreferrer' style={{ fontSize: '1rem' }}>{window.language.modals.welcome.sections.privacy.links.privacy_policy}</a>

        <h3>{this.language.contact_us}</h3>
        <a href={'mailto:' + window.constants.EMAIL} className='aboutIcon' target='_blank' rel='noopener noreferrer'><Email/></a>
        <a href={'https://twitter.com/' + window.constants.TWITTER_HANDLE} className='aboutIcon' target='_blank' rel='noopener noreferrer'><Twitter/></a>
        <a href={'https://instagram.com/' + window.constants.INSTAGRAM_HANDLE} className='aboutIcon' target='_blank' rel='noopener noreferrer'><Instagram/></a>
        <a href={'https://facebook.com/' + window.constants.FACEBOOK_HANDLE} className='aboutIcon' target='_blank' rel='noopener noreferrer'><Facebook/></a>
        <a href={'https://discord.gg/' + window.constants.DISCORD_SERVER} className='aboutIcon' target='_blank' rel='noopener noreferrer'><Chat/></a>

        <h3>{this.language.support_mue}</h3>
        <p>
          <a href={'https://github.com/sponsors/' + window.constants.DONATE_USERNAME} className='aboutLink' target='_blank' rel='noopener noreferrer'>GitHub Sponsors</a> 
          &nbsp; • &nbsp;<a href={'https://ko-fi.com/' + window.constants.DONATE_USERNAME} className='aboutLink' target='_blank' rel='noopener noreferrer'>Ko-Fi</a> 
          &nbsp; • &nbsp;<a href={'https://patreon.com/' + window.constants.DONATE_USERNAME} className='aboutLink' target='_blank' rel='noopener noreferrer'>Patreon</a>
        </p>

        <h3>{this.language.resources_used.title}</h3>
        <p>
          <a href='https://www.pexels.com' className='aboutLink' target='_blank' rel='noopener noreferrer'>Pexels</a>
          , <a href='https://unsplash.com' className='aboutLink' target='_blank' rel='noopener noreferrer'>Unsplash</a> ({this.language.resources_used.bg_images})
        </p>
        <p><a href='https://fonts.google.com/icons?selected=Material+Icons' className='aboutLink' target='_blank' rel='noopener noreferrer'>Google Fonts</a> ({this.language.resources_used.pin_icon})</p>
        <p><a href='https://undraw.co' className='aboutLink' target='_blank' rel='noopener noreferrer'>Undraw</a> ({this.language.resources_used.welcome_img})</p>

        <h3>{this.language.contributors}</h3>
        <p>{this.state.loading}</p>
        {this.state.contributors.map((item) => (
          <Tooltip title={item.login} key={item.login}>
            <a href={'https://github.com/' + item.login} target='_blank' rel='noopener noreferrer'><img draggable='false' className='abouticon' src={item.avatar_url + '&size=128'} alt={item.login}/></a>
          </Tooltip>
        ))}
        { // for those who contributed without opening a pull request
        this.state.other_contributors.map((item) => (
          <Tooltip title={item.login} key={item.login}>
            <a href={'https://github.com/' + item.login} target='_blank' rel='noopener noreferrer'><img draggable='false' className='abouticon' src={item.avatar_url + '&size=128'} alt={item.login}/></a>
          </Tooltip>
        ))}

        <h3>{this.language.supporters}</h3>
        <p>{this.state.loading}</p>
        {this.state.sponsors.map((item) => (
          <Tooltip title={item.handle} key={item.handle}>
            <a href={'https://github.com/' + item.handle} target='_blank' rel='noopener noreferrer'><img draggable='false' className='abouticon' src={item.avatar + '&size=128'} alt={item.handle}></img></a>
          </Tooltip>
        ))}

        <h3>{this.language.photographers}</h3>
        <p>{this.state.photographers}</p>
      </>
    );
  }
}
