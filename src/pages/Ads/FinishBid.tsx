import { Trans } from '@lingui/macro'
import { Trace } from '@uniswap/analytics'
import { InterfacePageName } from '@uniswap/analytics-events'
import { useWeb3React } from '@web3-react/core'
import { AdsButtonPrimary, ButtonPrimary, ButtonSecondary } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { Link, useLocation } from 'react-router-dom'
import styled, { useTheme } from 'styled-components/macro'
import { NoirUniLogo, useIPFSContext } from './CreateBid'
import NoirUni from '../../assets/images/noirUni.png'
import GloLogo from '../../assets/images/glo-logo.png'
import GloLogoAnimated from '../../assets/images/GLOtoken.gif'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { TextInput } from 'components/TextInput'
import Input from 'components/NumericalInput'
import { NumericInput } from 'nft/components/layout/Input'
import { useContract } from 'hooks/useContract'
import { ethers } from 'ethers'
import { useLocationLinkProps } from 'hooks/useLocationLinkProps'
import { useSingleCallResult } from 'lib/hooks/multicall'

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
  padding: 0 32px 52px;
  justify-content: center;
  width: 100vw;
  height: 800px;

  @media screen and (min-width: ${({ theme }) => theme.breakpoint.sm}px) {
    gap: 16px;
    padding: 0 32px 52px;
  }
  // @media screen and (min-width: ${({ theme }) => theme.breakpoint.md}px) {
  //   gap: 40px;
  //   padding: 48px 20px;
  // }
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
  background-color: #E3E3E3;
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
  padding: 1rem;
  text-align: left;
  font-size: 32px;
  color: #8C9397;
`

const BidCardElement = styled.div`
  width: 450px;
  height: 82px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background-color: #FFFFFF;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const BidCardElementCol = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
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
  amount: string;
  image: string;
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
      <img 
        style={{
          width: '100%',
          height: '100%',
          borderTopRightRadius: '0px',
          borderBottomRightRadius: '0px',
        }}
        src={bid.image} />
      <BidCardElementCol>
        <span style={{
          fontWeight: 'bold',
          marginBottom: '0.5rem'
        }}>{bid.amount} GLO</span>
        <span style={{
          fontSize: '12px'
        }}>Final bid</span>
        {/* <span>{bid.amount} * {bid.intensity}</span> */}
      </BidCardElementCol>
      <BidCardElementCol style={{
        textAlign: 'right'
      }}>
        <span>by {bid.address}</span>
        <span>7h ago</span>
        {/* <span>{bid.created_at}</span> */}
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
            marginBottom: '1rem',
          }}>
        <div style={{
            width: `${completed}%`,
            height: '100%',
            backgroundColor: '#787878',
            borderRadius: 'inherit',
            textAlign: 'right',
            borderRight: '5px solid #000000',
          }}></div>
      </div>
      <ProgressUnderlay>
          <span>1x</span>
          <ProgressCentered>0.75x</ProgressCentered>
          <ProgressCentered>0.5x</ProgressCentered>
          <ProgressCentered>0.25x</ProgressCentered>
          <ProgressCentered>0.1</ProgressCentered>
          <span style={{
            textAlign: 'right'
          }}>0</span>
      </ProgressUnderlay>
    </div>    
  )
}

const Loader = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row'
    }}>
      <img
        style={{
          maxWidth: "250px",
          maxHeight: "250px",
        }}
        src={GloLogoAnimated} 
        alt={"Loading..."}
      />
      {/* <p>
        Hold tight
      </p> */}
    </div>
  )
}

