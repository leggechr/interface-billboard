import { Trans } from '@lingui/macro'
import { Trace } from '@uniswap/analytics'
import { InterfacePageName } from '@uniswap/analytics-events'
import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { ButtonPrimary, ButtonSecondary } from 'components/Button'
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
  padding-top: 68px;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding: 48px 8px 0px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    padding-top: 20px;
  }
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
  align-items: start;
`

const RightPanel = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 50%;
  background-color: #FD82FF;
`

const TextButton = styled(ThemedText.DeprecatedMain)`
  color: ${({ theme }) => theme.accentAction};
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

export default function Landing() {
  const theme = useTheme()
  const { account, chainId } = useWeb3React()
  return (
    <Trace page={InterfacePageName.VOTE_PAGE} shouldLogImpression>
      <PageWrapper gap="lg" justify="center">
        <AdsLandingLayout>
          <LeftPanel>
            <h1>Shall we begin?</h1>
            <ButtonSecondary
                  as={Link}
                  to="/create-bid"
                  style={{ width: 'fit-content', borderRadius: '8px' }}
                  padding="8px"
                >
                <Trans>Place my bid</Trans>
            </ButtonSecondary>

          </LeftPanel>
          <RightPanel>
            <h1>How it works</h1>

          </RightPanel>
        </AdsLandingLayout>
      </PageWrapper>
    </Trace>
  )
}