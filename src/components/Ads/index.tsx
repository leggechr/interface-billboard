import { BigNumber } from '@ethersproject/bignumber'
import useInterval from 'lib/hooks/useInterval'
import { useCallback, useRef, useState } from 'react'
import styled from 'styled-components/macro'

interface Ad {
  image: string
  winner: string
  value: BigNumber
}

const Img = styled.img`
  padding-top: 24px;
  width: 100%;
`
export default function Ads({ ads }: { ads: Ad[] | undefined }) {
  const getAd = useCallback(() => {
    if (!ads) return
    const total = ads.reduce((acc, ad) => acc + ad.value.toNumber(), 0)
    let choice = Math.random() * total
    const index = ads.findIndex((ad) => {
      choice -= ad.value.toNumber()
      return choice < 0
    })
    return ads[index]
  }, [ads])

  const queuedAds = useRef([getAd(), getAd()])
  const [displayedIndex, setDisplayedIndex] = useState<0 | 1>(0)

  useInterval(
    () => {
      if (!ads) return

      const nextIndex = displayedIndex ? 0 : 1
      queuedAds.current[nextIndex] = getAd()

      if (queuedAds.current[displayedIndex]?.image === queuedAds.current[nextIndex]?.image) {
        return
      }

      setDisplayedIndex(nextIndex)
    },
    5000,
    false
  )

  if (!ads) return null

  return (
    <div style={{ position: 'relative' }}>
      <Img
        style={{
          position: 'absolute',
          left: 0,
          opacity: !displayedIndex ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
        src={queuedAds.current[0]?.image}
      />
      <Img
        style={{
          position: 'absolute',
          left: 0,
          opacity: displayedIndex ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
        src={queuedAds.current[1]?.image}
      />
    </div>
  )
}
