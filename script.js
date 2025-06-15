const RED = "red"
const BLACK = "black"

const getNode = (num, x, level) => {
    lastId++;
    return `<div class='node rednode' id='node${lastId}' data-x='${x}' data-level='${level}' data-id='${lastId}'><p>${num}</p></div>`
}

const NIL =  {color: BLACK, leftChild: null, rightChild: null}

var lastId = -1


var root = NIL
var nodesList = []
var lines = []

const insert = (value) => {
    if(root == NIL)
    {
        const nodeStr = getNode(value)
        document.getElementById("nodesContainer").innerHTML += nodeStr
        root = {key: value, color: RED, id: lastId, x: MAX_WIDTH / 2, level: 1, parent:null, leftChild: NIL, rightChild: NIL}
        nodesList.push(root)
        insert_fixup(root);
        return;
    }

    insertRec(root, value, 2)
}

const getRightPos = (x, level) => {
    return x + (MAX_WIDTH / Math.pow(2, level))
}

const getLeftPos = (x, level) => {
    return x - (MAX_WIDTH / Math.pow(2, level))
}

const insertRec = (node, value, currentLevel) => {
    
    if(value > node.key)
    {
        if(node.rightChild == NIL)
        {
            const nodeStr = getNode(value)
            document.getElementById("nodesContainer").innerHTML += nodeStr
            node.rightChild = {key: value, color: RED, x: getRightPos(node.x, currentLevel), level: currentLevel, id: lastId, parent:node, leftChild: NIL, rightChild: NIL}
            nodesList.push(node.rightChild)
            lineDraw(node, node.rightChild)
            insert_fixup(node.rightChild)
            return
        }

        insertRec(node.rightChild, value, currentLevel + 1)
    }
    
    if(value < node.key)
    {
        if(node.leftChild == NIL)
        {
            const nodeStr = getNode(value)
            document.getElementById("nodesContainer").innerHTML += nodeStr
            node.leftChild = {key: value, color: RED, x: getLeftPos(node.x, currentLevel), level: currentLevel, id: lastId, parent:node, leftChild: NIL, rightChild: NIL}
            lineDraw(node, node.leftChild)
            nodesList.push(node.leftChild)
            insert_fixup(node.leftChild)
            return
        }

        insertRec(node.leftChild, value, currentLevel + 1)
    }
}



let LEFT_OFFSET = 100
let MAX_WIDTH = 1000
let LEVEL_HEIGHT = 100

let LINE_HORIZONTAL = 0
let LINE_VERTICAL = 0

const absolutePosFix = () => {

    //document.getElementById("linesContainer").innerHTML = ""

    //if(root != null)
    //   setPos(root, 0, MAX_WIDTH, 1)
}


const right_rotate = (x) => {
    let y = x.leftChild 

    x.leftChild = y.rightChild 

    if(y.rightChild != NIL)
        y.rightChild.parent = x

    y.parent = x.parent

    if(x.parent == null)
        root = y 
    else if(x == x.parent.rightChild)
        x.parent.rightChild = y 
    else
        x.parent.leftChild = y 

    y.rightChild = x 
    x.parent = y
}

