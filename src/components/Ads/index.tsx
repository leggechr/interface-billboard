import { BigNumber } from '@ethersproject/bignumber'
import useInterval from 'lib/hooks/useInterval'
import { useCallback, useState } from 'react'
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

  const [currAd, setAd] = useState<Ad | undefined>(getAd())

  useInterval(
    () => {
      const ad = getAd()
      if (!ad || ad === currAd) return
      setAd(ad)
    },
    3000,
    false
  )

  if (!currAd) return null

  return <Img src={currAd.image} />
}
