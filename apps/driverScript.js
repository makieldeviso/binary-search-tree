
const createRandomArr = function (size) {

    const newArr = [];

    while (newArr.length < size) {
        const randomNum = Math.floor(Math.random() * 100 + 1)
        newArr.push(randomNum)
    }

    return newArr
}

const unbalance = function (tree, addSize) {

    const newArr = createRandomArr(addSize);

    newArr.forEach(num => {
        tree.insert(num);
    })

}

export {createRandomArr, unbalance}