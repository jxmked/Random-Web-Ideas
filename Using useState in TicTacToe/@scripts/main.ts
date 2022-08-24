/**
 * For Demo - TypeScript - React Like - useState Function
 * */

window.addEventListener("DOMContentLoaded", () => {
    const SOME_QOUTES:string[] = [
        "Play along.",
        "Greate game.",
        "It's open source",
        "Nice play",
        "Written in Typescript!",
        "Have a good day!"
    ];
    
    const BLOCKS_DOM:HTMLCollectionOf<Element> = document.getElementsByClassName('blocks')!;
    const MESSAGE_DOM:HTMLElement = document.getElementById('message-text')!;
    const RESET_BTN_DOM:HTMLButtonElement = <HTMLButtonElement> document.getElementById('reset-btn')!;
    
    const DOM_CLASS:{[id:string]:string} = {
        "opponent":"opponent",
        "player":"player"
    };
    
    const STRIKED_LINE:string = "striked";
    
    const STRAIGHTS:number[][] = [
        [0,1,2], [3,4,5], [6,7,8], // Horizontal
        [0,4,8], [2,4,6], // Cross
        [0,3,6], [1,4,7], [2,5,8] // Vertical
    ];
    
    /**
     * WIN, LOSE, DRAW
     * */
    let PLAYER_STATUS:string = ""
    
    /**
     * Prevent Making turn when AI does not make any move
     * */
    let AI_DOES_MOVE:boolean = true;
    
    /**
     * Message 
     * */
    const [_null_, changeText] = useState((e:HTMLElement, str:string, status:string) => {
        MESSAGE_DOM.innerText = str;
        if(status == "") {
            MESSAGE_DOM.classList.remove('win');
            MESSAGE_DOM.classList.remove('lose');
            MESSAGE_DOM.classList.remove('draw');
        } else {
            MESSAGE_DOM.classList.add(status);
        }
        
    }, MESSAGE_DOM);
    
    const HALT:Function = () => {
        switch(PLAYER_STATUS) {
            case 'WIN':
                changeText('You won!', "win");
                break;
            case 'LOSE':
                changeText('You lose!', 'lose');
                break;
            case 'DRAW':
                changeText('Draw!', 'draw');
                break;
            
            default:
                changeText(SOME_QOUTES[Math.floor(Math.random() * SOME_QOUTES.length)], '');
        }
        /**
         * Re-add event listener
         * */
        RESET_BTN_DOM.addEventListener('click', RESET_FUNCTION, true);

    };
    
    const RESET_FUNCTION:EventListenerOrEventListenerObject = () => {
        MESSAGE_DOM.classList.remove('win');
        MESSAGE_DOM.classList.remove('lose');
        MESSAGE_DOM.classList.remove('draw');
        PLAYER_STATUS = "";
        make_turn(0, BLOCKS_DOM[0], "reset");
        HALT();
        AI_DOES_MOVE = true;
        //RESET_BLOCK();
         
    }
    /**
     * Remove any System Added Class Name in Cell block
     * */
    const RESET_BLOCK:Function = (index:number) => {
        BLOCKS_DOM[index].classList.remove(STRIKED_LINE);
        BLOCKS_DOM[index].classList.remove(DOM_CLASS['player']);
        BLOCKS_DOM[index].classList.remove(DOM_CLASS['opponent']);
    }
    
    const HIGHLIGHT_STRAIGHTS:Function = (line:number[]) => {
        line.forEach((num:number) => {
            RESET_BLOCK(num);
            BLOCKS_DOM[num].classList.add(STRIKED_LINE);
        });
    }
    
    /**
     * Check for straights.
     * Any winning straight line(s)?
     * */
    const CHECK_STRAIGHT:Function = (table:string[], challenger:string) => {
        const wins:number[][] = [];
        
        for(const straight of STRAIGHTS){
            let win:number = 0;
            straight.forEach((cell)=>{
                if(table[cell] == challenger) {
                    win++;
                }
            });
            
            /**
             * Since, the value of win will reach the length of straight
             * if we have a successful straigh line
             * */
            if(win === straight.length) {
                wins.push(straight);
            }
        }
        
        return wins;
    }
    
    const IS_BLOCK_TAKEN:Function = (index:number) => {
        return BLOCKS_ARRAY()[index] !== void 0;
    }
    
    const [BLOCKS_ARRAY, make_turn, block_change] = useState((current_value:string[],index:number, element:any, challenger:any) => {
        /**
         *  make_turn function will trigger this function and return cloned modified array
         * */
         
        if(challenger == "reset")
            return Array.apply(null, Array(9)).map(() => void 0);
        
        const cloned:string[] = [...current_value]; // Clone
        
        cloned[index] = challenger;
        return cloned;
    }, Array.apply(null, Array(9)).map(() => void 0));
    
    block_change((new_table:string[]) => {
        /**
         * Update DOM on every changes in our table/BLOCKS_ARRAY
         * */
        for(let index:number = 0; index < BLOCKS_DOM.length; index++) {
            if(new_table[index] !== void 0) {
                BLOCKS_DOM[index].classList.add(new_table[index]);
            } else {
                RESET_BLOCK(index);
            }
        }
        
        
        let res:number[][] = CHECK_STRAIGHT(new_table, DOM_CLASS['player']);
        if(res.length > 0) {
            res.forEach((x:number[]) => HIGHLIGHT_STRAIGHTS(x));
            // Player Winner
            console.log("Player wins");
            console.log("Straights: ", res);
            PLAYER_STATUS = "WIN";
            HALT();
            return;
        }
        
        res = CHECK_STRAIGHT(new_table, DOM_CLASS['opponent']);
        
        if(res.length > 0) {
            res.forEach((x:number[]) => HIGHLIGHT_STRAIGHTS(x));
            // Opponent Winner
            console.log("AI wins");
            console.log("Straights: ", res);
            PLAYER_STATUS = "LOSE";
            HALT();
            return;
        }
        
        if(new_table.filter((x:string) => x == void 0).length == 0) {
            // Draw | No Available Moves
            console.log("No Available Moves");
            PLAYER_STATUS = "DRAW";
            HALT();
            return;
        }
        
    })
    
    /**
     * Our Opponent - AI
     * */
    const ENEMY:Function = () => {
        const available_moves:number[] = []
        BLOCKS_ARRAY().forEach((move:string, index:number) => {
            if(move === void 0) {
                available_moves.push(index);
            }
        });
        
        const NAME:string = DOM_CLASS['opponent'];
        const OPPONENT:string = DOM_CLASS['player'];
        
        const check_moves:Function = (name:string) => {
            const result:number[] = [];
            /**
             * Check Every Steps for chances
             * 
             * 1 dept
             * */
            available_moves.forEach((index:number) => {
                const test:string[] = [...BLOCKS_ARRAY()]
                test[index] = name;
                if(CHECK_STRAIGHT(test, name).length > 0) {
                    result.push(index);
                }
            });
            
            return result;
        }
        
        const random:Function = (arr:number[]) => {
            return Math.floor(Math.random() * arr.length);
        };
        
        let a:number[];
        
        a = check_moves(NAME);
        if(a.length > 0) {
            // Perform Winning Move
            return a[random(a)];
        }
        
        a = check_moves(OPPONENT);
        if(a.length > 0) {
            // Perform Blocking Move
            return a[random(a)];
        }
        
        return available_moves[random(available_moves)];
    }
    
    const BLOCK_PRESS_FUNCTION:Function = (evt:Event, index:number) => {
        
        if(PLAYER_STATUS !== "" || ! AI_DOES_MOVE || IS_BLOCK_TAKEN(index))
            return;
        
        // Prevent Reset button when System Making Turn on every Opponent
        RESET_BTN_DOM.removeEventListener('click', RESET_FUNCTION, true)
        AI_DOES_MOVE = false
        
        make_turn(index, BLOCKS_DOM[index], DOM_CLASS['player']);
        
        /**
         *  Add a little bit delay turn on our AI
         * */
        window.setTimeout(() => {
            if(PLAYER_STATUS !== "")
                return;
                
            let ai_turn:number = ENEMY();
            
            make_turn(ai_turn, BLOCKS_DOM[ai_turn], DOM_CLASS['opponent']);
            AI_DOES_MOVE = true;
            
            /**
             * Re-add event listener
             * */
            RESET_BTN_DOM.addEventListener('click', RESET_FUNCTION, true);
        }, 200);
    };
    
    for(let index:number = 0; index < BLOCKS_DOM.length; index++) {
        BLOCKS_DOM[index].addEventListener('click', (evt:Event) => BLOCK_PRESS_FUNCTION(evt, index));
    }
    
    /**
     * Reset
     * */
     RESET_BTN_DOM.addEventListener('click', RESET_FUNCTION, true);
    
    
});

/**
 * Written By Jovan De Guia
 * Project Name: Copy To Clipboard
 * Github: jxmked
 * */