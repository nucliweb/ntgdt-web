import React from 'react'
import PropTypes from 'prop-types'

const Video = ({webm, mp4, poster, onClick, width, height}) => {
  return (
    <video
      autoPlay
      className="Video"
      loop
      muted
      onClick={onClick}
      playsInline
      poster={poster}
      src={mp4}
      width={width}
      height={height}
    >
      Tu navegador no soporta HTML5 video
    </video>
  )
}

Video.displayName = 'Video'
Video.propTypes = {
  onClick: PropTypes.func,
  webm: PropTypes.string,
  mp4: PropTypes.string,
  poster: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
}
export default Video
