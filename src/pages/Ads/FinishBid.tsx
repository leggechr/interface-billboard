import { Trans } from '@lingui/macro'
import { Trace } from '@uniswap/analytics'
import { InterfacePageName } from '@uniswap/analytics-events'
import { useWeb3React } from '@web3-react/core'
import { AdsButtonPrimary, ButtonPrimary, ButtonSecondary } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { Link } from 'react-router-dom'
import styled, { useTheme } from 'styled-components/macro'
import { NoirUniLogo } from './CreateBid'
import NoirUni from '../../assets/images/noirUni.png'
import { useCallback, useState } from 'react'
import { TextInput } from 'components/TextInput'
import Input from 'components/NumericalInput'
import { NumericInput } from 'nft/components/layout/Input'

const PageWrapper = styled(AutoColumn)`
  // padding-top: 68px;

  // @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
  //   padding: 48px 8px 0px;
  // }

  // @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
  //   padding-top: 20px;
  // }
`

export const AdsLandingLayout = styled.div`
  display: flex;
  padding: 0 8px 52px;
  justify-content: center;
  width: 100vw;

  @media screen and (min-width: ${({ theme }) => theme.breakpoint.sm}px) {
    gap: 16px;
    padding: 0 16px 52px;
  }
  @media screen and (min-width: ${({ theme }) => theme.breakpoint.md}px) {
    gap: 40px;
    padding: 48px 20px;
  }
  @media screen and (min-width: ${({ theme }) => theme.breakpoint.xl}px) {
    gap: 60px;
  }
`

const LeftPanel = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 50%;
  place-content: space-between;
`

const RightPanel = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 50%;
  background-color: #FD82FF;
  padding: 0 2rem 2rem 2rem;
  place-content: space-between;
`

const PanelBottom = styled.div`
  // display: flex;
  // bottom: 0;
`

const MediumHeader = styled.p`
  font-size: 32px;
`

const BidInput = styled(Input)`
  width: 100%;
  height: 64px;
  border-radius: 12px;
  background-color: #FFFFFF;
  padding: 1rem;
  text-align: left;
  font-size: 32px;
  color: #8C9397;
`

export default function FinishBid() {
  const theme = useTheme()
  const { account, chainId } = useWeb3React()
  const [ bid, setBid ] = useState(0)

  const handleValue = useCallback(
    (value: string) => {
      setBid(Number(value))
    },
    [setBid]
  )


  return (
    <Trace page={InterfacePageName.VOTE_PAGE} shouldLogImpression>
      <PageWrapper gap="lg" justify="center">
        <AdsLandingLayout>
          <LeftPanel>
            <NoirUniLogo src={NoirUni} />
            {/* <p>Auction ends in</p> */}
            {/* <p>1d 2h 3m 4s</p> */}
            <p>Set Bid Price</p>
            <BidInput 
                onUserInput={handleValue}
                // TODO: cast to correct precision
                align={'left'}
                value={String(bid)}
                fontSize={'16'}
            />
            <p>The earlier you bid, the more intense your GLO. Bid now and your GLO will be intensified by 2x</p>
          </LeftPanel>
          <RightPanel>
            
          </RightPanel>
        </AdsLandingLayout>
      </PageWrapper>
    </Trace>
  )
}