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
import { useCallback, useEffect, useState } from 'react'
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
  height: 800px;

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
  place-content: space-evenly;
`

const RightPanel = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 50%;
  background-color: #FD82FF;
  padding: 2rem;
  align-items: center;
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
  max-height: 64px;
  border-radius: 12px;
  background-color: #FFFFFF;
  padding: 1rem;
  text-align: left;
  font-size: 32px;
  color: #8C9397;
`

const BidCardElement = styled.div`
  width: 450px;
  height: 82px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 1rem;
`

const BidCardElementCol = styled.div`
  display: flex;
  flex-direction: column;
`

const CountdownElement = styled.div`
  display: flex;
  flex-direction: row;
  place-items: space-evenly;
`

const ProgressUnderlay = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
`

const ProgressHeader = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`

const ProgressCentered = styled.span`
  text-align: center;
`

type BidType = {
  id: string;
  amount: number;
  address: string;
  intensity: number;
  created_at: string;
}

function BidCard({
  bid,
}: {
  bid: BidType
}) {
  return (
    <BidCardElement>
      <BidCardElementCol>
        <span style={{
          fontWeight: 'bold'
        }}>{bid.amount * bid.intensity}</span>
        <span>{bid.amount} * {bid.intensity}</span>
      </BidCardElementCol>
      <BidCardElementCol style={{
        textAlign: 'right'
      }}>
        <span>by {bid.address}</span>
        <span>{bid.created_at}</span>
      </BidCardElementCol>
    </BidCardElement>
  )
} 

const ProgressBar = ({
  completed
}: {
  completed: number
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <ProgressHeader>
        <span>start_time</span>
        <span style={{
          textAlign: 'right'
        }}>end_time</span>
      </ProgressHeader>
      <div style={{
            width: '100%',
            height: '20px',
            backgroundColor: '#FD82FF',
            borderRadius: '50',
            marginTop: '1rem',
            marginBottom: '1rem'
          }}>
        <div style={{
            width: `${completed}%`,
            height: '100%',
            backgroundColor: '#E0E0E0',
            borderRadius: 'inherit',
            textAlign: 'right'
          }}></div>
      </div>
      <ProgressUnderlay>
          <span>100x</span>
          <ProgressCentered>75x</ProgressCentered>
          <ProgressCentered>50x</ProgressCentered>
          <ProgressCentered>25x</ProgressCentered>
          <ProgressCentered>5x</ProgressCentered>
          <span style={{
            textAlign: 'right'
          }}>1x</span>
      </ProgressUnderlay>
    </div>    
  )
}

const bids = [
  {
    id: '1',
    amount: 100,
    address: '0x1234',
    intensity: 2,
    created_at: '2021-10-10 10:10:10'
  }
]

const calculateTimeLeft = (endTime: string): {
  d: number,
  h: number,
  m: number,
  s: number
} => {
  let difference = +new Date(endTime) - +new Date();

  if (difference > 0) {
    return {
      d: Math.floor(difference / (1000 * 60 * 60 * 24)),
      h: Math.floor((difference / (1000 * 60 * 60)) % 24),
      m: Math.floor((difference / 1000 / 60) % 60),
      s: Math.floor((difference / 1000) % 60)
    };
  }
  else {
    return {
      d: 0,
      h: 0,
      m: 0,
      s: 0
    }
  }
}

export default function FinishBid() {
  const theme = useTheme()
  const { account, chainId } = useWeb3React()
  const [ bid, setBid ] = useState(0)
  const [timeLeft, setTimeLeft] = useState<{
    d: number;
    h: number;
    m: number;
    s: number;
  }>(calculateTimeLeft('2023-01-27 00:00:00'));

  const handleValue = useCallback(
    (value: string) => {
      setBid(Number(value))
    },
    [setBid]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft('2023-01-27 00:00:00'));
    }, 1000);
  
    return () => clearTimeout(timer);
  });

  const timeString = Object.keys(timeLeft).map((interval) => {
    // @ts-ignore
    if (!timeLeft[interval]) {
      return;
    }

    // @ts-ignore
    return timeLeft[interval] + interval + " "
  }).join("");

  return (
    <Trace page={InterfacePageName.VOTE_PAGE} shouldLogImpression>
      <PageWrapper gap="lg" justify="center">
        <AdsLandingLayout>
          <LeftPanel>
            <div>
              <NoirUniLogo src={NoirUni} />
              <p>Set Bid Price</p>
              <BidInput 
                  onUserInput={handleValue}
                  // TODO: cast to correct precision
                  align={'left'}
                  value={String(bid)}
                  fontSize={'16'}
              />
            </div>
            <div>
              <p>Auction ends in</p>
              <CountdownElement>
                <span style={{
                  fontSize: '32px',
                  width: '50%'
                }}>{timeString && timeString}</span>
                <p style={{
                  width: '400px'
                }}>The earlier you bid, the more intense your GLO. Bid now and your GLO will be intensified by 2x</p>
              </CountdownElement>
              <ProgressBar completed={60}/>
            </div>
            <div>
              <AdsButtonPrimary
                // TODO: how to get icons here?
                // data-cy="join-pool-button"
                as={Link}
                to="/finish"
                style={{ width: '100%', borderRadius: '8px' }}
                padding="8px"
              >
                <Trans>Place top bid of 12,500 GLO Intensity</Trans>
              </AdsButtonPrimary>
            </div>
          </LeftPanel>
          <RightPanel>
            <MediumHeader>Current Top Bids</MediumHeader>
            {
              bids.map((bid) => (
                <BidCard bid={bid}/>
              ))
            }
          </RightPanel>
        </AdsLandingLayout>
      </PageWrapper>
    </Trace>
  )
}