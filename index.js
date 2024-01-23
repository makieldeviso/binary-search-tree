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
                    const lastValue = sortedArr[sortedArr.length - 1];
                    
                    // let newValue = left[0] < right[0] ? left.shift() : right.shift();
                    let newValue;
                    if (left[0] < right[0]) {
                        newValue = left.shift();
                    } else {
                        newValue = right.shift();
                    }

                    // Push new value if it is not equal to last value. Conditional, removes duplicate
                    if (lastValue !== newValue) {
                        sortedArr.push(newValue);
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
        const sortedArr = sortArr(arr); // sorts the argument array using merge sorts
        console.log(sortedArr);
        //  Reassign tree root node by executing build tree function using the sorted array
        this.root = createTree(sortedArr, sortedArr[0], sortedArr[sortedArr.length - 1]);
    }

    insert (value) {

        const insertNode = function (root, newValue) {
        
            if (root === null) {
                root = new Node(newValue);
                return root;
            }

            // If newValue exists on tree, cancel execution
            if (root.data === newValue) {
                return root;
            }

            if (root.data > newValue) {
                root.left =  insertNode (root.left, newValue);
            } else {
                root.right = insertNode (root.right, newValue);
            }
            
            // Returns the updated root
            return root;
        }

        this.root = insertNode(this.root, value);
    }

    delete (value) {

        // find the node for deletion

        const deleteNode = function (root, reqValue, parent) {

            if (root === null) return null

            if (root.data === reqValue) {

                // If node is leaf/ no children
                if (!root.left && !root.right) {

                    parent.left === root ? parent.left = null : parent.right = null;

                    root = null
                    return root
                }

                // If node has one child
                if ((root.left && !root.right) || (!root.left && root.right)) {

                    let successor = root.left === null ? root.right : root.left;

                    parent.left === root ? parent.left = successor : parent.right = successor;

                    root = successor;
                    return root
                }

                //  If Node has 2 children
                if (root.left && root.right) {

                    // Reiterate over the right child tree of the node for deletion
                    // to find successor

                    let minRightNode = root.right;
                    let current = root.right; // start at right side of node

                    while (current !== null) {
                        if (current.data < minRightNode.data) {
                            // !current.left && !current.right &&  
                            // Note:  current.data < minRightNode.data
                            // Ensures that the left is the smallest value in the right of node for deletion
                            minRightNode = current;
                        }

                        // Prioritize traversing to the left children, since were searching for smallest value
                        current = !current.left ?  current.right : current.left;
                    }

                    // Swap data/ position of node for deletion and successor node
                    const tempData = root.data;
                    root.data = minRightNode.data;
                    minRightNode.data = tempData;

                    // Recursively call deleteNode, attempting to delete node using conditional of 0 or 1 child
                    return deleteNode(root, reqValue, null)  
                }

            }

            const leftSide = deleteNode(root.left, reqValue, root);
            const rightSide = deleteNode(root.right, reqValue, root);

            return leftSide ? leftSide : rightSide;
        }

        deleteNode(this.root, value, null)

    }

    find (value) {

        const findNode = function (root, reqValue) {

            if (root === null) return null

            if (root.data === reqValue) return root

            const leftSide = findNode(root.left, reqValue);
            const rightSide = findNode(root.right, reqValue);

            return leftSide ? leftSide : rightSide;
        }

        return findNode(this.root, value)

    }

    // parent (value) {

    //     const getParent = function (root, reqValue, parent) {

    //         if (root === null) return null;

    //         if (root.data === reqValue) return parent

    //         const leftSide = getParent(root.left, reqValue, root);
    //         const rightSide = getParent(root.right, reqValue, root);

    //         return leftSide ? leftSide : rightSide;
            
    //     }

    //     return getParent(this.root, value, null)

    // }

    levelOrder () {

        const root = this.root;

        let resultArr = [];
        let order = [root];

        while (order.length !== 0) {
            // Note: front is in the last index of array (head of queue)
            const front = order.pop();

            if (front.left) order.unshift(front.left);
            if (front.right) order.unshift(front.right);
            
            resultArr.push(front.data);
        }

        return resultArr;

    }

    preOrder () {

        const getPreOrder = function (root, resultArr) {
            if (root === null) return []

            const leftSide = getPreOrder(root.left, [...resultArr]);
            const rightSide = getPreOrder(root.right, [...resultArr]);
            
            resultArr.push(root.data);

            return [...resultArr, ...leftSide, ...rightSide];

        }


        return getPreOrder(this.root, []);

    }

    inOrder() {
        const getInOrder = function (root, resultArr = []) {

            if (root) {
                getInOrder(root.left, resultArr);
                resultArr.push(root.data);
                getInOrder(root.right, resultArr);

            }

            return resultArr
        }

        return getInOrder(this.root)
    }

    postOrder () {
        const getPostOrder = function (root, resultArr = []) {

            if (root) {
               getPostOrder(root.left, resultArr);
               getPostOrder(root.right, resultArr);
               resultArr.push(root.data)
            }

            return resultArr
        }

        return getPostOrder(this.root)
    }

    height () {

        const getHeight = function (childrenArr) {
        
            const newArr = [];
            const lastLevel = childrenArr[childrenArr.length - 1];
            
           lastLevel.forEach(node => {
                if (node.left) newArr.push(node.left);
                if (node.right) newArr.push(node.right);
            })

            if (newArr.length > 0) {
                childrenArr.push(newArr)
            } else {
                return childrenArr
            }

            getHeight(childrenArr)
            return childrenArr.length ;
       }

        return getHeight([[this.root]]);

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
testTree.buildTree(testArr);
// testTree.insert(40);
// testTree.insert(50);
// testTree.insert(45);
// testTree.insert(47);
// testTree.insert(43);
// testTree.insert(10);
// testTree.insert(60);
// testTree.insert(55);
// testTree.insert(70);
// testTree.insert(65);
// testTree.insert(80);
// testTree.insert(75);
// testTree.insert(30);
// testTree.insert(20);
// testTree.insert(25);
// testTree.insert(5);
// testTree.insert(7);
// testTree.insert(50);

testTree.printTree();

console.log(testTree.height());

console.log(testTree);