import { AdsButtonPrimary } from 'components/Button'
import { TextInput } from 'components/TextInput'
import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import NoirUni from '../../assets/images/noirUni.png'

const CreateBidLayout = styled.div`
  display: flex;
  padding-top: 150px;
  justify-content: center;
  flex-direction: column;
  gap: 40px;
  max-width: 550px;
`

export const NoirUniLogo = styled.img`
  width: 64px;
  height: 64px;
`

const CreateBidHeader = styled.div`
  display: flex;
  gap: 24px;
`

const CreateBidHeaderText = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  line-height: 24px;
`

const IPFSContext = React.createContext<string | null>(null)

export default function CreateBid() {
  const [value, setValue] = useState('')
  const handleValue = useCallback(
    (value: string) => {
      setValue(value)
    },
    [setValue]
  )

  return (
    <IPFSContext.Provider value={value}>
      <CreateBidLayout>
        <CreateBidHeader>
          <NoirUniLogo src={NoirUni} />
          <CreateBidHeaderText>
            Upload your image to IPFS then paste your IPFS link below - voila, you&apos;re one step closer to a glowing
            ad!
          </CreateBidHeaderText>
        </CreateBidHeader>
        <TextInput
          style={{ borderRadius: '12px', backgroundColor: 'white', padding: '64px 10px', textAlign: 'center' }}
          placeholder="link here"
          onUserInput={handleValue}
          value={value}
          fontSize="56px"
        />
        <AdsButtonPrimary
          as={Link}
          to={{ pathname: `/ads/finish`, search: `?link=${value}` }}
          replace={true}
          style={{
            width: '100%',
            borderRadius: '12px',
            padding: '16px',
            opacity: value ? 1 : 0.5,
            pointerEvents: value ? 'all' : 'none',
          }}
          disabled={!value}
        >
          NEXT
        </AdsButtonPrimary>
      </CreateBidLayout>
    </IPFSContext.Provider>
  )
}
