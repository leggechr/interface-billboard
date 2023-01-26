
import { Route, Routes } from 'react-router-dom'

import Landing from './Landing'
import CreateBid from './CreateBid'

export default function Ads() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {/* <Route path=":governorIndex/:id" element={<VotePage />} /> */}
      <Route path="create-bid" element={<CreateBid />} />
    </Routes>
  )
}
