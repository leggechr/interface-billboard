import { Trace } from '@uniswap/analytics'
import { InterfacePageName } from '@uniswap/analytics-events'
import { useWeb3React } from '@web3-react/core'
import { AdsButtonPrimary } from 'components/Button'
import Input from 'components/NumericalInput'
import { ethers } from 'ethers'
import { useContract } from 'hooks/useContract'
import { useSingleCallResult } from 'lib/hooks/multicall'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import GloLogo from '../../assets/images/glo-logo.png'
import GloLogoAnimated from '../../assets/images/GLOtoken.gif'
import NoirUni from '../../assets/images/noirUni.png'
import { NoirUniLogo } from './CreateBid'

const AdsLandingLayout = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
`

const RightPanel = styled.div<{ bgColor?: string; justifyContent?: string; gap?: string }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 50%;
  background-color: ${({ bgColor }) => bgColor ?? 'none'};
  align-items: center;
  padding: 0px 50px;
  justify-content: ${({ justifyContent }) => justifyContent ?? 'flex-start'};
  gap: ${({ gap }) => gap ?? '0px'};
`

const BidInput = styled(Input)`
  width: 100%;
  height: 64px;
  max-height: 64px;
  padding: 1rem;
  text-align: left;
  font-size: 32px;
`

const BidCardElement = styled.div`
  width: 450px;
  height: 82px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background-color: #ffffff;
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
  align-items: center;
  padding: 10px 0;
  margin-bottom: 10px;
`

const ProgressUnderlay = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  font-size: 12px;
  color: #787878;
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
  id: string
  amount: string
  image: string
  address: string
  intensity: number
  created_at: string
}

function BidCard({ bid }: { bid: BidType }) {
  return (
    <BidCardElement>
      <img
        style={{
          width: '100%',
          height: '100%',
          borderTopRightRadius: '0px',
          borderBottomRightRadius: '0px',
        }}
        src={bid.image}
      />
      <BidCardElementCol>
        <span
          style={{
            fontWeight: 'bold',
            marginBottom: '0.5rem',
          }}
        >
          {bid.amount} GLO
        </span>
      </BidCardElementCol>
      <BidCardElementCol
        style={{
          textAlign: 'right',
        }}
      >
        <span>by {bid.address}</span>
      </BidCardElementCol>
    </BidCardElement>
  )
}

const ProgressBar = ({ completed }: { completed: number }) => {
  // date from unix timestamp
  const originalStartTime = new Date(1674772656 * 1000)
  const endTime = new Date(1674772656 * 1000)
  endTime.setDate(endTime.getDate() + 7)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ProgressHeader>
        <span style={{ fontSize: '12px', color: '#787878' }}>{originalStartTime.toLocaleString()}</span>
        <span
          style={{
            textAlign: 'right',
            fontSize: '12px',
            color: '#787878',
          }}
        >
          {endTime.toLocaleString()}
        </span>
      </ProgressHeader>
      <div
        style={{
          width: '100%',
          height: '20px',
          backgroundColor: '#FD82FF',
          borderRadius: '8px',
          margin: '6px 0',
        }}
      >
        <div
          style={{
            width: `${completed}%`,
            height: '100%',
            backgroundColor: '#787878',
            textAlign: 'right',
            borderRight: '5px solid #000000',
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
          }}
        ></div>
      </div>
      <ProgressUnderlay>
        <span>1x</span>
        <ProgressCentered>0.75x</ProgressCentered>
        <ProgressCentered>0.5x</ProgressCentered>
        <ProgressCentered>0.25x</ProgressCentered>
        <ProgressCentered>0.1</ProgressCentered>
        <span
          style={{
            textAlign: 'right',
          }}
        >
          0
        </span>
      </ProgressUnderlay>
    </div>
  )
}

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <img
        style={{
          maxWidth: '250px',
          maxHeight: '250px',
        }}
        src={GloLogoAnimated}
        alt="Loading..."
      />
    </div>
  )
}

