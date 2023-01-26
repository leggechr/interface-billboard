import useInterval from 'lib/hooks/useInterval'
import { useCallback, useState } from 'react'
import styled from 'styled-components/macro'

interface Ad {
  image: string
  winner: string
  value: number
}

const Img = styled.img`
  padding-top: 24px;
  width: 100%;
`
export default function Ads({ ads }: { ads: Ad[] }) {
  const getAd = useCallback(() => {
    const total = ads.reduce((acc, ad) => acc + ad.value, 0)
    let choice = Math.random() * total
    const index = ads.findIndex((ad) => {
      choice -= ad.value
      return choice < 0
    })
    return ads[index]
  }, [ads])

  const [currAd, setAd] = useState<Ad>(getAd())

  useInterval(
    () => {
      const ad = getAd()
      if (ad === currAd) return
      setAd(ad)
    },
    5000,
    false
  )

  return <Img src={currAd.image} />
}
