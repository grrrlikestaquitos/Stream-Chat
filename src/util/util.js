export const getRandomColor = () => {
    const listOfColors = [
        '#69A4FF',
        '#ff8469',
        '#FFEC69',
        '#FF6991',
        '#FFDB69',
        '#6DFF69',
        '#69FFD1',
        '#69C0FF',
        '#F291B9',
        '#91E3F2',
        '#6383A5',
        '#7563A5',
        '#63A57B',
        '#A57B63',
        '#DE9368',
        '#68DED2',
        '#DE6882',
        '#B81F40',
        '#B64C63',
    ]

    const randomNumber = Math.floor(Math.random() * (listOfColors.length - 1) + 1)

    return listOfColors[randomNumber] || '#ffffff'
}