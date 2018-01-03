import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import profilePic from './profile-pic.jpg'
import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={profilePic}
          alt={`Richard Imaoka`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
          }}
        />
        <p>
          Written by <strong>Richard Imaoka</strong>, a Scala developer
          . You can find me (richardimaoka) at <a href="https://twitter.com/richardimaoka">twitter</a>,
          and <a href="https://github.com/richardimaoka">github</a>.
        </p>
      </div>
    )
  }
}

export default Bio
