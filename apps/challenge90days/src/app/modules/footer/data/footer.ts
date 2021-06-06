import { IFooter } from '../interface/footer';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faGithub,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
export const footerData: IFooter[] = [
  {
    icon: faFacebook,
    link: 'https://www.facebook.com/90DAYSCHALLEHNGS',
  },
  {
    icon: faInstagram,
    link: 'https://www.instagram.com/90dayschallenges.tw/',
  },
  {
    icon: faEnvelope,
    link: 'mailto:90dayschallenges.tw@gmail.com?subject=Hi 90天的大家',
  },
  {
    icon: faGithub,
    link: 'https://github.com/tso1158687/challenge90days',
  },
];
