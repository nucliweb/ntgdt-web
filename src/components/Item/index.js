import React from 'react'
import PropTypes from 'prop-types'

import {useItemFavoriteFirebase} from '../../hooks/firebase'

import Image from '../Image'
import Favorite from '../Icons/Favorite'
import GetApp from '../Icons/GetApp'
import Send from '../Icons/Send'

const Item = ({item, style, onClick}) => {
  const {title, image, image_blur: blur} = item
  const {isFavorite, callbackHandleClick} = useItemFavoriteFirebase(item)
  return (
    <div className="Item" style={style}>
      <h2 className="Item-title">{title}</h2>
      <div className="Item-image" onClick={onClick}>
        <Image blur={blur} src={image} alt={title} />
      </div>
      <div className="Item-icons">
        <Favorite
          className="Item-icon"
          isFavorite={isFavorite}
          onClick={callbackHandleClick}
        />
        <a href={item.image} download="image.jpeg" hidden>
          <GetApp className="Item-icon" />
        </a>
        <a href={`whatsapp://send?text=${item.image}`} aria-label="Send">
          <Send className="Item-icon" />
        </a>
      </div>
    </div>
  )
}

Item.displayName = 'Item'
Item.propTypes = {
  onClick: PropTypes.func,
  style: PropTypes.object,
  item: PropTypes.shape({
    createdAt: PropTypes.number,
    id: PropTypes.string,
    image: PropTypes.string,
    image_blur: PropTypes.string,
    link: PropTypes.string,
    site: PropTypes.string,
    title: PropTypes.string
  })
}

export default Item