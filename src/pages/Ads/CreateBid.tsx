import { Trans } from '@lingui/macro'
import { AdsButtonPrimary } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { TextInput } from 'components/TextInput'
import React, { useCallback, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import styled, { useTheme } from 'styled-components/macro'
import NoirUni from '../../assets/images/noirUni.png'

const PageWrapper = styled(AutoColumn)`
  padding-top: 68px;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding: 48px 8px 0px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    padding-top: 20px;
  }
`

export const CreateBidLayout = styled.div`
  display: flex;
  padding: 0 8px 52px;
  justify-content: center;
  flex-direction: column;

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

export const NoirUniLogo = styled.img`
  width: 64px;
  height: 64px;
`

const CreateBidHeader = styled.div`
  display: flex;
  flex-direction: row;
  width: 500px;
`

const CreateBidHeaderText = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1.5rem;
`

const CreateBidHeaderTextBlock = styled.p`
  margin-top: 0;
  margin-bottom: 0.5rem;
`

export const IPFSContext = React.createContext<string | null>(null);

export function useIPFSContext() {
  const context = useContext(IPFSContext)
  if (context === undefined) {
    throw new Error('useIPFSContext must be used within a IPFSProvider')
  }
  return context
}

export default function CreateBid() {
  const [value, setValue] = useState('')
  const ipfs = useIPFSContext()
  const handleValue = useCallback(
    (value: string) => {
      setValue(value)
      
    },
    [setValue]
  )

  return (
    <IPFSContext.Provider value={value}>
      <PageWrapper>
        <CreateBidLayout>
          <CreateBidHeader>
            <NoirUniLogo src={NoirUni} />
            <CreateBidHeaderText>
              <CreateBidHeaderTextBlock>Upload your image</CreateBidHeaderTextBlock>
              <CreateBidHeaderTextBlock>1584 (w) x 396 (h) pixels (recommended)</CreateBidHeaderTextBlock>
              <CreateBidHeaderTextBlock>We will upload your image to IPFS and paste your IPFS link and voila, you're one step closer to a glowing ad!</CreateBidHeaderTextBlock>
            </CreateBidHeaderText>
          </CreateBidHeader>
          <TextInput 
              // className={className}
              placeholder={`IPFS link here`}
              onUserInput={handleValue}
              value={value}
              fontSize={'1.25rem'}
          />
          <AdsButtonPrimary
            as={Link}
            to={{pathname: `/ads/finish`, search: `?link=${value}`}}
            // state={{ link: value }}
            replace={true}
            style={{ width: '100%', borderRadius: '8px' }}
            padding="8px"
          >
            <Trans>Next</Trans>
          </AdsButtonPrimary>
        </CreateBidLayout>
      </PageWrapper>
    </IPFSContext.Provider>
  )
}