export default function FinishBid() {
  const { account, chainId } = useWeb3React()
  const location = useLocation()

  const [bid, setBid] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)

  let progressCounter = 100
  const calculateTimeLeft = (): {
    d: number
    h: number
    m: number
    s: number
  } => {
    // date from unix timestamp
    const startTime = new Date(1674772656 * 1000)
    const originalStartTime = new Date(1674772656 * 1000)
    startTime.setDate(startTime.getDate() + 7)
    // add 1 week to start time
    const difference = +startTime - +new Date()

    progressCounter = difference / (startTime.getTime() - originalStartTime.getTime())

    if (difference > 0) {
      return {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      }
    } else {
      return {
        d: 0,
        h: 0,
        m: 0,
        s: 0,
      }
    }
  }

  const [timeLeft, setTimeLeft] = useState<{
    d: number
    h: number
    m: number
    s: number
  }>(calculateTimeLeft())

  const ipfsLink = location.search.split('link=')[1]

  const handleValue = useCallback(
    (value: string) => {
      setBid(Number(value))
    },
    [setBid]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearTimeout(timer)
  })

  const AuctionHouse = useContract(
    '0xa7620C421d29db2bb991cD603a725b960E927cEd',
    [
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'tokens',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'image',
            type: 'string',
          },
        ],
        name: 'insert',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
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
        ],
      },
    ],
    true
  )

  const currentLeaderboard: any[] = useSingleCallResult(AuctionHouse, 'getWinners', [1])?.result?.[0].filter(
    (result: any) => result.winner !== '0x0000000000000000000000000000000000000000'
  )

  const initialLeaders = useMemo(() => {
    let idx = 0
    if (!currentLeaderboard) return []
    return currentLeaderboard.map((ret) => {
      return {
        id: String(idx++),
        image: ret.image,
        amount: ethers.utils.formatEther(ret.value),
        // show first 4 and last 4
        address: ret.winner.slice(0, 4) + '...' + ret.winner.slice(-4),
        intensity: 1,
        created_at: '2021-10-10 10:10:10',
      }
    })
  }, [currentLeaderboard?.length])

  const [leaders, setLeaders] = useState<any[]>([])

  useEffect(() => {
    if (initialLeaders) {
      setLeaders(initialLeaders)
    }
  }, [initialLeaders])

  const timeString = Object.keys(timeLeft)
    .map((interval) => {
      // @ts-ignore
      if (!timeLeft[interval]) {
        return
      }

      // @ts-ignore
      return timeLeft[interval] + interval + ' '
    })
    .join('')

  function handleSubmit() {
    if (!bid) {
      alert('Please enter a bid')
      return
    }

    if (!ipfsLink) {
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
          created_at: '2021-10-10 10:10:10',
        },
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
      {!loading ? (
        <AdsLandingLayout>
          {!completed ? (
            <RightPanel justifyContent="center" gap="24px">
              <NoirUniLogo style={{ alignSelf: 'flex-start' }} src={NoirUni} />
              <div style={{ width: '100%' }}>
                Set Bid Price
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    paddingRight: '1rem',
                    border: '1px solid #E3E3E3',
                    marginTop: '5px',
                  }}
                >
                  <BidInput
                    onUserInput={handleValue}
                    // TODO: cast to correct precision
                    align="left"
                    value={String(bid)}
                    fontSize="16"
                  />
                  <img
                    style={{
                      width: '24px',
                      height: '24px',
                      marginRight: '0.5rem',
                    }}
                    src={GloLogo}
                  ></img>
                  <span
                    style={{
                      fontSize: '32px',
                    }}
                  >
                    GLO
                  </span>
                </div>
              </div>
              <div style={{ width: '100%' }}>
                Auction ends in
                <CountdownElement>
                  <span
                    style={{
                      fontSize: '32px',
                      width: '570px',
                      whiteSpace: 'nowrap',
                      paddingRight: '3px',
                    }}
                  >
                    {timeString && timeString}
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#6D6D6D',
                    }}
                  >
                    The earlier you bid, the more intense your GLO. Bid now and your GLO will only be worth{' '}
                    {(progressCounter * 100).toFixed(0)}%
                  </span>
                </CountdownElement>
                <ProgressBar completed={100 - progressCounter * 100} />
              </div>
              <AdsButtonPrimary
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  padding: '16px',
                  opacity: bid > 0 ? 1 : 0.5,
                  pointerEvents: bid > 0 ? 'all' : 'none',
                }}
                padding="8px"
                onClick={handleSubmit}
              >
                Place bid of {bid}{' '}
                <img
                  style={{
                    width: '24px',
                    height: '24px',
                    marginRight: '0.5rem',
                    marginLeft: '0.5rem',
                  }}
                  src={GloLogo}
                ></img>{' '}
                for {(bid * progressCounter).toFixed(2)} GLO Power
              </AdsButtonPrimary>
            </RightPanel>
          ) : (
            <RightPanel>
              <p
                style={{
                  fontSize: '64px',
                }}
              >
                You&apos;re all set
              </p>
              {ipfsLink && <img src={ipfsLink} alt="" />}
            </RightPanel>
          )}
          <RightPanel bgColor="#e3e3e3">
            <span style={{ paddingTop: '64px', fontSize: '14px' }}>01/26 - 2/2</span>
            <span style={{ fontSize: '28px', paddingTop: '10px', paddingBottom: '20px' }}>Bids</span>
            {
              // sort bids first by amount * intensity
              (leaders || []).sort().map((bid) => (
                <BidCard key={bid.id} bid={bid} />
              ))
            }
          </RightPanel>
        </AdsLandingLayout>
      ) : (
        <Loader />
      )}
    </Trace>
  )
}
