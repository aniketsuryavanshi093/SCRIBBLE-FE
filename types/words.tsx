export const randomwords = [
  'apple',
  'banana',
  'cherry',
  'date',
  'elderberry',
  'fig',
  'grape',
  'honeydew',
  'kiwi',
  'lemon',
  'mango',
  'nectarine',
  'orange',
  'papaya',
  'quince',
  'raspberry',
  'strawberry',
  'tangerine',
  'watermelon',
]

export const getRandomWords = (): string[] => {
  const shuffled = [...randomwords].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 3)
}
