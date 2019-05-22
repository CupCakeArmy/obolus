export const capitalize = s => s[0].toUpperCase() + s.slice(1)

const getRandomItemFromArray = a => a[Math.floor((Math.random() * a.length))]

export const getRandomSlogan = () => '💸 ' + getRandomItemFromArray(
    ['centkrieger', 'pfandsklave', 'minusexperte'],
)

export const getAvatarOfFallback = avatar => avatar || '_fallback'