export default function FinishBid() {
  const theme = useTheme()
  const { account, chainId } = useWeb3React()
  const location = useLocation()
  
  const [ bid, setBid ] = useState(0)
  const [ intensity, setIntensity ] = useState(1)
  const [ completed, setCompleted ] = useState(false)
  const [ loading, setLoading ] = useState(false)

  let progressCounter = 100
  const calculateTimeLeft = (): {
    d: number,
    h: number,
    m: number,
    s: number
  } => {
    // date from unix timestamp
    let startTime = new Date(1674772656 * 1000)
    const originalStartTime = new Date(1674772656 * 1000)
    startTime.setDate(startTime.getDate() + 7)
    // add 1 week to start time
    let difference = +startTime - +new Date();
    
    progressCounter = difference / (startTime.getTime() - originalStartTime.getTime())
  
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

  const [timeLeft, setTimeLeft] = useState<{
    d: number;
    h: number;
    m: number;
    s: number;
  }>(calculateTimeLeft());

  const ipfsLink = location.search.split("link=")[1]

  const handleValue = useCallback(
    (value: string) => {
      setBid(Number(value))
    },
    [setBid]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  
    return () => clearTimeout(timer);
  });

  const AuctionHouse = useContract(
    '0xa7620C421d29db2bb991cD603a725b960E927cEd',
    [
      {
        inputs: [
          {
            "internalType": "uint256",
            "name": "tokens",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "image",
            "type": "string"
          }
        ],
        "name": "insert",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'week',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
        name: 'getWinners',
        outputs: [
          {
            internalType: 'struct Auction.AuctionWinners[10]',
            name: 'winners_',
            type: 'tuple[10]',
            components: [
              {
                internalType: 'address',
                name: 'winner',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
              },
              {
                internalType: 'string',
                name: 'image',
                type: 'string',
              },
            ],
          },
        ]
      }
    ],
    true
  )

  const oldWinners = useSingleCallResult(AuctionHouse, 'getWinners', [0])?.result?.[0]?.filter(
    (result: any) => result.winner !== '0x0000000000000000000000000000000000000000'
  )


  const currentLeaderboard: any[] = useSingleCallResult(AuctionHouse, 'getWinners', [1])?.result?.[0].filter(
    (result: any) => result.winner !== '0x0000000000000000000000000000000000000000'
  )

  const initialLeaders = useMemo(() => {
    let idx = 0
    if(!currentLeaderboard) return []
    return currentLeaderboard.map((ret) => {
      return {
        id: String(idx++),
        image: ret.image,
        amount: ethers.utils.formatEther(ret.value),
        // show first 4 and last 4
        address: ret.winner.slice(0, 4) + '...' + ret.winner.slice(-4),
        intensity: 1,
        created_at: '2021-10-10 10:10:10'
      }
    })
  }, [currentLeaderboard.length])

  const [leaders, setLeaders] = useState(initialLeaders)

  const timeString = Object.keys(timeLeft).map((interval) => {
    // @ts-ignore
    if (!timeLeft[interval]) {
      return;
    }

    // @ts-ignore
    return timeLeft[interval] + interval + " "
  }).join("");

  function handleSubmit() {
    if(!bid) {
      alert('Please enter a bid')
      return
    }

    if(!ipfsLink) {
      alert('Please enter a link on previous screen')
      return
    }

    setLoading(true)
    // TODO: sign and submit txn here

    const transfromedBid = ethers.utils.parseEther(bid.toString())
    console.log(transfromedBid)
    AuctionHouse?.functions?.insert(transfromedBid, ipfsLink).then((res) => {
      console.log(res)
      // add to leaders (hacky)
      setLeaders([
        ...initialLeaders,
        {
          id: String(leaders.length),
          image: ipfsLink,
          amount: bid.toString(),
          // show first 4 and last 4
          address: account?.slice(0, 4) + '...' + account?.slice(-4),
          intensity: 1,
          created_at: '2021-10-10 10:10:10'
        }
      ])
      res.wait().then((res: any) => {
        console.log(res)
        setCompleted(true)
      })
    })
    setLoading(false)
  }

  return (
    <Trace page={InterfacePageName.VOTE_PAGE} shouldLogImpression>
      <PageWrapper gap="lg" justify="center">
        { !loading ? <AdsLandingLayout>
          { !completed ?
            <LeftPanel>
              <div style={{
                  
              }}>
                <NoirUniLogo src={NoirUni} />
                <p>Set Bid Price</p>
                <div style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  paddingRight: '1rem'
                }}>
                  <BidInput
                      onUserInput={handleValue}
                      // TODO: cast to correct precision
                      align={'left'}
                      value={String(bid)}
                      fontSize={'16'}
                  />
                  <img style={{
                    width: '24px',
                    height: '24px',
                    marginRight: '0.5rem'
                  }} src={GloLogo}></img>
                  <span style={{
                    fontSize: '32px'
                  }}>GLO</span>
                </div>
                
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
                  }}>The earlier you bid, the more intense your GLO. Bid now and your GLO will only be worth {(progressCounter * 100).toFixed(0)}%</p>
                </CountdownElement>
                <ProgressBar completed={100 - (progressCounter * 100)}/>
              </div>
              <div>
                <AdsButtonPrimary
                  style={{ width: '100%', borderRadius: '8px', height: '60px', opacity: bid > 0 ? 1 : 0.5, pointerEvents: bid > 0 ? 'all' : 'none' }}
                  padding="8px"
                  onClick={handleSubmit}
                >
                  <Trans>Place bid of {bid} <img style={{
                    width: '24px',
                    height: '24px',
                    marginRight: '0.5rem',
                    marginLeft: '0.5rem'
                  }} src={GloLogo}></img> for {(bid * progressCounter).toFixed(2)} GLO Power</Trans>
                </AdsButtonPrimary>
              </div>
            </LeftPanel>
            :
            <LeftPanel>
              <p style={{
                fontSize: '64px'
              }}>You're all set</p>
              {ipfsLink && <img src={ipfsLink} alt="" />}
            </LeftPanel>
          }
          <RightPanel>
            <MediumHeader>Current Top Bids</MediumHeader>
            {
              // sort bids first by amount * intensity
              (leaders || []).sort().map((bid) => (
                  <BidCard key={bid.id} bid={bid}/>
              ))
            }
          </RightPanel>
        </AdsLandingLayout>
        : <Loader />
      }
      </PageWrapper>
    </Trace>
  )
}