import { Trans } from '@lingui/macro'
import { Trace } from '@uniswap/analytics'
import { InterfacePageName } from '@uniswap/analytics-events'
import { AdsButtonPrimary } from 'components/Button'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

const AdsLandingLayout = styled.div`
  display: flex;
  justify-content: center;
`

const RightPanel = styled.div<{ bgColor?: string }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 50%;
  background-color: ${({ bgColor }) => bgColor ?? 'none'};
  padding: 0 2rem 5rem 2rem;
  place-content: space-between;
`

const MediumHeader = styled.p`
  font-size: 32px;
`

export default function Landing() {
  return (
    <Trace page={InterfacePageName.VOTE_PAGE} shouldLogImpression>
      <div style={{ display: 'flex', flex: 1 }}>
        <AdsLandingLayout>
          <RightPanel>
            <p
              style={{
                fontSize: '64px',
              }}
            >
              Upload and bid your ad to the top
            </p>

            <div>
              <MediumHeader>
                Every week an AD SPACE auction begins and the AD SPACE is sold to the highest bidder using $GLO.
              </MediumHeader>
              <AdsButtonPrimary
                as={Link}
                to="/create-bid"
                style={{ width: '100%', borderRadius: '12px' }}
                padding="16px"
              >
                <Trans>PLACE BID</Trans>
              </AdsButtonPrimary>
            </div>
          </RightPanel>
          <RightPanel bgColor="#fd82ff">
            <p
              style={{
                fontSize: '64px',
              }}
            >
              Swap and earn $GLO rewards
            </p>

            <div>
              <MediumHeader>
                $GLO from the top bid is distributed to viewers of the ad. Download and track rewards with our browser
                extension.
              </MediumHeader>
              <AdsButtonPrimary
                style={{ width: '100%', borderRadius: '12px' }}
                padding="16px"
                onClick={() => {
                  alert('Ask Christine for the extension binary if you want to see it!')
                }}
              >
                DOWNLOAD
              </AdsButtonPrimary>
            </div>
          </RightPanel>
        </AdsLandingLayout>
      </div>
    </Trace>
  )
}
