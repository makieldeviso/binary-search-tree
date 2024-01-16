class Node {
    constructor (value) {
        this.data = value;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor () {
        this.root = null;
    }

    buildTree (arr) {

        const sortArr = function (unsortedArr) {

            // Merges leftSide and rightSide
            const merge = function (left, right) {
                let sortedArr = []

                while(left.length && right.length) {
                    if (left[0] < right[0]) {
                        sortedArr.push(left.shift());
                    } else {
                        sortedArr.push(right.shift());
                    }
                }

                return [...sortedArr, ...left, ...right]
            }

            // Split array into halves
            const split = function (splitArr) {
                if (splitArr.length <=  1) {
                    return splitArr
                }
    
                const midIndex = Math.floor(splitArr.length / 2);
    
                const leftSide = splitArr.slice(0, midIndex);
                const rightSide = splitArr.slice(midIndex);

                return merge(split(leftSide), split(rightSide));
            }

            return split(unsortedArr);
        }

        const createTree = function (reqArr, start, end) {
            if (start > end) return null
            if (!start || !end) return null

            const midIndex = Math.floor(reqArr.length / 2);

            const node = new Node(reqArr[midIndex]);
            node.left = createTree(reqArr.slice(0, midIndex), start, reqArr[midIndex - 1]);
            node.right = createTree(reqArr.slice(midIndex + 1), reqArr[midIndex + 1], end );
            
            return node;
        }

        // Utility functions calls
        const sortedArr = sortArr(arr); // sorts the argument array using merge sort
        //  Reassign tree root node by executing build tree function using the sorted array
        this.root = createTree(sortedArr, sortedArr[0], sortedArr[sortedArr.length - 1]);
    }

    insert (value) {

        const insertNode = function (root, newValue) {
        
            if (root === null) {
                root = new Node(newValue);
                return root;
            }

            if (root.data > newValue) {
                root.left =  insertNode (root.left, newValue);
            } else {
                root.right = insertNode (root.right, newValue);
            }
            
            return root;
        }

        this.root = insertNode(this.root, value);
    }

    printTree () {

        const prettyPrint = (node, prefix = "", isLeft = true) => {
            if (node === null) {
              return;
            }
            if (node.right !== null) {
              prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
            }
            console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
            if (node.left !== null) {
              prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
            }
          };

          return prettyPrint(this.root)
    }
    
}

const testArr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]
const testTree = new Tree();
// testTree.buildTree(testArr);
testTree.insert(50);
testTree.insert(10);
testTree.insert(60);
testTree.insert(30);
testTree.insert(20);

testTree.printTree();
console.log(testTree)