import Typography from 'typography'
import Wordpress2016 from 'typography-theme-wordpress-2016'

Wordpress2016.overrideThemeStyles = () => ({
  'a.gatsby-resp-image-link': {
    boxShadow: 'none',
  },
  'p': {
    marginBottom: '1em',
  },
  'li': {
    marginBottom: '0em',
  },
  'code': {
    fontSize: '1em',
    backgroundColor: '#fdf6e3',
  },
  'img': {
    align: 'middle',
  },
})

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
