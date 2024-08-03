import React, { FC, useEffect, useState } from 'react'
import './avatar.css'
import { User, useUserStore } from '@/stores/userStore'

let buttonsmap = [
  { type: 'hat', top: '20%' },
  { type: 'eyes', top: '35%' },
  { type: 'mouth', top: '50%' },
  { type: 'body', top: '65%' },
]

const AvatarSelector: FC<{
  isEditor?: boolean
  config?: User['Avatar']
  avatarclassname?: string
}> = ({ isEditor, config, avatarclassname }) => {
  const [AvatarConfig, setAvatarConfig] = useState({
    hat: {
      total: 25,
      dimensions: {
        currentrow: 1,
        row: 3,
      },
      x: 0,
      y: 0,
    },
    eyes: {
      total: 46,
      dimensions: {
        currentrow: 1,
        row: 5,
      },
      y: 0,
      x: 0,
    },
    mouth: {
      total: 44,
      dimensions: {
        currentrow: 1,
        row: 5,
      },
      y: 0,
      x: 0,
    },
    body: {
      total: 30,
      dimensions: {
        row: 3,
        currentrow: 1,
      },
      y: 0,
      x: -198,
    },
  })
  const { setUser, user } = useUserStore(state => state)
  function generateRandomNumber(type: 'x' | 'y') {
    const numbers =
      type === 'x'
        ? [-198, -396, -594, -792, -990, -1386, -1188, -1584, -1782]
        : [0, -198]
    const randomIndex = Math.floor(Math.random() * numbers.length)
    return numbers[randomIndex]
  }
  useEffect(() => {
    if (isEditor) {
      setUser({
        ...user!,
        Avatar: {
          hat: {
            x: AvatarConfig.hat.x,
            y: AvatarConfig.hat.y,
          },
          eyes: {
            x: AvatarConfig.eyes.x,
            y: AvatarConfig.eyes.y,
          },
          mouth: {
            x: AvatarConfig.mouth.x,
            y: AvatarConfig.mouth.y,
          },
          body: {
            x: AvatarConfig.body.x,
            y: AvatarConfig.body.y,
          },
        },
      })
    } else {
      setAvatarConfig(config as any)
    }
  }, [AvatarConfig, isEditor, config])

  const handleRandom = () => {
    setAvatarConfig(prev => ({
      ...prev,
      hat: {
        ...prev.hat,
        x: generateRandomNumber('x'),
        y: generateRandomNumber('y'),
      },
      eyes: {
        ...prev.eyes,
        x: generateRandomNumber('x'),
        y: generateRandomNumber('y'),
      },
      mouth: {
        ...prev.mouth,
        x: generateRandomNumber('x'),
        y: generateRandomNumber('y'),
      },
      body: {
        ...prev.body,
        x: generateRandomNumber('x'),
        y: generateRandomNumber('y'),
      },
    }))
  }
  const handleStateupdate = (type: string, isleft: boolean) => {
    if (isleft) {
      setAvatarConfig(prev => ({
        ...prev,
        [type]: {
          ...prev[type!],
          x:
            Math.abs(prev[type].x) - 198 <= 198
              ? -1782
              : (Math.abs(prev[type].x) - 198) * -1,
          y:
            Math.abs(prev[type].x) - 198 <= 198
              ? (prev[type].dimensions.currentrow + 1 > prev[type].dimensions.row
                  ? 0
                  : prev[type].dimensions.currentrow) *
                (198 * -1)
              : prev[type].y,
          dimensions: {
            row: 3,
            currentrow:
              Math.abs(prev[type].x) - 198 <= 198
                ? prev[type].dimensions.currentrow + 1 > prev[type].dimensions.row
                  ? 1
                  : prev[type].dimensions.currentrow + 1
                : prev[type].dimensions.currentrow,
          },
        },
      }))
    } else {
      setAvatarConfig(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          x:
            Math.abs(prev[type].x) + 198 > 1782
              ? -198
              : (Math.abs(prev[type].x) + 198) * -1,
          y:
            Math.abs(prev[type].x) - 198 <= 198
              ? (prev[type].dimensions.currentrow + 1 > prev[type].dimensions.row
                  ? 0
                  : prev[type].dimensions.currentrow) *
                (198 * -1)
              : prev[type].y,
          dimensions: {
            row: 3,
            currentrow:
              Math.abs(prev[type].x) - 198 <= 198
                ? prev[type].dimensions.currentrow + 1 > prev[type].dimensions.row
                  ? 1
                  : prev[type].dimensions.currentrow + 1
                : prev[type].dimensions.currentrow,
          },
        },
      }))
    }
  }
  const handleLeft = (type: string) => {
    handleStateupdate(type, true)
  }
  const handeRight = (type: string) => {
    handleStateupdate(type, false)
  }
  return (
    <div id='avatarSelector' className={avatarclassname}>
      {isEditor && (
        <>
          {buttonsmap.map(button => (
            <>
              <div
                id='avatarSelectorLeft'
                style={{
                  top: button.top,
                }}
                onClick={() => handleLeft(button.type)}
                className={`left-[20%]`}
              ></div>
              <div
                id='avatarSelectorright'
                style={{
                  top: button.top,
                }}
                onClick={() => handeRight(button.type)}
                className={`right-[20%]`}
              ></div>
            </>
          ))}
          <div
            id='avatarSelectorRandomize'
            onClick={handleRandom}
            className='cursor-pointer'
          ></div>
        </>
      )}
      <div id='avatarSelectorAvatar' className='avatar'>
        <div
          style={{
            backgroundPosition: `${AvatarConfig.hat.x}px ${AvatarConfig.hat.y}px`,
          }}
          className='avatarSprite avatarhat z-[7]'
        />
        <div
          style={{
            backgroundPosition: `${AvatarConfig.eyes.x}px ${AvatarConfig.eyes.y}px`,
          }}
          className='avatarSprite avatareyes z-[4]'
        />
        <div
          style={{
            backgroundPosition: `${AvatarConfig.mouth.x}px ${AvatarConfig.mouth.y}px`,
          }}
          className='avatarSprite avatarmouth z-[1]'
        />
        <div
          style={{
            backgroundPosition: `${AvatarConfig.body.x}px ${AvatarConfig.body.y}px`,
          }}
          className='avatarSprite avatarbody z-0'
        />
        <div className='avatarSprite avatarlegs z-0'></div>
        <div className='avatarShadow'></div>
      </div>
    </div>
  )
}

export default AvatarSelector
