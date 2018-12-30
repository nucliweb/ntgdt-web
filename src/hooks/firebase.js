import {useState, useEffect, useCallback} from 'react'
import {get, set} from 'idb-keyval'

import * as firebase from 'firebase/app'
import 'firebase/database'

const config = {
  apiKey: 'AIzaSyCeUsBwp1gzKDwQqorrri7nRlqr_QXtg1g',
  authDomain: 'no-tengo-ganas-de-trabajar.firebaseapp.com',
  databaseURL: 'https://no-tengo-ganas-de-trabajar.firebaseio.com',
  projectId: 'no-tengo-ganas-de-trabajar',
  storageBucket: 'no-tengo-ganas-de-trabajar.appspot.com',
  messagingSenderId: '1069878588859'
}
firebase.initializeApp(config)

const NOT_FOUND = -1
const MAX_ITEMS = 100
const ITEMS_KEY = 'NTGDT_ITEMS_KEY'
const FAVORITES_ITEMS_KEY = 'NTGDT_FAVORITES_ITEMS_KEY'
const sortByDate = ({createdAt: a}, {createdAt: b}) => new Date(b) - new Date(a)
const uniqueElementsBy = (arr, fn) =>
  arr.reduce((acc, v) => {
    if (!acc.some(x => fn(v, x))) acc.push(v)
    return acc
  }, [])

export const useFavoritesFirebase = () => {
  const [items, setItems] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleFavoritesRemove = async () => {
      const favorites = await get(FAVORITES_ITEMS_KEY)
      setItems(favorites)
    }

    document.addEventListener('favorites:remove', handleFavoritesRemove)
    return () =>
      document.removeEventListener('favorites:remove', handleFavoritesRemove)
  }, [])

  useEffect(() => {
    get(FAVORITES_ITEMS_KEY).then((favorites = []) => {
      setItems(favorites)
      setLoading(false)
    })
  }, [])

  return {loading, items}
}

export const useItemFavoriteFirebase = item => {
  const [isFavorite, setIsFavorite] = useState(false)
  useEffect(() => {
    get(FAVORITES_ITEMS_KEY).then((favorites = []) => {
      setIsFavorite(favorites.some(favorite => item.id === favorite.id))
    })
  }, [])

  const callbackHandleClick = useCallback(async () => {
    const favorites = (await get(FAVORITES_ITEMS_KEY)) || []

    const indexFavorite = favorites.findIndex(
      favorite => favorite.id === item.id
    )

    if (indexFavorite === NOT_FOUND) {
      const nextFavorites = uniqueElementsBy(
        [item, ...(favorites || [])],
        (a, b) => a.id === b.id
      ).sort(sortByDate)
      set(FAVORITES_ITEMS_KEY, nextFavorites)
      setIsFavorite(true)
    } else {
      const nextFavorites = [
        ...favorites.slice(0, indexFavorite),
        ...favorites.slice(indexFavorite + 1)
      ]
      set(FAVORITES_ITEMS_KEY, nextFavorites)
      setIsFavorite(false)
      document.dispatchEvent(new window.Event('favorites:remove'))
    }
  })

  return {callbackHandleClick, isFavorite}
}

export const useItemFirebase = id => {
  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState()

  useEffect(() => {
    get(ITEMS_KEY).then(items => {
      const item = items.find(i => i.id === id)
      setLoading(false)
      setItem(item)
    })
  })
  return {loading, item}
}

export const useFirebaseRef = ref => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState()

  useEffect(() => {
    get(ITEMS_KEY).then((items = []) => {
      const [lastItemSaved = {}] = items
      lastItemSaved.id && setLoading(false)
      setItems(items)

      firebase
        .database()
        .ref(ref)
        .orderByChild('createdAt')
        .startAt(lastItemSaved.createdAt)
        .limitToLast(MAX_ITEMS)
        .on('value', async snapshot => {
          const fbItems = Object.values(snapshot.val() || {}).sort(sortByDate)
          const nextItems = uniqueElementsBy(
            [...fbItems, ...items],
            (a, b) => a.id === b.id
          )
          set(ITEMS_KEY, nextItems)
          setLoading(false)
          setItems(nextItems)
        })
    })

    return () =>
      firebase
        .database()
        .ref(ref)
        .off()
  }, [])

  return {loading, items}
}