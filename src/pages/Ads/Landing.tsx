import { Trans } from '@lingui/macro'
import { Trace } from '@uniswap/analytics'
import { InterfacePageName } from '@uniswap/analytics-events'
import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { ButtonPrimary } from 'components/Button'
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

export default function Landing() {
  const theme = useTheme()
  const { account, chainId } = useWeb3React()
  return (
    <Trace page={InterfacePageName.VOTE_PAGE} shouldLogImpression>
      <PageWrapper gap="lg" justify="center">
        <h1>its an ad</h1>
      </PageWrapper>
    </Trace>
  )
}