const left_rotate = (x) => {
    let y = x.rightChild 

    x.rightChild = y.leftChild 

    if(y.leftChild != NIL)
        y.leftChild.parent = x

    y.parent = x.parent

    if(x.parent == null)
        root = y 
    else if(x == x.parent.leftChild)
        x.parent.leftChild = y 
    else
        x.parent.rightChild = y 

    y.leftChild = x 
    x.parent = y
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const insert_fixup = async (z) => {
    console.log("FIXUP")
    while(z.parent != null && z.parent.color == RED)
    {
        if(z.parent == z.parent.parent.leftChild)
        {
            let y = z.parent.parent.rightChild
            if(y.color == RED)
            {
                z.parent.color = BLACK
                y.color = BLACK 
                z.parent.parent.color = RED
                z = z.parent.parent
            }
            else
            {
                if(z == z.parent.rightChild)
                {
                    z = z.parent 
                    left_rotate(z)
                }
                z.parent.color = BLACK
                z.parent.parent.color = RED 
                right_rotate(z.parent.parent)
            }
        }    
        else
        {
            let y = z.parent.parent.leftChild
            if(y.color == RED)
            {
                z.parent.color = BLACK
                y.color = BLACK
                z.parent.parent.color = RED
                z = z.parent.parent
            }
            else
            {
                if(z == z.parent.leftChild)
                {
                    z = z.parent 
                    right_rotate(z)
                }
                z.parent.color = BLACK
                z.parent.parent.color = RED 
                left_rotate(z.parent.parent)
            }  
        }
        
        if(z == root)
            break;


        /*
        rebootPositions();
        setPositions();
        await sleep(500);
        */
    }

    root.color = BLACK   
    
    

    rebootPositions()
}

const delete_node = (x) => {
    z = nodesList.find(q => (q.key == x))

    if(z == NIL)
        return "Key not found!"

    y = z
    y_orig_color = y.color 
    
    // case 1
    if(z.leftChild == NIL)
    {
        x = z.rightChild 
        transplant(z, z.rightChild)
    }
    // case 2
    else if(z.rightChild == NIL)
    {
        x = z.leftChild
        transplant(z, z.leftChild)
    }
    // case 3
    else
    {
        y = minimum(z.rightChild)
        y_orig_color = y.color
        x = y.rightChild 
        
        if(y.parent == z)
            x.parent = y
        else
        {
            transplant(y, y.rightChild)
            y.rightChild = z.rightChild
            y.rightChild.parent = y
        }
        
        transplant(z, y)
        y.leftChild = z.leftChild 
        y.leftChild.parent = y 
        y.color = z.color 
    }
    
    if(y_orig_color == BLACK)
        delete_fixup(x)
}

const delete_fixup = (x) => {
    while(x != root && x.color == BLACK)
    {
        if(x == x.parent.leftChild)
        {
            w = x.parent.rightChild
            // type 1
            if(w.color == RED)
            {
                w.color = BLACK
                x.parent.color = RED
                left_rotate(x.parent)
                w = x.parent.rightChild
            }
            // type 2
            if(w.leftChild.color == BLACK && w.rightChild.color == BLACK)
            {
                w.color = RED 
                x = x.parent 
            }
            else
            {
                // type 3
                if(w.rightChild.color == BLACK)
                {
                    w.leftChild.color = BLACK
                    w.color = RED
                    right_rotate(w)
                    w = x.parent.rightChild
                }
                // type 4
                w.color = x.parent.color 
                x.parent.color = BLACK 
                w.rightChild.color = BLACK 
                left_rotate(x.parent)
                x = root
            }
        }
        else
        {
            w = x.parent.leftChild
            // type 1
            if(w.color == RED)
            {
                w.color = BLACK
                x.parent.color = RED
                right_rotate(x.parent)
                w = x.parent.leftChild
            }
            // type 2
            if(w.rightChild.color == BLACK && w.leftChild.color == BLACK)
            {
                w.color = RED 
                x = x.parent 
            }
            else
            {
                // type 3
                if(w.leftChild.color == BLACK)
                {
                    w.rightChild.color = BLACK
                    w.color = RED
                    left_rotate(w)
                    w = x.parent.leftChild
                }
                // type 4
                w.color = x.parent.color 
                x.parent.color = BLACK 
                w.leftChild.color = BLACK 
                right_rotate(x.parent)
                x = root
            }
        }
    }
        
    x.color = BLACK

    
}

const minimum = (x) => {
    while(x.leftChild != NIL)
        x = x.leftChild
    return x
}

const transplant = (u, v) => {
    if(u.parent == null)
        root = v
    else if(u == u.parent.leftChild)
        u.parent.leftChild = v 
    else
        u.parent.rightChild = v

    v.parent = u.parent
}

const rebootPositions = (startNode = null, level = null) => {
    if(startNode == null)
    {
        root.x = MAX_WIDTH / 2;
        root.level = 1

        rebootPositions(root, 2);
        return;
    }

    if(startNode == NIL)
        return;

    
    if(startNode.leftChild != NIL)
    {
        startNode.leftChild.x = getLeftPos(startNode.x, level);
        startNode.leftChild.level = level
        rebootPositions(startNode.leftChild, level + 1);
    }

    if(startNode.rightChild != NIL)
    {
        startNode.rightChild.x = getRightPos(startNode.x, level);
        startNode.rightChild.level = level
        rebootPositions(startNode.rightChild, level + 1);
    }

}

const colorize = (startNode = null) => {

    if(startNode == null)
    {
        colorize(root);
        return;
    }

    if(startNode == NIL)
        return;

    if(startNode.color == RED)
    {
        $(`#node${startNode.id}`).addClass("rednode")
    }
    else
    {
        $(`#node${startNode.id}`).removeClass("rednode")
    }

    if(startNode.leftChild != NIL)
    {
        colorize(startNode.leftChild)
    }

    if(startNode.rightChild != NIL)
    {
        colorize(startNode.rightChild)
    }
}

const setPositions = (startNode = null) => {
    if(startNode == null)
    {
        setPositions(root);
        for(var i=0;i<lines.length;i++)
        {
            if(lines[i] == null)    
                continue;


            if((lines[i].from.leftChild != lines[i].to && lines[i].from.rightChild != lines[i].to) || lines[i].from.key == null || lines[i].to.key == null)
            {
                console.log(`HIDING: ${lines[i].id}`)
                $(`#${lines[i].id}`).hide();
                $(`#${lines[i].id}`).css('display', 'none');
                lines[i] = null;
            }
        }
        return;
    }

    if(startNode == NIL)
        return;

    const html = document.getElementById(`node${startNode.id}`)

    if(startNode.color == RED)
    {
        $(`#node${startNode.id}`).addClass("rednode")
    }
    else
    {
        $(`#node${startNode.id}`).removeClass("rednode")
    }

    const level = startNode.level
    const left = startNode.x
    const top = level * LEVEL_HEIGHT

    html.style.left = `${left}px`
    html.style.top = `${top}px`

    if(startNode.leftChild != NIL)
    {
        setPositions(startNode.leftChild)
        lineSet(startNode, startNode.leftChild)
    }

    if(startNode.rightChild != NIL)
    {
        setPositions(startNode.rightChild)
        lineSet(startNode, startNode.rightChild)
    }
}

const setPos = (node, start, width, level) => {

    const html = document.getElementById(`node${node.id}`)

    const left = LEFT_OFFSET + start + (width / 2)
    const top = level * LEVEL_HEIGHT

    html.style.left = `${left}px`
    html.style.top = `${top}px`

    if(node.leftChild != null)
    {
        setPos(node.leftChild, start, (width / 2), level + 1)
        //lineDraw(left, top, left - (width / 4), top + LEVEL_HEIGHT)
    }

    if(node.rightChild != null)
    {
        setPos(node.rightChild, start + (width / 2), (width / 2), level + 1)
        //lineDraw(left, top, left + (width / 4), top + LEVEL_HEIGHT)
    }
}

const removeNode = (node) => {
    
    if(node.leftChild == null && node.rightChild == null)
    {
        if(node.parent != null)
        {
            if(node.parent.leftChild == node)
            {
                node.parent.leftChild = null
            }
            if(node.parent.rightChild == node)
            {
                node.parent.rightChild = null
            }
        }
        document.getElementById(`node${node.id}`).style.display = 'none'
        absolutePosFix()
        return
    }

    if(node.leftChild == null)
    {
        node = node.rightChild
        document.getElementById(`node${node.id}`).style.display = 'none'
        absolutePosFix()
        return
    }

    if(node.rightChild == null)
    {
        node.key = node.leftChild.key
        node = node.leftChild
        document.getElementById(`node${node.id}`).style.display = 'none'
        absolutePosFix()
        return
    }

    document.getElementById(`node${node.id}`).style.display = 'none'
    absolutePosFix()
}


const findPredecessor = (node) => {
    return findPredecessorRec(node.leftChild)
}

const findPredecessorRec = (node) => {
    if(node.rightChild == null)
        return node
    
    return findPredecessorRec(node.leftChild)
}

const findSuccsessor = (node) => {
    return findSuccsessorRec(node.rightChild)
}

const findSuccsessorRec = (node) => {
    if(node.leftChild == null)
        return node
    
    return findPredecessorRec(node.leftChild)
}


const onInsert = () => {
    $('.node').removeClass('found')

    const val = parseInt(document.getElementById('inputField').value)
    clearInput();
    insert(val)   
    
    setTimeout(setPositions, 5);
    //absolutePosFix()
}



const onDelete = async () => {
    console.log("ON DELETE")
    removeFound()
    const val = parseInt(document.getElementById('inputField').value)
    clearInput();

    let node = nodesList.find(q => q.key == val)
    let idx = nodesList.indexOf(node)

    if(node != null)
    {
        $(`#node${node.id}`).addClass('found');
        
        await sleep(2000);

        delete_node(val);

        $(`#node${node.id}`).hide();
        
        node.key = null;
        nodesList[idx].key = null;

        rebootPositions()
        setTimeout(setPositions, 5);
    }
    else
        console.log("NOT FOUND")
}

const onSearch = async () => {
    removeFound()
    const val = parseInt(document.getElementById('inputField').value)
    clearInput();
    searchRec(root, val);

}


const removeFound = () => {
    $('.node').removeClass('found')
}

const searchRec = (node, val) => {
    
    $(`#node${node.id}`).addClass('found');

    if(node.key == val)
    {
        setTimeout(removeFound, 3000);
        return;
    }

    if(node.key > val)
    {
        setTimeout(searchRec, 300, node.leftChild, val);
    }
    else
    {
        setTimeout(searchRec, 300, node.rightChild, val);
    }
}

const clearInput = () => {
    document.getElementById('inputField').value = "";
}


function lineSet(node1, node2) {
    let line = $(`#${node1.id}x${node2.id}`)
    if(line.length <= 0)
    {
        console.log("NULL LINE")
        lineDraw(node1, node2);
        return;
    }

    x1 = node1.x
    x2 = node2.x
    y1 = node1.level * LEVEL_HEIGHT
    y2 = node2.level * LEVEL_HEIGHT

    x1 += LINE_HORIZONTAL
    x2 += LINE_HORIZONTAL
    y1 += LINE_VERTICAL
    y2 += LINE_VERTICAL

    if (x2 < x1) {
        var tmp;
        tmp = x2 ; x2 = x1 ; x1 = tmp;
        tmp = y2 ; y2 = y1 ; y1 = tmp;
    }

    var lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    var m = (y2 - y1) / (x2 - x1);

    var degree = Math.atan(m) * 180 / Math.PI;

    line.show();
    line.css({'transform' : `rotate(${degree}deg)`, 'width': `${lineLength}px`, 'top': `${y1}px`, 'left': `${x1}px`});
}



function lineDraw(node1, node2) {

    let id = `${node1.id}x${node2.id}`

    lines.push({from: node1, to: node2, id: `${id}`})

    x1 = node1.x
    x2 = node2.x
    y1 = node1.level * LEVEL_HEIGHT
    y2 = node2.level * LEVEL_HEIGHT

    x1 += LINE_HORIZONTAL
    x2 += LINE_HORIZONTAL
    y1 += LINE_VERTICAL
    y2 += LINE_VERTICAL

    if (x2 < x1) {
        var tmp;
        tmp = x2 ; x2 = x1 ; x1 = tmp;
        tmp = y2 ; y2 = y1 ; y1 = tmp;
    }

    var lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    var m = (y2 - y1) / (x2 - x1);

    var degree = Math.atan(m) * 180 / Math.PI;

    document.getElementById("linesContainer").innerHTML += `<div id='${id}' class='line'></div>`;
    //$(`#${id}`).css(`transform: rotate(${degree}deg); width: ${lineLength}px; top: ${y1}px; left: ${x1}px`)


    $(`#${id}`).css({'transform' : `rotate(${degree}deg)`, 'width': `${lineLength}px`, 'top': `${y1}px`, 'left': `${x1}px`});

}




addEventListener("load", (event) => {
    const width = parseInt($('#nodesContainer').css('width'))
    const height = parseInt($('#nodesContainer').css('height'))
    
    MAX_WIDTH = width;
    LEVEL_HEIGHT = height / 7;
});