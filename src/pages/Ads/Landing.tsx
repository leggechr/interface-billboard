import { Trans } from '@lingui/macro'
import { Trace } from '@uniswap/analytics'
import { InterfacePageName } from '@uniswap/analytics-events'
import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { AdsButtonPrimary, ButtonPrimary, ButtonSecondary } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { CardBGImage, CardNoise, CardSection, DataCard } from 'components/earn/styled'
import FormattedCurrencyAmount from 'components/FormattedCurrencyAmount'
import Loader from 'components/Loader'
import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import Toggle from 'components/Toggle'
import DelegateModal from 'components/vote/DelegateModal'
import ProposalEmptyState from 'components/vote/ProposalEmptyState'
import JSBI from 'jsbi'
import { darken } from 'polished'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'rebass/styled-components'
import { useModalIsOpen, useToggleDelegateModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import { useTokenBalance } from 'state/connection/hooks'
import { ProposalData, ProposalState } from 'state/governance/hooks'
import { useAllProposalData, useUserDelegatee, useUserVotes } from 'state/governance/hooks'
import styled, { useTheme } from 'styled-components/macro'
import { ExternalLink, ThemedText } from 'theme'
import { shortenAddress } from 'utils'
import { ExplorerDataType, getExplorerLink } from 'utils/getExplorerLink'

import { ZERO_ADDRESS } from '../../constants/misc'
import { UNI } from '../../constants/tokens'

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

export default function Landing() {
  const theme = useTheme()
  const { account, chainId } = useWeb3React()
  return (
    <Trace page={InterfacePageName.VOTE_PAGE} shouldLogImpression>
      <PageWrapper gap="lg" justify="center">
        <AdsLandingLayout>
          <LeftPanel>
            <p style={{
              fontSize: '64px'
            }}>Upload and bid your ad to the top</p>

            <PanelBottom>
              <MediumHeader style={{
                maxWidth: '90%'
              }}>
                Every week an AD SPACE auction begins and the AD SPACE is sold to the highest bidder using $GLO
              </MediumHeader>
              <AdsButtonPrimary
                    as={Link}
                    to="/create-bid"
                    style={{ width: '100%', borderRadius: '8px', height: '64px' }}
                    padding="8px"
                  >
                  <Trans>PLACE BID</Trans>
              </AdsButtonPrimary>
            </PanelBottom>
          </LeftPanel>
          <RightPanel>
            <p style={{
              fontSize: '64px'
            }}>Swap and earn $GLO rewards</p>

            <PanelBottom>
              <MediumHeader style={{
                maxWidth: '90%'
              }}>
                $GLO from the top bid is distributed to viewers of the ad. Download and track rewards with our browser extension.
              </MediumHeader>
              <AdsButtonPrimary
                    as={Link}
                    to="/create-bid"
                    style={{ width: '100%', borderRadius: '8px', height: '64px' }}
                    padding="8px"
                  >
                  <Trans>DOWNLOAD</Trans>
              </AdsButtonPrimary>
            </PanelBottom>
          </RightPanel>
        </AdsLandingLayout>
      </PageWrapper>
    </Trace>
  )
}