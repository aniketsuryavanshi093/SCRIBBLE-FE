import React from 'react'
import MemberList from './MemberList'

const SideBar = () => {
  return (
    <div className='hidden flex-[3] border-l lg:block'>
      <MemberList />
    </div>
  )
}

export default SideBar
