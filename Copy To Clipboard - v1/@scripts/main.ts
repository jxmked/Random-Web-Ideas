/**
 * For Demo - TypeScript - Copy To Copy To Clipboard
 * */

window.addEventListener("DOMContentLoaded", () => {
    const btn : HTMLButtonElement = <HTMLButtonElement> document.getElementById("main_btn")!;
    let target : string = btn.getAttribute("data-target")!
    const input : HTMLInputElement = <HTMLInputElement> document.getElementById(target)!;
    
    const ctb = new CopyToClipboard(btn);
    
    function reset(btn : HTMLButtonElement) : void{
        let i : ReturnType<typeof setTimeout> = window.setTimeout(() => {
            btn.setAttribute("data-state", "copy");
            clearTimeout(i)
        }, 750)
    }
    
    ctb.onClick((element : HTMLButtonElement) => {
        if(String(input.value).trim().length < 1){
            throw new Error("empty");
        }
        
        input.select();
        
        // Up to 99,999 Characters
        input.setSelectionRange(0, 99999); // Mobile phone range
        return document.getSelection()!.toString();
    });
    
    ctb.then(() => {
        // Success
        btn.setAttribute("data-state", "copied");
        reset(btn);
    });
    ctb.catch(() => {
        // Failed
        btn.setAttribute("data-state", "failed");
        reset(btn);
    })
});

/**
 * Written By Jovan De Guia
 * Project Name: Copy To Clipboard
 * Github: jxmked
 * */