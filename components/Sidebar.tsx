import React from 'react'
import MemberList from './MemberList'

const SideBar = () => {
  return (
    <div className='hidden flex-[3] border-l px-3 py-4 lg:block'>
      <MemberList />
    </div>
  )
}

export default SideBar
