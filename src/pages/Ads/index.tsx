
import { Route, Routes } from 'react-router-dom'

import Landing from './Landing'
import CreateBid from './CreateBid'
import FinishBid from './FinishBid'

export default function Ads() {
  return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="create-bid" element={<CreateBid />} />
        {/* <Route path="finish" element={<FinishBid />} /> */}
      </Routes>
  )
}
