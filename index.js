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

    delete (value) {

        // find if the Node exist in the tree
        const nodeDel = this.find(value);
        const nodeParent = this.parent(value);
        
        // Utility function when deleting leaf nodes/ no right and left children
        const deleteLeafNode = function (root, reqValue, parent) {
            if (root === null) return root

            if (root.data === reqValue) {

                if (parent.left === root) {
                    parent.left = null;
            
                } else {
                    parent.right = null;
                }

                root = null;
                return root
            }   
        
            deleteLeafNode(root.left, reqValue, root);
            deleteLeafNode(root.right, reqValue, root);
            
            return root;
        }
        
        // Utility function if one child is empty
        const deleteOneChildNode = function (root, reqValue, parent) {
            if (root === null) return root

            if (root.data === reqValue) {

                let successor;
                if (root.left === null) {
                     successor = root.right;

                } else {
                    successor = root.left;
                }
                
                if (parent.left === root) {
                    parent.left = successor;
                } else {
                    parent.right = successor;
                }   
                
                root = successor;
                return root
            }   
        
            deleteOneChildNode(root.left, reqValue, root);
            deleteOneChildNode(root.right, reqValue, root);
            
            return root;
        }

        // Utility function if two children
        const deleteTwoChildNode = function (root, nodeForDel, reqValue) {
            
            let minRightNode = nodeForDel.right;
            let current = nodeForDel.right; // start right side of no
            
            while (current !== null) {
                // current is leaf
                if (!current.left && !current.right ) {
                    if (current.data < minRightNode.data) {
                        minRightNode = current
                    }
                }

                if (!current.left) {
                    current = current.right
                } else {
                    current = current.left
                }

            }
            
            // successor is not leaf
            if (nodeForDel.right === minRightNode) {
                const tempLeft = nodeForDel.left;
                nodeForDel = minRightNode;
                nodeForDel.left = tempLeft;

                if (nodeParent.left.data === reqValue) {
                    nodeParent.left = nodeForDel;
                } else {
                    nodeParent.right = nodeForDel;
                }

            } else {
                const tempData = nodeForDel.data;
                nodeForDel.data = minRightNode.data;
                minRightNode.data = tempData;
                deleteLeafNode(root, tempData, null)
            }

            return root
        }

        if (!nodeDel) {
            return

        } else if (!nodeDel.left && !nodeDel.right) {
            this.root = deleteLeafNode(this.root, value, null);

        } else if ( (nodeDel.left && !nodeDel.right) || (!nodeDel.left && nodeDel.right) ) {
            this.root = deleteOneChildNode(this.root, value, null);

        } else {

            this.root = deleteTwoChildNode(this.root, nodeDel, value);
        }

        

    }

    deleteNode2 (value) {

        // find the node for deletion

        const deleteNode = function (root, reqValue, parent) {

            if (root === null) return null

            if (root.data === reqValue) {

                // If node is leaf/ no children
                if (!root.left && !root.right) {

                    parent.left === root ? parent.left = null : parent.right = null;

                    root = null
                    return null
                }

                

            }

            const leftSide = deleteNode(root.left, reqValue, root);
            const rightSide = deleteNode(root.right, reqValue, root);

            return leftSide ? leftSide : rightSide;



        }


        deleteNode(this.root, value, null)

    }

    parent (value) {

        const getParent = function (root, reqValue, parent) {

            if (root === null) return null;

            if (root.data === reqValue) return parent

            const leftSide = getParent(root.left, reqValue, root);
            const rightSide = getParent(root.right, reqValue, root);

            return leftSide ? leftSide : rightSide;
            
        }

        return getParent(this.root, value, null)

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
testTree.insert(40);
testTree.insert(50);
testTree.insert(45);
testTree.insert(47);
testTree.insert(43);
testTree.insert(10);
testTree.insert(60);
testTree.insert(55);
testTree.insert(70);
testTree.insert(65);
testTree.insert(80);
testTree.insert(75);
testTree.insert(30);
testTree.insert(20);
testTree.insert(25);
testTree.insert(5);
testTree.insert(7);
testTree.insert(50);

testTree.printTree();
testTree.deleteNode2(75);
testTree.deleteNode2(80);

testTree.printTree();
// console.log(testTree);