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
    const FRESH_ARRAY:string[]|undefined[] = Array.apply(null, Array(BLOCKS_DOM.length)).map(() => void 0);
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
    const [_null_, changeText] = useState((e:HTMLElement) => {
        if(PLAYER_STATUS == "") {
            MESSAGE_DOM.classList.remove('win');
            MESSAGE_DOM.classList.remove('lose');
            MESSAGE_DOM.classList.remove('draw');
            MESSAGE_DOM.innerText = SOME_QOUTES[Math.floor(Math.random() * SOME_QOUTES.length)];
        } else {
            switch(PLAYER_STATUS) {
                case 'WIN':
                    MESSAGE_DOM.innerText = 'You won!'
                    MESSAGE_DOM.classList.add('win');
                    break;
                case 'LOSE':
                    MESSAGE_DOM.innerText = 'You lose!'
                    MESSAGE_DOM.classList.add('lose');
                    break;
                case 'DRAW':
                    MESSAGE_DOM.innerText = 'Draw!'
                    MESSAGE_DOM.classList.add('draw');
                    break;
            }
            RESET_BTN_DOM.addEventListener('click', RESET_FUNCTION, true);
        }
        
    }, MESSAGE_DOM);
    
    const RESET_FUNCTION:EventListenerOrEventListenerObject = () => {
        PLAYER_STATUS = "";
        make_turn(0, BLOCKS_DOM[0], "reset");
        changeText();
        AI_DOES_MOVE = true;
    };
    
    /**
     * Remove any System Added Class Name in Cell block DOM
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
        return STRAIGHTS.filter((straight:number[]) => {
            return straight.filter((i:number) => table[i] == challenger).length == straight.length;
        });
    };
    
    const IS_BLOCK_TAKEN:Function = (index:number) => {
        return BLOCKS_ARRAY()[index] !== void 0;
    };
    
    const [BLOCKS_ARRAY, make_turn, block_change] = useState((current_value:string[], index:number, element:any, challenger:any) => {
        /**
         *  make_turn function will trigger this function and return cloned modified array
         * */
         
        if(challenger == "reset")
            return [...FRESH_ARRAY];
        
        const cloned:string[] = [...current_value]; // Clone
        
        cloned[index] = challenger;
        return cloned;
    }, [...FRESH_ARRAY]);
    
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
            changeText();
            return;
        }
        
        res = CHECK_STRAIGHT(new_table, DOM_CLASS['opponent']);
        
        if(res.length > 0) {
            res.forEach((x:number[]) => HIGHLIGHT_STRAIGHTS(x));
            // Opponent Winner
            console.log("AI wins");
            console.log("Straights: ", res);
            PLAYER_STATUS = "LOSE";
            changeText();
            return;
        }
        
        if(new_table.filter((x:string) => x == void 0).length == 0) {
            // Draw | No Available Moves
            console.log("No Available Moves");
            PLAYER_STATUS = "DRAW";
            changeText();
            return;
        }
        
    })
    
    /**
     * Our Opponent - AI
     * */
    const ENEMY:Function = () => {
        const available_moves:number[] = BLOCKS_ARRAY().map((v:string,index:number) => {
             return (v == void 0) ? index : void 0
        }).filter((k:number) => k != void 0);
        
        const NAME:string = DOM_CLASS['opponent'];
        const OPPONENT:string = DOM_CLASS['player'];
        
        const check_moves:Function = (name:string) => {
            const result:number[] = [];
            /**
             * Check Every Steps for any chances
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
        
        const random:Function = (arr:number[]) => Math.floor(Math.random() * arr.length);
        
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
        
        // Randomly select available Move
        return available_moves[random(available_moves)];
    }
    
    const BLOCK_PRESS_FUNCTION:Function = (evt:Event, index:number) => {
        
        if(PLAYER_STATUS !== "" || ! AI_DOES_MOVE || IS_BLOCK_TAKEN(index))
            return;
        
        // Prevent Reset button when System Making Turn on each Opponent
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