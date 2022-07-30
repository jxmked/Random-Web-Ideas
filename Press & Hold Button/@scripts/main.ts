
/**
 * For Demo - Javascript press and hold Button 
 * */
function Start(data : {[id:string]:any}){
    // Click Every 100ms
    data["ival"] = setInterval(() => {
        data["func"]();
    }, 100)
}

function Stop(data:{[id:string]:any}){
    clearInterval(data["ival"]);
}


window.addEventListener("DOMContentLoaded", () => {
    // Main Input
    const input : HTMLInputElement = document.querySelector("#num")!;
    
    // Init - Increase
    const i_btn : {[id:string]:Function} = HoldButton(document.querySelector("#i_num")!);
    
    
    // Main function
    i_btn.onClick(() => {
        input.value = String(Number(input.value) + 1);
    });
    
    // Set what will happen if we hold the button
    i_btn.onHold(Start, 500);
    
    // Set what will happen if we unhold the button
    i_btn.onUnHold(Stop);
    
    
    // Init - Decrease
    const d_btn : {[id:string]:Function} = HoldButton(document.querySelector("#d_num")!);
    
    // our main function to call
    d_btn.onClick(() => {
        input.value = String(Number(input.value) - 1);
    })
    
    // Set what will happen if we hold the button
    
    d_btn.onHold(Start, 500);
    
    // Set what will happen if we unhold the button
    d_btn.onUnHold(Stop);
    
    
    /** With Modal // Pop-up action **/
    
    // Modal Container
    const m_modal : HTMLElement = document.querySelector("#hold_modal")!;
    
    // Close on click
    document.querySelector("#hold_modal_close")!.addEventListener("click", () => {
        m_modal.classList.add("hidden");
    });
    
    // Show Modal after press and hold of main button
    const m_hb = HoldButton(document.querySelector("#hold_button")!)
    
    m_hb.onHold(() => {
        m_modal.classList.remove("hidden");
    });
    
});

/**
 * Written By Jovan De Guia
 * Project Name: Press and Hold For Web Buttons
 * Github: jxmked
 * */
